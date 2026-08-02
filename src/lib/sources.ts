import type { DataSource } from "./types";

/**
 * Validated / trusted public data feeds and reference frameworks
 * used by the agent pipeline and report provenance.
 *
 * Live fetch today: Open-Meteo forecast + air quality.
 * Remaining entries are authoritative reference sources that
 * ground heuristics, India CHIS notes, and UN-aligned framing.
 */
export const TRUSTED_SOURCES: DataSource[] = [
  // —— Live operational feeds ——
  {
    id: "open-meteo",
    name: "Open-Meteo Forecast API",
    url: "https://open-meteo.com/en/docs",
    authenticated: false,
  },
  {
    id: "open-meteo-air",
    name: "Open-Meteo Air Quality API",
    url: "https://open-meteo.com/en/docs/air-quality-api",
    authenticated: false,
  },
  {
    id: "copernicus-cds",
    name: "Copernicus Climate Data Store (ERA5 / seasonal)",
    url: "https://cds.climate.copernicus.eu/",
    authenticated: false,
  },
  {
    id: "nasa-power",
    name: "NASA POWER Agroclimatology API",
    url: "https://power.larc.nasa.gov/",
    authenticated: false,
  },
  {
    id: "chirps-rainfall",
    name: "CHIRPS Rainfall Estimates (UCSB / USGS)",
    url: "https://www.chc.ucsb.edu/data/chirps",
    authenticated: false,
  },
  {
    id: "ecmwf",
    name: "ECMWF Open Data & Forecasts",
    url: "https://www.ecmwf.int/en/forecasts/datasets",
    authenticated: false,
  },
  {
    id: "noaa-cpc",
    name: "NOAA Climate Prediction Center",
    url: "https://www.cpc.ncep.noaa.gov/",
    authenticated: false,
  },

  // —— UN / multilateral health & climate ——
  {
    id: "who-guidance",
    name: "WHO Climate Change & Health",
    url: "https://www.who.int/health-topics/climate-change",
    authenticated: false,
  },
  {
    id: "who-heat-health",
    name: "WHO Heat–Health Guidance",
    url: "https://www.who.int/teams/environment-climate-change-and-health/climate-change-and-health",
    authenticated: false,
  },
  {
    id: "who-wash",
    name: "WHO Water, Sanitation and Hygiene (WASH)",
    url: "https://www.who.int/teams/environment-climate-change-and-health/water-sanitation-and-health",
    authenticated: false,
  },
  {
    id: "who-gho",
    name: "WHO Global Health Observatory",
    url: "https://www.who.int/data/gho",
    authenticated: false,
  },
  {
    id: "who-traditional-medicine",
    name: "WHO Traditional, Complementary and Integrative Medicine",
    url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine",
    authenticated: false,
  },
  {
    id: "unicef-climate-child",
    name: "UNICEF Children's Climate Risk Index (CCRI)",
    url: "https://www.unicef.org/reports/climate-crisis-child-rights-crisis",
    authenticated: false,
  },
  {
    id: "unicef-wash",
    name: "UNICEF Water, Sanitation and Hygiene",
    url: "https://www.unicef.org/wash",
    authenticated: false,
  },
  {
    id: "unicef-mics",
    name: "UNICEF Multiple Indicator Cluster Surveys (MICS)",
    url: "https://mics.unicef.org/",
    authenticated: false,
  },
  {
    id: "undrr-sendai",
    name: "UNDRR Sendai Framework / Disaster Risk Knowledge",
    url: "https://www.undrr.org/",
    authenticated: false,
  },
  {
    id: "wmo-climate",
    name: "WMO Climate & Early Warning Services",
    url: "https://wmo.int/",
    authenticated: false,
  },
  {
    id: "ipcc-ar6",
    name: "IPCC AR6 Climate Change Assessment",
    url: "https://www.ipcc.ch/assessment-report/ar6/",
    authenticated: false,
  },
  {
    id: "undp-human-climate",
    name: "UNDP Climate & Human Development",
    url: "https://www.undp.org/climate",
    authenticated: false,
  },
  {
    id: "unhabitat-cities",
    name: "UN-Habitat Urban Climate Resilience",
    url: "https://unhabitat.org/",
    authenticated: false,
  },
  {
    id: "inform-risk",
    name: "European Commission INFORM Risk Index",
    url: "https://drmkc.jrc.ec.europa.eu/inform-index",
    authenticated: false,
  },
  {
    id: "nd-gain",
    name: "Notre Dame Global Adaptation Initiative (ND-GAIN)",
    url: "https://gain.nd.edu/",
    authenticated: false,
  },
  {
    id: "reliefweb",
    name: "UN OCHA ReliefWeb Crisis & Disaster Updates",
    url: "https://reliefweb.int/",
    authenticated: false,
  },
  {
    id: "fews-net",
    name: "FEWS NET Food Security Early Warning",
    url: "https://fews.net/",
    authenticated: false,
  },
  {
    id: "acaps",
    name: "ACAPS Humanitarian Needs Analysis",
    url: "https://www.acaps.org/",
    authenticated: false,
  },
  {
    id: "unhcr-climate",
    name: "UNHCR Climate Change & Displacement",
    url: "https://www.unhcr.org/what-we-do/build-better-futures/climate-change-and-displacement",
    authenticated: false,
  },
  {
    id: "iom-dtm",
    name: "IOM Displacement Tracking Matrix",
    url: "https://dtm.iom.int/",
    authenticated: false,
  },
  {
    id: "ghews",
    name: "FAO GIEWS Global Information & Early Warning System",
    url: "https://www.fao.org/giews/en/",
    authenticated: false,
  },
  {
    id: "climateserv",
    name: "SERVIR / ClimateSERV Earth Observation",
    url: "https://climateserv.servirglobal.net/",
    authenticated: false,
  },

  // —— Food security & nutrition ——
  {
    id: "fao-food-security",
    name: "FAO Food Security & Climate",
    url: "https://www.fao.org/climate-change/en/",
    authenticated: false,
  },
  {
    id: "wfp-hunger",
    name: "WFP Hunger Monitoring / Climate Risk",
    url: "https://www.wfp.org/",
    authenticated: false,
  },
  {
    id: "ipc-acute-food",
    name: "Integrated Food Security Phase Classification (IPC)",
    url: "https://www.ipcinfo.org/",
    authenticated: false,
  },

  // —— Disaster & environmental risk ——
  {
    id: "emdat-disasters",
    name: "EM-DAT International Disaster Database",
    url: "https://www.emdat.be/",
    authenticated: false,
  },
  {
    id: "wri-aqueduct",
    name: "WRI Aqueduct Water Risk Atlas",
    url: "https://www.wri.org/aqueduct",
    authenticated: false,
  },
  {
    id: "world-bank-climate",
    name: "World Bank Climate Change Knowledge Portal",
    url: "https://climateknowledgeportal.worldbank.org/",
    authenticated: false,
  },

  // —— Regional health / met services ——
  {
    id: "paho-climate",
    name: "PAHO Climate Change & Health (Americas)",
    url: "https://www.paho.org/en/topics/climate-change-and-health",
    authenticated: false,
  },
  {
    id: "africa-cdc",
    name: "Africa CDC Public Health / Epidemic Intelligence",
    url: "https://africacdc.org/",
    authenticated: false,
  },
  {
    id: "ecdc",
    name: "ECDC Climate-Sensitive Disease Surveillance",
    url: "https://www.ecdc.europa.eu/",
    authenticated: false,
  },
  {
    id: "caribbean-cimh",
    name: "Caribbean Institute for Meteorology and Hydrology (CIMH)",
    url: "https://www.cimh.edu.bb/",
    authenticated: false,
  },
  {
    id: "sprep-pacific",
    name: "SPREP Pacific Climate Change Centre",
    url: "https://www.sprep.org/",
    authenticated: false,
  },
  {
    id: "uk-metoffice",
    name: "UK Met Office Climate Services",
    url: "https://www.metoffice.gov.uk/",
    authenticated: false,
  },
  {
    id: "bom-australia",
    name: "Australian Bureau of Meteorology",
    url: "https://www.bom.gov.au/",
    authenticated: false,
  },
  {
    id: "jma-japan",
    name: "Japan Meteorological Agency",
    url: "https://www.jma.go.jp/jma/indexe.html",
    authenticated: false,
  },
  {
    id: "cdc-climate-health",
    name: "US CDC Climate & Health Program",
    url: "https://www.cdc.gov/climateandhealth/",
    authenticated: false,
  },

  // —— India national validated references ——
  {
    id: "nfhs-india",
    name: "NFHS-5 India (child health baseline)",
    url: "https://rchiips.org/nfhs/factsheet_NFHS-5.shtml",
    authenticated: false,
  },
  {
    id: "imd-india",
    name: "India Meteorological Department",
    url: "https://mausam.imd.gov.in/",
    authenticated: false,
  },
  {
    id: "cpcb-india",
    name: "CPCB National Air Quality Index",
    url: "https://cpcb.nic.in/",
    authenticated: false,
  },
  {
    id: "nvbdcp-india",
    name: "NVBDCP Vector-Borne Disease Control",
    url: "https://nvbdcp.gov.in/",
    authenticated: false,
  },
  {
    id: "idsp-india",
    name: "India IDSP Integrated Disease Surveillance",
    url: "https://idsp.mohfw.gov.in/",
    authenticated: false,
  },
  {
    id: "ncdc-india",
    name: "NCDC India Centre for Disease Control",
    url: "https://ncdc.mohfw.gov.in/",
    authenticated: false,
  },
];

export function getTrustedSource(id: string): DataSource | undefined {
  return TRUSTED_SOURCES.find((s) => s.id === id);
}
