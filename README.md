# Business Portfolio — Cobalt reference adaptation

**Status:** Initial implementation, not a visually verified or production-approved clone.

Reference: https://cobalt-web.framer.website/
Repository: https://github.com/vaishnavsawant1994-stack/business-portfolio-

This is an independently coded, responsive portfolio demonstration informed by the publicly accessible information architecture of Cobalt Studio. It is **not affiliated with its creator** and is **not pixel-perfect**. Some example titles and project slugs are retained for route fidelity, but the copy, illustrative artwork, testimonial examples and technical code are newly written.

## Routes
Home; Work; 6 project details; Services; Pricing; About; Journal; 3 article details; Contact; Privacy; custom client-side 404. Total: 17 known routes plus unmatched fallback.

## Functionality
Client-side navigation with browser history, mobile navigation, tabbed services, FAQ disclosure, testimonial controls, scroll reveals, CSS visual studies, responsive content layouts, a validated contact form and serverless email delivery integration.

The form **does not pretend to succeed** when delivery is not configured. Configure \`RESEND_API_KEY\`, \`CONTACT_TO_EMAIL\` and \`CONTACT_FROM_EMAIL\` in Vercel. Use an email sender domain verified with Resend. Never put secrets in public JavaScript. Do not use original Cobalt email addresses.

## Run locally
\`\`\`bash
npm install
npm run dev
npm run check
npx playwright install chromium
npm test
\`\`\`
Preview locally at http://localhost:3000.

## Deployment
Connect this GitHub repository to Vercel using the \`main\` branch and no framework preset (static content plus /api/contact serverless function). \`vercel.json\` rewrites friendly URLs to index.html.

## Design/source restrictions
The public reference identifies a Limited-licensed Framer template. The original photos, case-study assets, video, team images, detailed page motion and original text have **not** been transferred to this repository. CSS-drawn visuals are intentionally different and are marked as original demo art. See \`ASSET_AND_ACCEPTANCE_GAPS.md\`.

## Validation to complete
- Obtain approved rights for each original asset or replace with user-owned content.
- Capture original and implementation at matching viewport/scroll/hover/animation checkpoints using a real browser and compare pixel/perceptual diffs.
- Verify every route and interaction with Playwright and accessibility checks.
- Test all target viewport widths and browser engines.
- Confirm the contact email provider, business identity, legal policy and canonical deployment domain.
- Remove \`noindex\` only after production-content and legal review.

Do not claim original-fidelity parity, contact delivery, CI, or production verification without attached evidence.
