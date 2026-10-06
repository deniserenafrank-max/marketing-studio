// The single source of every word on the site, in Denise's voice (docs/team/creative-director.md).
// Rules: no em dashes, no hype, no guarantees, no invented facts. The static (no-JS) document
// and the interactive rooms both render from this file.

export const SITE = {
  name: 'The Unusual Open House',
  headline: { before: 'Not your ', italic: 'usual', after: ' open house.' },
  sub: 'Denise Frank, Broker and Realtor®, Houston-north. Every room teaches you one thing and hands you one key. About six minutes. Knock when you’re ready.',
  description: 'Denise Frank, Broker/Owner of Hometown Realtors of Texas: a six-minute night walk through her open house in the Houston-north pines. Every room teaches one real estate lesson and hands you one key.',
  heroAlt: 'A front porch at night in the pines north of Houston, one light on, fireflies in the yard.',
  url: 'https://hometownrealtorsoftexas.com',
};

export const CONTACT = {
  direct: { display: '(832) 928-3019', tel: '+18329283019', label: 'Denise, direct' },
  office: { display: '(832) 661-0475', tel: '+18326610475', label: 'Office' },
  address: '1104 Jacob’s Lake Blvd., Conroe, TX 77384',
  book: 'https://www.har.com/appointment-with-defrank',
  message: 'https://hometownrealtorsoftexas.com/#contact',
  search: 'https://www.har.com/web/denisefrank',
  har: 'https://www.har.com/denise-frank/agent_defrank',
  facebook: 'https://www.facebook.com/HometownRealtorsOfTexasLlc',
  reels: 'https://www.facebook.com/HometownRealtorsOfTexasLlc/owner_reels',
  instagram: 'https://www.instagram.com/best_real_estate_agent_4life/',
  x: 'https://x.com/hometownrealgal',
  group: 'https://www.facebook.com/groups/',
  groupName: 'Houston Homes | Credit Help & Real Estate Advice',
  calculator: 'https://hometownrealtorsoftexas.com/#rent-vs-buy',
  iabs: 'https://www.har.com/mhf/terms/dispBrokerInfo?sitetype=aws&cid=530671',
  cpn: 'https://content.harstatic.com/pdf/TREC_CPN.pdf',
};

export const KEYS = [
  { id: 'porch', name: 'Porch Key', room: 'porch' },
  { id: 'hall', name: 'Hall Key', room: 'front-hall' },
  { id: 'lab', name: 'Lab Key', room: 'lab' },
  { id: 'case', name: 'Case Key', room: 'evidence-board' },
  { id: 'library', name: 'Library Key', room: 'library' },
  { id: 'map', name: 'Map Key', room: 'map-room' },
  { id: 'backyard', name: 'Backyard Key', room: 'backyard' },
];
export const HOUSE_KEY = { name: 'House Key', tag: 'Handed over in person', still: 'still in the house' };

