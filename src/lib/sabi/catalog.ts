export type SkillId =
  | "electrical"
  | "plumbing"
  | "phone-repair"
  | "generator"
  | "fashion"
  | "makeup"
  | "video"
  | "coding"
  | "sales"
  | "cooking";

export const CITIES = [
  "Lagos",
  "Abuja",
  "Port Harcourt",
  "Ibadan",
  "Kano",
  "Enugu",
  "Aba",
  "Kaduna",
  "Benin City",
  "Onitsha",
] as const;

export const SKILLS: {
  id: SkillId;
  name: string;
  category: string;
  blurb: string;
}[] = [
  { id: "electrical", name: "Electrical", category: "Trade", blurb: "Wiring, faults, NEPA, and site work." },
  { id: "plumbing", name: "Plumbing", category: "Trade", blurb: "Pipes, leaks, soakaway, and fittings." },
  { id: "phone-repair", name: "Phone repair", category: "Trade", blurb: "Screens, boards, and diagnostics." },
  { id: "generator", name: "Generator", category: "Trade", blurb: "Service, carburetor, ATS, and load." },
  { id: "fashion", name: "Fashion", category: "Craft", blurb: "Cut, stitch, fit, and finish." },
  { id: "makeup", name: "Makeup", category: "Craft", blurb: "Skin, occasion looks, and longevity." },
  { id: "video", name: "Video edit", category: "Digital", blurb: "Cuts, color, sound, and delivery." },
  { id: "coding", name: "Coding", category: "Digital", blurb: "Build, debug, and ship working software." },
  { id: "sales", name: "Sales", category: "Hustle", blurb: "Pitch, close, and handle objections." },
  { id: "cooking", name: "Cooking", category: "Hustle", blurb: "Taste, timing, and service at scale." },
];

export function skillName(id: string) {
  return SKILLS.find((s) => s.id === id)?.name ?? id;
}

export type ChallengeSeed = {
  id: string;
  skillId: SkillId;
  title: string;
  minutes: number;
  difficulty: "street" | "site" | "master";
  prompt: string;
  rubric: string;
};

