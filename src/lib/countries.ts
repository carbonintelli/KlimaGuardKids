import type { CityPreset, CountryOption } from "./types";

/**
 * Climate-vulnerable countries and cities for the global demo registry.
 * Coverage prioritizes heat, flood, cyclone/typhoon, drought, air quality,
 * sea-level, and vector-borne disease risk for children. India multi-region
 * depth remains in `india-regions.ts`; other countries expose city presets here.
 */
export const COUNTRIES: CountryOption[] = [
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "BD", name: "Bangladesh", flag: "🇧🇩" },
  { code: "PK", name: "Pakistan", flag: "🇵🇰" },
  { code: "NP", name: "Nepal", flag: "🇳🇵" },
  { code: "LK", name: "Sri Lanka", flag: "🇱🇰" },
  { code: "MM", name: "Myanmar", flag: "🇲🇲" },
  { code: "BT", name: "Bhutan", flag: "🇧🇹" },
  { code: "AF", name: "Afghanistan", flag: "🇦🇫" },
  { code: "PH", name: "Philippines", flag: "🇵🇭" },
  { code: "ID", name: "Indonesia", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", flag: "🇻🇳" },
  { code: "TH", name: "Thailand", flag: "🇹🇭" },
  { code: "KH", name: "Cambodia", flag: "🇰🇭" },
  { code: "LA", name: "Laos", flag: "🇱🇦" },
  { code: "MY", name: "Malaysia", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "TL", name: "Timor-Leste", flag: "🇹🇱" },
  { code: "CN", name: "China", flag: "🇨🇳" },
  { code: "MN", name: "Mongolia", flag: "🇲🇳" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", flag: "🇰🇷" },
  { code: "MV", name: "Maldives", flag: "🇲🇻" },
  { code: "FJ", name: "Fiji", flag: "🇫🇯" },
  { code: "VU", name: "Vanuatu", flag: "🇻🇺" },
  { code: "SB", name: "Solomon Islands", flag: "🇸🇧" },
  { code: "PG", name: "Papua New Guinea", flag: "🇵🇬" },
  { code: "KI", name: "Kiribati", flag: "🇰🇮" },
  { code: "TV", name: "Tuvalu", flag: "🇹🇻" },
  { code: "TO", name: "Tonga", flag: "🇹🇴" },
  { code: "WS", name: "Samoa", flag: "🇼🇸" },
  { code: "MH", name: "Marshall Islands", flag: "🇲🇭" },
  { code: "FM", name: "Micronesia", flag: "🇫🇲" },
  { code: "PW", name: "Palau", flag: "🇵🇼" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬" },
  { code: "GH", name: "Ghana", flag: "🇬🇭" },
  { code: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "SN", name: "Senegal", flag: "🇸🇳" },
  { code: "ML", name: "Mali", flag: "🇲🇱" },
  { code: "BF", name: "Burkina Faso", flag: "🇧🇫" },
  { code: "NE", name: "Niger", flag: "🇳🇪" },
  { code: "TD", name: "Chad", flag: "🇹🇩" },
  { code: "MR", name: "Mauritania", flag: "🇲🇷" },
  { code: "GM", name: "Gambia", flag: "🇬🇲" },
  { code: "GN", name: "Guinea", flag: "🇬🇳" },
  { code: "GW", name: "Guinea-Bissau", flag: "🇬🇼" },
  { code: "SL", name: "Sierra Leone", flag: "🇸🇱" },
  { code: "LR", name: "Liberia", flag: "🇱🇷" },
  { code: "BJ", name: "Benin", flag: "🇧🇯" },
  { code: "TG", name: "Togo", flag: "🇹🇬" },
  { code: "CM", name: "Cameroon", flag: "🇨🇲" },
  { code: "CF", name: "Central African Republic", flag: "🇨🇫" },
  { code: "CD", name: "DR Congo", flag: "🇨🇩" },
  { code: "CG", name: "Congo", flag: "🇨🇬" },
  { code: "GA", name: "Gabon", flag: "🇬🇦" },
  { code: "AO", name: "Angola", flag: "🇦🇴" },
  { code: "KE", name: "Kenya", flag: "🇰🇪" },
  { code: "ET", name: "Ethiopia", flag: "🇪🇹" },
  { code: "SO", name: "Somalia", flag: "🇸🇴" },
  { code: "DJ", name: "Djibouti", flag: "🇩🇯" },
  { code: "ER", name: "Eritrea", flag: "🇪🇷" },
  { code: "SS", name: "South Sudan", flag: "🇸🇸" },
  { code: "SD", name: "Sudan", flag: "🇸🇩" },
  { code: "UG", name: "Uganda", flag: "🇺🇬" },
  { code: "TZ", name: "Tanzania", flag: "🇹🇿" },
  { code: "RW", name: "Rwanda", flag: "🇷🇼" },
  { code: "BI", name: "Burundi", flag: "🇧🇮" },
  { code: "MZ", name: "Mozambique", flag: "🇲🇿" },
  { code: "MW", name: "Malawi", flag: "🇲🇼" },
  { code: "ZM", name: "Zambia", flag: "🇿🇲" },
  { code: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦" },
  { code: "NA", name: "Namibia", flag: "🇳🇦" },
  { code: "BW", name: "Botswana", flag: "🇧🇼" },
  { code: "MG", name: "Madagascar", flag: "🇲🇬" },
  { code: "KM", name: "Comoros", flag: "🇰🇲" },
  { code: "MU", name: "Mauritius", flag: "🇲🇺" },
  { code: "SC", name: "Seychelles", flag: "🇸🇨" },
  { code: "CV", name: "Cabo Verde", flag: "🇨🇻" },
  { code: "ST", name: "São Tomé and Príncipe", flag: "🇸🇹" },
  { code: "EG", name: "Egypt", flag: "🇪🇬" },
  { code: "LY", name: "Libya", flag: "🇱🇾" },
  { code: "TN", name: "Tunisia", flag: "🇹🇳" },
  { code: "DZ", name: "Algeria", flag: "🇩🇿" },
  { code: "MA", name: "Morocco", flag: "🇲🇦" },
  { code: "IQ", name: "Iraq", flag: "🇮🇶" },
  { code: "YE", name: "Yemen", flag: "🇾🇪" },
  { code: "SY", name: "Syria", flag: "🇸🇾" },
  { code: "JO", name: "Jordan", flag: "🇯🇴" },
  { code: "LB", name: "Lebanon", flag: "🇱🇧" },
  { code: "IR", name: "Iran", flag: "🇮🇷" },
  { code: "OM", name: "Oman", flag: "🇴🇲" },
  { code: "AE", name: "United Arab Emirates", flag: "🇦🇪" },
  { code: "SA", name: "Saudi Arabia", flag: "🇸🇦" },
  { code: "KW", name: "Kuwait", flag: "🇰🇼" },
  { code: "BH", name: "Bahrain", flag: "🇧🇭" },
  { code: "QA", name: "Qatar", flag: "🇶🇦" },
  { code: "TR", name: "Türkiye", flag: "🇹🇷" },
  { code: "TJ", name: "Tajikistan", flag: "🇹🇯" },
  { code: "UZ", name: "Uzbekistan", flag: "🇺🇿" },
  { code: "KG", name: "Kyrgyzstan", flag: "🇰🇬" },
  { code: "TM", name: "Turkmenistan", flag: "🇹🇲" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "GT", name: "Guatemala", flag: "🇬🇹" },
  { code: "HN", name: "Honduras", flag: "🇭🇳" },
  { code: "SV", name: "El Salvador", flag: "🇸🇻" },
  { code: "NI", name: "Nicaragua", flag: "🇳🇮" },
  { code: "CR", name: "Costa Rica", flag: "🇨🇷" },
  { code: "PA", name: "Panama", flag: "🇵🇦" },
  { code: "BZ", name: "Belize", flag: "🇧🇿" },
  { code: "CU", name: "Cuba", flag: "🇨🇺" },
  { code: "HT", name: "Haiti", flag: "🇭🇹" },
  { code: "DO", name: "Dominican Republic", flag: "🇩🇴" },
  { code: "JM", name: "Jamaica", flag: "🇯🇲" },
  { code: "BS", name: "Bahamas", flag: "🇧🇸" },
  { code: "BB", name: "Barbados", flag: "🇧🇧" },
  { code: "TT", name: "Trinidad and Tobago", flag: "🇹🇹" },
  { code: "LC", name: "Saint Lucia", flag: "🇱🇨" },
  { code: "GD", name: "Grenada", flag: "🇬🇩" },
  { code: "VC", name: "Saint Vincent and the Grenadines", flag: "🇻🇨" },
  { code: "DM", name: "Dominica", flag: "🇩🇲" },
  { code: "AG", name: "Antigua and Barbuda", flag: "🇦🇬" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "CO", name: "Colombia", flag: "🇨🇴" },
  { code: "PE", name: "Peru", flag: "🇵🇪" },
  { code: "VE", name: "Venezuela", flag: "🇻🇪" },
  { code: "BO", name: "Bolivia", flag: "🇧🇴" },
  { code: "EC", name: "Ecuador", flag: "🇪🇨" },
  { code: "PY", name: "Paraguay", flag: "🇵🇾" },
  { code: "AR", name: "Argentina", flag: "🇦🇷" },
  { code: "CL", name: "Chile", flag: "🇨🇱" },
  { code: "GY", name: "Guyana", flag: "🇬🇾" },
  { code: "SR", name: "Suriname", flag: "🇸🇷" },
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "PT", name: "Portugal", flag: "🇵🇹" },
  { code: "GR", name: "Greece", flag: "🇬🇷" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "NZ", name: "New Zealand", flag: "🇳🇿" },
];

export const CITIES_BY_COUNTRY: Record<string, CityPreset[]> = {
  IN: [
    { id: "new-delhi", city: "New Delhi", lat: 28.6139, lon: 77.209, primaryRisks: ["heat", "air", "vector"] },
  ],
  BD: [
    { id: "dhaka", city: "Dhaka", lat: 23.8103, lon: 90.4125, primaryRisks: ["flood", "heat", "vector"] },
    { id: "chattogram", city: "Chattogram", lat: 22.3569, lon: 91.7832, primaryRisks: ["cyclone", "flood"] },
    { id: "khulna", city: "Khulna", lat: 22.8456, lon: 89.5403, primaryRisks: ["flood", "salinity"] },
    { id: "sylhet", city: "Sylhet", lat: 24.8949, lon: 91.8687, primaryRisks: ["flood", "landslide"] },
    { id: "barishal", city: "Barishal", lat: 22.701, lon: 90.3535, primaryRisks: ["cyclone", "flood"] },
  ],
  PK: [
    { id: "karachi", city: "Karachi", lat: 24.8607, lon: 67.0011, primaryRisks: ["heat", "flood", "air"] },
    { id: "lahore", city: "Lahore", lat: 31.5204, lon: 74.3587, primaryRisks: ["heat", "air", "smog"] },
    { id: "islamabad", city: "Islamabad", lat: 33.6844, lon: 73.0479, primaryRisks: ["heat", "flood"] },
    { id: "multan", city: "Multan", lat: 30.1575, lon: 71.5249, primaryRisks: ["heat", "dust"] },
    { id: "hyderabad-pk", city: "Hyderabad", lat: 25.396, lon: 68.3578, primaryRisks: ["heat", "flood"] },
  ],
  NP: [
    { id: "kathmandu", city: "Kathmandu", lat: 27.7172, lon: 85.324, primaryRisks: ["heat", "air", "flood"] },
    { id: "pokhara", city: "Pokhara", lat: 28.2096, lon: 83.9856, primaryRisks: ["flood", "landslide"] },
    { id: "biratnagar", city: "Biratnagar", lat: 26.4525, lon: 87.2718, primaryRisks: ["heat", "flood"] },
  ],
  LK: [
    { id: "colombo", city: "Colombo", lat: 6.9271, lon: 79.8612, primaryRisks: ["flood", "heat", "vector"] },
    { id: "jaffna", city: "Jaffna", lat: 9.6615, lon: 80.0255, primaryRisks: ["drought", "heat"] },
    { id: "galle", city: "Galle", lat: 6.0535, lon: 80.221, primaryRisks: ["flood", "cyclone"] },
    { id: "batticaloa", city: "Batticaloa", lat: 7.7102, lon: 81.6924, primaryRisks: ["flood", "cyclone"] },
  ],
  MM: [
    { id: "yangon", city: "Yangon", lat: 16.8661, lon: 96.1951, primaryRisks: ["flood", "heat", "vector"] },
    { id: "mandalay", city: "Mandalay", lat: 21.9588, lon: 96.0891, primaryRisks: ["heat", "drought"] },
    { id: "sittwe", city: "Sittwe", lat: 20.146, lon: 92.8984, primaryRisks: ["cyclone", "flood"] },
  ],
  BT: [
    { id: "thimphu", city: "Thimphu", lat: 27.4728, lon: 89.639, primaryRisks: ["flood", "landslide", "glacial"] },
  ],
  AF: [
    { id: "kabul", city: "Kabul", lat: 34.5553, lon: 69.2075, primaryRisks: ["drought", "heat", "air"] },
    { id: "herat", city: "Herat", lat: 34.3482, lon: 62.1997, primaryRisks: ["drought", "dust"] },
    { id: "kandahar", city: "Kandahar", lat: 31.6289, lon: 65.7372, primaryRisks: ["heat", "drought"] },
  ],
  PH: [
    { id: "manila", city: "Manila", lat: 14.5995, lon: 120.9842, primaryRisks: ["flood", "heat", "typhoon"] },
    { id: "cebu", city: "Cebu City", lat: 10.3157, lon: 123.8854, primaryRisks: ["typhoon", "flood"] },
    { id: "davao", city: "Davao City", lat: 7.1907, lon: 125.4553, primaryRisks: ["flood", "heat"] },
    { id: "tacloban", city: "Tacloban", lat: 11.251, lon: 125.004, primaryRisks: ["typhoon", "storm-surge"] },
    { id: "iloilo", city: "Iloilo City", lat: 10.7202, lon: 122.5621, primaryRisks: ["flood", "typhoon"] },
  ],
  ID: [
    { id: "jakarta", city: "Jakarta", lat: -6.2088, lon: 106.8456, primaryRisks: ["flood", "heat", "air"] },
    { id: "surabaya", city: "Surabaya", lat: -7.2575, lon: 112.7521, primaryRisks: ["flood", "heat"] },
    { id: "medan", city: "Medan", lat: 3.5952, lon: 98.6722, primaryRisks: ["flood", "heat"] },
    { id: "makassar", city: "Makassar", lat: -5.1477, lon: 119.4327, primaryRisks: ["flood", "heat"] },
    { id: "denpasar", city: "Denpasar", lat: -8.6705, lon: 115.2126, primaryRisks: ["heat", "water"] },
    { id: "semarang", city: "Semarang", lat: -6.9667, lon: 110.4167, primaryRisks: ["flood", "subsidence"] },
  ],
  VN: [
    { id: "ho-chi-minh-city", city: "Ho Chi Minh City", lat: 10.8231, lon: 106.6297, primaryRisks: ["flood", "heat", "vector"] },
    { id: "hanoi", city: "Hanoi", lat: 21.0278, lon: 105.8342, primaryRisks: ["heat", "air", "flood"] },
    { id: "da-nang", city: "Da Nang", lat: 16.0544, lon: 108.2022, primaryRisks: ["typhoon", "flood"] },
    { id: "can-tho", city: "Can Tho", lat: 10.0452, lon: 105.7469, primaryRisks: ["flood", "salinity"] },
    { id: "hai-phong", city: "Hai Phong", lat: 20.8449, lon: 106.6881, primaryRisks: ["typhoon", "flood"] },
  ],
  TH: [
    { id: "bangkok", city: "Bangkok", lat: 13.7563, lon: 100.5018, primaryRisks: ["flood", "heat", "vector"] },
    { id: "chiang-mai", city: "Chiang Mai", lat: 18.7883, lon: 98.9853, primaryRisks: ["air", "heat", "haze"] },
    { id: "hat-yai", city: "Hat Yai", lat: 7.0061, lon: 100.469, primaryRisks: ["flood"] },
    { id: "khon-kaen", city: "Khon Kaen", lat: 16.4322, lon: 102.8236, primaryRisks: ["heat", "drought"] },
  ],
  KH: [
    { id: "phnom-penh", city: "Phnom Penh", lat: 11.5564, lon: 104.9282, primaryRisks: ["flood", "heat"] },
    { id: "siem-reap", city: "Siem Reap", lat: 13.3633, lon: 103.8564, primaryRisks: ["flood", "heat"] },
    { id: "battambang", city: "Battambang", lat: 13.1023, lon: 103.198, primaryRisks: ["flood", "drought"] },
  ],
  LA: [
    { id: "vientiane", city: "Vientiane", lat: 17.9757, lon: 102.6331, primaryRisks: ["flood", "heat"] },
    { id: "pakse", city: "Pakse", lat: 15.1202, lon: 105.8018, primaryRisks: ["flood", "heat"] },
    { id: "luang-prabang", city: "Luang Prabang", lat: 19.8845, lon: 102.1346, primaryRisks: ["flood", "haze"] },
  ],
  MY: [
    { id: "kuala-lumpur", city: "Kuala Lumpur", lat: 3.139, lon: 101.6869, primaryRisks: ["flood", "heat", "vector"] },
    { id: "george-town", city: "George Town", lat: 5.4164, lon: 100.3327, primaryRisks: ["flood", "heat"] },
    { id: "kota-kinabalu", city: "Kota Kinabalu", lat: 5.9804, lon: 116.0735, primaryRisks: ["flood", "heat"] },
  ],
  SG: [
    { id: "singapore", city: "Singapore", lat: 1.3521, lon: 103.8198, primaryRisks: ["heat", "vector", "flood"] },
  ],
  TL: [
    { id: "dili", city: "Dili", lat: -8.5569, lon: 125.5603, primaryRisks: ["drought", "flood", "heat"] },
  ],
  CN: [
    { id: "guangzhou", city: "Guangzhou", lat: 23.1291, lon: 113.2644, primaryRisks: ["heat", "flood", "air"] },
    { id: "shanghai", city: "Shanghai", lat: 31.2304, lon: 121.4737, primaryRisks: ["heat", "flood", "air"] },
    { id: "wuhan", city: "Wuhan", lat: 30.5928, lon: 114.3055, primaryRisks: ["heat", "flood"] },
    { id: "chongqing", city: "Chongqing", lat: 29.4316, lon: 106.9123, primaryRisks: ["heat", "air"] },
    { id: "shenzhen", city: "Shenzhen", lat: 22.5431, lon: 114.0579, primaryRisks: ["heat", "typhoon"] },
  ],
  MN: [
    { id: "ulaanbaatar", city: "Ulaanbaatar", lat: 47.8864, lon: 106.9057, primaryRisks: ["air", "cold", "dust"] },
    { id: "erdenet", city: "Erdenet", lat: 49.027, lon: 104.083, primaryRisks: ["air", "cold"] },
  ],
  JP: [
    { id: "tokyo", city: "Tokyo", lat: 35.6762, lon: 139.6503, primaryRisks: ["heat", "flood"] },
    { id: "osaka", city: "Osaka", lat: 34.6937, lon: 135.5023, primaryRisks: ["heat", "flood"] },
    { id: "fukuoka", city: "Fukuoka", lat: 33.5904, lon: 130.4017, primaryRisks: ["heat", "flood"] },
    { id: "naha", city: "Naha", lat: 26.2124, lon: 127.6809, primaryRisks: ["typhoon", "heat"] },
  ],
  KR: [
    { id: "seoul", city: "Seoul", lat: 37.5665, lon: 126.978, primaryRisks: ["heat", "air", "flood"] },
    { id: "busan", city: "Busan", lat: 35.1796, lon: 129.0756, primaryRisks: ["heat", "typhoon"] },
  ],
  MV: [
    { id: "male", city: "Malé", lat: 4.1755, lon: 73.5093, primaryRisks: ["sea-level", "heat", "water"] },
    { id: "addu-city", city: "Addu City", lat: -0.63, lon: 73.1, primaryRisks: ["sea-level", "heat"] },
  ],
  FJ: [
    { id: "suva", city: "Suva", lat: -18.1416, lon: 178.4419, primaryRisks: ["cyclone", "flood"] },
    { id: "lautoka", city: "Lautoka", lat: -17.6167, lon: 177.45, primaryRisks: ["cyclone", "flood"] },
    { id: "nadi", city: "Nadi", lat: -17.7765, lon: 177.4356, primaryRisks: ["cyclone", "flood"] },
  ],
  VU: [
    { id: "port-vila", city: "Port Vila", lat: -17.7333, lon: 168.3273, primaryRisks: ["cyclone", "quake", "sea-level"] },
  ],
  SB: [
    { id: "honiara", city: "Honiara", lat: -9.4456, lon: 159.9729, primaryRisks: ["cyclone", "flood", "sea-level"] },
  ],
  PG: [
    { id: "port-moresby", city: "Port Moresby", lat: -9.4438, lon: 147.1803, primaryRisks: ["heat", "flood", "vector"] },
    { id: "lae", city: "Lae", lat: -6.722, lon: 146.999, primaryRisks: ["flood", "heat"] },
  ],
  KI: [
    { id: "south-tarawa", city: "South Tarawa", lat: 1.4518, lon: 172.9717, primaryRisks: ["sea-level", "water", "heat"] },
  ],
  TV: [
    { id: "funafuti", city: "Funafuti", lat: -8.5243, lon: 179.1942, primaryRisks: ["sea-level", "water", "cyclone"] },
  ],
  TO: [
    { id: "nukualofa", city: "Nukuʻalofa", lat: -21.1394, lon: -175.2018, primaryRisks: ["cyclone", "sea-level"] },
  ],
  WS: [
    { id: "apia", city: "Apia", lat: -13.8333, lon: -171.7667, primaryRisks: ["cyclone", "flood"] },
  ],
  MH: [
    { id: "majuro", city: "Majuro", lat: 7.1167, lon: 171.3667, primaryRisks: ["sea-level", "water", "heat"] },
  ],
  FM: [
    { id: "palikir", city: "Palikir", lat: 6.9177, lon: 158.185, primaryRisks: ["typhoon", "sea-level"] },
  ],
  PW: [
    { id: "koror", city: "Koror", lat: 7.3419, lon: 134.479, primaryRisks: ["typhoon", "sea-level"] },
  ],
  NG: [
    { id: "lagos", city: "Lagos", lat: 6.5244, lon: 3.3792, primaryRisks: ["flood", "heat", "vector"] },
    { id: "kano", city: "Kano", lat: 12.0022, lon: 8.592, primaryRisks: ["heat", "drought"] },
    { id: "port-harcourt", city: "Port Harcourt", lat: 4.8156, lon: 7.0498, primaryRisks: ["flood", "heat"] },
    { id: "abuja", city: "Abuja", lat: 9.0765, lon: 7.3986, primaryRisks: ["heat", "flood"] },
    { id: "maiduguri", city: "Maiduguri", lat: 11.8311, lon: 13.151, primaryRisks: ["heat", "drought"] },
  ],
  GH: [
    { id: "accra", city: "Accra", lat: 5.6037, lon: -0.187, primaryRisks: ["flood", "heat", "vector"] },
    { id: "kumasi", city: "Kumasi", lat: 6.6885, lon: -1.6244, primaryRisks: ["flood", "heat"] },
    { id: "tamale", city: "Tamale", lat: 9.4034, lon: -0.8424, primaryRisks: ["heat", "drought"] },
  ],
  CI: [
    { id: "abidjan", city: "Abidjan", lat: 5.36, lon: -4.0083, primaryRisks: ["flood", "heat", "vector"] },
    { id: "bouake", city: "Bouaké", lat: 7.6906, lon: -5.03, primaryRisks: ["heat", "drought"] },
  ],
  SN: [
    { id: "dakar", city: "Dakar", lat: 14.7167, lon: -17.4677, primaryRisks: ["heat", "flood", "coastal"] },
    { id: "saint-louis", city: "Saint-Louis", lat: 16.0326, lon: -16.4818, primaryRisks: ["flood", "coastal", "heat"] },
  ],
  ML: [
    { id: "bamako", city: "Bamako", lat: 12.6392, lon: -8.0029, primaryRisks: ["heat", "flood", "dust"] },
    { id: "gao", city: "Gao", lat: 16.2717, lon: -0.0447, primaryRisks: ["heat", "drought"] },
    { id: "mopti", city: "Mopti", lat: 14.4843, lon: -4.182, primaryRisks: ["flood", "heat"] },
  ],
  BF: [
    { id: "ouagadougou", city: "Ouagadougou", lat: 12.3714, lon: -1.5197, primaryRisks: ["heat", "flood", "dust"] },
    { id: "bobo-dioulasso", city: "Bobo-Dioulasso", lat: 11.1784, lon: -4.2979, primaryRisks: ["heat", "drought"] },
  ],
  NE: [
    { id: "niamey", city: "Niamey", lat: 13.5127, lon: 2.1126, primaryRisks: ["heat", "flood", "dust"] },
    { id: "zinder", city: "Zinder", lat: 13.8072, lon: 8.9882, primaryRisks: ["heat", "drought"] },
  ],
  TD: [
    { id: "ndjamena", city: "N'Djamena", lat: 12.1348, lon: 15.0557, primaryRisks: ["heat", "flood", "dust"] },
    { id: "moundou", city: "Moundou", lat: 8.5667, lon: 16.0833, primaryRisks: ["flood", "heat"] },
  ],
  MR: [
    { id: "nouakchott", city: "Nouakchott", lat: 18.0735, lon: -15.9582, primaryRisks: ["heat", "dust", "coastal"] },
  ],
  GM: [
    { id: "banjul", city: "Banjul", lat: 13.4549, lon: -16.579, primaryRisks: ["flood", "heat", "coastal"] },
  ],
  GN: [
    { id: "conakry", city: "Conakry", lat: 9.6412, lon: -13.5784, primaryRisks: ["flood", "heat", "vector"] },
  ],
  GW: [
    { id: "bissau", city: "Bissau", lat: 11.8636, lon: -15.5984, primaryRisks: ["flood", "heat", "coastal"] },
  ],
  SL: [
    { id: "freetown", city: "Freetown", lat: 8.4657, lon: -13.2317, primaryRisks: ["flood", "landslide", "heat"] },
  ],
  LR: [
    { id: "monrovia", city: "Monrovia", lat: 6.3156, lon: -10.8074, primaryRisks: ["flood", "heat", "vector"] },
  ],
  BJ: [
    { id: "cotonou", city: "Cotonou", lat: 6.3703, lon: 2.3912, primaryRisks: ["flood", "heat", "coastal"] },
    { id: "porto-novo", city: "Porto-Novo", lat: 6.4969, lon: 2.6283, primaryRisks: ["flood", "heat"] },
  ],
  TG: [
    { id: "lome", city: "Lomé", lat: 6.1256, lon: 1.2254, primaryRisks: ["flood", "heat", "coastal"] },
  ],
  CM: [
    { id: "douala", city: "Douala", lat: 4.0511, lon: 9.7679, primaryRisks: ["flood", "heat", "vector"] },
    { id: "yaounde", city: "Yaoundé", lat: 3.848, lon: 11.5021, primaryRisks: ["flood", "heat"] },
    { id: "maroua", city: "Maroua", lat: 10.591, lon: 14.3158, primaryRisks: ["heat", "drought"] },
  ],
  CF: [
    { id: "bangui", city: "Bangui", lat: 4.3947, lon: 18.5582, primaryRisks: ["flood", "heat", "vector"] },
  ],
  CD: [
    { id: "kinshasa", city: "Kinshasa", lat: -4.4419, lon: 15.2663, primaryRisks: ["flood", "heat", "vector"] },
    { id: "lubumbashi", city: "Lubumbashi", lat: -11.6647, lon: 27.4794, primaryRisks: ["heat", "flood"] },
    { id: "goma", city: "Goma", lat: -1.6792, lon: 29.2228, primaryRisks: ["flood", "volcanic"] },
  ],
  CG: [
    { id: "brazzaville", city: "Brazzaville", lat: -4.2634, lon: 15.2429, primaryRisks: ["flood", "heat", "vector"] },
  ],
  GA: [
    { id: "libreville", city: "Libreville", lat: 0.4162, lon: 9.4673, primaryRisks: ["flood", "heat", "vector"] },
  ],
  AO: [
    { id: "luanda", city: "Luanda", lat: -8.839, lon: 13.2894, primaryRisks: ["heat", "flood", "water"] },
    { id: "huambo", city: "Huambo", lat: -12.7761, lon: 15.7392, primaryRisks: ["drought", "heat"] },
  ],
  KE: [
    { id: "nairobi", city: "Nairobi", lat: -1.2921, lon: 36.8219, primaryRisks: ["flood", "vector", "air"] },
    { id: "mombasa", city: "Mombasa", lat: -4.0435, lon: 39.6682, primaryRisks: ["heat", "flood", "vector"] },
    { id: "kisumu", city: "Kisumu", lat: -0.0917, lon: 34.768, primaryRisks: ["flood", "vector"] },
    { id: "eldoret", city: "Eldoret", lat: 0.5143, lon: 35.2698, primaryRisks: ["flood", "vector"] },
  ],
  ET: [
    { id: "addis-ababa", city: "Addis Ababa", lat: 9.032, lon: 38.7469, primaryRisks: ["flood", "air", "drought"] },
    { id: "dire-dawa", city: "Dire Dawa", lat: 9.6009, lon: 41.8501, primaryRisks: ["heat", "drought", "flood"] },
    { id: "mekelle", city: "Mekelle", lat: 13.4967, lon: 39.4753, primaryRisks: ["drought", "heat"] },
  ],
  SO: [
    { id: "mogadishu", city: "Mogadishu", lat: 2.0469, lon: 45.3182, primaryRisks: ["drought", "flood", "heat"] },
    { id: "hargeisa", city: "Hargeisa", lat: 9.56, lon: 44.065, primaryRisks: ["drought", "heat"] },
    { id: "kismayo", city: "Kismayo", lat: -0.3582, lon: 42.5454, primaryRisks: ["flood", "drought"] },
  ],
  DJ: [
    { id: "djibouti-city", city: "Djibouti City", lat: 11.5721, lon: 43.1456, primaryRisks: ["heat", "drought", "water"] },
  ],
  ER: [
    { id: "asmara", city: "Asmara", lat: 15.3229, lon: 38.9251, primaryRisks: ["drought", "heat"] },
  ],
  SS: [
    { id: "juba", city: "Juba", lat: 4.8594, lon: 31.5713, primaryRisks: ["flood", "heat", "vector"] },
  ],
  SD: [
    { id: "khartoum", city: "Khartoum", lat: 15.5007, lon: 32.5599, primaryRisks: ["heat", "flood", "dust"] },
    { id: "port-sudan", city: "Port Sudan", lat: 19.6158, lon: 37.2164, primaryRisks: ["heat", "coastal"] },
  ],
  UG: [
    { id: "kampala", city: "Kampala", lat: 0.3476, lon: 32.5825, primaryRisks: ["flood", "vector", "heat"] },
    { id: "gulu", city: "Gulu", lat: 2.7727, lon: 32.2881, primaryRisks: ["flood", "vector"] },
  ],
  TZ: [
    { id: "dar-es-salaam", city: "Dar es Salaam", lat: -6.7924, lon: 39.2083, primaryRisks: ["flood", "heat", "vector"] },
    { id: "dodoma", city: "Dodoma", lat: -6.163, lon: 35.7516, primaryRisks: ["drought", "heat"] },
    { id: "mwanza", city: "Mwanza", lat: -2.5164, lon: 32.9172, primaryRisks: ["flood", "vector"] },
  ],
  RW: [
    { id: "kigali", city: "Kigali", lat: -1.9441, lon: 30.0619, primaryRisks: ["flood", "vector", "landslide"] },
  ],
  BI: [
    { id: "bujumbura", city: "Bujumbura", lat: -3.3614, lon: 29.3599, primaryRisks: ["flood", "vector", "heat"] },
  ],
  MZ: [
    { id: "maputo", city: "Maputo", lat: -25.9692, lon: 32.5732, primaryRisks: ["cyclone", "flood", "heat"] },
    { id: "beira", city: "Beira", lat: -19.8333, lon: 34.85, primaryRisks: ["cyclone", "flood"] },
    { id: "nampula", city: "Nampula", lat: -15.1165, lon: 39.2666, primaryRisks: ["cyclone", "flood"] },
  ],
  MW: [
    { id: "lilongwe", city: "Lilongwe", lat: -13.9626, lon: 33.7741, primaryRisks: ["flood", "drought", "vector"] },
    { id: "blantyre", city: "Blantyre", lat: -15.7861, lon: 35.0058, primaryRisks: ["flood", "drought"] },
  ],
  ZM: [
    { id: "lusaka", city: "Lusaka", lat: -15.3875, lon: 28.3228, primaryRisks: ["heat", "drought", "cholera"] },
    { id: "ndola", city: "Ndola", lat: -12.9587, lon: 28.6366, primaryRisks: ["heat", "flood"] },
  ],
  ZW: [
    { id: "harare", city: "Harare", lat: -17.8252, lon: 31.0335, primaryRisks: ["drought", "heat", "water"] },
    { id: "bulawayo", city: "Bulawayo", lat: -20.148, lon: 28.581, primaryRisks: ["drought", "heat"] },
  ],
  ZA: [
    { id: "johannesburg", city: "Johannesburg", lat: -26.2041, lon: 28.0473, primaryRisks: ["heat", "air", "flood"] },
    { id: "cape-town", city: "Cape Town", lat: -33.9249, lon: 18.4241, primaryRisks: ["drought", "heat", "fire"] },
    { id: "durban", city: "Durban", lat: -29.8587, lon: 31.0218, primaryRisks: ["flood", "heat", "vector"] },
    { id: "pretoria", city: "Pretoria", lat: -25.7479, lon: 28.2293, primaryRisks: ["heat", "air"] },
  ],
  NA: [
    { id: "windhoek", city: "Windhoek", lat: -22.5609, lon: 17.0658, primaryRisks: ["drought", "heat", "water"] },
  ],
  BW: [
    { id: "gaborone", city: "Gaborone", lat: -24.6282, lon: 25.9231, primaryRisks: ["drought", "heat"] },
  ],
  MG: [
    { id: "antananarivo", city: "Antananarivo", lat: -18.8792, lon: 47.5079, primaryRisks: ["cyclone", "flood", "drought"] },
    { id: "toamasina", city: "Toamasina", lat: -18.1492, lon: 49.4023, primaryRisks: ["cyclone", "flood"] },
    { id: "mahajanga", city: "Mahajanga", lat: -15.7167, lon: 46.3167, primaryRisks: ["drought", "heat"] },
  ],
  KM: [
    { id: "moroni", city: "Moroni", lat: -11.7022, lon: 43.2551, primaryRisks: ["cyclone", "sea-level"] },
  ],
  MU: [
    { id: "port-louis", city: "Port Louis", lat: -20.1609, lon: 57.5012, primaryRisks: ["cyclone", "heat", "flood"] },
  ],
  SC: [
    { id: "victoria", city: "Victoria", lat: -4.6191, lon: 55.4513, primaryRisks: ["sea-level", "heat"] },
  ],
  CV: [
    { id: "praia", city: "Praia", lat: 14.9167, lon: -23.5167, primaryRisks: ["drought", "coastal"] },
  ],
  ST: [
    { id: "sao-tome", city: "São Tomé", lat: 0.3365, lon: 6.7273, primaryRisks: ["flood", "heat", "coastal"] },
  ],
  EG: [
    { id: "cairo", city: "Cairo", lat: 30.0444, lon: 31.2357, primaryRisks: ["heat", "air", "dust"] },
    { id: "alexandria", city: "Alexandria", lat: 31.2001, lon: 29.9187, primaryRisks: ["coastal", "heat", "flood"] },
    { id: "aswan", city: "Aswan", lat: 24.0889, lon: 32.8998, primaryRisks: ["heat", "dust"] },
  ],
  LY: [
    { id: "tripoli", city: "Tripoli", lat: 32.8872, lon: 13.1913, primaryRisks: ["heat", "dust"] },
    { id: "benghazi", city: "Benghazi", lat: 32.1167, lon: 20.0667, primaryRisks: ["heat", "flood"] },
  ],
  TN: [
    { id: "tunis", city: "Tunis", lat: 36.8065, lon: 10.1815, primaryRisks: ["heat", "drought", "coastal"] },
    { id: "sfax", city: "Sfax", lat: 34.7406, lon: 10.7603, primaryRisks: ["heat", "drought"] },
  ],
  DZ: [
    { id: "algiers", city: "Algiers", lat: 36.7538, lon: 3.0588, primaryRisks: ["heat", "flood", "coastal"] },
    { id: "oran", city: "Oran", lat: 35.6971, lon: -0.6308, primaryRisks: ["heat", "drought"] },
  ],
  MA: [
    { id: "casablanca", city: "Casablanca", lat: 33.5731, lon: -7.5898, primaryRisks: ["heat", "coastal", "flood"] },
    { id: "marrakesh", city: "Marrakesh", lat: 31.6295, lon: -7.9811, primaryRisks: ["heat", "drought"] },
    { id: "rabat", city: "Rabat", lat: 34.0209, lon: -6.8416, primaryRisks: ["heat", "coastal"] },
  ],
  IQ: [
    { id: "baghdad", city: "Baghdad", lat: 33.3152, lon: 44.3661, primaryRisks: ["heat", "dust", "drought"] },
    { id: "basra", city: "Basra", lat: 30.5081, lon: 47.7835, primaryRisks: ["heat", "dust", "water"] },
    { id: "mosul", city: "Mosul", lat: 36.34, lon: 43.13, primaryRisks: ["heat", "drought"] },
  ],
  YE: [
    { id: "sanaa", city: "Sana'a", lat: 15.3694, lon: 44.191, primaryRisks: ["heat", "water", "drought"] },
    { id: "aden", city: "Aden", lat: 12.7855, lon: 45.0187, primaryRisks: ["heat", "water", "coastal"] },
    { id: "hodeidah", city: "Al Hudaydah", lat: 14.8022, lon: 42.9511, primaryRisks: ["heat", "flood", "coastal"] },
  ],
  SY: [
    { id: "damascus", city: "Damascus", lat: 33.5138, lon: 36.2765, primaryRisks: ["heat", "drought", "dust"] },
    { id: "aleppo", city: "Aleppo", lat: 36.2021, lon: 37.1343, primaryRisks: ["heat", "drought"] },
  ],
  JO: [
    { id: "amman", city: "Amman", lat: 31.9539, lon: 35.9106, primaryRisks: ["heat", "water", "drought"] },
    { id: "aqaba", city: "Aqaba", lat: 29.5267, lon: 35.0067, primaryRisks: ["heat", "water"] },
  ],
  LB: [
    { id: "beirut", city: "Beirut", lat: 33.8938, lon: 35.5018, primaryRisks: ["heat", "flood", "coastal"] },
    { id: "tripoli-lb", city: "Tripoli", lat: 34.4367, lon: 35.8497, primaryRisks: ["heat", "flood"] },
  ],
  IR: [
    { id: "tehran", city: "Tehran", lat: 35.6892, lon: 51.389, primaryRisks: ["heat", "air", "dust"] },
    { id: "ahvaz", city: "Ahvaz", lat: 31.3183, lon: 48.6706, primaryRisks: ["heat", "dust"] },
    { id: "bandar-abbas", city: "Bandar Abbas", lat: 27.1865, lon: 56.2808, primaryRisks: ["heat", "humidity"] },
  ],
  OM: [
    { id: "muscat", city: "Muscat", lat: 23.588, lon: 58.3829, primaryRisks: ["heat", "cyclone", "coastal"] },
    { id: "salalah", city: "Salalah", lat: 17.0151, lon: 54.0924, primaryRisks: ["heat", "cyclone"] },
  ],
  AE: [
    { id: "dubai", city: "Dubai", lat: 25.2048, lon: 55.2708, primaryRisks: ["heat", "humidity", "dust"] },
    { id: "abu-dhabi", city: "Abu Dhabi", lat: 24.4539, lon: 54.3773, primaryRisks: ["heat", "humidity"] },
  ],
  SA: [
    { id: "jeddah", city: "Jeddah", lat: 21.4858, lon: 39.1925, primaryRisks: ["heat", "humidity", "flood"] },
    { id: "riyadh", city: "Riyadh", lat: 24.7136, lon: 46.6753, primaryRisks: ["heat", "dust"] },
  ],
  KW: [
    { id: "kuwait-city", city: "Kuwait City", lat: 29.3759, lon: 47.9774, primaryRisks: ["heat", "dust"] },
  ],
  BH: [
    { id: "manama", city: "Manama", lat: 26.2285, lon: 50.586, primaryRisks: ["heat", "humidity", "sea-level"] },
  ],
  QA: [
    { id: "doha", city: "Doha", lat: 25.2854, lon: 51.531, primaryRisks: ["heat", "humidity"] },
  ],
  TR: [
    { id: "istanbul", city: "Istanbul", lat: 41.0082, lon: 28.9784, primaryRisks: ["heat", "flood", "quake"] },
    { id: "ankara", city: "Ankara", lat: 39.9334, lon: 32.8597, primaryRisks: ["heat", "drought"] },
    { id: "izmir", city: "İzmir", lat: 38.4237, lon: 27.1428, primaryRisks: ["heat", "wildfire"] },
  ],
  TJ: [
    { id: "dushanbe", city: "Dushanbe", lat: 38.5598, lon: 68.7738, primaryRisks: ["heat", "glacial", "dust"] },
    { id: "khujand", city: "Khujand", lat: 40.2826, lon: 69.6222, primaryRisks: ["heat", "dust"] },
  ],
  UZ: [
    { id: "tashkent", city: "Tashkent", lat: 41.2995, lon: 69.2401, primaryRisks: ["heat", "dust", "drought"] },
    { id: "samarkand", city: "Samarkand", lat: 39.6542, lon: 66.9597, primaryRisks: ["heat", "drought"] },
  ],
  KG: [
    { id: "bishkek", city: "Bishkek", lat: 42.8746, lon: 74.5698, primaryRisks: ["heat", "air", "glacial"] },
  ],
  TM: [
    { id: "ashgabat", city: "Ashgabat", lat: 37.9601, lon: 58.3261, primaryRisks: ["heat", "dust", "drought"] },
  ],
  MX: [
    { id: "mexico-city", city: "Mexico City", lat: 19.4326, lon: -99.1332, primaryRisks: ["air", "heat", "flood"] },
    { id: "monterrey", city: "Monterrey", lat: 25.6866, lon: -100.3161, primaryRisks: ["heat", "drought"] },
    { id: "guadalajara", city: "Guadalajara", lat: 20.6597, lon: -103.3496, primaryRisks: ["heat", "flood"] },
    { id: "merida", city: "Mérida", lat: 20.9674, lon: -89.5926, primaryRisks: ["heat", "vector"] },
    { id: "tijuana", city: "Tijuana", lat: 32.5149, lon: -117.0382, primaryRisks: ["heat", "drought"] },
  ],
  GT: [
    { id: "guatemala-city", city: "Guatemala City", lat: 14.6349, lon: -90.5069, primaryRisks: ["flood", "landslide", "heat"] },
    { id: "escuintla", city: "Escuintla", lat: 14.305, lon: -90.785, primaryRisks: ["flood", "heat"] },
  ],
  HN: [
    { id: "tegucigalpa", city: "Tegucigalpa", lat: 14.0723, lon: -87.1921, primaryRisks: ["flood", "heat", "vector"] },
    { id: "san-pedro-sula", city: "San Pedro Sula", lat: 15.504, lon: -88.025, primaryRisks: ["flood", "heat"] },
    { id: "la-ceiba", city: "La Ceiba", lat: 15.7833, lon: -86.7919, primaryRisks: ["flood", "hurricane"] },
  ],
  SV: [
    { id: "san-salvador", city: "San Salvador", lat: 13.6929, lon: -89.2182, primaryRisks: ["heat", "flood", "quake"] },
  ],
  NI: [
    { id: "managua", city: "Managua", lat: 12.1149, lon: -86.2362, primaryRisks: ["heat", "flood", "quake"] },
    { id: "bluefields", city: "Bluefields", lat: 12.0136, lon: -83.755, primaryRisks: ["hurricane", "flood"] },
  ],
  CR: [
    { id: "san-jose", city: "San José", lat: 9.9281, lon: -84.0907, primaryRisks: ["flood", "heat", "vector"] },
    { id: "limon", city: "Limón", lat: 9.9907, lon: -83.036, primaryRisks: ["flood", "vector"] },
  ],
  PA: [
    { id: "panama-city", city: "Panama City", lat: 8.9824, lon: -79.5199, primaryRisks: ["flood", "heat", "vector"] },
    { id: "david", city: "David", lat: 8.4333, lon: -82.4333, primaryRisks: ["flood", "heat"] },
  ],
  BZ: [
    { id: "belize-city", city: "Belize City", lat: 17.5046, lon: -88.1962, primaryRisks: ["hurricane", "flood", "sea-level"] },
  ],
  CU: [
    { id: "havana", city: "Havana", lat: 23.1136, lon: -82.3666, primaryRisks: ["hurricane", "heat", "coastal"] },
    { id: "santiago-de-cuba", city: "Santiago de Cuba", lat: 20.0169, lon: -75.83, primaryRisks: ["hurricane", "heat"] },
  ],
  HT: [
    { id: "port-au-prince", city: "Port-au-Prince", lat: 18.5944, lon: -72.3074, primaryRisks: ["hurricane", "flood", "heat"] },
    { id: "cap-haitien", city: "Cap-Haïtien", lat: 19.759, lon: -72.201, primaryRisks: ["hurricane", "flood"] },
    { id: "les-cayes", city: "Les Cayes", lat: 18.1931, lon: -73.746, primaryRisks: ["hurricane", "flood"] },
  ],
  DO: [
    { id: "santo-domingo", city: "Santo Domingo", lat: 18.4861, lon: -69.9312, primaryRisks: ["hurricane", "flood", "heat"] },
    { id: "santiago", city: "Santiago de los Caballeros", lat: 19.4517, lon: -70.697, primaryRisks: ["flood", "heat"] },
  ],
  JM: [
    { id: "kingston", city: "Kingston", lat: 18.0179, lon: -76.8099, primaryRisks: ["hurricane", "heat", "flood"] },
    { id: "montego-bay", city: "Montego Bay", lat: 18.4762, lon: -77.8939, primaryRisks: ["hurricane", "flood"] },
  ],
  BS: [
    { id: "nassau", city: "Nassau", lat: 25.048, lon: -77.3554, primaryRisks: ["hurricane", "sea-level"] },
    { id: "freeport", city: "Freeport", lat: 26.5333, lon: -78.7, primaryRisks: ["hurricane", "sea-level"] },
  ],
  BB: [
    { id: "bridgetown", city: "Bridgetown", lat: 13.0975, lon: -59.6167, primaryRisks: ["hurricane", "sea-level", "heat"] },
  ],
  TT: [
    { id: "port-of-spain", city: "Port of Spain", lat: 10.6549, lon: -61.5019, primaryRisks: ["flood", "heat", "vector"] },
  ],
  LC: [
    { id: "castries", city: "Castries", lat: 14.0101, lon: -60.9875, primaryRisks: ["hurricane", "flood"] },
  ],
  GD: [
    { id: "st-georges", city: "St. George's", lat: 12.0564, lon: -61.7486, primaryRisks: ["hurricane", "flood"] },
  ],
  VC: [
    { id: "kingstown", city: "Kingstown", lat: 13.16, lon: -61.2248, primaryRisks: ["hurricane", "volcanic"] },
  ],
  DM: [
    { id: "roseau", city: "Roseau", lat: 15.3092, lon: -61.3794, primaryRisks: ["hurricane", "flood", "landslide"] },
  ],
  AG: [
    { id: "st-johns", city: "St. John's", lat: 17.1274, lon: -61.8468, primaryRisks: ["hurricane", "sea-level"] },
  ],
  BR: [
    { id: "sao-paulo", city: "São Paulo", lat: -23.5505, lon: -46.6333, primaryRisks: ["flood", "heat", "air"] },
    { id: "rio-de-janeiro", city: "Rio de Janeiro", lat: -22.9068, lon: -43.1729, primaryRisks: ["heat", "flood", "vector"] },
    { id: "manaus", city: "Manaus", lat: -3.119, lon: -60.0217, primaryRisks: ["heat", "vector", "smoke"] },
    { id: "recife", city: "Recife", lat: -8.0476, lon: -34.877, primaryRisks: ["flood", "heat", "vector"] },
    { id: "fortaleza", city: "Fortaleza", lat: -3.7172, lon: -38.5433, primaryRisks: ["drought", "heat", "flood"] },
    { id: "belem", city: "Belém", lat: -1.4558, lon: -48.4902, primaryRisks: ["flood", "vector", "heat"] },
  ],
  CO: [
    { id: "bogota", city: "Bogotá", lat: 4.711, lon: -74.0721, primaryRisks: ["flood", "air", "vector"] },
    { id: "barranquilla", city: "Barranquilla", lat: 10.9685, lon: -74.7813, primaryRisks: ["heat", "flood", "vector"] },
    { id: "cali", city: "Cali", lat: 3.4516, lon: -76.532, primaryRisks: ["heat", "flood", "vector"] },
    { id: "cartagena", city: "Cartagena", lat: 10.391, lon: -75.4794, primaryRisks: ["heat", "coastal", "flood"] },
  ],
  PE: [
    { id: "lima", city: "Lima", lat: -12.0464, lon: -77.0428, primaryRisks: ["air", "water", "heat"] },
    { id: "iquitos", city: "Iquitos", lat: -3.7437, lon: -73.2516, primaryRisks: ["flood", "vector", "heat"] },
    { id: "arequipa", city: "Arequipa", lat: -16.409, lon: -71.5375, primaryRisks: ["drought", "dust"] },
    { id: "piura", city: "Piura", lat: -5.1945, lon: -80.6328, primaryRisks: ["flood", "heat", "el-nino"] },
  ],
  VE: [
    { id: "caracas", city: "Caracas", lat: 10.4806, lon: -66.9036, primaryRisks: ["flood", "heat", "vector"] },
    { id: "maracaibo", city: "Maracaibo", lat: 10.6666, lon: -71.6125, primaryRisks: ["heat", "drought"] },
    { id: "ciudad-guayana", city: "Ciudad Guayana", lat: 8.3114, lon: -62.7181, primaryRisks: ["flood", "heat"] },
  ],
  BO: [
    { id: "la-paz", city: "La Paz", lat: -16.4897, lon: -68.1193, primaryRisks: ["flood", "cold", "air"] },
    { id: "santa-cruz", city: "Santa Cruz de la Sierra", lat: -17.8146, lon: -63.1561, primaryRisks: ["heat", "flood", "smoke"] },
    { id: "cochabamba", city: "Cochabamba", lat: -17.3895, lon: -66.1568, primaryRisks: ["drought", "air"] },
  ],
  EC: [
    { id: "guayaquil", city: "Guayaquil", lat: -2.1894, lon: -79.8891, primaryRisks: ["flood", "heat", "vector"] },
    { id: "quito", city: "Quito", lat: -0.1807, lon: -78.4678, primaryRisks: ["air", "flood"] },
    { id: "esmeraldas", city: "Esmeraldas", lat: 0.9592, lon: -79.6539, primaryRisks: ["flood", "coastal"] },
  ],
  PY: [
    { id: "asuncion", city: "Asunción", lat: -25.2637, lon: -57.5759, primaryRisks: ["heat", "flood", "vector"] },
    { id: "ciudad-del-este", city: "Ciudad del Este", lat: -25.5097, lon: -54.6112, primaryRisks: ["heat", "flood"] },
  ],
  AR: [
    { id: "buenos-aires", city: "Buenos Aires", lat: -34.6037, lon: -58.3816, primaryRisks: ["heat", "flood"] },
    { id: "cordoba", city: "Córdoba", lat: -31.4201, lon: -64.1888, primaryRisks: ["heat", "drought"] },
    { id: "rosario", city: "Rosario", lat: -32.9442, lon: -60.6505, primaryRisks: ["heat", "flood"] },
  ],
  CL: [
    { id: "santiago", city: "Santiago", lat: -33.4489, lon: -70.6693, primaryRisks: ["air", "drought", "heat"] },
    { id: "antofagasta", city: "Antofagasta", lat: -23.65, lon: -70.4, primaryRisks: ["drought", "heat"] },
    { id: "valparaiso", city: "Valparaíso", lat: -33.0472, lon: -71.6127, primaryRisks: ["wildfire", "coastal"] },
  ],
  GY: [
    { id: "georgetown", city: "Georgetown", lat: 6.8013, lon: -58.1551, primaryRisks: ["flood", "sea-level", "vector"] },
  ],
  SR: [
    { id: "paramaribo", city: "Paramaribo", lat: 5.852, lon: -55.2038, primaryRisks: ["flood", "heat", "vector"] },
  ],
  US: [
    { id: "houston", city: "Houston", lat: 29.7604, lon: -95.3698, primaryRisks: ["heat", "flood", "hurricane"] },
    { id: "phoenix", city: "Phoenix", lat: 33.4484, lon: -112.074, primaryRisks: ["heat", "drought"] },
    { id: "miami", city: "Miami", lat: 25.7617, lon: -80.1918, primaryRisks: ["hurricane", "heat", "sea-level"] },
    { id: "new-orleans", city: "New Orleans", lat: 29.9511, lon: -90.0715, primaryRisks: ["hurricane", "flood", "heat"] },
    { id: "los-angeles", city: "Los Angeles", lat: 34.0522, lon: -118.2437, primaryRisks: ["heat", "air", "wildfire"] },
  ],
  CA: [
    { id: "toronto", city: "Toronto", lat: 43.6532, lon: -79.3832, primaryRisks: ["heat", "flood", "air"] },
    { id: "vancouver", city: "Vancouver", lat: 49.2827, lon: -123.1207, primaryRisks: ["heat", "wildfire", "air"] },
    { id: "montreal", city: "Montreal", lat: 45.5017, lon: -73.5673, primaryRisks: ["heat", "flood"] },
  ],
  GB: [
    { id: "london", city: "London", lat: 51.5074, lon: -0.1278, primaryRisks: ["heat", "flood", "air"] },
    { id: "manchester", city: "Manchester", lat: 53.4808, lon: -2.2426, primaryRisks: ["flood", "heat"] },
    { id: "glasgow", city: "Glasgow", lat: 55.8642, lon: -4.2518, primaryRisks: ["flood", "heat"] },
  ],
  FR: [
    { id: "paris", city: "Paris", lat: 48.8566, lon: 2.3522, primaryRisks: ["heat", "air"] },
    { id: "marseille", city: "Marseille", lat: 43.2965, lon: 5.3698, primaryRisks: ["heat", "wildfire"] },
    { id: "lyon", city: "Lyon", lat: 45.764, lon: 4.8357, primaryRisks: ["heat", "air"] },
  ],
  DE: [
    { id: "berlin", city: "Berlin", lat: 52.52, lon: 13.405, primaryRisks: ["heat", "flood"] },
    { id: "cologne", city: "Cologne", lat: 50.9375, lon: 6.9603, primaryRisks: ["flood", "heat"] },
    { id: "munich", city: "Munich", lat: 48.1351, lon: 11.582, primaryRisks: ["heat", "flood"] },
  ],
  ES: [
    { id: "seville", city: "Seville", lat: 37.3891, lon: -5.9845, primaryRisks: ["heat", "drought"] },
    { id: "madrid", city: "Madrid", lat: 40.4168, lon: -3.7038, primaryRisks: ["heat", "air"] },
    { id: "barcelona", city: "Barcelona", lat: 41.3874, lon: 2.1686, primaryRisks: ["heat", "flood"] },
    { id: "valencia", city: "Valencia", lat: 39.4699, lon: -0.3763, primaryRisks: ["flood", "heat"] },
  ],
  IT: [
    { id: "rome", city: "Rome", lat: 41.9028, lon: 12.4964, primaryRisks: ["heat", "flood"] },
    { id: "milan", city: "Milan", lat: 45.4642, lon: 9.19, primaryRisks: ["heat", "air"] },
    { id: "naples", city: "Naples", lat: 40.8518, lon: 14.2681, primaryRisks: ["heat", "flood"] },
    { id: "palermo", city: "Palermo", lat: 38.1157, lon: 13.3615, primaryRisks: ["heat", "drought"] },
  ],
  PT: [
    { id: "lisbon", city: "Lisbon", lat: 38.7223, lon: -9.1393, primaryRisks: ["heat", "wildfire"] },
    { id: "porto", city: "Porto", lat: 41.1579, lon: -8.6291, primaryRisks: ["heat", "flood"] },
    { id: "faro", city: "Faro", lat: 37.0194, lon: -7.9322, primaryRisks: ["heat", "drought", "wildfire"] },
  ],
  GR: [
    { id: "athens", city: "Athens", lat: 37.9838, lon: 23.7275, primaryRisks: ["heat", "wildfire", "air"] },
    { id: "thessaloniki", city: "Thessaloniki", lat: 40.6401, lon: 22.9444, primaryRisks: ["heat", "flood"] },
    { id: "heraklion", city: "Heraklion", lat: 35.3387, lon: 25.1442, primaryRisks: ["heat", "drought"] },
  ],
  AU: [
    { id: "sydney", city: "Sydney", lat: -33.8688, lon: 151.2093, primaryRisks: ["heat", "flood", "fire"] },
    { id: "melbourne", city: "Melbourne", lat: -37.8136, lon: 144.9631, primaryRisks: ["heat", "fire"] },
    { id: "brisbane", city: "Brisbane", lat: -27.4698, lon: 153.0251, primaryRisks: ["heat", "flood"] },
    { id: "perth", city: "Perth", lat: -31.9505, lon: 115.8605, primaryRisks: ["heat", "drought"] },
    { id: "darwin", city: "Darwin", lat: -12.4634, lon: 130.8456, primaryRisks: ["heat", "cyclone"] },
  ],
  NZ: [
    { id: "auckland", city: "Auckland", lat: -36.8485, lon: 174.7633, primaryRisks: ["flood", "heat"] },
    { id: "wellington", city: "Wellington", lat: -41.2865, lon: 174.7762, primaryRisks: ["flood", "quake"] },
  ],
};

export function getCitiesForCountry(code: string): CityPreset[] {
  return CITIES_BY_COUNTRY[code.toUpperCase()] ?? [];
}

export function getCityPreset(code: string, cityId?: string): CityPreset | undefined {
  const cities = getCitiesForCountry(code);
  if (!cities.length) return undefined;
  if (!cityId) return cities[0];
  return cities.find((c) => c.id === cityId) ?? cities[0];
}

/** First/default city per country (API and legacy callers). */
export const CITY_BY_COUNTRY: Record<string, { city: string; lat: number; lon: number }> =
  Object.fromEntries(
    Object.entries(CITIES_BY_COUNTRY).map(([code, cities]) => [
      code,
      { city: cities[0].city, lat: cities[0].lat, lon: cities[0].lon },
    ])
  );

export const CITY_COUNT = Object.values(CITIES_BY_COUNTRY).reduce(
  (sum, cities) => sum + cities.length,
  0
);
