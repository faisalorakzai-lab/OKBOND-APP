# OKBOND Mobile — Premium Home Screen Report

**Date:** 2026-10-23  
**Scope:** Premium OKBOND Home Screen redesign based on the supplied requirements and Trust Wallet / BePay Money style references, without copying their branding or proprietary assets.

## Implemented

The authenticated Home screen now uses OKBOND's existing emblem, obsidian-black surfaces, charcoal cards, restrained metallic gold accents, readable white text, and accessible rounded controls. The composition is original and mobile-first.

The top area contains the OKBOND logo and wordmark, actual Polygon Chain 137 indicator, notification control, and profile avatar derived from the authenticated user's name when available. It never invents a user name.

The welcome section uses the requested messaging and personalizes the greeting only when the authenticated session returns a name. The portfolio card includes a show/hide control, refresh control, USD label, available/staked/pending breakdown, and wallet connection state. Since the current mobile project has no production mobile wallet adapter, the card correctly shows an empty/unavailable state instead of a fake balance.

Quick actions include Send, Receive, Buy Crypto, and Swap. Each action has an accessible button and a clear configuration-pending message. No simulated transaction or success response exists.

The My Assets section displays the configured OKBOND token contract and public Polygon supply when the existing verified read succeeds. It explicitly labels this as public contract data and not the user's personal wallet balance. Loading, unavailable, and retry states use the existing Polygon read hook.

Explore OKBOND links to real existing routes for Vault, Staking, Governance, and Services. Staking and Governance are visibly marked as coming soon/not configured where their verified deployment or data source is absent.

Recent activity has a real empty state and a separate Activity tab. The app does not fabricate pending, confirmed, failed, profit, or transaction history data.

The bottom navigation was adapted to: **Home, Markets, Activity, Services, Profile**. Existing Portfolio remains the Markets route, existing More remains the Profile route, and existing Staking remains reachable from the Home ecosystem card without breaking the prior route architecture.

## Data sources and boundaries

The Home screen reuses the existing authenticated session hook, existing Polygon read-only summary hook, and verified contract manifest. The website repository's Supabase client was inspected. Its currently visible mobile-relevant data is profile/social/referral data, not a verified personal portfolio, transaction history, or market-pricing source. Therefore no Supabase data was copied into a financial balance card and no Supabase secret was added to the mobile client.

Personal balances, prices, 24-hour change, wallet transactions, send, receive, swap, buy, and activity remain unavailable until the corresponding secure production integrations are connected. The UI shows honest setup states rather than demo content.

## Validation

- `pnpm check` — passed
- `pnpm lint` — passed
- `pnpm test -- --run` — 40 passed, 1 existing auth logout test skipped
- Expo Web export — passed after the Home and Activity navigation update; `/activity` and all existing routes exported
- Native iOS/Android signed builds — not run in Sandbox

## Files

- `app/(tabs)/index.tsx` — premium Home Screen
- `app/(tabs)/activity.tsx` — real empty Activity screen
- `app/(tabs)/_layout.tsx` — Home / Markets / Activity / Services / Profile navigation

The existing website repository and Vercel production deployment were not changed.
