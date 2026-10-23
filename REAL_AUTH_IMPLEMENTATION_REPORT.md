# OKBOND Real Authentication Implementation

## Live Supabase account flow

The login and create-account actions now use the connected Orakzai Bond Supabase project through `@supabase/supabase-js`.

- Email/password login calls `supabase.auth.signInWithPassword`.
- Create account calls `supabase.auth.signUp`.
- Signup stores the requested referral code in auth metadata.
- Supabase creates an `account_referrals` record from an `auth.users` trigger.
- Referral codes are validated through the secure `is_valid_account_referral` RPC before signup.
- Email confirmation is respected: when Supabase requires confirmation, the UI tells the user to confirm email before logging in.
- Session persistence uses browser localStorage on web and AsyncStorage on native.
- Auth state restoration and logout are connected to the Supabase session.
- The old development-only Testnet Preview Account is disabled by default; it only appears when `EXPO_PUBLIC_TESTNET_PREVIEW=true` is explicitly set.

## Supabase database changes

Applied migrations to project `aqjfleanijwtfdfjimwz`:

- `account_auth_referrals`: creates `public.account_referrals`, RLS policies and an `auth.users` signup trigger.
- `validate_account_referral_code`: creates the limited `is_valid_account_referral(text)` RPC.

The trigger generates each new user's own unique OKBOND referral code and stores a valid referrer code when supplied. Invalid referral codes are rejected before signup.

## Wallet connection

The Continue with wallet button now performs a real EIP-1193 browser wallet connection and requests Polygon Mainnet (`0x89`). It supports injected MetaMask and Trust Wallet browser providers, including chain switch/add requests. It shows the connected address and clear errors when no provider exists.

Full wallet-based account sign-in still requires server-side SIWE signature verification plus a Reown/WalletConnect project ID for native/mobile wallet deep links. No fake wallet session or unverified account is created.

## Validation

- TypeScript: passed
- Expo lint: passed
- Tests: 40 passed, 1 existing auth logout test skipped
- Expo Web export: passed
- Supabase migrations: applied successfully
- No service-role key was placed in the client bundle