export const ROOMS = [
  {
    id: 'porch', num: 1, title: 'The Porch', key: 'porch', verb: 'Knock',
    eyebrow: 'Room one of eight',
    toast: 'Porch Key. You knocked. Most people walk right in.',
    next: 'front-hall',
  },
  {
    id: 'front-hall', num: 2, title: 'The Front Hall', key: 'hall', verb: 'Choose',
    eyebrow: 'Room two',
    intro: 'Hi, I’m Denise. Broker, Realtor, Houston girl, Aggie, IT before this. My girls come first. A cat and a lizard run the office. I’m not your usual Realtor, and I’d rather show you than tell you.',
    question: 'What brought you by tonight?',
    toast: 'Hall Key. Now the house knows why you came.',
    next: 'lab',
  },
  {
    id: 'lab', num: 3, title: 'The Lab', key: 'lab', verb: 'Run the numbers',
    eyebrow: 'Room three',
    intro: 'Science nerd, reporting for duty. Rent is not “throwing money away,” and buying is not always the smart move. It’s math. Move the sliders and see the true monthly cost of owning, taxes, insurance, HOA and PMI included, next to rent.',
    instruction: 'Move the sliders. Then run the numbers.',
    notYet: 'Not yet is a plan. That’s Credit to Keys: rent now, build credit, buy later, on purpose.',
    creditNote: 'This is general information, not credit repair or financial advice. Results differ. Denise is not a credit counselor.',
    disclaimer: 'These numbers are estimates for learning. They are not a loan quote or financial advice. Your taxes, insurance, HOA, PMI and rate will differ. Talk to a licensed lender before you decide.',
    toast: 'Lab Key. You ran the numbers before you fell in love. Rare.',
    next: 'evidence-board',
  },
  {
    id: 'evidence-board', num: 4, title: 'The Evidence Board', key: 'case', verb: 'Tap',
    eyebrow: 'Room four',
    intro: 'True crime fan. Occupational hazard: I read listings like case files. Here’s one. Tap every word that’s hiding something. The twine does the rest.',
    instruction: null,
    caseLabel: 'Case file 0530671',
    stamp: 'Case closed',
    wrong: 'Not quite. Try another word.',
    toast: 'Case Key. You can’t unsee “cozy” now. Sorry.',
    next: 'library',
  },
  {
    id: 'library', num: 5, title: 'The Library', key: 'library', verb: 'Flip',
    eyebrow: 'Room five',
    intro: 'Bookworm. Real estate has its own language and nobody hands you the glossary. Flip five cards. They show up on your paperwork whether you know them or not.',
    instruction: null,
    toast: 'Library Key. You now speak fluent closing table.',
    next: 'map-room',
  },
  {
    id: 'map-room', num: 6, title: 'The Map Room', key: 'map', verb: 'Pin',
    eyebrow: 'Room six',
    intro: 'I grew up in Houston and I work the north side. Drop a pin on your town and I’ll tell you the three questions I ask first out there.',
    instruction: 'Pick your town.',
    toast: 'Map Key. Know what to ask before you know where to look.',
    next: 'backyard',
  },
  {
    id: 'backyard', num: 7, title: 'The Backyard', key: 'backyard', verb: 'Flip',
    eyebrow: 'Room seven',
    intro: 'Meet the supervisors. Rico, bearded dragon, Head of Security. Cheeto, cat, Chief Inspection Officer. Flip each between real life and real estate life, then take their advice.',
    instruction: 'Tap a photo to see the other life.',
    toast: 'Backyard Key. Both supervisors signed off. Cheeto took his time.',
    next: 'closing-table',
  },
  {
    id: 'closing-table', num: 8, title: 'The Closing Table', key: null, verb: 'Call',
    eyebrow: 'Room eight',
    headline: 'Let’s get you keys.',
    sub: 'Seven on the ring. One hook empty. That one is the house key, and I hand it over in person.',
    skipped: 'Straight to the table. I respect that. Everything you need is right here.',
    partial: 'You left a few keys behind. The door still opens.',
    full: 'Seven on the ring. One hook empty. That one is the house key, and I hand it over in person.',
    next: null,
  },
];

export const MOVES = [
  { id: 'buy', label: 'I want to buy', short: 'buy', labHeading: 'What owning really costs each month', mapLine: 'Buying out here: ask for the MUD rate and the flood zone before you fall for the kitchen.', closing: 'Let’s go find your keys.', primary: { label: 'Book a time on HAR', href: CONTACT.book }, secondary: { label: 'Search homes on HAR', href: CONTACT.search } },
  { id: 'sell', label: 'I want to sell', short: 'sell', labHeading: 'What your buyer is weighing', mapLine: 'Selling out here: your homestead exemption and HOA documents come up early. Have both ready.', closing: 'Let’s find out what it’s worth.', primary: { label: 'Ask for a CMA', href: CONTACT.message }, secondary: { label: 'Book a time on HAR', href: CONTACT.book } },
  { id: 'rent', label: 'I need to rent', short: 'rent', labHeading: 'Rent now, keys later', mapLine: 'Renting out here: drive the commute before you sign, and read the lease before the application fee.', closing: 'Rent now. Keys later.', primary: { label: 'Ask about Credit to Keys', href: CONTACT.message }, secondary: { label: 'Join the Facebook group', href: CONTACT.facebook } },
  { id: 'landlord', label: 'I own a rental', short: 'own a rental', labHeading: 'Will it ROI?', mapLine: 'Owning a rental out here: HOA leasing rules and MUD taxes change the math. Check both before you set the rent.', closing: 'Let’s talk about your rental.', primary: { label: 'Ask about property management', href: CONTACT.message }, secondary: { label: 'Book a time on HAR', href: CONTACT.book } },
];

