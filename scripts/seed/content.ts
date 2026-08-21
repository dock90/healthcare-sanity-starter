/**
 * Wrenfield Health: a fictional multi-specialty clinic. Every name, address and
 * phone number is invented (555-01xx numbers are reserved for fiction).
 * Portable Text is written with the helpers at the bottom so it reads as prose here.
 */

export const ORG = {
  name: "Wrenfield Health",
  tagline: "Primary care, cardiology and orthopedics for the Wrenfield valley since 1998.",
  phone: "(555) 013-2200",
  email: "hello@wrenfieldhealth.example",
};

export const LOCATIONS = [
  {
    key: "northgate",
    name: "Wrenfield Health Northgate",
    street: "4120 Northgate Parkway, Suite 200",
    city: "Wrenfield",
    region: "WA",
    postalCode: "98599",
    phone: "(555) 013-2200",
    geo: { lat: 47.4112, lng: -121.8743 },
    hours: [
      { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "07:30", closes: "17:30" },
      { days: ["Saturday"], opens: "08:00", closes: "12:00" },
    ],
    alt: "Exterior of the Northgate clinic, a two-storey brick building with a covered entrance",
  },
  {
    key: "riverside",
    name: "Wrenfield Health Riverside",
    street: "88 Mill Race Road",
    city: "Wrenfield",
    region: "WA",
    postalCode: "98599",
    phone: "(555) 013-2260",
    geo: { lat: 47.3981, lng: -121.8512 },
    hours: [{ days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "08:00", closes: "17:00" }],
    alt: "Riverside clinic waiting area with large windows facing the river path",
  },
] as const;

export const PEOPLE = [
  {
    key: "marsh",
    name: "Helen Marsh",
    credentials: "MD",
    role: "Chief Medical Officer",
    bio: "Dr. Marsh has practiced internal medicine for twenty-two years and led Wrenfield Health's clinical quality program since 2016. She reviews every piece of patient-facing health content before it is published.",
    initials: "HM",
  },
  {
    key: "pike",
    name: "Jordan Pike",
    credentials: "MPH",
    role: "Patient Education Lead",
    bio: "Jordan writes Wrenfield Health's patient education materials and runs the plain-language review process. Previously a health communications specialist at a county public health department.",
    initials: "JP",
  },
] as const;

export const PROVIDERS = [
  {
    key: "desai",
    name: "Anika Desai",
    credentials: "MD",
    title: "Internal Medicine Physician",
    specialties: ["Internal medicine", "Preventive care", "Diabetes management"],
    acceptingPatients: true,
    locations: ["northgate"],
    initials: "AD",
    bio: [
      "Dr. Desai joined Wrenfield Health in 2014 after completing her residency at a university hospital in Seattle. She cares for adults of all ages, with a particular interest in helping patients with diabetes and high blood pressure get and stay on track.",
      "She believes the most useful thing a doctor can do is listen carefully, explain clearly, and make a plan the patient actually agrees with. Her visits run on time, and she answers portal messages herself.",
      "Outside the clinic she volunteers with the valley's free blood-pressure screening program and is learning to keep bees, with mixed results.",
    ],
  },
  {
    key: "oyelaran",
    name: "Marcus Oyelaran",
    credentials: "DO",
    title: "Family Medicine Physician",
    specialties: ["Family medicine", "Pediatrics", "Sports physicals"],
    acceptingPatients: true,
    locations: ["northgate", "riverside"],
    initials: "MO",
    bio: [
      "Dr. Oyelaran sees patients from newborns to grandparents, often from the same family. He trained in osteopathic family medicine and keeps a hands-on approach to musculoskeletal complaints when it helps.",
      "He splits his week between Northgate and Riverside so that families on the south side of the valley don't have to cross town for a well-child visit.",
      "He coaches a youth soccer team and will happily talk about it for as long as you let him.",
    ],
  },
  {
    key: "whitcombe",
    name: "Lena Whitcombe",
    credentials: "ARNP",
    title: "Cardiology Nurse Practitioner",
    specialties: ["Cardiology", "Heart failure", "Cardiac rehabilitation"],
    acceptingPatients: false,
    locations: ["northgate"],
    initials: "LW",
    bio: [
      "Lena works alongside our cardiologists managing ongoing care for patients with heart failure, coronary artery disease and arrhythmias. She runs the cardiac rehabilitation program and the clinic's remote blood-pressure monitoring service.",
      "Her panel is currently full. Existing patients can book directly; new cardiology patients are scheduled with the team after a referral from their primary care provider.",
    ],
  },
  {
    key: "reinholt",
    name: "Tomas Reinholt",
    credentials: "MD",
    title: "Orthopedic Surgeon",
    specialties: ["Orthopedics", "Sports medicine", "Joint replacement"],
    acceptingPatients: true,
    locations: ["riverside"],
    initials: "TR",
    bio: [
      "Dr. Reinholt is a fellowship-trained orthopedic surgeon who treats knee, hip and shoulder problems, from overuse injuries in weekend athletes to joint replacement. He favours conservative treatment first and operates when the evidence says it will help.",
      "He performs surgery at the regional medical center and sees clinic patients at Riverside, where the physical therapy suite is down the hall.",
    ],
  },
] as const;

