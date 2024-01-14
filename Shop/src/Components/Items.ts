// TODO: Replace with contact interface
export interface Entry {
  id: number;
  title: string;
  imgs: Array<string>;
  price: number; // float
  units: number; // int
  seller: string;
  maxTd: number; // Maximum shipping duration in seconds after delivery
  to: Array<{ region: string; sp: number; sd: number }>; // Country code, shipping price in USD and shipping duration in seconds after payment. {region: "DE", sp: 5,10, sd: 604800}, regions may be "WW", "EU", "US DE AT",
  exclude_regions: string;
  from_region: string; // "", "NL"
  accept: Array<{ symbol: string; contract: string; chain: string }>; // Allowed Token
  available: boolean;
  description: string;
  note: string;
}

// TODO: Replace with contract interface
export interface Seller {
  account: string;
  available: boolean;
  toDate: number; // available or not available until this date as unix timestamp
  pgp: string;
  contact: Array<string>;
}

export interface PGP_Keys {
  pub: string;
  pri: string;
  passphrase: string;
  fingerprint?: string;
}