export const LAB = {
  defaults: { price: 325000, down: 5, rate: 6.5, tax: 2.5, insurance: 3000, hoa: 50, rent: 2000 },
  sliders: [
    { id: 'price', label: 'Home price', min: 100000, max: 900000, step: 5000, unit: 'usd', text: (v) => `${usd(v)} home price` },
    { id: 'down', label: 'Down payment', min: 0, max: 30, step: 1, unit: 'pct', text: (v) => `${v} percent down` },
    { id: 'rate', label: 'Interest rate', hint: 'Use your lender’s quote.', min: 3, max: 10, step: 0.125, unit: 'pct', text: (v) => `${v} percent rate` },
    { id: 'tax', label: 'Property tax rate', hint: 'Varies by address, MUD included.', min: 1.5, max: 3.6, step: 0.1, unit: 'pct', text: (v) => `${v} percent property tax` },
    { id: 'insurance', label: 'Home insurance, yearly', min: 1000, max: 8000, step: 100, unit: 'usd', text: (v) => `${usd(v)} insurance per year` },
    { id: 'hoa', label: 'HOA dues, monthly', min: 0, max: 400, step: 10, unit: 'usd', text: (v) => `${usd(v)} HOA per month` },
    { id: 'rent', label: 'Rent instead', min: 800, max: 5000, step: 50, unit: 'usd', text: (v) => `${usd(v)} rent per month` },
  ],
  run: 'Run the numbers',
  ownLabel: 'To own',
  rentLabel: 'To rent',
  perMonth: 'per month, first year',
  lines: ['Principal and interest', 'Property taxes', 'Home insurance', 'HOA dues', 'PMI', 'Upkeep, 1% of price a year, rule of thumb'],
  rateUnset: 'your lender’s quote',
  rateHint: 'Set a rate from your lender’s quote first.',
  pmiRate: 0.006,
  upkeepRate: 0.01,
  termYears: 30,
};

export const EVIDENCE = {
  listing: [
    'Charming ', { word: 'cozy', meaning: 'Small. Bring a tape measure.' }, ' 3/2 on a quiet cul-de-sac. ',
    { word: 'Needs TLC', meaning: 'Needs a contractor.' }, ' but priced to move. ',
    { word: 'Motivated seller', meaning: 'Price is a conversation. Bring an offer.' }, '! ',
    { word: 'Investor special', meaning: 'Bring a flashlight.' }, ' with a ',
    { word: 'partial lake view', meaning: 'Stand on the roof.' }, '. Won’t last!',
  ],
  found: (n) => `${n} of 5 found`,
  correct: (word, meaning) => `Found it. “${word}” usually means: ${meaning}`,
};

export const LIBRARY = [
  { id: 'mud', word: 'MUD', def: 'A district that taxes you for water, sewer and drainage, common in newer subdivisions.', gloss: 'Ask for the rate.' },
  { id: 'pmi', word: 'PMI', def: 'Mortgage insurance that rides along with many smaller down payments.', gloss: 'It protects the lender, not you.' },
  { id: 'homestead', word: 'Homestead exemption', def: 'A filing that can lower the taxable value of the home you live in.', gloss: 'Easy to miss.' },
  { id: 'escrow', word: 'Escrow', def: 'Where the money waits until everyone keeps their promises.', gloss: 'Patience, in account form.' },
  { id: 'earnest', word: 'Earnest money', def: 'The deposit that says “I mean it.”', gloss: 'Credited to you at closing, if you close.' },
];

export const TOWNS = [
  { id: 'montgomery', name: 'Montgomery', x: 27, y: 40 },
  { id: 'conroe', name: 'Conroe', x: 56, y: 44 },
  { id: 'magnolia', name: 'Magnolia', x: 31, y: 66 },
  { id: 'pinehurst', name: 'Pinehurst', x: 35, y: 77 },
  { id: 'shenandoah', name: 'Shenandoah', x: 59, y: 61 },
  { id: 'woodlands', name: 'The Woodlands', x: 55, y: 69 },
  { id: 'spring', name: 'Spring', x: 62, y: 84 },
];
export const OFF_MAP = { id: 'college-station', name: 'College Station', note: 'Not in the service area. Whhhooop anyway.', x: 9, y: 9 };
export const FIELD_NOTE = {
  title: (town) => `Field note: ${town}`,
  lines: [
    'Flood zone: check the map before you check the paint.',
    'MUD: new street, ask for the rate.',
    'Commute: drive it at 7:40 on a Tuesday, not noon on a Sunday.',
  ],
  elsewhere: 'Somewhere else? Denise is also licensed in Colorado, Kansas, Oklahoma, Missouri and Ohio, and knows who to call everywhere else.',
};

export const PETS = [
  {
    id: 'rico', name: 'Rico', species: 'Bearded dragon', title: 'Head of Security',
    real: 'Once mistook a finger for a blueberry. Now fed with tongs.',
    advice: 'Read it before you sign it. Not everything that looks like a blueberry is one.',
    altReal: 'Rico the bearded dragon, in real life.',
    altWork: 'Rico the bearded dragon in a three-piece suit carrying a briefcase: his real estate life.',
    img: { real: 'media/rico-real-life.webp', work: 'media/rico-real-estate-life.webp' },
  },
  {
    id: 'cheeto', name: 'Cheeto', species: 'Cat', title: 'Chief Inspection Officer',
    real: 'Tests every sunny windowsill before a listing goes live.',
    advice: 'Never skip the inspection. He does windowsills. Hire a human for the roof.',
    altReal: 'Cheeto, an orange and white cat, napping in real life.',
    altWork: 'Cheeto, an orange and white cat, in a black suit beside a black SUV: his real estate life.',
    img: { real: 'media/cheeto-real-life.webp', work: 'media/cheeto-real-estate-life.webp' },
  },
];
export const PET_SIDES = { real: 'In real life', work: 'Real estate life' };

