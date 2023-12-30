export interface UserTable {
  user: string;
  contact: Array<string>;
  allowed: Array<TokenSymbol>;
  active: boolean;
  lastUpdate: number;
  items: Array<IdAndCategory>;
  banned: boolean;
  pgp: string;
  note: string;
}

export interface ItemTable {
  id: number | string | bigint;
  seller: string;
  available: boolean;
  title: string;
  imgs: Array<string>;
  price: number | string | bigint;
  prepT: number;
  fromR: string;
  shipTo: Array<ToRegion>;
  excl: string;
  options: Array<string>;
  descr: string;
  note: string;
  expired: number;
}

export interface AddItem {
  seller: string;
  category: string;
  title: string;
  imgs: Array<string>;
  price: number | string | bigint;
  prepT: number;
  fromR: string;
  excl: string;
  shipTo: Array<ToRegion>;
  opts: Array<string>;
  descr: string;
  note: string;
  available: boolean;
  expired: number;
}

export interface Ban {
  user: string;
  ban: boolean;
}

export interface Deleteuser {
  user: string;
}

export interface IdAndCategory {
  id: number | string | bigint;
  category: string;
}

export interface Itemstate {
  id: number | string | bigint;
  category: string;
  available: boolean;
  expired: number;
}

export interface Removeitem {
  id: number | string | bigint;
  category: string;
}

export interface Rmexpired {
  category: string;
}

export interface ToRegion {
  t: number; // shipping duration in seconds
  p: number; // shipping price
  rs: string; // region names
}

export interface TokenSymbol {
  sym: string;
  contr: string;
  chain: string;
}

export interface Updateuser {
  user: string;
  contact: Array<string>;
  allowed: Array<TokenSymbol>;
  active: boolean;
  pgp: string;
  note: string;
}
