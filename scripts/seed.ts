/**
 * Seed the demo dataset with Wrenfield Health.
 *
 *   npm run seed
 *
 * Idempotent: every document has a deterministic _id and is createOrReplace'd.
 * Images are generated with sharp and uploaded (Sanity de-duplicates by hash).
 * Needs SANITY_API_WRITE_TOKEN. Never run this against a real client dataset.
 */
import { createHash } from "node:crypto";
import type { SanityClient } from "@sanity/client";
import { writeClient } from "./lib/env";
import { logo, portrait, scene } from "./seed/images";
import { FAQS, LEGAL, LOCATIONS, ORG, PEOPLE, POSTS, PROVIDERS, REPLACE_BEFORE_LAUNCH, SERVICES } from "./seed/content";

/* ───────── Portable Text helpers ───────── */

type Para = string | { h2: string } | { ul: readonly string[] };

const key = (s: string) => createHash("sha1").update(s).digest("hex").slice(0, 12);

function span(text: string, k: string) {
  return { _type: "span", _key: k, text, marks: [] };
}

function block(text: string, style = "normal", k = key(text)) {
  return { _type: "block", _key: k, style, markDefs: [], children: [span(text, `${k}s`)] };
}

function pt(paras: readonly Para[]): unknown[] {
  const out: unknown[] = [];
  paras.forEach((p, i) => {
    if (typeof p === "string") out.push(block(p, "normal", key(`${i}${p}`)));
    else if ("h2" in p) out.push(block(p.h2, "h2", key(`${i}${p.h2}`)));
    else
      p.ul.forEach((item, j) =>
        out.push({ _type: "block", _key: key(`${i}${j}${item}`), style: "normal", listItem: "bullet", level: 1, markDefs: [], children: [span(item, key(`${i}${j}${item}s`))] }),
      );
  });
  return out;
}

const ref = (id: string) => ({ _type: "reference", _ref: id, _key: key(id) });
const link = (label: string, href: string) => ({ _type: "link", _key: key(label + href), label, href });
const slug = (s: string) => ({ _type: "slug", current: s });

/* ───────── Images ───────── */

async function upload(client: SanityClient, buffer: Buffer, filename: string, alt: string) {
  const asset = await client.assets.upload("image", buffer, { filename });
  return { _type: "imageWithAlt", asset: { _type: "reference", _ref: asset._id }, alt };
}

/* ───────── Main ───────── */

