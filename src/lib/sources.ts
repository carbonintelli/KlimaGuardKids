import type { DataSource } from "./types";

/** Authenticated / trusted public data feeds used by agent pipeline */
export const TRUSTED_SOURCES: DataSource[] = [
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
    id: "who-guidance",
    name: "WHO Climate & Health Guidance (reference)",
    url: "https://www.who.int/health-topics/climate-change",
    authenticated: false,
  },
  {
    id: "who-traditional-medicine",
    name: "WHO Traditional, Complementary and Integrative Medicine",
    url: "https://www.who.int/health-topics/traditional-complementary-and-integrative-medicine",
    authenticated: false,
  },
  {
    id: "nfhs-india",
    name: "NFHS-5 India (child health baseline reference)",
    url: "https://rchiips.org/nfhs/factsheet_NFHS-5.shtml",
    authenticated: false,
  },
  {
    id: "imd-india",
    name: "India Meteorological Department (heatwave reference)",
    url: "https://mausam.imd.gov.in/",
    authenticated: false,
  },
  {
    id: "cpcb-india",
    name: "CPCB Air Quality Index (reference)",
    url: "https://cpcb.nic.in/",
    authenticated: false,
  },
  {
    id: "nvbdcp-india",
    name: "NVBDCP Vector-Borne Disease Control (reference)",
    url: "https://nvbdcp.gov.in/",
    authenticated: false,
  },
];
