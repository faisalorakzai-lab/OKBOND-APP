# OKBOND Mobile — Implementation Plan

## Maqsad aur boundary

Yeh alag React Native + Expo app hogi jo iOS aur Android ke liye taiyar ki jayegi. Maujooda website `https://orakzaibond.com` aur uska GitHub/Vercel project read-only reference hain; unki source files, APIs, domain, production deployment ya live website ko is project se edit, replace ya deploy nahin kiya jayega. App ko existing OKBOND logo aur black/metallic-gold identity follow karni hai.

Aap ne 2026-10-23 ko recommended Phase 1 approve ki: app read-only rahegi—koi login/account, native wallet connection, wallet signing, token purchase, staking transaction, lottery entry ya doosri financial action nahin. Public on-chain values tabhi dikhengi jab actual read successful ho; RPC ya contract error par `Unavailable`/retry state hoga, zero ya sample value nahin. Personal portfolio balance nahin dikhaya jayega. Services page inquiry-only categories dikhayega; personal details submit nahin karega aur inquiry ke liye explicit tap par existing website kholega.

## Screens aur navigation

Expo Router ke native bottom tabs one-handed portrait use ke liye honge: **Home**, **Portfolio**, **Services**, **Staking**, aur **More**. More ke andar **Lottery**, **Vault**, **Governance**, **Profile/Settings**, **Help**, aur **Legal** honge. Splash/onboarding sirf brand aur app ka read-only scope samjhayega; user account banane ya wallet connect karne ka dawa nahin hoga.

Home par ecosystem ka concise introduction, network/read-data status aur screen shortcuts honge. Portfolio Dashboard protocol-level verified aggregate reads dikhayega; personal wallet holdings ke liye clear “wallet link not configured in Phase 1” state hogi. Staking, Lottery, Vault aur Governance screens informational/read-only hongi aur verified contract/official source links dengi. Transaction buttons aur “guaranteed return”, “audited” ya doosre unsupported claims nahin honge.

Services hub maujooda website ki 12 inquiry-only service categories aur unki availability ko native cards mein dikhayega. Sirf verified, published property listings ka read-only catalog use ho sakta hai. Phase 1 mein app ke andar name/contact fields submit nahin karenge; user agar inquiry karna chahe to wazeh tap ke baad existing website ka Services page external browser mein khulega. Is se mobile app personal inquiry records collect nahin karegi aur website/API mein koi tabdeeli darkar nahin hogi. Local settings on-device rahengi; cloud profile/account nahin hoga.

Har data-driven screen mein loading, empty, stale/unavailable aur retry states honge. Network failure ko zero, fake transaction ya placeholder reward mein convert nahin kiya jayega. Reduced-motion preference aur accessible labels/touch targets respect honge.

## Design direction

**Movement:** contemporary South Asian luxury-finance, sober black-metal surfaces aur restrained metallic gold ke saath. **Principles:** trustworthy disclosure; one-hand clarity; premium lekin readable contrast; interaction hamesha actual data/availability se linked. **Palette:** near-black/dark graphite main background, warm metallic gold signature, muted ivory text, aur green sirf confirmed live status ke liye. Gold ko success/risk ka substitute nahin banaya jayega.

Layout editorial aur vertical hoga: screen title, one primary fact/status, phir chhote readable data sections; mobile par over-dense dashboard grid nahin. Signature elements mein fine gold divider, restrained metallic outline, aur existing OKBOND emblem shamil honge. Motion short aur subtle, reduced-motion setting par band; tab/refresh par optional haptic. Typography system sans for numbers/body aur platform system serif for a limited display heading. Brand essence: “OKBOND — ek transparent, read-only mobile window into the Orakzai Bond ecosystem”; personality: composed, premium, candid. Voice concise aur factual hogi, misal: “Polygon read status: live” aur “Personal wallet data is not connected in this version.” Existing logo istemal hoga; naya wordmark invent nahin hoga.

## Architecture aur sources

Project fixed starter par rahega: Expo Router, React Native, TypeScript aur NativeWind. `app/` screens/routes; `components/` shared native cards/status controls; `hooks/` query/read state; `lib/` verified contract/API clients aur formatters; `assets/images/` app, splash aur Android adaptive icons; `server/` sirf tab jab zaroori read-only proxy ko app ke apne server mein implement karna justified ho. `drizzle/`/managed DB Phase 1 mein user data ke liye use nahin honge. `README.md`, `eas.json`, `.env.example`, `plan.md`, `TODO.md` aur store-readiness notes project documentation/config ko sambhalenge.

Existing website hook seedha reuse nahin hoga: `useWallet` ka `window.ethereum`/ethers `BrowserProvider` browser-injected wallet hai, React Native wallet adapter nahin; `useStaking`/`useICO` mein write-transaction methods hain; `useProtocolMetrics` kuch individual RPC failures ko zero fallback de sakta hai. Inse sirf verified interfaces/ABIs aur contract-address source ko read-only native implementation mein adapt kiya jayega. Polygon addresses ka source existing `contracts/deployments/polygon-mainnet.json` hoga; address guess ya naya production contract nahin banega. RPC, ABI/version, chain ID 137 aur data freshness screen par transparent honge.

`GET /api/property-listings` sirf `published` aur `verified` records ke liye read-only source hai. Browser preview par current API CORS allowlist Expo preview origin ko block kar sakti hai; website ko edit karne ke bajaye app mein honest error state ya external website fallback hoga. Website ka `/api/service-requests` GET/POST contact details aur inquiry fields persist karta hai, per-device owner token rakhta hai, aur inspected endpoint mein deletion route nahin mila; isi liye Phase 1 app us endpoint par personal inquiry submit nahin karegi. Existing service-request flow `localStorage`/`window.crypto` par depend karta hai, usay seedha native mein copy nahin kiya jayega.

