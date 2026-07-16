export interface ThaiMission {
  id: string;
  name: string;
  type: "embassy" | "consulate-general" | "permanent-mission";
  country: string;
  city: string;
  websiteUrl?: string;
  socialUrls?: string[];
}

// A curated starting list of Royal Thai Embassies and Consulates-General.
// Not exhaustive — users can also enter a mission manually if it isn't listed here.
export const THAI_MISSIONS: ThaiMission[] = [
  { id: "washington-dc", name: "Royal Thai Embassy, Washington D.C.", type: "embassy", country: "United States", city: "Washington, D.C.", websiteUrl: "https://thaiembdc.org" },
  { id: "los-angeles", name: "Royal Thai Consulate-General, Los Angeles", type: "consulate-general", country: "United States", city: "Los Angeles", websiteUrl: "https://thaiconsulatela.org" },
  { id: "new-york", name: "Royal Thai Consulate-General, New York", type: "consulate-general", country: "United States", city: "New York", websiteUrl: "https://thaiconsulateny.org" },
  { id: "chicago", name: "Royal Thai Consulate-General, Chicago", type: "consulate-general", country: "United States", city: "Chicago", websiteUrl: "https://thaichicago.net" },
  { id: "london", name: "Royal Thai Embassy, London", type: "embassy", country: "United Kingdom", city: "London", websiteUrl: "https://london.thaiembassy.org" },
  { id: "paris", name: "Royal Thai Embassy, Paris", type: "embassy", country: "France", city: "Paris", websiteUrl: "https://paris.thaiembassy.org" },
  { id: "berlin", name: "Royal Thai Embassy, Berlin", type: "embassy", country: "Germany", city: "Berlin", websiteUrl: "https://berlin.thaiembassy.org" },
  { id: "frankfurt", name: "Royal Thai Consulate-General, Frankfurt", type: "consulate-general", country: "Germany", city: "Frankfurt", websiteUrl: "https://frankfurt.thaiembassy.org" },
  { id: "rome", name: "Royal Thai Embassy, Rome", type: "embassy", country: "Italy", city: "Rome", websiteUrl: "https://rome.thaiembassy.org" },
  { id: "madrid", name: "Royal Thai Embassy, Madrid", type: "embassy", country: "Spain", city: "Madrid", websiteUrl: "https://madrid.thaiembassy.org" },
  { id: "stockholm", name: "Royal Thai Embassy, Stockholm", type: "embassy", country: "Sweden", city: "Stockholm", websiteUrl: "https://stockholm.thaiembassy.org" },
  { id: "brussels", name: "Royal Thai Embassy, Brussels", type: "embassy", country: "Belgium", city: "Brussels", websiteUrl: "https://brussels.thaiembassy.org" },
  { id: "the-hague", name: "Royal Thai Embassy, The Hague", type: "embassy", country: "Netherlands", city: "The Hague", websiteUrl: "https://thehague.thaiembassy.org" },
  { id: "bern", name: "Royal Thai Embassy, Bern", type: "embassy", country: "Switzerland", city: "Bern", websiteUrl: "https://bern.thaiembassy.org" },
  { id: "vienna", name: "Royal Thai Embassy, Vienna", type: "embassy", country: "Austria", city: "Vienna", websiteUrl: "https://vienna.thaiembassy.org" },
  { id: "moscow", name: "Royal Thai Embassy, Moscow", type: "embassy", country: "Russia", city: "Moscow", websiteUrl: "https://moscow.thaiembassy.org" },
  { id: "canberra", name: "Royal Thai Embassy, Canberra", type: "embassy", country: "Australia", city: "Canberra", websiteUrl: "https://canberra.thaiembassy.org" },
  { id: "sydney", name: "Royal Thai Consulate-General, Sydney", type: "consulate-general", country: "Australia", city: "Sydney", websiteUrl: "https://thaiconsulatesydney.org" },
  { id: "wellington", name: "Royal Thai Embassy, Wellington", type: "embassy", country: "New Zealand", city: "Wellington", websiteUrl: "https://wellington.thaiembassy.org" },
  { id: "tokyo", name: "Royal Thai Embassy, Tokyo", type: "embassy", country: "Japan", city: "Tokyo", websiteUrl: "https://tokyo.thaiembassy.org" },
  { id: "osaka", name: "Royal Thai Consulate-General, Osaka", type: "consulate-general", country: "Japan", city: "Osaka", websiteUrl: "https://osaka.thaiembassy.org" },
  { id: "seoul", name: "Royal Thai Embassy, Seoul", type: "embassy", country: "South Korea", city: "Seoul", websiteUrl: "https://seoul.thaiembassy.org" },
  { id: "beijing", name: "Royal Thai Embassy, Beijing", type: "embassy", country: "China", city: "Beijing", websiteUrl: "https://beijing.thaiembassy.org" },
  { id: "shanghai", name: "Royal Thai Consulate-General, Shanghai", type: "consulate-general", country: "China", city: "Shanghai", websiteUrl: "https://shanghai.thaiembassy.org" },
  { id: "hong-kong", name: "Royal Thai Consulate-General, Hong Kong", type: "consulate-general", country: "Hong Kong SAR", city: "Hong Kong", websiteUrl: "https://hongkong.thaiembassy.org" },
  { id: "guangzhou", name: "Royal Thai Consulate-General, Guangzhou", type: "consulate-general", country: "China", city: "Guangzhou", websiteUrl: "https://guangzhou.thaiembassy.org" },
  { id: "kunming", name: "Royal Thai Consulate-General, Kunming", type: "consulate-general", country: "China", city: "Kunming", websiteUrl: "https://kunming.thaiembassy.org" },
  { id: "singapore", name: "Royal Thai Embassy, Singapore", type: "embassy", country: "Singapore", city: "Singapore", websiteUrl: "https://singapore.thaiembassy.org" },
  { id: "kuala-lumpur", name: "Royal Thai Embassy, Kuala Lumpur", type: "embassy", country: "Malaysia", city: "Kuala Lumpur", websiteUrl: "https://kualalumpur.thaiembassy.org" },
  { id: "jakarta", name: "Royal Thai Embassy, Jakarta", type: "embassy", country: "Indonesia", city: "Jakarta", websiteUrl: "https://jakarta.thaiembassy.org" },
  { id: "manila", name: "Royal Thai Embassy, Manila", type: "embassy", country: "Philippines", city: "Manila", websiteUrl: "https://manila.thaiembassy.org" },
  { id: "hanoi", name: "Royal Thai Embassy, Hanoi", type: "embassy", country: "Vietnam", city: "Hanoi", websiteUrl: "https://hanoi.thaiembassy.org" },
  { id: "ho-chi-minh", name: "Royal Thai Consulate-General, Ho Chi Minh City", type: "consulate-general", country: "Vietnam", city: "Ho Chi Minh City", websiteUrl: "https://hochiminh.thaiembassy.org" },
  { id: "phnom-penh", name: "Royal Thai Embassy, Phnom Penh", type: "embassy", country: "Cambodia", city: "Phnom Penh", websiteUrl: "https://phnompenh.thaiembassy.org" },
  { id: "vientiane", name: "Royal Thai Embassy, Vientiane", type: "embassy", country: "Laos", city: "Vientiane", websiteUrl: "https://vientiane.thaiembassy.org" },
  { id: "yangon", name: "Royal Thai Embassy, Yangon", type: "embassy", country: "Myanmar", city: "Yangon", websiteUrl: "https://yangon.thaiembassy.org" },
  { id: "new-delhi", name: "Royal Thai Embassy, New Delhi", type: "embassy", country: "India", city: "New Delhi", websiteUrl: "https://newdelhi.thaiembassy.org" },
  { id: "dhaka", name: "Royal Thai Embassy, Dhaka", type: "embassy", country: "Bangladesh", city: "Dhaka", websiteUrl: "https://dhaka.thaiembassy.org" },
  { id: "islamabad", name: "Royal Thai Embassy, Islamabad", type: "embassy", country: "Pakistan", city: "Islamabad", websiteUrl: "https://islamabad.thaiembassy.org" },
  { id: "canberra-hc", name: "Royal Thai Embassy, Ottawa", type: "embassy", country: "Canada", city: "Ottawa", websiteUrl: "https://ottawa.thaiembassy.org" },
  { id: "mexico-city", name: "Royal Thai Embassy, Mexico City", type: "embassy", country: "Mexico", city: "Mexico City", websiteUrl: "https://mexicocity.thaiembassy.org" },
  { id: "brasilia", name: "Royal Thai Embassy, Brasilia", type: "embassy", country: "Brazil", city: "Brasília", websiteUrl: "https://brasilia.thaiembassy.org" },
  { id: "pretoria", name: "Royal Thai Embassy, Pretoria", type: "embassy", country: "South Africa", city: "Pretoria", websiteUrl: "https://pretoria.thaiembassy.org" },
  { id: "cairo", name: "Royal Thai Embassy, Cairo", type: "embassy", country: "Egypt", city: "Cairo", websiteUrl: "https://cairo.thaiembassy.org" },
  { id: "riyadh", name: "Royal Thai Embassy, Riyadh", type: "embassy", country: "Saudi Arabia", city: "Riyadh", websiteUrl: "https://riyadh.thaiembassy.org" },
  { id: "abu-dhabi", name: "Royal Thai Embassy, Abu Dhabi", type: "embassy", country: "United Arab Emirates", city: "Abu Dhabi", websiteUrl: "https://abudhabi.thaiembassy.org" },
  { id: "dubai", name: "Royal Thai Consulate-General, Dubai", type: "consulate-general", country: "United Arab Emirates", city: "Dubai", websiteUrl: "https://dubai.thaiembassy.org" },
  { id: "tel-aviv", name: "Royal Thai Embassy, Tel Aviv", type: "embassy", country: "Israel", city: "Tel Aviv", websiteUrl: "https://telaviv.thaiembassy.org" },
  { id: "geneva-mission", name: "Permanent Mission of Thailand to the UN, Geneva", type: "permanent-mission", country: "Switzerland", city: "Geneva", websiteUrl: "https://genevaptm.thaiembassy.org" },
];

export function findMissionById(id: string): ThaiMission | undefined {
  return THAI_MISSIONS.find((m) => m.id === id);
}