export const SERVICES = [
  {
    key: "primary-care",
    title: "Primary Care",
    summary: "Ongoing care for adults and children: checkups, chronic conditions, vaccinations and same-week sick visits.",
    providers: ["desai", "oyelaran"],
    faqs: ["new-patient", "same-day", "insurance", "portal"],
    body: [
      "Primary care is the front door to everything else we do. Your primary care provider gets to know you over time, manages routine and chronic conditions, and coordinates any specialist care you need.",
      { h2: "What we treat" },
      { ul: ["Annual physicals and preventive screenings", "High blood pressure, diabetes, asthma and other chronic conditions", "Colds, infections, minor injuries and other same-week concerns", "Vaccinations for children and adults", "Well-child visits and sports physicals"] },
      { h2: "Your first visit" },
      "Plan on about 45 minutes for a new-patient visit. Bring a photo ID, your insurance card, and a list of the medications you take, including supplements. If you have records from a previous clinic, ask them to send those to us before your visit; the form is on our new-patients page.",
      { h2: "Between visits" },
      "Use the patient portal to send a message, request a refill or see your results. Messages are answered within one business day, usually by your own provider.",
    ],
  },
  {
    key: "cardiology",
    title: "Cardiology",
    summary: "Diagnosis and long-term management of heart conditions, including heart failure, arrhythmias and coronary artery disease.",
    providers: ["whitcombe"],
    faqs: ["referral-needed", "cardiac-rehab", "insurance"],
    body: [
      "Our cardiology team cares for people with known heart conditions and evaluates new symptoms such as chest discomfort, palpitations and shortness of breath. We work closely with your primary care provider so that nothing falls between the two.",
      { h2: "Services" },
      { ul: ["Consultation and diagnosis", "Echocardiography and stress testing, on site at Northgate", "Heart failure management", "Arrhythmia monitoring, including wearable monitors", "Cardiac rehabilitation (a 12-week supervised program)", "Remote blood-pressure monitoring"] },
      { h2: "Getting a cardiology appointment" },
      "New cardiology patients need a referral from a primary care provider, either at Wrenfield Health or elsewhere. This is an insurance requirement for most plans and it also lets the team review your history before you arrive, which makes the first visit more useful.",
      { h2: "If you have symptoms now" },
      "Chest pain, fainting, or sudden shortness of breath are emergencies. Call 911. Do not drive yourself to the clinic.",
    ],
  },
  {
    key: "orthopedics",
    title: "Orthopedics & Sports Medicine",
    summary: "Bone, joint and muscle care from injury through recovery, with surgery only when it's the right answer.",
    providers: ["reinholt", "oyelaran"],
    faqs: ["imaging", "physical-therapy", "same-day"],
    body: [
      "Most orthopedic problems do not need surgery. Our approach starts with an accurate diagnosis, then the least invasive treatment that will work: activity modification, physical therapy, bracing, or injections. When surgery is the best option, Dr. Reinholt will explain why, what to expect, and what recovery looks like.",
      { h2: "Common reasons to see us" },
      { ul: ["Knee pain, meniscus and ligament injuries", "Hip and knee arthritis, including joint replacement", "Shoulder pain, rotator cuff and instability", "Sprains, strains and fractures", "Overuse injuries in runners and athletes"] },
      { h2: "On-site imaging and therapy" },
      "X-ray is available at Riverside during clinic hours, so most visits end with a diagnosis rather than a second appointment. Physical therapy is in the same building; for many patients the first therapy session happens the same week.",
    ],
  },
] as const;

