# Store policy sources and findings (checked 2026-10-23)

These notes are planning inputs, not legal advice or a claim of store eligibility. Re-check each source when preparing an actual submission.

## Apple

- Apple requires App Store Connect privacy details for the app's own collection and for integrated third-party partners; these disclosures are required for new submissions and updates. Data categories, whether data is linked to a person, purposes, tracking, and privacy-policy links must be determined from the final shipped code and SDKs. Source: https://developer.apple.com/app-store/app-privacy-details/
- App Review Guidelines call for accurate privacy disclosures, appropriate security, clear contact/support information, and explaining data retention/deletion. Account deletion requirements depend on whether the app creates accounts; do not add account creation without an in-app deletion path and an agreed deletion process. Source: https://developer.apple.com/app-store/review/guidelines/

## Google Play

- Every published app must complete and maintain an accurate Data Safety form. It covers app and third-party SDK data collection, handling, and protection; only the developer can accurately attest to the actual shipped behavior. Source: https://support.google.com/googleplay/android-developer/answer/10787469?hl=en
- If an app lets users create accounts, Google requires both an in-app way to request account and associated-data deletion and an external web resource where users can request deletion. Even without in-app account creation, Play Console still has Data Deletion questions; non-account personal-data handling should be disclosed and a deletion contact/process confirmed. Source: https://support.google.com/googleplay/android-developer/answer/13327111?hl=en
- Google Play requires a Financial Features Declaration for apps that are cryptocurrency exchanges and/or software wallets, and applicable regional licensing/registration information may be required. Phase 1 should remain non-custodial/read-only and must be assessed against the policy based on actual shipped features before declaration or submission; no transaction feature should be enabled by assumption. Source: https://support.google.com/googleplay/android-developer/answer/16329703?hl=en

## Existing OKBOND site facts relevant to declarations

- The website's service inquiry API accepts contact information and inquiry fields, and stores records in Supabase using server-side credentials. It requires a per-owner 64-hex token and currently exposes GET/POST only; no user-facing deletion endpoint was found in the inspected handler. Do not promise deletion or history portability until the business's support/deletion process is confirmed.
- The website wallet hook uses `window.ethereum` and ethers `BrowserProvider`; it is browser-injected and is not a native React Native wallet adapter. No signing or financial actions are in scope until native wallet support, exact contract compatibility, security, and store-policy review are explicitly addressed.