export const CHALLENGES: ChallengeSeed[] = [
  {
    id: "elec-1",
    skillId: "electrical",
    title: "Light is on, sockets are dead",
    minutes: 8,
    difficulty: "street",
    prompt:
      "A 2-bedroom in Surulere has ceiling lights working but all wall sockets dead after PHCN restored power. Walk through diagnosis and the first three checks you would do before opening the board. Name the likely fault and how you would prove it.",
    rubric:
      "Must mention isolating supply, checking socket circuit MCB/fuse vs lighting circuit, testing live/neutral/earth, possible burnt socket ring or loose neutral, never guess blindly, safety first.",
  },
  {
    id: "elec-2",
    skillId: "electrical",
    title: "Changeover without killing the fridge",
    minutes: 10,
    difficulty: "site",
    prompt:
      "Client wants a changeover between PHCN and a 5.5kVA generator. Fridge and inverter are already on site. Explain the wiring logic, interlock, and what you must never allow to happen. List materials and the order of work.",
    rubric:
      "Must cover mechanical or electrical interlock so both sources cannot feed together, proper earthing, cable sizing, changeover switch rating, labeling, and not backfeeding the grid.",
  },
  {
    id: "plumb-1",
    skillId: "plumbing",
    title: "Upstairs bathroom, downstairs stain",
    minutes: 8,
    difficulty: "street",
    prompt:
      "A stain keeps returning on the ceiling under an upstairs shower. The landlord already replaced tiles. What is your inspection sequence, likely causes, and how you confirm before breaking anything?",
    rubric:
      "Trap, waterproofing membrane, pipe joints behind wall, shower mixer, overflow, dye or water test, don't retile first, isolate wet vs structural leak.",
  },
  {
    id: "phone-1",
    skillId: "phone-repair",
    title: "Restarts when you call",
    minutes: 8,
    difficulty: "street",
    prompt:
      "An iPhone 11 restarts the moment a call connects, but plays video fine. What do you suspect, how do you test, and what do you tell the customer before opening it?",
    rubric:
      "Audio IC / baseband / charging flex / moisture; reproduce, inspect, battery health, known-issue talk, no overpromise, parts vs board-level, data backup.",
  },
  {
    id: "gen-1",
    skillId: "generator",
    title: "It starts, then dies in two minutes",
    minutes: 8,
    difficulty: "street",
    prompt:
      "A Tiger 3.5kVA starts on choke, runs two minutes, then dies. Fuel is fresh. Explain likely causes in order and the tests you run without replacing random parts.",
    rubric:
      "Fuel flow, carburetor jet, clogged filter, low oil sensor, spark, load vs no-load, governor. Sequence of tests, not parts shopping.",
  },
  {
    id: "fash-1",
    skillId: "fashion",
    title: "Agbada that sits like a sack",
    minutes: 9,
    difficulty: "site",
    prompt:
      "A client brings an already-sewn agbada. Shoulder drops, sleeve is long, and the embroidery is uneven at the neck. They want it for Saturday. What can you save, what must you recut, and how do you price the rescue?",
    rubric:
      "Fit diagnosis, what is structural vs cosmetic, time vs quality, honest no if the cloth is gone, measurement, lining, embroidery risk, Saturday deadline realism.",
  },
  {
    id: "make-1",
    skillId: "makeup",
    title: "Owambe in March heat",
    minutes: 7,
    difficulty: "street",
    prompt:
      "Bride's maid, oily skin, outdoor reception in Lagos heat, white aso-oke. Build a product and sequence plan that lasts 8 hours without looking cakey. Include what you refuse to use and why.",
    rubric:
      "Prep, primer, long-wear base, set, cream vs powder, SPF/flashback, sweat, touch-up kit, undertone vs fabric, hygiene.",
  },
  {
    id: "vid-1",
    skillId: "video",
    title: "Wedding recap, 48 hours",
    minutes: 9,
    difficulty: "site",
    prompt:
      "You have 4 hours of messy wedding footage, no shot list, audio is uneven, and the couple wants a 60-second recap by Monday. Outline your edit plan, selects, music, and what you cut without mercy.",
    rubric:
      "Selects, story beats, audio repair, pacing, color consistency, rights-safe music, delivery specs, what to drop, communication of limits.",
  },
  {
    id: "code-1",
    skillId: "coding",
    title: "Paystack webhook that double-charges",
    minutes: 12,
    difficulty: "master",
    prompt:
      "An endpoint records a successful payment twice when Paystack retries the webhook. Write the exact logic you would add (language of your choice) and explain the failure mode you are closing. Include how you test it.",
    rubric:
      "Idempotency key, unique constraint on reference, acknowledge 200 only after persist, replay safety, logging, test with duplicate events. Real code or precise pseudocode.",
  },
  {
    id: "code-2",
    skillId: "coding",
    title: "This form is lying",
    minutes: 8,
    difficulty: "street",
    prompt:
      "A React form shows 'saved' but the database never updates for some users. Network tab shows 200. How do you hunt this, what are the top three causes, and what instrumentation do you add?",
    rubric:
      "Optimistic UI vs actual response body, auth user mismatch, client cache, silent validation, different environments, logging request ids, reproducing with the failing account.",
  },
  {
    id: "sales-1",
    skillId: "sales",
    title: "The price is the objection",
    minutes: 7,
    difficulty: "street",
    prompt:
      "You sell generator servicing at ₦45,000. The customer says a roadside guy will do it for ₦12,000. Write the conversation — their lines and yours — that either closes or walks away with respect. No insults.",
    rubric:
      "Acknowledge, reframe value (warranty, parts, callback), proof, alternative package, know when to walk, no lying, no insulting the roadside guy.",
  },
  {
    id: "cook-1",
    skillId: "cooking",
    title: "120 plates, one pot of soup",
    minutes: 8,
    difficulty: "site",
    prompt:
      "You must serve 120 guests jollof plus two proteins. Kitchen has two burners and no extra fridge space. Write the timeline from T-6 hours, batching, holding, and the failure you refuse to risk.",
    rubric:
      "Rice method at scale, food safety, holding temperature, protein batching, service sequence, staffing, what you prep vs cook last, leftover risk.",
  },
];

export type FeaturedPro = {
  userId: string;
  handle: string;
  displayName: string;
  city: string;
  bio: string;
  primarySkill: SkillId;
  sabiScore: number;
  jobsDone: number;
  ratingAvg: number;
  ratingCount: number;
};

