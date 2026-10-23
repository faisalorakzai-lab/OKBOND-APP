# OKBOND Mobile — TODO

## 1. Separate native app architecture and website isolation
- [x] Create a separate React Native + Expo application workspace using TypeScript for Apple App Store and Google Play Store.
  - Identify the existing website's frontend framework, backend APIs, authentication, Polygon integrations, wallet provider, routes, shared types, and design assets.
  - Reuse existing backend APIs and shared business logic only where compatible; do not render the website's React DOM components inside React Native.
  - Document the architecture and any required API changes before implementing complex integrations.
  - Do not replace, edit, break, deploy, or otherwise change the existing website or its production APIs as part of this app task.
- [x] Keep the mobile app on the initialized Expo Router / React Native / TypeScript / NativeWind starter and create a clear native folder structure for routes, shared components, data hooks, API/contract helpers, and assets.

## 2. Native screens, visual identity, and interaction states
- [x] Deliver Splash and onboarding; Home; Portfolio Dashboard; Services; Staking overview; Lottery information; Vault and Governance overview; and Profile, settings, help, and legal-disclosure screens.
  - Use native mobile navigation suitable for portrait, one-handed use.
  - Use the existing OKBOND black-and-metallic-gold brand, logo assets, typography, and visual language.
  - Provide a premium mobile-first interface, responsive layouts, subtle animations, accessible controls, and polished loading, empty, and error states.
  - Respect reduced-motion and readable touch-target/label requirements.
- [x] Keep all claims factual and aligned with actual on-chain/API data; show explicit unavailable/retry states instead of sample values or silent zero fallbacks.

## 3. Read-only data, Services, and financial-action boundaries
- [x] Connect only to existing verified API endpoints and configured Polygon contracts. Read contract addresses from existing configuration; never invent addresses. Use environment variables and secure secret handling; never put private keys, seed phrases, or server secrets in the mobile bundle.
- [x] Do not implement fake balances, fabricated transactions, or simulated production rewards. Preserve existing production contracts and tokenomics.
- [x] Implement the approved Phase 1 as read-only: no login/account, no native wallet connection, no token purchases, no lottery entry, no staking transactions, and no other financial action. Do not enable any financial action until native wallet integration, contract compatibility, and applicable store-policy requirements have been separately reviewed and approved.
- [x] Services may show the existing inquiry-only categories and only verified/published property catalog data when available. The app must not submit personal service-inquiry fields to the existing service-requests API in Phase 1; an explicit inquiry action opens the existing website instead. Do not change the website/API or claim that an inquiry is a booking or payment.
- [x] Keep Portfolio Dashboard limited to real public aggregate data. Do not show a personal wallet balance or imply a wallet is connected in Phase 1.

## 4. App-store configuration, permissions, and documentation
- [x] Configure Expo app metadata, app icon, splash screen, Android package ID, and iOS bundle ID; use clearly documented placeholders wherever legal ownership or final identifiers need confirmation. Preserve the starter's generated identifiers until the owner confirms the production identifiers.
- [x] Prepare EAS Build configuration for both Android and iOS. Add environment-configuration examples without committing secrets.
- [x] Identify and document required privacy disclosures, app permissions, data deletion/account-management requirements where applicable, app review documentation, and qualified review of crypto/lottery store classification and jurisdictions. Remove starter permissions/plugins/libraries that the approved app does not use; do not add analytics, ads, or hidden tracking.
- [x] Provide a README covering local development, environment setup, testing, build commands, and store-submission prerequisites. Keep official Apple/Google source links and findings in `STORE_RESEARCH_NOTES.md`.
- [x] Do not claim the app is published or store-approved. Do not submit a release, publish to a store, deploy to production, or change the website without explicit authorization.

## 5. Quality and handoff to the requested GitHub repository
- [x] Run the available app type check, lint, tests, and build; test the app on Android and iOS simulators or available preview environments and report which execution surfaces were actually verified.
  - Prior Phase 1 verification in this Sandbox: TypeScript (`pnpm check`), Expo lint (`pnpm lint`), Vitest (`31 passed`, one existing auth logout test skipped), Expo Web static export, and HTTP 200/nonempty content for `/`, `/onboarding`, `/portfolio`, `/services`, `/staking`, `/lottery`, `/vault`, `/governance`, `/settings`, `/help`, and `/more`. Native iOS/Android EAS signing/builds were not run.
  - Onboarding follow-up verification: `pnpm check` and `pnpm lint` passed; Vitest reported 38 passed and one existing logout test skipped; Expo Web export succeeded with 19 routes. Preview verified all five onboarding screens, Back/Next, Skip, saved completion after a root reload, and Settings replay.