async function main() {
  const client = writeClient();
  console.log(`Seeding ${client.config().projectId}/${client.config().dataset} …`);

  // Images
  console.log("uploading images");
  const logoImg = await upload(client, await logo(), "wrenfield-logo.png", "Wrenfield Health logo");
  const heroImg = await upload(client, await scene(11), "hero.jpg", "Soft abstract shapes in teal and cream");
  const providerHeroImg = await upload(client, await scene(23), "hero-providers.jpg", "Soft abstract shapes in teal and cream");
  const locationImgs = Object.fromEntries(
    await Promise.all(LOCATIONS.map(async (l, i) => [l.key, await upload(client, await scene(40 + i, 1600, 900), `${l.key}.jpg`, l.alt)])),
  );
  const serviceImgs = Object.fromEntries(
    await Promise.all(SERVICES.map(async (s, i) => [s.key, await upload(client, await scene(60 + i, 1600, 900), `${s.key}.jpg`, `Abstract illustration for ${s.title}`)])),
  );
  const postImgs = Object.fromEntries(
    await Promise.all(POSTS.map(async (p, i) => [p.key, await upload(client, await scene(80 + i, 1600, 900), `${p.key}.jpg`, `Abstract illustration for the article “${p.title}”`)])),
  );
  const headshots = Object.fromEntries(
    await Promise.all([...PROVIDERS, ...PEOPLE].map(async (p, i) => [p.key, await upload(client, await portrait(p.initials, i), `${p.key}.jpg`, `Portrait placeholder for ${p.name}`)])),
  );

  const docs: Array<Record<string, unknown> & { _id: string; _type: string }> = [];

  // Locations
  for (const l of LOCATIONS) {
    docs.push({
      _id: `location-${l.key}`,
      _type: "location",
      name: l.name,
      slug: slug(l.key),
      image: locationImgs[l.key],
      address: { street: l.street, city: l.city, region: l.region, postalCode: l.postalCode, country: "US" },
      geo: { _type: "geopoint", ...l.geo },
      phone: l.phone,
      hours: l.hours.map((h) => ({ _type: "hoursRange", _key: key(h.days.join() + h.opens), days: [...h.days], opens: h.opens, closes: h.closes })),
    });
  }

  // People
  for (const p of PEOPLE) {
    docs.push({ _id: `person-${p.key}`, _type: "person", name: p.name, credentials: p.credentials, role: p.role, bio: p.bio, headshot: headshots[p.key] });
  }

  // Providers
  for (const p of PROVIDERS) {
    docs.push({
      _id: `provider-${p.key}`,
      _type: "provider",
      name: p.name,
      credentials: p.credentials,
      slug: slug(p.key),
      headshot: headshots[p.key],
      title: p.title,
      specialties: [...p.specialties],
      acceptingPatients: p.acceptingPatients,
      bio: pt(p.bio),
      locations: p.locations.map((l) => ref(`location-${l}`)),
    });
  }

  // FAQs
  for (const f of FAQS) {
    docs.push({ _id: `faq-${f.key}`, _type: "faq", question: f.question, answer: pt(f.answer), category: f.category });
  }

  // Services
  for (const s of SERVICES) {
    docs.push({
      _id: `service-${s.key}`,
      _type: "service",
      title: s.title,
      slug: slug(s.key),
      summary: s.summary,
      image: serviceImgs[s.key],
      body: pt(s.body),
      faqs: s.faqs.map((f) => ref(`faq-${f}`)),
      providers: s.providers.map((p) => ref(`provider-${p}`)),
      reviewedBy: ref("person-marsh"),
      reviewedAt: "2026-06-01",
    });
  }

  // Posts
  for (const p of POSTS) {
    docs.push({
      _id: `post-${p.key}`,
      _type: "post",
      title: p.title,
      slug: slug(p.key),
      publishedAt: p.publishedAt,
      excerpt: p.excerpt,
      image: postImgs[p.key],
      author: ref("person-pike"),
      body: pt(p.body),
      reviewedBy: ref("person-marsh"),
      reviewedAt: p.reviewedAt,
    });
  }

  // Legal
  for (const l of LEGAL) {
    docs.push({
      _id: `legal-${l.key}`,
      _type: "legalPage",
      title: l.title,
      slug: slug(l.key),
      effectiveDate: l.effectiveDate,
      body: [block(`⚠ ${REPLACE_BEFORE_LAUNCH}`, "blockquote", key(`banner-${l.key}`)), ...pt(l.body)],
    });
  }

  // Pages: patients
  const contactForm = {
    _type: "form",
    _key: key("contact-form"),
    heading: "Send us a message",
    text: "For scheduling and general questions. Please don't include medical details here. We'll collect anything clinical over the phone or through the patient portal.",
    formId: "contact",
    fields: [
      { _type: "field", _key: key("c-name"), key: "name", label: "Your name", type: "text", required: true },
      { _type: "field", _key: key("c-email"), key: "email", label: "Email", type: "email", required: true },
      { _type: "field", _key: key("c-phone"), key: "phone", label: "Phone", type: "tel", required: false },
      { _type: "field", _key: key("c-topic"), key: "topic", label: "What is this about?", type: "select", required: true, options: ["New patient", "Existing patient, scheduling", "Billing", "Records request", "Something else"] },
      { _type: "field", _key: key("c-message"), key: "message", label: "Message", type: "textarea", required: true },
    ],
    submitLabel: "Send message",
    successMessage: "Thanks, we've received your message and will be in touch within two business days. If this is urgent, please call (555) 013-2200.",
  };

  const referralForm = {
    _type: "form",
    _key: key("referral-form"),
    heading: "Start a referral",
    text: "Tell us who you are and which service you're referring to. We'll call your office within one business day to collect clinical details securely. Do not include patient information in this form.",
    formId: "referral",
    fields: [
      { _type: "field", _key: key("r-name"), key: "referrerName", label: "Referring clinician", type: "text", required: true },
      { _type: "field", _key: key("r-practice"), key: "practice", label: "Practice name", type: "text", required: true },
      { _type: "field", _key: key("r-email"), key: "email", label: "Office email", type: "email", required: true },
      { _type: "field", _key: key("r-phone"), key: "phone", label: "Office phone", type: "tel", required: true },
      { _type: "field", _key: key("r-service"), key: "service", label: "Service", type: "select", required: true, options: ["Cardiology", "Orthopedics & Sports Medicine", "Primary Care"] },
      { _type: "field", _key: key("r-urgency"), key: "urgency", label: "Urgency", type: "select", required: true, options: ["Routine (2–4 weeks)", "Soon (within a week)", "Urgent (48 hours)"] },
    ],
    submitLabel: "Request a call back",
    successMessage: "Thanks, our referral coordinator will call your office within one business day.",
  };

  docs.push(
    {
      _id: "page-patients-home",
      _type: "page",
      title: "Home",
      audience: "patients",
      slug: slug("home"),
      sections: [
        { _type: "hero", _key: key("ph-hero"), eyebrow: "Accepting new patients at both locations", heading: "Care that knows your name", text: "Primary care, cardiology and orthopedics for the Wrenfield valley. Two clinics, same-week appointments, and a team that answers the phone.", image: heroImg, buttons: [link("Book a visit", "/contact"), link("Find a location", "/locations")] },
        { _type: "cards", _key: key("ph-cards"), heading: "What we do", intro: "Three services, one record, one team that talks to each other.", items: SERVICES.map((s) => ({ _type: "card", _key: key(`ph-card-${s.key}`), title: s.title, text: s.summary, image: serviceImgs[s.key], link: link(`About ${s.title.toLowerCase()}`, `/services/${s.key}`) })) },
        { _type: "providers", _key: key("ph-providers"), heading: "Meet the team", items: [] },
        { _type: "faqs", _key: key("ph-faqs"), heading: "Common questions", items: ["new-patient", "same-day", "insurance", "portal"].map((f) => ref(`faq-${f}`)) },
        { _type: "cta", _key: key("ph-cta"), heading: "Ready to get started?", text: "New-patient visits are usually available within two weeks.", buttons: [link("Request an appointment", "/contact"), link("Call (555) 013-2200", "tel:+15550132200")] },
      ],
      seo: { _type: "seo", title: "Wrenfield Health: Primary care, cardiology and orthopedics", description: "Multi-specialty clinic in the Wrenfield valley. Same-week appointments, two locations, accepting new patients." },
    },
    {
      _id: "page-patients-about",
      _type: "page",
      title: "About",
      audience: "patients",
      slug: slug("about"),
      sections: [
        { _type: "hero", _key: key("pa-hero"), heading: "About Wrenfield Health", text: "Independent, physician-owned, and in the valley since 1998." },
        { _type: "richText", _key: key("pa-body"), body: pt([
          "Wrenfield Health started as a two-physician family practice above the old hardware store on Main Street. Today we are twenty-six clinicians across two locations, but we still run the way we did then: your provider knows you, the phone is answered by a person, and nobody is rushed through a visit.",
          { h2: "How we work" },
          "We are physician-owned and independent, which means decisions about your care are made here, by people you can talk to. Our primary care, cardiology and orthopedic teams share one record and one building, so a referral is a walk down the hall rather than a fax into the void.",
          { h2: "Our commitments" },
          { ul: ["Same-week appointments for established patients who are unwell", "Portal messages answered within one business day", "Plain-language explanations, every time", "Patient-facing health content reviewed by a clinician before it is published"] },
        ]) },
        { _type: "locations", _key: key("pa-locations"), heading: "Where to find us", items: [] },
        { _type: "cta", _key: key("pa-cta"), heading: "Become a patient", buttons: [link("Request an appointment", "/contact")] },
      ],
    },
    {
      _id: "page-patients-new-patients",
      _type: "page",
      title: "New patients",
      audience: "patients",
      slug: slug("new-patients"),
      sections: [
        { _type: "hero", _key: key("pn-hero"), heading: "New to Wrenfield Health?", text: "Here's what to expect at your first visit and how to get your records to us.", buttons: [link("Request an appointment", "/contact")] },
        { _type: "richText", _key: key("pn-body"), body: pt([
          { h2: "1. Request an appointment" },
          "Use the contact form or call (555) 013-2200 and choose “New patient.” We'll confirm your insurance and offer the first available visit at the location you prefer, usually within two weeks.",
          { h2: "2. Send us your records" },
          "If you're transferring from another clinic, ask them to send your records before your visit. They'll need a signed release; your previous clinic will have one, or you can ask us for ours when you call.",
          { h2: "3. Your first visit" },
          "Plan for 45 minutes. Bring a photo ID, your insurance card and every medication you take, including supplements. Your provider will go through your history, examine you, and agree a plan with you. You'll leave with portal access set up.",
        ]) },
        { _type: "faqs", _key: key("pn-faqs"), heading: "Questions new patients ask", items: ["new-patient", "insurance", "portal", "same-day"].map((f) => ref(`faq-${f}`)) },
        { _type: "cta", _key: key("pn-cta"), heading: "Ready when you are", buttons: [link("Request an appointment", "/contact"), link("See our providers", "/providers")] },
      ],
    },
    {
      _id: "page-patients-contact",
      _type: "page",
      title: "Contact",
      audience: "patients",
      slug: slug("contact"),
      sections: [
        { _type: "hero", _key: key("pc-hero"), heading: "Contact us", text: "Call (555) 013-2200 for appointments. For anything else, the form below reaches our front desk." },
        contactForm,
        { _type: "locations", _key: key("pc-locations"), heading: "Our locations", items: [] },
      ],
    },
    // Pages: providers
    {
      _id: "page-providers-home",
      _type: "page",
      title: "For providers",
      audience: "providers",
      slug: slug("home"),
      sections: [
        { _type: "hero", _key: key("pp-hero"), eyebrow: "For referring clinicians", heading: "Refer with confidence", text: "Routine cardiology and orthopedic referrals are seen within two weeks, urgent ones within 48 hours. You'll get a note back after every visit.", image: providerHeroImg, buttons: [link("Refer a patient", "/for-providers/refer-a-patient"), link("Our specialists", "/providers")] },
        { _type: "cards", _key: key("pp-cards"), heading: "How referrals work", items: [
          { _type: "card", _key: key("pp-c1"), title: "1. Send the referral", text: "Fax to (555) 013-2299, send via Direct messaging, or request a call back with the form. We confirm receipt the same day." },
          { _type: "card", _key: key("pp-c2"), title: "2. We schedule the patient", text: "Our coordinator calls the patient within one business day. Urgent referrals are seen within 48 hours." },
          { _type: "card", _key: key("pp-c3"), title: "3. You get the note", text: "A consult note goes back to you within two business days of the visit, by your preferred channel." },
        ] },
        { _type: "providers", _key: key("pp-providers"), heading: "Specialists accepting referrals", items: [ref("provider-whitcombe"), ref("provider-reinholt")] },
        { _type: "cta", _key: key("pp-cta"), heading: "Questions about a case?", text: "Our specialists take provider-to-provider calls Monday to Friday.", buttons: [link("Call the provider line", "tel:+15550132290"), link("Start a referral", "/for-providers/refer-a-patient")] },
      ],
      seo: { _type: "seo", title: "For referring providers | Wrenfield Health", description: "Refer patients to Wrenfield Health cardiology, orthopedics and primary care. Two-week routine, 48-hour urgent." },
    },
    {
      _id: "page-providers-refer",
      _type: "page",
      title: "Refer a patient",
      audience: "providers",
      slug: slug("refer-a-patient"),
      sections: [
        { _type: "hero", _key: key("pr-hero"), heading: "Refer a patient", text: "Three ways to send a referral. Whichever you use, we confirm receipt the same business day." },
        { _type: "richText", _key: key("pr-body"), body: pt([
          { h2: "Fax" },
          "(555) 013-2299. Include demographics, insurance, the reason for referral and recent relevant results.",
          { h2: "Direct secure messaging" },
          "referrals@direct.wrenfieldhealth.example. Attach the same information as a CCD or PDF.",
          { h2: "Request a call back" },
          "Use the form below. It collects only your office's contact details; our coordinator will call to take the clinical information securely.",
        ]) },
        referralForm,
        { _type: "faqs", _key: key("pr-faqs"), heading: "Referral questions", items: ["referral-needed", "cardiac-rehab", "imaging"].map((f) => ref(`faq-${f}`)) },
      ],
    },
  );

  // Settings
  docs.push({
    _id: "settings",
    _type: "settings",
    orgName: ORG.name,
    tagline: ORG.tagline,
    logo: logoImg,
    contact: { phone: ORG.phone, email: ORG.email, primaryLocation: { _type: "reference", _ref: "location-northgate" } },
    social: [link("LinkedIn", "https://www.linkedin.com/"), link("Facebook", "https://www.facebook.com/")],
    patientsNav: {
      header: [link("Services", "/services"), link("Providers", "/providers"), link("Locations", "/locations"), link("Health library", "/blog"), link("New patients", "/new-patients")],
      footer: [link("About", "/about"), link("Contact", "/contact"), link("For providers", "/for-providers"), link("Privacy policy", "/legal/privacy-policy"), link("Terms of use", "/legal/terms-of-use"), link("Accessibility", "/legal/accessibility"), link("Notice of privacy practices", "/legal/notice-of-privacy-practices")],
      cta: link("Book a visit", "/contact"),
    },
    providersNav: {
      header: [link("Refer a patient", "/for-providers/refer-a-patient"), link("Specialists", "/providers"), link("Services", "/services"), link("Locations", "/locations")],
      footer: [link("For patients", "/"), link("Contact", "/contact"), link("Privacy policy", "/legal/privacy-policy"), link("Terms of use", "/legal/terms-of-use"), link("Accessibility", "/legal/accessibility")],
      cta: link("Refer a patient", "/for-providers/refer-a-patient"),
    },
    defaultSeo: { _type: "seo", description: "Wrenfield Health: primary care, cardiology and orthopedics in the Wrenfield valley. Two locations, same-week appointments.", image: heroImg },
    consent: {
      title: "Cookies on this site",
      description: "We use necessary cookies to make the site work. With your permission we'd also like to use analytics cookies to understand how the site is used. We never use cookies to collect health information.",
      policyLink: link("Privacy policy", "/legal/privacy-policy"),
    },
  });

  console.log(`writing ${docs.length} documents`);
  const tx = client.transaction();
  for (const d of docs) tx.createOrReplace(d);
  await tx.commit();
  console.log("done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
