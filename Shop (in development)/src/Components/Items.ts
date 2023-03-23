export interface Entry {
  id: number;
  title: string;
  imgs: Array<string>;
  price: number;
  units: number;
  seller: string;
  editDate: number;
  shipSpan: number;
  to_regions: string; // "WW", "EU", "US DE AT",
  exclude_regions: string;
  from_region: string; // "", "nl"
  accept: Array<{ symbol: string; contract: string; chain: string }>; // Allowed Token
  available: boolean;
  note: string;
}

export interface Seller {
  available: boolean;
  pgp: string;
  contact: Array<string>;
}