- [x] Ensure the existing website continues to build and function without changing its source, branch, or live deployment.
  - Existing website checkout remained clean on `main` at commit `9ea5083`; mobile code is in a different workspace.
- [x] Report what is actually implemented, credentials still needed, and anything blocked by legal or app-store policy review.
- [x] When the app work is complete, push the app code to the exact requested destination `https://github.com/faisalorakzai-lab/OKBOND-APP` while preserving the separate Manus-managed canonical repository. Inspect the target first, do not overwrite pre-existing unrelated content, never force-push/rewrite history, and exclude `.env`, secrets, and temporary credentials. If target history/access prevents a safe push, stop and report the blocker.
  - Prior Phase 1 handoff: app commit `75f8a0c` was pushed without force to `main`; subsequent handoff commit `21f4030` updated the repository checklist.
  - Onboarding implementation and report were pushed without force to GitHub `main` at `dc5e511be02df54b014e2ac79aa62ed8dd8e54c2`; existing repository history was preserved, the Manus-managed repository remains canonical, and the staged changes contained no credential-pattern matches.

## 6. Verified contract coverage and truthful disclosures
- [x] Only use addresses and view methods supported by the exact-match Polygon deployment manifest and verified source. The manifest does not list a verified Staking deployment or Governance contract/route; do not copy the old website's hardcoded staking address or show unverified staking metrics/APY. Staking and Governance must clearly say that no verified deployment/data source is configured.
- [x] If Vault data is displayed, call the verified `vaultBalance()` view and label it as OKBOND held by the vault address. Do not reuse old `totalReserves`, `lotteryPool`, or `treasuryBalance` zero-fallback metrics or describe the OKBOND amount as POL reserves.
- [x] If Lottery contract facts are displayed, accurately reflect its verified source: 100 OKBOND entry amount, 60-day lock, five winners, native POL rewards, owner-only winner selection using `block.timestamp` and `block.prevrandao`; do not claim Chainlink VRF, independent audit, automatic refund/reward, or guaranteed outcome. The manifest records the independent audit as `not-submitted`. The mobile app must not invoke entry, winner selection, refund-claim, or reward-claim methods.
- [x] Only label Polygon/contract data live after successful chain and method responses; provider errors must result in a visible unavailable/retry state, never an assumed offline chain or fabricated zero.

## 7. Five distinct onboarding visuals and optimized animation
- [x] Improve the existing onboarding rather than rebuilding the app, with five distinct ordered visuals: (1) OKBOND logo reveal, (2) floating wallet/token, (3) ecosystem/Services, (4) Vault/Network, and (5) final gold emblem.
  - Maintain the existing black-and-gold OKBOND branding and reuse the existing logo.
  - Prefer optimized Lottie animations for suitable scenes and lightweight native animation for transitions; use pre-rendered 3D only where meaningful, and keep the experience performant on ordinary Android devices.
  - Lazy-load or mount only the active animation; preserve OS reduced-motion and accessible-control behavior.
  - Optimize animation/image dimensions and bundled asset sizes; keep the five visuals distinct and local/offline.
  - Evidence: five local Lottie scenes total 13,088 bytes plus a compressed 512×512 emblem; Preview rendered a Lottie canvas at 390×844 and all five distinct scenes were exercised.

## 8. First-launch, skip, completion, and replay behavior
- [x] Show onboarding once on a fresh install; provide Back and Next actions, allow Skip, save completion, and provide a final Get Started action.
  - Skip completes onboarding and opens the normal app entry screen; final Get Started saves completion and opens that screen.
  - On app restart after saved completion, do not show onboarding again. Wait for local-storage initialization before routing so onboarding does not flash briefly on every launch.
  - Add “Replay Onboarding” in Settings; it clears only the local completion flag and returns to the first onboarding screen.
  - Handle local-storage read/write/remove errors explicitly without falsely claiming the completion flag was saved or changing website/server data.
  - Evidence: unit tests cover fresh launch, saved restart, replay, and storage failure; Preview verified Back/Next, Get started, Skip saving `okbond.mobile.phase1.onboarding-seen=seen`, cold root launch to Home, and Settings replay to screen one.

## 9. Onboarding delivery evidence
- [x] Run the available app checks and verify the complete onboarding sequence, skip path, saved-completion restart behavior, and Settings replay in an available preview/device environment.
  - Report which animation library was actually used, the number and source of animation assets, their total file size, and the actual build/preview status. Distinguish Expo Web checks from Android/iOS native builds; do not claim a native build unless it ran successfully.
  - Do not modify the website or smart contracts.
  - Evidence: TypeScript and lint passed; 38 tests passed with one existing logout test skipped; Expo Web export succeeded with 19 static routes. All source changes are confined to the mobile workspace. Android/iOS release builds were not run.
