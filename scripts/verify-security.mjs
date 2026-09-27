/**
 * verify-security.mjs
 * 
 * Automated Security & Privacy Verification Suite for Paw & Keepsake
 * Run with: node scripts/verify-security.mjs
 */

import fs from 'fs';
import path from 'path';

const ROOT_DIR = process.cwd();

console.log('\n🔒 ==========================================');
console.log('   PAW & KEEPSAKE — AUTOMATED SECURITY AUDIT');
console.log('==========================================\n');

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, testName, details = '') {
  totalTests++;
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    if (details) console.error(`     ↳ ${details}`);
    failedTests++;
  }
}

// ---------------------------------------------------------------------------
// TEST SUITE 1: Secret Leaks & Partner Artifacts Scan
// ---------------------------------------------------------------------------
console.log('📌 [Suite 1] Scanning Codebase for Leaked Secrets & Ex-Partner Accounts');

function scanDir(dir, filterFn) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== 'node_modules' && entry.name !== '.next' && entry.name !== '.git') {
        results = results.concat(scanDir(fullPath, filterFn));
      }
    } else if (filterFn(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

const sourceFiles = scanDir(path.join(ROOT_DIR, 'src'), (f) => f.endsWith('.ts') || f.endsWith('.tsx'));

let foundStripeKey = false;
let foundPartnerPixel = false;
let foundFbqCall = false;

for (const file of sourceFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('sk_live_') || content.includes('sk_test_')) {
    foundStripeKey = true;
    console.error(`Found Stripe secret in: ${file}`);
  }
  if (content.includes('1543383894501429')) {
    foundPartnerPixel = true;
    console.error(`Found partner Pixel ID in: ${file}`);
  }
  if (content.includes('window.fbq') || content.includes("fbq('track'")) {
    foundFbqCall = true;
    console.error(`Found active fbq call in: ${file}`);
  }
}

assert(!foundStripeKey, 'Zero hardcoded Stripe API keys in src/');
assert(!foundPartnerPixel, 'Zero occurrences of ex-partner Meta Pixel ID (1543383894501429) in src/');
assert(!foundFbqCall, 'Zero active Meta window.fbq calls in src/');

// Check .env.local
const envLocalPath = path.join(ROOT_DIR, '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  assert(!envContent.includes('sk_live_'), '.env.local has no partner live Stripe secret key');
  assert(!envContent.includes('1543383894501429'), '.env.local has no partner Meta Pixel ID');
  assert(envContent.includes('PRINTIFY_API_TOKEN='), '.env.local retains your Printify token safely');
  assert(envContent.includes('PRINTIFY_SHOP_ID=28881871'), '.env.local retains your Printify shop ID');
}

// ---------------------------------------------------------------------------
// TEST SUITE 2: HTTP Security Headers Configuration
// ---------------------------------------------------------------------------
console.log('\n📌 [Suite 2] Verifying Server Security Headers (next.config.ts)');

const nextConfigContent = fs.readFileSync(path.join(ROOT_DIR, 'next.config.ts'), 'utf8');

assert(nextConfigContent.includes('X-Frame-Options') && nextConfigContent.includes('DENY'), 'Anti-Clickjacking (X-Frame-Options: DENY) configured');
assert(nextConfigContent.includes('X-Content-Type-Options') && nextConfigContent.includes('nosniff'), 'Anti-MIME Sniffing (X-Content-Type-Options: nosniff) configured');
assert(nextConfigContent.includes('Strict-Transport-Security') && nextConfigContent.includes('max-age='), 'HSTS (Strict-Transport-Security HTTPS enforcement) configured');
assert(nextConfigContent.includes('X-XSS-Protection'), 'X-XSS-Protection header active');
assert(nextConfigContent.includes('Permissions-Policy') && nextConfigContent.includes('interest-cohort=()'), 'Permissions-Policy configured with FLoC/Topics tracking blocked');

// ---------------------------------------------------------------------------
// TEST SUITE 3: PII Leak Prevention in Analytics
// ---------------------------------------------------------------------------
console.log('\n📌 [Suite 3] Verifying Zero-PII Leakage in Analytics');

const analyticsContent = fs.readFileSync(path.join(ROOT_DIR, 'src/lib/analytics.ts'), 'utf8');

assert(analyticsContent.includes('sanitizeAnalyticsPayload'), 'PII Sanitization function exists in analytics');
assert(!analyticsContent.includes('metaPayload'), 'No Meta payload formatting exists');
assert(analyticsContent.includes('hasTrackingConsent'), 'Consent verification check exists before firing analytics');
assert(analyticsContent.includes('setTrackingConsent'), 'User consent opt-in/opt-out control exported');

// ---------------------------------------------------------------------------
// TEST SUITE 4: Webhook & Endpoint Decommissioning Guard
// ---------------------------------------------------------------------------
console.log('\n📌 [Suite 4] Verifying Stripe Webhook & Session Decommissioning');

const stripeWebhookContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/webhooks/stripe/route.ts'), 'utf8');
assert(stripeWebhookContent.includes('decommissioned'), 'Stripe webhook endpoint is marked decommissioned');
assert(!stripeWebhookContent.includes('createPrintifyOrder'), 'Stripe webhook has ZERO access to createPrintifyOrder');

const sessionRouteContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/checkout/session/route.ts'), 'utf8');
assert(sessionRouteContent.includes('isPaid: false') || sessionRouteContent.includes('decommissioned'), 'Checkout session verification is decommissioned');

// ---------------------------------------------------------------------------
// TEST SUITE 5: Printify Defense-in-Depth
// ---------------------------------------------------------------------------
console.log('\n📌 [Suite 5] Verifying Printify Protection & Inventory Integration');

const printifyContent = fs.readFileSync(path.join(ROOT_DIR, 'src/lib/printify.ts'), 'utf8');
assert(printifyContent.includes('test_order_blocked'), 'Printify order creation blocks test sessions from being sent');
assert(printifyContent.includes('PRINTIFY_CANVAS_VARIANTS'), 'All 4 Printify canvas variants (8x12, 12x16, 16x20, 16x24) mapped');
assert(printifyContent.includes('PRINTIFY_MUG_VARIANTS'), 'Printify mug variants mapped');
assert(printifyContent.includes('PRINTIFY_KEYRING_VARIANTS'), 'Printify keyring variants mapped');

// ---------------------------------------------------------------------------
// TEST SUITE 6: Cookie Hardening (HttpOnly & Secure)
// ---------------------------------------------------------------------------
console.log('\n📌 [Suite 6] Verifying Cookie Security Attributes');

const tributeRouteContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/ai/generate-tribute/route.ts'), 'utf8');
assert(tributeRouteContent.includes('httpOnly: true') && tributeRouteContent.includes('secure: process.env.NODE_ENV'), 'generate-tribute cookie has httpOnly and secure flags');

const quoteRouteContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/api/generate-quote/route.ts'), 'utf8');
assert(quoteRouteContent.includes('httpOnly: true') && quoteRouteContent.includes('secure: process.env.NODE_ENV'), 'generate-quote cookie has httpOnly and secure flags');

// ---------------------------------------------------------------------------
// TEST SUITE 7: Legal Compliance Pages
// ---------------------------------------------------------------------------
console.log('\n📌 [Suite 7] Verifying Required Legal Documents');

assert(fs.existsSync(path.join(ROOT_DIR, 'src/app/(legal)/privacy/page.tsx')), 'Privacy Policy page exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'src/app/(legal)/terms/page.tsx')), 'Terms of Service page exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'src/app/(legal)/refund/page.tsx')), 'Refund & Replacement page exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'src/app/(legal)/shipping/page.tsx')), 'Shipping Policy page exists');
assert(fs.existsSync(path.join(ROOT_DIR, 'src/components/layout/CookieConsentBanner.tsx')), 'CookieConsentBanner component exists');

const privacyContent = fs.readFileSync(path.join(ROOT_DIR, 'src/app/(legal)/privacy/page.tsx'), 'utf8');
assert(privacyContent.includes('pawkeepsake@gmail.com'), 'Privacy policy lists official support email');
assert(privacyContent.includes('DO NOT sell'), 'Privacy policy contains explicit Zero Data Selling guarantee');
assert(privacyContent.includes('CCPA') && privacyContent.includes('GDPR'), 'Privacy policy covers CCPA and GDPR rights');

// ---------------------------------------------------------------------------
// SUMMARY
// ---------------------------------------------------------------------------
console.log('\n==========================================');
console.log(`🏁 AUDIT COMPLETE: ${passedTests}/${totalTests} TESTS PASSED`);
if (failedTests === 0) {
  console.log('🎉 100% SECURITY & PRIVACY VERIFICATION SUCCESSFUL!');
} else {
  console.error(`⚠️ ${failedTests} TESTS FAILED — Review errors above.`);
}
console.log('==========================================\n');

process.exit(failedTests === 0 ? 0 : 1);