## Privacy, permissions aur store readiness

Phase 1 mein login/account nahin, personal details submit nahin, location/microphone/camera/contacts/notifications ki zaroorat nahin. Unused audio, video, notifications, aur keep-awake libraries/plugins aur explicit Android permissions list remove kiye gaye; optional haptics retained hain, is liye final merged native manifest EAS build par check karna hoga. Future permissions sirf kisi baad mein approved feature ke liye mangi jayengi. Local preferences ke ilawa analytics/ad SDK ya hidden tracking add nahin hoga.

Apple App Store Connect ke Privacy Details aur Google Play Data Safety declarations final shipped code aur third-party SDKs ke mutabiq bharna developer ki zimmedari hai. Google account-deletion flow tab apply hota hai jab app account create karne deti ho; Phase 1 mein aisa account nahin hoga, lekin Play Console ke Data Safety/Data Deletion sawalat phir bhi check karne honge. Google crypto Financial Features Declaration shipped functionality par assess hogi; Phase 1 ko wallet/exchange ya transaction feature ke taur par assume nahin kiya jayega. Official links aur findings [STORE_RESEARCH_NOTES.md](./STORE_RESEARCH_NOTES.md) mein hain.

Read-only inspection mein website ka `/legal` route ek transparency-vault page nazar aaya, dedicated mobile-app privacy policy/data-retention/deletion notice nahin. Is liye store submission se pehle approved privacy-policy URL, support/contact details, data-retention/deletion process, app owner/legal entity, final Android package/iOS bundle IDs, aur Apple/Google developer-account approvals confirm karne honge. Abhi yeh release blockers hain; app ko published ya store-approved nahin kaha jayega.

## Build aur handoff workflow

Starter ke fixed ports par `pnpm dev` Metro/Expo Web `8081` aur API server `3000` chalata hai; dono listeners ki readiness verify hogi. `pnpm check`, `pnpm lint` aur `pnpm test` available checks hain. Starter ka `pnpm db:push` sirf tab chalaya jayega jab approved implementation pehli baar uske OAuth/API schema ko use kare; Phase 1 mein apna database/OAuth use nahin karna tajweez hai. Existing website ka production build sirf read-only regression check ke taur par chal sakta hai; uska source commit/deploy nahin hoga.

Existing square logo ko native icon, Android foreground/background/monochrome variants aur splash mein fit kiya jayega—rounded-corner mask image mein bake nahin hoga. `app.config.ts` ke current generated `space.manus...` IDs aur scheme template identifiers hain, final public store IDs nahin; legal/domain ownership aur unique availability confirm hone tak unhein documented provisional state mein rakha jayega. `eas.json` mein Android aur iOS development/preview/production profiles tayyar honge, secrets `.env.example` mein nahin honge. Expo Web Preview UI aur read states verify karega; asli iOS/Android native verification ke liye Expo Go/device ya Dashboard EAS build ki zaroorat hogi. Native release builds Sandbox mein nahin banenge. EAS/Apple/Google credentials aur final signing release ke waqt owner-controlled Dashboard/Console flow mein chahiye honge.

Implementation shuru hone ke baad project `README.md` mein local setup, environment setup, dev/preview commands, tests, EAS build aur store prerequisites document honge. Store submission, production deployment, wallet transactions ya website/API changes is approval ka hissa nahin.

## GitHub handoff

App ka code kaam mukammal hone par aapke diye hue `https://github.com/faisalorakzai-lab/OKBOND-APP` repository mein push karne ki aapki authorization hai. Mobile project ka Manus-managed repository canonical hi rahega; GitHub destination ek alag code copy hogi, canonical switch nahin. Push se pehle target ki branch/history aur existing files inspect karenge; `.env`, secrets ya temporary credentials kabhi push nahin honge. Force-push ya history rewrite nahin hogi. Agar target par pehle se unrelated code/conflicting history ho ya authorization available na ho, existing content overwrite karne ke bajaye ruk kar aapko batayenge.

## Approved scope

Aap ne recommended read-only Phase 1 approve ki: **no login/account, no native wallet connection, no personal-data service forms, no financial transactions**. Native WalletConnect aur in-app service inquiry forms baad mein sirf alag approval, credentials aur policy/deletion requirements confirm hone ke baad add honge. Is approved plan ke baad detailed `TODO.md` aur implementation shuru hogi.


## Verified-source caveats from the deeper contract review

The Polygon mainnet deployment manifest marks the token, ICO, lottery, and vault sources `exact-match`; it contains no staking deployment address or governance contract, and the website has no Governance route. Do not copy the staking address that appears only in legacy website code. Staking and Governance screens will explain that no verified deployment/data source is configured and will not display live stats or APY.

The verified Vault source exposes `vaultBalance()`, which returns the OKBOND token balance held at the vault address. It does not expose the legacy dashboard's claimed `totalReserves`, `lotteryPool`, or `treasuryBalance` getters; if displayed, the value must be labelled as vault-held OKBOND, not POL reserves. The verified Lottery source has a 100 OKBOND entry amount, a 60-day lock, five-winner selection and native POL rewards; winner selection is owner-only and derives from `block.timestamp`/`block.prevrandao`. The app must not describe this as Chainlink VRF, audited, automatic, or guaranteed. The manifest records the lottery's independent audit as `not-submitted`; display that exact disclosure if the contract facts are shown. No lottery entry, refund claim, winner selection or reward claim will be callable from the app.

The current Sandbox could not reach the checked public Polygon RPC endpoints. This does not prove Polygon or the contracts are offline; the app must show live values only after a successful response and otherwise display an unavailable/retry state.
