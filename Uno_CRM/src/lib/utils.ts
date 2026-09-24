import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string, Date object, or timestamp to 'DD/MM/YYYY'.
 * If the input is empty or invalid, returns fallback ('—' or '-').
 */
export function formatDate(date: string | Date | number | null | undefined, fallback: string = '—'): string {
  if (date === null || date === undefined || (date as any) === '') return fallback;
  
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'number') {
    d = new Date(date);
  } else if (typeof date === 'string') {
    const trimmed = date.trim();
    if (!trimmed) return fallback;
    // Check if ISO format YYYY-MM-DD
    const match = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, y, m, day] = match;
      return `${day}/${m}/${y}`;
    }
    d = new Date(trimmed);
  } else {
    d = new Date(date as any);
  }

  if (isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Formats a date-time to 'DD/MM/YYYY HH:mm'.
 */
export function formatDateTime(date: string | Date | number | null | undefined, fallback: string = '—'): string {
  if (date === null || date === undefined || (date as any) === '') return fallback;
  
  let d: Date;
  if (date instanceof Date) {
    d = date;
  } else if (typeof date === 'number') {
    d = new Date(date);
  } else if (typeof date === 'string') {
    d = new Date(date);
  } else {
    d = new Date(date as any);
  }

  if (isNaN(d.getTime())) return fallback;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Standard IATA (2-char) to ICAO (3-char) airline designator mapping.
 * FlightAware's direct live tracking URL requires 3-letter ICAO codes (e.g. THY1768 instead of TK1768).
 */
export const IATA_TO_ICAO_AIRLINES: Record<string, string> = {
  // Turkish & Regional Carriers
  TK: 'THY', // Turkish Airlines
  PC: 'PGT', // Pegasus Airlines
  VF: 'TKJ', // AJet (AnadoluJet)
  XQ: 'SXS', // SunExpress
  XC: 'CAI', // Corendon Airlines
  XR: 'CXI', // Corendon Airlines Europe
  FH: 'FHY', // Freebird Airlines
  TI: 'TWI', // Tailwind Airlines
  BX: 'BHK', // BBN Airlines

  // Major European Carriers
  LH: 'DLH', // Lufthansa
  OS: 'AUA', // Austrian Airlines
  LX: 'SWR', // Swiss International Air Lines
  SN: 'BEL', // Brussels Airlines
  EW: 'EWG', // Eurowings
  W6: 'WZZ', // Wizz Air
  W4: 'WMT', // Wizz Air Malta
  FR: 'RYR', // Ryanair
  RK: 'RUK', // Ryanair UK
  U2: 'EZY', // easyJet UK
  DS: 'EZS', // easyJet Switzerland
  EC: 'EJU', // easyJet Europe
  BA: 'BAW', // British Airways
  AF: 'AFR', // Air France
  KL: 'KLM', // KLM Royal Dutch Airlines
  TO: 'TVF', // Transavia France
  HV: 'TRA', // Transavia
  AZ: 'ITY', // ITA Airways
  IB: 'IBE', // Iberia
  VY: 'VLG', // Vueling
  UX: 'AEA', // Air Europa
  TP: 'TAP', // TAP Air Portugal
  QS: 'TVS', // Smartwings
  OK: 'CSA', // Czech Airlines
  LO: 'LOT', // LOT Polish Airlines
  BT: 'BTI', // airBaltic
  AY: 'FIN', // Finnair
  SK: 'SAS', // Scandinavian Airlines
  DY: 'NOZ', // Norwegian Air
  D8: 'NSZ', // Norwegian Air Sweden
  FI: 'ICE', // Icelandair
  EI: 'EIN', // Aer Lingus
  JU: 'ASL', // Air Serbia
  OU: 'CTN', // Croatia Airlines
  FB: 'LZB', // Bulgaria Air
  RO: 'ROT', // TAROM
  A3: 'AEE', // Aegean Airlines
  KM: 'KMM', // KM Malta Airlines

  // Middle East & Gulf Carriers
  QR: 'QTR', // Qatar Airways
  EK: 'UAE', // Emirates
  EY: 'ETD', // Etihad Airways
  FZ: 'FDB', // flydubai
  G9: 'ABY', // Air Arabia
  SV: 'SVA', // Saudia
  MS: 'MSR', // EgyptAir
  RJ: 'RJA', // Royal Jordanian
  ME: 'MEA', // Middle East Airlines
  KU: 'KAC', // Kuwait Airways
  GF: 'GFA', // Gulf Air
  WY: 'OMA', // Oman Air
  XY: 'FAD', // flynas
  J9: 'JZR', // Jazeera Airways

  // North American Carriers
  AA: 'AAL', // American Airlines
  UA: 'UAL', // United Airlines
  DL: 'DAL', // Delta Air Lines
  WN: 'SWA', // Southwest Airlines
  B6: 'JBU', // JetBlue
  AS: 'ASA', // Alaska Airlines
  AC: 'ACA', // Air Canada
  WS: 'WJA', // WestJet

  // Asian & Global Carriers
  SQ: 'SIA', // Singapore Airlines
  TG: 'THA', // Thai Airways
  MH: 'MAS', // Malaysia Airlines
  GA: 'GIA', // Garuda Indonesia
  VN: 'HVN', // Vietnam Airlines
  CX: 'CPA', // Cathay Pacific
  BR: 'EVA', // EVA Air
  CI: 'CAL', // China Airlines
  KE: 'KAL', // Korean Air
  OZ: 'AAR', // Asiana Airlines
  JL: 'JAL', // Japan Airlines
  NH: 'ANA', // All Nippon Airways
  CA: 'CCA', // Air China
  CZ: 'CSN', // China Southern
  MU: 'CES', // China Eastern
  HU: 'CHH', // Hainan Airlines
  AI: 'AIC', // Air India
  '6E': 'IGO', // IndiGo
  QF: 'QFA', // Qantas
  NZ: 'ANZ', // Air New Zealand
  ET: 'ETH', // Ethiopian Airlines
  KQ: 'KQA', // Kenya Airways
  AT: 'RAM', // Royal Air Maroc
};

/**
 * Normalizes a raw flight number (e.g. "TK 1768", "PC 210", "W6 2451") to its canonical ICAO identifier for FlightAware.
 */
export function normalizeFlightIdent(flight: string | null | undefined): string {
  if (!flight) return '';
  const clean = flight.trim().replace(/[\s-]+/g, '').toUpperCase();
  const match = clean.match(/^([A-Z]{2,3}|[A-Z]\d|\d[A-Z])(\d+[A-Z]?)$/);
  if (match) {
    const prefix = match[1];
    const number = match[2];
    const icao = IATA_TO_ICAO_AIRLINES[prefix];
    if (icao) {
      return `${icao}${number}`;
    }
  }
  return clean;
}

/**
 * Returns a direct FlightAware tracking URL for the flight, converting IATA to 3-letter ICAO designator when known.
 */
export function getFlightAwareUrl(flight: string | null | undefined): string {
  if (!flight) return 'https://www.flightaware.com';
  const ident = normalizeFlightIdent(flight);
  return `https://www.flightaware.com/live/flight/${ident}`;
}