export const FAQS = [
  { key: "new-patient", category: "Appointments", question: "How do I become a new patient?", answer: ["Call the clinic or use the contact form and choose “New patient.” We will ask a few questions about your insurance and which location you prefer, then book a 45-minute first visit. Most new patients are seen within two weeks."] },
  { key: "same-day", category: "Appointments", question: "Do you offer same-day appointments?", answer: ["Yes. Each location holds a number of same-day slots for established patients with a new illness or injury. Call before 10 a.m. for the best chance of a slot that day. For anything life-threatening, call 911."] },
  { key: "referral-needed", category: "Appointments", question: "Do I need a referral to see a specialist?", answer: ["For cardiology, yes, a referral is required by most insurance plans and it lets the team prepare. For orthopedics, many plans allow you to book directly; our schedulers can check your plan when you call."] },
  { key: "insurance", category: "Billing", question: "Which insurance plans do you accept?", answer: ["We accept most major commercial plans, Medicare and Washington Apple Health. Because plan networks change, please confirm with our billing office at (555) 013-2210 before your first visit. We also offer a self-pay schedule."] },
  { key: "portal", category: "Patient portal", question: "How do I use the patient portal?", answer: ["You will receive an invitation by email after your first visit. The portal lets you see results, request refills, and message your care team. Please do not use the portal for urgent problems; messages are answered within one business day."] },
  { key: "cardiac-rehab", category: "Cardiology", question: "What is cardiac rehabilitation?", answer: ["A supervised 12-week program of exercise, education and support after a heart attack, heart surgery, or a heart failure diagnosis. Sessions are at Northgate three mornings a week. Most insurance plans cover it with a referral."] },
  { key: "imaging", category: "Orthopedics", question: "Can I get an X-ray at the clinic?", answer: ["Yes. X-ray is available at Riverside during clinic hours, and results are usually read the same visit. MRI and CT are scheduled at the regional medical center; we will arrange that for you if it is needed."] },
  { key: "physical-therapy", category: "Orthopedics", question: "Is physical therapy available on site?", answer: ["Physical therapy is in the Riverside building, down the hall from the orthopedic clinic. You can be referred by any Wrenfield Health provider, and for many conditions your first session can happen the same week as your visit."] },
] as const;

