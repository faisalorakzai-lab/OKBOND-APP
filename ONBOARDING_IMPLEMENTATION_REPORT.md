# OKBOND onboarding implementation report

## What changed

The existing React Native + Expo onboarding was refined in place; the app was not rebuilt. The five existing ordered scenes remain: OKBOND logo reveal, wallet/token, ecosystem and Services, Vault/Network, and final gold emblem. Navigation continues to support Back, Next, Skip, and Get started. Only the active scene animates, and the existing OS reduced-motion preference still disables autoplay.

On screen 2, the generic mini-card is now a premium black-and-metallic-gold card-style illustration with a foil edge, subtle highlights, the genuine OKBOND emblem, and truthful `PUBLIC DATA · READ ONLY` / `NO WALLET LINKED` labels. It reuses the existing `assets/images/onboarding-emblem.jpg` and uses native `react-native-svg` gradients; this dependency was already in the app. No new card image, 3D asset, or package was added. The reference's personal name, card number, expiry, Visa/network marks, and payment credentials were not copied. The artwork does not claim that OKBOND issues a payment card.

The root launch gate still waits for local storage before choosing onboarding or Home, and storage failures are surfaced instead of being silently treated as complete or fresh launch. Settings retains **Replay Onboarding** and clears only the local completion flag. The website and smart contracts were not modified.

## Animation library and bundled assets

- Native animation: `lottie-react-native` **7.3.8**.
- Expo Web preview adapter: `@lottiefiles/dotlottie-react` **0.13.5**. The browser Preview rendered a Lottie canvas; native playback remains Lottie React Native.
- The card uses the already-installed `react-native-svg` **15.15.4** for scalable vector gradients; no new dependency was required.
- Screen transitions reuse the app's existing React Native Animated-based `FadeIn`; no 3D model assets were introduced.
- Five locally authored and bundled Lottie JSON scenes, each 512×512, 30 fps, and 3 seconds long:

| Scene | File size |
| --- | ---: |
| Logo reveal | 2,288 bytes |
| Wallet/token with halo recentered on the emblem | 2,693 bytes |
| Ecosystem/Services | 2,713 bytes |
| Vault/Network | 3,119 bytes |
| Final emblem | 2,288 bytes |
| **Five animations total** | **13,101 bytes** |

The original 1024×1024 OKBOND app icon remains unchanged. Onboarding reuses its existing 512×512 JPEG derivative, **65,615 bytes**. Five Lottie files plus that derivative total **78,716 bytes** (about 76.9 KiB), below the 350 KB plan budget. The vector card itself adds no separate raster/media asset. All scene assets are local/offline.

## Verification and build status

- `pnpm check` (TypeScript): passed.
- `pnpm lint`: passed.
- `pnpm test`: **40 passed, 1 skipped** (the existing `auth.logout` test is skipped); the onboarding suite contains 9 tests, including the genuine-emblem/read-only card and halo-alignment checks.
- `pnpm exec expo export --platform web`: succeeded; **19 static routes** were exported and the reported JavaScript bundle is **3.5 MB**.
- Preview at **390×844** captured the mobile onboarding layout. An interactive Preview click-through reached screen 2 and confirmed the genuine emblem, card styling, and read-only labels. The artwork stage is capped at 360 px and the card at approximately 344×210 px; the interactive browser itself used its default wide viewport.
- Fresh-install, completed-launch, Back/Next, Skip, final completion, and Settings replay behavior had already been exercised in Preview and remain covered by tests; this visual refinement did not change the navigation or persistence logic.
- Android and iOS native release builds were **not run**. Expo Web export and browser Preview do not constitute native-device or EAS build verification; no store-ready artifact is claimed.
- The Expo dependency checker had offered unrelated baseline SDK package updates; they were left unchanged to keep this card refinement scoped. Resolve any SDK alignment requirement before a native release build if Dashboard/EAS requires it.
