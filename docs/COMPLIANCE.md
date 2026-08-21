# Compliance: what this starter does and does not do

Plain language, because the people who need this are usually not lawyers, and the lawyers who read it are usually not engineers.

## The short version

**This starter is a marketing website.** It is designed so that it never needs to touch Protected Health Information (PHI). That is the whole compliance strategy: a site that holds no PHI has nothing to breach.

It is **not** a patient portal, intake system, telehealth tool, or anything else that handles health information. Using it for those things is possible, but then HIPAA applies to your deployment, and nothing in this repository makes you compliant.

## What the starter does

| Concern | What's built in |
|---|---|
| **Forms collect contact details, not health details.** | The form section posts to a webhook you configure (`FORM_WEBHOOK_URL`). Nothing is stored in Sanity, nothing is written to a database, and the server action never logs the request body. Field keys that look like PHI (`dob`, `ssn`, `mrn`, `diagnosis`, `condition`, `medication`, `insuranceId`, …) trigger a warning in the Studio that explains why. Every seeded form says, in the copy, not to include medical details. |
| **Nothing tracks before consent.** | GA4 loads only after a visitor accepts analytics cookies. Consent is stored in `localStorage` (no third-party consent vendor, no cookie set by the consent tool itself). Consent Mode v2 signals are sent so Google respects the choice. |
| **Analytics can't carry PII by accident.** | `track()` accepts a closed union of events and typed props. There's no way to pass an arbitrary string, which is how emails and names end up in analytics on most sites. |
| **No third-party scripts by default.** | Apart from GA4 (consent-gated) and Cloudflare Turnstile (on form pages only, needed for bot protection), the site loads nothing from anyone else. No chat widgets, no session replay, no pixels. The FTC and HHS have both acted against health sites that leaked browsing data through such tools. |
| **Accessibility is a legal exposure too.** | WCAG 2.2 AA is enforced by axe in CI; an accessibility statement page is seeded. ADA web suits against healthcare organisations are common and cheap to file. |
| **Medical content is attributable.** | `reviewedBy` / `reviewedAt` on services and posts render as bylines and in structured data. This is E-E-A-T for search engines, but it is also how you show a regulator that clinical claims were reviewed. |
| **Legal pages exist and are dated.** | Privacy policy, terms, accessibility statement and Notice of Privacy Practices are seeded with realistic placeholder text and an `effectiveDate`. Each carries a banner: **replace before launch.** |

## What the starter does NOT do

- **It does not make you HIPAA compliant.** HIPAA is about your organisation's policies, agreements and practices. A repository can't sign a BAA.
- **It does not secure your webhook receiver.** Whatever receives form posts (a CRM, Zapier, an email service, your own endpoint) is where the data goes. If PHI could ever arrive there, that service needs a BAA and you need to treat it as a covered system. We strongly recommend keeping clinical questions out of web forms entirely and collecting them by phone or through your portal, as the seeded copy does.
- **It does not encrypt or retain submissions.** By design. If you need an audit trail of submissions, that is a different system with different obligations.
- **It does not vet your content.** The PHI warning looks at field *keys*, not at what patients type. A free-text "message" field can still receive health information; that's why the form copy tells people not to send it, and why your receiver matters.
- **It does not handle authentication, patient accounts, scheduling, or payments.** Link out to the systems that do (your EHR's portal, a scheduling vendor with a BAA).
- **It does not cover Sanity's side.** Sanity stores your *marketing* content. If an editor pastes a patient's story into a post, that's PHI in Sanity. Train editors; Sanity offers HIPAA-eligible plans if you need them.
- **It does not replace legal review.** The seeded legal pages are templates written to be realistic. Have counsel review them for your jurisdiction, your state's privacy law, and your actual practices.

## Things to decide before launch

1. Where do form submissions go, and is that destination allowed to see anything a patient might type?
2. Does your privacy policy match what the site actually does (consent, GA4, Turnstile)?
3. Who reviews medical content, and is that reflected in `reviewedBy`?
4. Has someone who uses a screen reader tried the site?
5. Are you keeping the "Built with" footer link? (It's fine either way; it's just a line in `components/layout/Footer.tsx`.)

## Regulatory pointers (not legal advice)
- HHS bulletin on tracking technologies on health websites (2022, updated 2024).
- FTC enforcement under the Health Breach Notification Rule (GoodRx, BetterHelp).
- ADA Title III web accessibility; DOJ's 2024 rule for state and local government sites (WCAG 2.1 AA) is the de facto bar.
- State privacy laws with health-data provisions: Washington My Health My Data Act, Nevada SB 370, Connecticut. Several define "consumer health data" broadly enough to include inferences from browsing.
