import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import type Stripe from 'stripe';

export const runtime = 'nodejs';

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    console.error('[stripe-webhook] Missing signature or webhook secret');
    return NextResponse.json(
      { error: 'Missing signature or webhook secret' },
      { status: 400 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('[stripe-webhook] Signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info(
          '[stripe-webhook] ✅ Order completed:',
          session.id,
          '| Amount:',
          session.amount_total,
          '| Customer:',
          session.customer_details?.email,
        );

        // In test mode (livemode === false) or local development, NEVER dispatch orders to Printify
        if (!session.livemode || process.env.NODE_ENV === 'development') {
          console.info(
            `[stripe-webhook] 🧪 Test/dev mode session detected (${session.id}). Skipping Printify order dispatch.`,
          );
          break;
        }

        // Automatically dispatch order to Printify
        const sessionAny = session as unknown as {
          collected_information?: { shipping_details?: { name?: string; address?: Stripe.Address } };
          shipping_details?: { name?: string; address?: Stripe.Address };
        };
        const shippingDetails = sessionAny.collected_information?.shipping_details || sessionAny.shipping_details;
        const addr = shippingDetails?.address || session.customer_details?.address;

        if (addr) {
          const recipientName = shippingDetails?.name || session.customer_details?.name || 'Valued Customer';
          const nameParts = recipientName.trim().split(' ');
          const firstName = nameParts[0] || 'Valued';
          const lastName = nameParts.slice(1).join(' ') || 'Customer';

          try {
            const { createPrintifyOrder } = await import('@/lib/printify');
            const canvasSize = (session.metadata?.canvas_size as string) || '12x16';
            const primaryProductType = (session.metadata?.product_type as string) || 'museum-canvas';
            const hasOrderBump = session.metadata?.has_order_bump === 'true';
            const bumpType = session.metadata?.order_bump_type || 'keyring';

            const printifyItems: Array<{
              productType: 'museum-canvas' | 'framed-print' | 'apparel' | 'ceramic-mug' | 'keepsake-keyring';
              size: string;
              quantity: number;
              printFileUrl?: string;
              apparelSize?: string;
            }> = [];

            // Primary purchased product
            if (primaryProductType === 'ceramic-mug') {
              printifyItems.push({
                productType: 'ceramic-mug',
                size: '11oz',
                quantity: 1,
                printFileUrl: session.metadata?.print_file_url,
              });
            } else if (primaryProductType === 'keepsake-keyring') {
              printifyItems.push({
                productType: 'keepsake-keyring',
                size: 'One Size',
                quantity: 1,
                printFileUrl: session.metadata?.print_file_url,
              });
            } else if (primaryProductType === 'memorial-crewneck' || primaryProductType === 'memorial-tshirt') {
              printifyItems.push({
                productType: 'apparel',
                size: (session.metadata?.apparel_size as string) || 'L',
                quantity: 1,
                apparelSize: (session.metadata?.apparel_size as string) || 'L',
              });
            } else {
              printifyItems.push({
                productType: 'museum-canvas',
                size: canvasSize,
                quantity: 1,
                printFileUrl: session.metadata?.print_file_url,
              });
            }

            // Order Bump item (Ceramic Mug or Keepsake Keyring)
            if (hasOrderBump) {
              if (bumpType === 'mug') {
                printifyItems.push({
                  productType: 'ceramic-mug',
                  size: '11oz',
                  quantity: 1,
                  printFileUrl: session.metadata?.print_file_url,
                });
              } else {
                printifyItems.push({
                  productType: 'keepsake-keyring',
                  size: 'One Size',
                  quantity: 1,
                  printFileUrl: session.metadata?.print_file_url,
                });
              }
            }

            await createPrintifyOrder({
              externalId: session.id,
              shippingAddress: {
                first_name: firstName,
                last_name: lastName,
                email: session.customer_details?.email || '',
                phone: session.customer_details?.phone || '',
                country: addr.country || 'US',
                region: addr.state || '',
                address1: addr.line1 || '',
                address2: addr.line2 || '',
                city: addr.city || '',
                zip: addr.postal_code || '',
              },
              items: printifyItems,
              autoSubmit: process.env.PRINTIFY_AUTO_SUBMIT === 'true', // Defaults to Draft for safety & 1-click approval
            });
            console.info('[stripe-webhook] ✅ Printify order dispatched successfully for session:', session.id);
          } catch (printifyErr) {
            console.error('[stripe-webhook] ⚠️ Printify order dispatch failed:', printifyErr);
          }
        }

        // TODO: Fire server-side Meta CAPI Purchase event
        // await fireMetaCAPIPurchase(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info('[stripe-webhook] Session expired:', session.id);
        // TODO: Send abandoned cart recovery email
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object as Stripe.PaymentIntent;
        console.warn('[stripe-webhook] ❌ Payment failed:', intent.id, '|', intent.last_payment_error?.message);
        break;
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge;
        console.info('[stripe-webhook] 🔄 Refund processed:', charge.id, '| Amount:', charge.amount_refunded);
        // TODO: Cancel print job if within 1 hour of order
        // TODO: Send refund confirmation email
        break;
      }

      default:
        // Silently acknowledge events we don't handle
        break;
    }
  } catch (handlerError) {
    console.error('[stripe-webhook] Handler error for event', event.type, ':', handlerError);
    // Return 200 to prevent Stripe from retrying — log the error internally
    return NextResponse.json({ received: true, warning: 'Handler failed but acknowledged' });
  }

  return NextResponse.json({ received: true });
}
