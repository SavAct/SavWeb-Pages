export interface ContractToRegion {
  t: number; // shipping duration in seconds
  p: number; // shipping price
  rs: string; // region names
}

export interface ActionAddItem {
  seller: string;
  category: string;
  title: string;
  imgs: Array<string>;
  price: number | string | bigint;
  prepT: number;
  fromR: string;
  excl: string;
  shipTo: Array<ContractToRegion>;
  opts: Array<string>;
  descr: string;
  note: string;
  available: boolean;
  expired: number;
}
