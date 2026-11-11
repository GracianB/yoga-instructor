# Public visitor journey · acceptance and guardrails

The public Yoga Instructor experience now has an optional intent-first orientation panel followed by practical bilingual questions. Both are outside the retired practice-engine sections, so they appear on the published Pages artifact.

Four explicit visitor intents map one-to-one to existing enquiry service radio values (individual, sala, online, equipos). The new handler delegates to the already-tested `[data-yoga-service]` interaction in `p2-navigation.js`; it does not create a second enquiry pathway, persist selections, fetch data, or claim bookings.

The FAQ and orientation do not offer medical advice or imply payment/availability commitments. Their English/Spanish presentation uses the existing `data-p2-lang` system.

All styling is appended to the canonical `yoga-public-final.css`, and the small event handler is appended to the existing public `yoga-showcase-v2.js`. This keeps the production script allowlist, consolidated CSS pipeline and SHA-256 manifest unchanged.

Acceptance: Node editorial contracts; Playwright 320/390/768px selection, enquiry propagation and keyboard FAQ; npm run quality; complete cross-browser CI; production deployment on merge.