export const POSTS = [
  {
    key: "blood-pressure-at-home",
    title: "How to check your blood pressure at home (and what the numbers mean)",
    publishedAt: "2026-05-12",
    reviewedAt: "2026-05-10",
    excerpt: "Home readings are often more useful than the one we take in the clinic. Here is how to get an accurate reading and when to call us.",
    body: [
      "A single blood-pressure reading in the clinic tells us less than you might think. Many people run high in the waiting room and normal at home; a few run the other way. That is why, if you have high blood pressure or are being checked for it, we will usually ask you to measure at home.",
      { h2: "Choosing a monitor" },
      "Use an automatic upper-arm cuff. Wrist and finger monitors are less reliable. Check that the cuff size matches your arm; a cuff that is too small reads high. Bring your monitor to your next visit so we can compare it against ours.",
      { h2: "Taking a reading" },
      { ul: ["Sit quietly for five minutes first, feet flat, back supported.", "No caffeine, exercise or smoking for 30 minutes before.", "Rest your arm on a table so the cuff is at heart level.", "Take two readings a minute apart and write both down.", "Measure in the morning before medication and again in the evening, for seven days."] },
      { h2: "What the numbers mean" },
      "The top number (systolic) is the pressure when your heart beats; the bottom (diastolic) is the pressure between beats. For most adults, a home average under 130/80 is the goal. A home average of 135/85 or higher is generally considered high. Your own target may be different depending on your age and other conditions, so check with your provider.",
      { h2: "When to call" },
      "Call the clinic if your average is consistently above your target, or if you get a reading over 180/120. If that high reading comes with chest pain, a severe headache, vision changes or weakness, call 911.",
    ],
  },
  {
    key: "knee-pain-when-to-see-someone",
    title: "Knee pain: when to wait it out and when to get it looked at",
    publishedAt: "2026-04-03",
    reviewedAt: "2026-04-01",
    excerpt: "Most knee pain settles on its own. A few patterns should not wait. Here is how to tell the difference.",
    body: [
      "Knees take a lot of load and complain about it. Most knee pain after a long hike or a new exercise program is soreness that improves over a week or two with rest, ice and gentle movement. But some symptoms mean something is structurally wrong, and waiting makes them worse.",
      { h2: "Usually fine to wait two weeks" },
      { ul: ["Aching after activity that improves with rest", "Stiffness in the morning that loosens up within half an hour", "Mild swelling without warmth or redness"] },
      { h2: "Book a visit" },
      { ul: ["Pain that has lasted more than two weeks despite rest", "The knee locks, catches, or gives way", "Swelling that appeared within a few hours of an injury", "You cannot fully straighten or bend the knee"] },
      { h2: "Go to urgent care or the emergency department" },
      { ul: ["You cannot put weight on the leg", "The knee looks deformed", "The knee is hot, red and swollen and you have a fever (possible infection)"] },
      "At the clinic we will examine the knee and, if needed, take an X-ray on site. Most people leave with a diagnosis and a plan that starts with physical therapy rather than surgery.",
    ],
  },
  {
    key: "what-to-bring-first-visit",
    title: "What to bring to your first visit",
    publishedAt: "2026-02-18",
    reviewedAt: "2026-02-15",
    excerpt: "A short list that makes your first appointment faster and more useful for both of us.",
    body: [
      "First visits take longer than follow-ups because we are building your record from scratch. A little preparation means more of that time goes to the things you came in for.",
      { h2: "Bring" },
      { ul: ["Photo ID and insurance card", "Every medication you take, including over-the-counter drugs and supplements; bring the bottles if it is easier", "A list of past surgeries and major illnesses, with approximate dates", "The name of any specialist you see", "Your questions, written down"] },
      { h2: "Before you arrive" },
      "If you are transferring from another clinic, ask them to send your records to us; we need a signed release, which is on the new-patients page. Records that arrive before your visit let your provider review them in advance.",
      { h2: "Please don’t send health details through the website" },
      "Our contact form is for scheduling and general questions. It is not a secure medical channel. Anything about your health, symptoms, diagnoses, medications, should go through the patient portal or a phone call, where it is protected.",
    ],
  },
] as const;

