# Store-readiness checklist — not a submission

The app has **not** been submitted to Apple or Google, and this checklist is not a representation that either store has approved it. Declarations must describe the exact release binary and SDKs; the app owner must make the final attestations.

## Confirm with the app owner before creating store listings

- Legal publisher/developer entity name, support URL/email, privacy contact, and who owns and maintains the app.
- A dedicated public mobile-app privacy-policy URL that accurately covers the shipped app, public Polygon RPC services, PolygonScan links, device/network metadata, retention, and support contact. The existing OKBOND `/legal` destination inspected for planning is a transparency-vault page, not a confirmed dedicated privacy policy.
- Document the publisher's retention/deletion process and public contact for any data processed by the app or external providers. Phase 1 has no app account and no direct personal service-inquiry submission, but this does not remove the need to answer store privacy/data questions accurately.
- Confirm the store identifiers. Current `app.config.ts` still has generated `space.manus.okbondapp.t210852996604796` Android/iOS IDs and a generated deep-link scheme. They are technical placeholders, not confirmed publisher-owned identifiers. A matching publisher domain may also require confirmation before universal/app-link verification.
- Store artwork, age-rating/content questionnaires, screenshots, support URL, regional availability, final description and financial-feature declarations.
- Because this app describes an on-chain lottery and crypto contracts, obtain qualified review of store gambling/lottery and crypto-financial classifications, platform eligibility, and jurisdictions before submission. Phase 1 exposes no lottery participation or financial action; do not add those actions or claim this preliminary scope guarantees store eligibility.
- Review the exact Polygon RPC provider terms/privacy documentation and every production/test dependency/SDK. Do not claim “no data shared” without verifying provider and SDK behavior.

## Permissions and data designed into this phase

- `android.permissions` is an empty explicit list. The app does not request camera, microphone, contacts, location, notifications, photos, or payment permissions. The existing optional tab-haptics package may contribute `android.permission.VIBRATE` through its merged manifest; inspect the generated Android manifest on the actual EAS build before any store declaration.
- `expo-audio`, `expo-video`, `expo-notifications`, and `expo-keep-awake` direct libraries and plugins are removed because the Phase 1 app has no such feature. Optional `expo-haptics` is the only intentionally retained device-interaction module; inspect the EAS merged Android manifest for any `VIBRATE` permission before the store declaration.
- The native navigation exposes no sign-in, account-creation, or OAuth callback route, and the native app root does not wire the starter's tRPC/auth session client. The Expo starter still contains server/auth scaffolding for its fixed development runtime; it is unused by the read-only mobile routes. No wallet signer, service-request form, ad network, or analytics SDK is connected. No private key, seed phrase, wallet address, or server secret is bundled.
- The app stores the onboarding-completed flag only in local AsyncStorage. It is not a server profile and is not associated with a login/account. An in-app action clears this flag.
- Public Polygon reads call the configured public JSON-RPC endpoint. The app requests public token supply, vault balance, lottery getters, block metadata and contract code/balance. The RPC operator may receive IP/device/network metadata and should be described in the eventual policy and store declarations.
- PolygonScan links and an explicit link to the existing Services website open the platform browser; the app itself does not submit personal service inquiries.

## Policy references

See [STORE_RESEARCH_NOTES.md](./STORE_RESEARCH_NOTES.md) for the official Apple and Google sources consulted on 2026-10-23. Re-check the current source pages and actual shipped SDK/data behavior during store submission; this note is not legal advice.
