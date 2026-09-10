import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products-data';
import { WallArtPdp } from './WallArtPdp';
import { ApparelPdp } from './ApparelPdp';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return { title: 'Product Not Found' };
  return {
    title: `${product.title} — Personalized Dog Memorial`,
    description: product.description,
    openGraph: {
      title: `${product.title} | Paw & Keepsake`,
      description: product.description,
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  if (product.category === 'apparel') {
    return <ApparelPdp product={product} />;
  }
  return <WallArtPdp product={product} />;
}
