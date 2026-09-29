// The mobile app's dropdown fields, as the admin panel knows them.
//
// Fields with an `api` route are live: the admin's edits go to the server's
// master-data endpoints (/api/master/<route>) and take effect in the app the
// next time it loads that list. Fields without one are still hardcoded inside
// the app or tied to a server enum; the panel shows them read-only for
// reference until they get an endpoint too.

/** One selectable option as the panel renders it. */
export type DropdownOption = {
  id: string;
  /** Stored value (enum key for enum-backed fields, else the text itself). */
  value: string;
  /** Display text. Same as `value` for plain lists. */
  label: string;
  /** Optional picture (Kuladevata deities, welfare category emoji). */
  image?: string;
  active: boolean;
};

export type DropdownField = {
  /** URL slug, e.g. "gotra". */
  key: string;
  name: string;
  description: string;
  screen: "Registration & Profile" | "Matrimonial" | "Family Tree" | "Welfare" | "Birth Details";
  kind: "text" | "enum";
  allowsImage?: boolean;
  imageUpload?: boolean;
  multiSelect?: boolean;
  api?: string;
  fixed?: DropdownOption[];
};

const plain = (values: string[]): DropdownOption[] =>
  values.map((v, i) => ({ id: `fixed-${i}`, value: v, label: v, active: true }));

const keyed = (pairs: [string, string][]): DropdownOption[] =>
  pairs.map(([value, label], i) => ({ id: `fixed-${i}`, value, label, active: true }));

export const DROPDOWN_FIELDS: DropdownField[] = [
  {
    key: "kuladevata",
    name: "Kuladevata",
    description: "Family deity suggestions with a picture. Members can still type their own.",
    screen: "Registration & Profile",
    kind: "text",
    allowsImage: true,
    imageUpload: true,
    api: "kuladevatas",
  },
  {
    key: "blood-group",
    name: "Blood group",
    description: "ABO/Rh groups on the profile.",
    screen: "Registration & Profile",
    kind: "text",
    api: "blood-groups",
  },
  {
    key: "occupation",
    name: "Occupation",
    description: "Occupation choices on the profile.",
    screen: "Registration & Profile",
    kind: "text",
    api: "occupations",
  },
  {
    key: "annual-income",
    name: "Annual income",
    description: "Income brackets on the matrimonial profile.",
    screen: "Matrimonial",
    kind: "text",
    api: "annual-incomes",
  },
  {
    key: "occupation-type",
    name: "Occupation type",
    description: "Career section of the matrimonial profile.",
    screen: "Matrimonial",
    kind: "enum",
    fixed: keyed([["SALARIED", "Salaried"], ["SELF_EMPLOYED", "Self-employed"], ["UNEMPLOYED", "Not working"]]),
  },
  {
    key: "marriage-intention",
    name: "Marriage timeline",
    description: "When the member intends to marry.",
    screen: "Matrimonial",
    kind: "enum",
    fixed: keyed([["SOON", "Soon"], ["ONE_TO_TWO_YEARS", "1–2 years"], ["NOT_DECIDED", "Not decided"]]),
  },
  {
    key: "children-preference",
    name: "Children preference",
    screen: "Matrimonial",
    description: "Marriage preferences section.",
    kind: "enum",
    fixed: keyed([["WANT_CHILDREN", "Want children"], ["DO_NOT_WANT_CHILDREN", "Do not want children"], ["OPEN_TO_DISCUSS", "Open to discuss"]]),
  },
  {
    key: "family-preference",
    name: "Family type",
    description: "Joint or nuclear family preference.",
    screen: "Matrimonial",
    kind: "enum",
    fixed: keyed([["JOINT_FAMILY", "Joint family"], ["NUCLEAR_FAMILY", "Nuclear family"], ["FLEXIBLE", "Flexible"]]),
  },
  {
    key: "relocation-preference",
    name: "Willing to relocate",
    description: "Marriage preferences section.",
    screen: "Matrimonial",
    kind: "enum",
    fixed: keyed([["YES", "Yes"], ["NO", "No"], ["MAYBE", "Maybe"]]),
  },
  {
    key: "food-preference",
    name: "Food preference",
    description: "Lifestyle section.",
    screen: "Matrimonial",
    kind: "enum",
    fixed: keyed([["VEGETARIAN", "Vegetarian"], ["NON_VEGETARIAN", "Non-vegetarian"], ["EGGETARIAN", "Eggetarian"], ["OTHER", "Other"]]),
  },
  {
    key: "interests",
    name: "Interests",
    description: "Multi-select chips on the matrimonial profile.",
    screen: "Matrimonial",
    kind: "enum",
    multiSelect: true,
    fixed: keyed([
      ["TRAVEL", "Travel"], ["MUSIC", "Music"], ["MOVIES", "Movies"], ["FITNESS", "Fitness"],
      ["SPORTS", "Sports"], ["READING", "Reading"], ["COOKING", "Cooking"], ["SPIRITUALITY", "Spirituality"],
    ]),
  },
  {
    key: "relationship",
    name: "Relationship to you",
    description: "Relation picked when adding a relative to the family tree.",
    screen: "Family Tree",
    kind: "enum",
    fixed: keyed([
      ["father", "Father"], ["mother", "Mother"], ["spouse", "Spouse"], ["brother", "Brother"],
      ["sister", "Sister"], ["son", "Son"], ["daughter", "Daughter"],
    ]),
  },
  {
    key: "welfare-category",
    name: "Campaign category",
    description: "Category chosen when creating a welfare campaign.",
    screen: "Welfare",
    kind: "enum",
    allowsImage: true,
    fixed: [
      { id: "fixed-0", value: "infrastructure", label: "Infrastructure", image: "🏛️", active: true },
      { id: "fixed-1", value: "culturalHeritage", label: "Cultural heritage", image: "🪔", active: true },
      { id: "fixed-2", value: "education", label: "Education", image: "🎓", active: true },
      { id: "fixed-3", value: "emergency", label: "Emergency", image: "❤️", active: true },
      { id: "fixed-4", value: "healthcare", label: "Healthcare", image: "🏥", active: true },
    ],
  },
  {
    key: "birth-time-accuracy",
    name: "Birth time accuracy",
    description: "How precisely the birth time is known, for the horoscope.",
    screen: "Birth Details",
    kind: "enum",
    fixed: keyed([
      ["EXACT_DOCUMENT_VERIFIED", "Exact (from document)"],
      ["EXACT_FAMILY_CONFIRMED", "Exact (family confirmed)"],
      ["APPROXIMATE_15_MINUTES", "Approximate (±15 minutes)"],
      ["APPROXIMATE_30_MINUTES", "Approximate (±30 minutes)"],
      ["APPROXIMATE_60_MINUTES", "Approximate (±60 minutes)"],
      ["UNKNOWN", "Unknown"],
    ]),
  },
];

export const SCREENS = [
  "Registration & Profile",
  "Matrimonial",
  "Family Tree",
  "Welfare",
  "Birth Details",
] as const satisfies readonly DropdownField["screen"][];

export function getField(key: string): DropdownField | undefined {
  return DROPDOWN_FIELDS.find((f) => f.key === key);
}

/** Reference options for a fixed (read-only) field; [] for live ones. */
export function fixedOptions(key: string): DropdownOption[] {
  return getField(key)?.fixed ?? [];
}
