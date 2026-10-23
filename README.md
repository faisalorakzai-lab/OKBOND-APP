# OKBOND-APP

Native OKBOND Mobile application.

A separate Expo + React Native application for iOS and Android. The existing OKBOND website, its production APIs, GitHub repository, and Vercel deployment are separate and must not be changed by this project. See [plan.md](./plan.md) for the approved product scope and [TODO.md](./TODO.md) for deliverable status.

## Phase 1 scope

This version is informational and read-only. It has no user account, wallet connection, signing, buy/claim/stake/lottery-entry transaction, or in-app service-inquiry form. The Services catalog opens `https://orakzaibond.com/ico` only after a user's explicit tap. Public chain queries read Polygon chain/block metadata and the exact-match configured token, vault, and lottery contracts. Staking and Governance do not have a configured verified deployment in the reviewed manifest; the app does not show guessed contract data, APY, or voting statistics. RPC/method errors remain visible as unavailable states, not fabricated zeroes.

The only app preference written locally is the onboarding-completed flag. Public RPC providers can see request/network metadata (including the caller's IP address) and should be disclosed in the approved privacy policy. No private key, seed phrase, service-request contact, or personal profile is included in the native app.

## Requirements and setup

Use Node.js and the repository-pinned package manager, pnpm 9.12.0. Dependencies are pinned in `pnpm-lock.yaml`.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local  # optional: set EXPO_PUBLIC_POLYGON_RPC_URL
pnpm dev
```

Mobile Dev uses its fixed listeners: Metro / Expo Web Preview on port `8081` and the app API server on port `3000`. Do not alter either project port. The Phase 1 screens call public JSON-RPC directly and do not call the starter OAuth or data APIs. If you later add a starter OAuth/API flow, first run `pnpm db:push` as required by the Expo template; no Phase 1 screen should trigger it.

`EXPO_PUBLIC_POLYGON_RPC_URL` is an optional public JSON-RPC URL override, not a secret; it will be used in client network requests. Without it the app tries public Polygon RPC endpoints in order. Never set a private key, seed phrase, privileged provider credential, server secret, or personal access token in `EXPO_PUBLIC_*` values.

## Checks

```bash
pnpm check
pnpm lint
pnpm test
```

`pnpm check` is the TypeScript check; `pnpm lint` is Expo ESLint; `pnpm test` runs the Vitest suite. Tests and app checks do not perform wallet or contract writes. Start Preview only through the project Dashboard; Expo Web or a QR/Expo Go session is not the same as verifying a signed native release binary.

## Native builds

The project includes development, internal preview, and production profiles in `eas.json` for Android and iOS. Native release builds are created through the project Dashboard/EAS from an accepted source checkpoint, not in this Sandbox shell. Expo Go requires the owner's Expo account authorization through the Dashboard Connect Expo flow. A production signing setup, Apple Developer account, Google Play Console account, certificates/credentials, final package/bundle identifiers, and store listing assets are still owner-controlled prerequisites.

The current `space.manus.okbondapp.t210852996604796` Android/iOS identifiers and generated deep-link scheme are temporary technical starter values, **not confirmed public publisher IDs**. Keep them until the legal owner confirms IDs it controls and that they are available. The `eas.json` profiles being present does not mean any build or store submission has run.

## Branding, privacy and release readiness

The launcher, adaptive Android, monochrome, splash, and favicon images are derived from the existing OKBOND logo. The app uses a deep-black/metallic-gold theme; the explicit Android permission list is empty, unused starter audio/video/notification/keep-awake plugins and direct libraries are removed, and haptics are optional. Review [STORE_READINESS.md](./STORE_READINESS.md) and [STORE_RESEARCH_NOTES.md](./STORE_RESEARCH_NOTES.md) before creating store listings.

A dedicated approved mobile-app privacy policy, the publisher's retention/deletion contact/process, legal publisher/support details, final owned identifiers, accurate Apple privacy/Google Play Data Safety declarations, age rating/content information, and any applicable crypto financial-feature declaration remain release prerequisites. Nothing here claims store approval or publish status.

## GitHub handoff

The intended external destination is `https://github.com/faisalorakzai-lab/OKBOND-APP`. This export must preserve its existing files/history and contain app source only: no `.env*` local secrets, signing credentials, Expo access token, GitHub personal access token, or Vercel token. The initialized Manus mobile project's canonical repository remains separate from the external GitHub export.