export const HUD = {
  progress: (n, total) => `Keys ${n} of ${total}`,
  ring: 'Keyring',
  skip: 'Skip to the closing table',
  skipShort: 'Skip to closing',
  back: 'Back to the tour',
  soundOn: 'Sound on', soundOff: 'Sound off', soundHint: 'Crickets included. Sound stays off until you turn it on.', soundKicker: 'Sound',
  calmOn: 'Calm mode on', calmOff: 'Calm mode off',
  menu: 'Your keyring',
  restart: 'Start over', restartConfirm: 'Clear your keys and start over?', restartYes: 'Yes, start over', restartNo: 'Keep my keys',
  earned: 'Key earned', locked: 'Not yet',
  nextRoom: (name) => `Next room: ${name}`,
  welcomeBack: (n) => (n ? `Welcome back. ${n} of 7 keys on the ring.` : 'Welcome back.'),
};

export const ACHIEVEMENTS = [
  { id: 'knocked', name: 'Knocked First', desc: 'Most people walk right in.' },
  { id: 'straight', name: 'Straight to Business', desc: 'Skipped to the table. No judgment.' },
  { id: 'scientist', name: 'Mad Scientist', desc: 'Moved every slider in the Lab.' },
  { id: 'notyet', name: 'Not Yet Is a Plan', desc: 'Found the Credit to Keys path.' },
  { id: 'caseclosed', name: 'Case Closed', desc: 'Found every hidden word.' },
  { id: 'whoop', name: 'Whhhooop', desc: 'Found the pin that isn’t on the map.' },
  { id: 'local', name: 'Local', desc: 'Visited all seven towns.' },
  { id: 'tongs', name: 'Tong Certified', desc: 'Met Rico, kept all ten fingers.' },
  { id: 'fullring', name: 'Full Ring', desc: 'Seven keys, one empty hook. You know what to do.' },
];

export const ANNOUNCE = {
  key: (name, n, total) => `Key earned: ${name}. ${n} of ${total} keys.`,
  achievement: (name) => `Achievement: ${name}.`,
  allKeys: 'All seven keys earned. The Closing Table is open.',
  restored: (n) => `Progress restored: ${n} of 7 keys.`,
  soundOn: 'Sound on.', soundOff: 'Sound off.',
  calmOn: 'Motion reduced.', calmOff: 'Motion on.',
  reset: 'Keys cleared. Starting over.',
};

export const FALLBACK = {
  noWebGL: 'The fireflies took the night off. The house is still open. Come on in.',
  calm: 'Same house, fewer fireflies.',
  audioBlocked: 'Your browser kept the crickets quiet. Tap the speaker when you want them.',
};

export const CLOSING = {
  call: 'Call Denise',
  copy: 'Copy number', copied: 'Copied',
  book: 'Book a time on HAR',
  message: 'Send a message',
  search: 'Search homes on HAR',
  socials: [
    { label: 'Facebook', href: CONTACT.facebook },
    { label: 'Instagram', href: CONTACT.instagram },
    { label: 'X', href: CONTACT.x },
    { label: 'HAR profile', href: CONTACT.har },
  ],
  reviews: 'Reviews and recent sales live on HAR.',
};

export const FOOTER = {
  brokerage: 'Hometown Realtors of Texas LLC',
  line1: 'Denise Frank, Broker/Owner. Texas Real Estate Commission broker license #0530671.',
  line2: `${CONTACT.address}. Direct ${CONTACT.direct.display}. Office ${CONTACT.office.display}.`,
  iabs: 'Texas Real Estate Commission Information About Brokerage Services',
  cpn: 'Texas Real Estate Commission Consumer Protection Notice (PDF)',
  fair: 'Equal Housing Opportunity. Hometown Realtors of Texas LLC follows the federal Fair Housing Act and the Texas Fair Housing Act. We do not discriminate on the basis of race, color, religion, sex, disability, familial status or national origin.',
  trademark: 'REALTOR® is a registered trademark of the National Association of REALTORS®. Denise Frank is a member of the Houston Association of REALTORS®.',
  estimates: 'Lab numbers are estimates for learning, not financial, legal or tax advice; credit information is general, not advice. Nothing here promises rates, values or outcomes.',
  built: 'Built as a game on purpose. Every room is readable without playing.',
};

export function usd(n, digits = 0) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
}

export const TOTAL_KEYS = KEYS.length;