export const FEATURED: FeaturedPro[] = [
  {
    userId: "featured-kemi",
    handle: "kemi-glam",
    displayName: "Kemi Adewale",
    city: "Lagos",
    bio: "Owambe and bridal. Skin first, then colour. I do not do cake-face.",
    primarySkill: "makeup",
    sabiScore: 92,
    jobsDone: 48,
    ratingAvg: 4.9,
    ratingCount: 41,
  },
  {
    userId: "featured-chinedu",
    handle: "nedu-wires",
    displayName: "Chinedu Okoro",
    city: "Enugu",
    bio: "House wiring, changeover, and the faults people call 'NEPA wahala' that are actually the board.",
    primarySkill: "electrical",
    sabiScore: 90,
    jobsDone: 61,
    ratingAvg: 4.8,
    ratingCount: 52,
  },
  {
    userId: "featured-fatima",
    handle: "ftm-boards",
    displayName: "Fatima Bello",
    city: "Abuja",
    bio: "Phone and board work. I tell you if it is parts or if the board is gone — before I open it.",
    primarySkill: "phone-repair",
    sabiScore: 91,
    jobsDone: 73,
    ratingAvg: 4.8,
    ratingCount: 66,
  },
  {
    userId: "featured-tunde",
    handle: "tunde-ships",
    displayName: "Tunde Bakare",
    city: "Lagos",
    bio: "Payments, dashboards, and the bugs that only show for some users. I write tests.",
    primarySkill: "coding",
    sabiScore: 88,
    jobsDone: 29,
    ratingAvg: 4.7,
    ratingCount: 24,
  },
  {
    userId: "featured-blessing",
    handle: "blessing-stitches",
    displayName: "Blessing Eze",
    city: "Aba",
    bio: "Tailoring that sits on the body. Rescue jobs accepted only when the cloth can still be saved.",
    primarySkill: "fashion",
    sabiScore: 93,
    jobsDone: 80,
    ratingAvg: 4.9,
    ratingCount: 71,
  },
  {
    userId: "featured-musa",
    handle: "musa-gen",
    displayName: "Musa Ibrahim",
    city: "Kano",
    bio: "Generators that actually last. I service, I do not 'manage it'.",
    primarySkill: "generator",
    sabiScore: 89,
    jobsDone: 54,
    ratingAvg: 4.8,
    ratingCount: 47,
  },
  {
    userId: "featured-amaka",
    handle: "amaka-cuts",
    displayName: "Amaka Nwosu",
    city: "Port Harcourt",
    bio: "Recaps, ads, and clean audio. I cut without mercy so the story can breathe.",
    primarySkill: "video",
    sabiScore: 86,
    jobsDone: 33,
    ratingAvg: 4.7,
    ratingCount: 28,
  },
  {
    userId: "featured-ibrahim",
    handle: "ibro-pipes",
    displayName: "Ibrahim Sule",
    city: "Kaduna",
    bio: "Leaks, soakaway, and the stain that keeps coming back after they retile.",
    primarySkill: "plumbing",
    sabiScore: 87,
    jobsDone: 44,
    ratingAvg: 4.6,
    ratingCount: 39,
  },
  {
    userId: "featured-zainab",
    handle: "zee-closes",
    displayName: "Zainab Yusuf",
    city: "Abuja",
    bio: "B2B and home-service sales. I close or I walk. I do not beg a bad fit.",
    primarySkill: "sales",
    sabiScore: 90,
    jobsDone: 38,
    ratingAvg: 4.8,
    ratingCount: 31,
  },
  {
    userId: "featured-femi",
    handle: "femi-pots",
    displayName: "Femi Alabi",
    city: "Ibadan",
    bio: "Event cooking at scale. Jollof that holds, proteins that are not dry, kitchen that does not panic.",
    primarySkill: "cooking",
    sabiScore: 85,
    jobsDone: 22,
    ratingAvg: 4.7,
    ratingCount: 19,
  },
];

export const SAMPLE_JOBS: {
  clientId: string;
  skillId: SkillId;
  title: string;
  description: string;
  city: string;
  budget: number;
}[] = [
  {
    clientId: "featured-tunde",
    skillId: "electrical",
    title: "Changeover for a 3-bed in Lekki Phase 1",
    description:
      "PHCN + 7.5kVA. Fridge and inverter already installed. Need someone who will not backfeed the street.",
    city: "Lagos",
    budget: 180000,
  },
  {
    clientId: "featured-kemi",
    skillId: "fashion",
    title: "Two aso-ebi dresses, Saturday",
    description: "Gele already sorted. Need fit that can survive dancing. Measurements ready.",
    city: "Lagos",
    budget: 95000,
  },
  {
    clientId: "featured-zainab",
    skillId: "coding",
    title: "Fix Paystack webhook double-credit",
    description: "Customers get marked paid twice when Paystack retries. Need idempotency, tests, and a postmortem.",
    city: "Abuja",
    budget: 250000,
  },
  {
    clientId: "featured-amaka",
    skillId: "makeup",
    title: "Bridal party of 6, outdoor reception",
    description: "Port Harcourt heat. White and gold. Must last from church to last dance.",
    city: "Port Harcourt",
    budget: 120000,
  },
  {
    clientId: "featured-blessing",
    skillId: "video",
    title: "60-second recap from a chaotic wedding",
    description: "Four hours of footage, no shot list. Need a tight recap by Monday evening.",
    city: "Aba",
    budget: 70000,
  },
  {
    clientId: "featured-musa",
    skillId: "generator",
    title: "Tiger 3.5 that dies after two minutes",
    description: "Starts on choke then dies. Fuel is new. Do not replace the whole carb 'because'.",
    city: "Kano",
    budget: 35000,
  },
];
