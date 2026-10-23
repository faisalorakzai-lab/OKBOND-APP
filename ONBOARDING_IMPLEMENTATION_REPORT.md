# OKBOND onboarding implementation report

## What changed

The existing React Native + Expo onboarding was upgraded in place to five ordered, black-and-gold screens: OKBOND logo reveal, floating wallet/token, ecosystem and Services, Vault/Network, and final gold emblem. Navigation supports Back, Next, Skip, and Get started. Only the current scene is mounted for animation; the existing reduced-motion preference also gates motion. The root launch gate waits for local storage before choosing onboarding or Home, and storage failures are surfaced rather than silently treated as a completed or fresh launch. Settings now offers **Replay Onboarding** and clears the local completion flag.

## Animation library and bundled assets

- Native animation: `lottie-react-native` **7.3.8**.
- Expo Web preview adapter: `@lottiefiles/dotlottie-react` **0.13.5**. The browser preview rendered a Lottie canvas; the native implementation remains Lottie React Native.
- Screen transitions reuse the app’s existing React Native Animated-based `FadeIn`; no 3D model assets were introduced.
- Five locally authored, bundled Lottie JSON scenes, each 512×512 at 30 fps and 3 seconds long:

| Scene | File size |
| --- | ---: |
| Logo reveal | 2,288 bytes |
| Floating wallet/token | 2,680 bytes |
| Ecosystem/Services | 2,713 bytes |
| Vault/Network | 3,119 bytes |
| Final emblem | 2,288 bytes |
| **Five animations total** | **13,088 bytes** |

The existing OKBOND app icon remains unchanged. A separate 512×512 JPEG derivative for onboarding is **65,615 bytes**. The five animations plus that derivative total **78,703 bytes** (about 76.9 KiB). All five animation files and the derivative are local/offline assets.

## Verification and build status

- `pnpm check` (TypeScript): passed.
- `pnpm lint`: passed after correcting the launch-gate effect diagnostic.
- `pnpm test`: **38 passed, 1 skipped** (the existing `auth.logout` test is skipped); the onboarding suite contains 7 tests.
- `pnpm exec expo export --platform web`: succeeded and exported **19 static routes**. The reported Web JavaScript bundle is 3.4 MB.
- Browser Preview at a 390×844 mobile viewport: rendered the first Lottie canvas; verified all five screens, Back/Next, final completion, Skip persistence, cold root launch to Home after completion, and Settings → Replay Onboarding returning to screen one.
- Android and iOS native release builds were **not run**. Expo Web export and browser Preview do not constitute native-device or EAS build verification; no store-ready artifact is claimed.
- The Expo dependency checker offered unrelated baseline SDK package updates. They were left unchanged to keep this onboarding change scoped; resolve SDK alignment before a native release build if the Dashboard/EAS build requires it.
- The website and smart contracts were not modified.