export const LEGAL = [
  { key: "privacy-policy", title: "Privacy Policy", effectiveDate: "2026-01-01", body: [
    "This policy describes how Wrenfield Health collects, uses and protects information gathered through this website. It does not cover information you share with us as a patient in the course of your care; that is governed by our Notice of Privacy Practices.",
    { h2: "Information we collect" },
    "When you use our contact or referral forms, we collect the information you enter (such as your name, email address and phone number) and forward it to our scheduling team. We ask you not to include health information in these forms. With your consent, we collect anonymous analytics about how the site is used.",
    { h2: "Cookies" },
    "We use necessary cookies that make the site work. Analytics and marketing cookies are used only if you allow them in the cookie banner, and you can change your choice at any time using the “Cookie settings” link in the footer.",
    { h2: "How we use information" },
    "Form submissions are used to respond to you. Analytics data is used to improve the site. We do not sell personal information.",
    { h2: "Contact" },
    "Questions about this policy can be sent to our privacy officer at privacy@wrenfieldhealth.example or by post to the Northgate clinic.",
  ]},
  { key: "terms-of-use", title: "Terms of Use", effectiveDate: "2026-01-01", body: [
    "By using this website you agree to these terms. If you do not agree, please do not use the site.",
    { h2: "Not medical advice" },
    "The content on this site is general health information. It is not a substitute for advice from a clinician who knows you. Do not delay seeking care because of something you read here. If you think you are having an emergency, call 911.",
    { h2: "No patient relationship" },
    "Using this site, including submitting a form, does not create a patient–provider relationship. That begins when you are seen by one of our clinicians.",
    { h2: "Accuracy" },
    "We review health content before publishing and update it periodically, but medicine changes and errors are possible. Content shows a review date where applicable.",
    { h2: "Links" },
    "Links to other websites are provided for convenience. We are not responsible for their content or privacy practices.",
  ]},
  { key: "accessibility", title: "Accessibility Statement", effectiveDate: "2026-01-01", body: [
    "Wrenfield Health wants everyone to be able to use this website, including people who use screen readers, keyboard navigation, magnification, or voice control.",
    { h2: "Our standard" },
    "We aim to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA. The site is built with semantic HTML, visible focus indicators, sufficient colour contrast, text that can be resized, and forms with clear labels and error messages. Automated accessibility checks run on every change to the site.",
    { h2: "Known limitations" },
    "Some PDF documents produced before 2024 may not be fully accessible. We are replacing them as they come up for review. If you need one of these in an accessible format, contact us and we will provide it.",
    { h2: "Tell us" },
    "If you have trouble using any part of this site, please call (555) 013-2200 or email accessibility@wrenfieldhealth.example. We aim to respond within three business days.",
    { h2: "Accommodations at our clinics" },
    "All locations have step-free access, accessible restrooms and reserved parking. Interpreter services, including American Sign Language, are available at no cost with advance notice.",
  ]},
  { key: "notice-of-privacy-practices", title: "Notice of Privacy Practices", effectiveDate: "2026-01-01", body: [
    "This notice describes how medical information about you may be used and disclosed and how you can get access to this information. Please review it carefully.",
    { h2: "Our responsibilities" },
    "We are required by law to maintain the privacy of your protected health information, to give you this notice of our legal duties and privacy practices, and to follow the terms of the notice currently in effect.",
    { h2: "How we may use and disclose your information" },
    { ul: ["For treatment: to coordinate your care with other providers", "For payment: to bill you or your insurer", "For health care operations: quality improvement, training and audits", "As required by law, for public health, or to avert a serious threat"] },
    { h2: "Your rights" },
    { ul: ["To see and get a copy of your record", "To request a correction", "To request restrictions on certain uses and disclosures", "To request confidential communications", "To a list of certain disclosures we have made", "To a paper copy of this notice", "To file a complaint with us or with the U.S. Department of Health and Human Services; we will not retaliate"] },
    { h2: "Contact" },
    "Privacy Officer, Wrenfield Health, 4120 Northgate Parkway, Suite 200, Wrenfield, WA 98599. privacy@wrenfieldhealth.example.",
  ]},
] as const;

/** Banner prepended to every legal page body. */
export const REPLACE_BEFORE_LAUNCH =
  "Placeholder text. This is a realistic template, not legal advice. Replace it with language reviewed by your counsel and privacy officer before launch.";
