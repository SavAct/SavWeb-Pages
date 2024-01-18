import { AssetSymbol, Token } from "../Components/AntelopeHelpers";
import { get_available_tokens } from "../Components/AvailableTokens";
import {
  AddItem,
  ItemTable,
  UserTable,
} from "../Components/ContractInterfaces";
import { Seller } from "../Components/Items";
import { PublicAccount } from "../Components/SavWeb";
import { savWeb } from "./connect";

export interface ExtendedTokenSymbol {
  symbol: AssetSymbol;
  contract: string;
  chain: string;
}

export interface User extends Omit<UserTable, "allowed"> {
  allowed: Array<ExtendedTokenSymbol>;
}

export interface MarketContract {
  account: string;
  chain: string;
  actions: {
    addItem: string;
    removeItem: string;
    removeExpired: string;
    updateItemState: string;
    updateUser: string;
    deleteUser: string;
    banUser: string;
  };
  tables: {
    user: string;
    item: string;
  };
}

const contract: MarketContract = {
  account: "infiniteshop",
  chain: "lamington",
  actions: {
    addItem: "additem",
    removeItem: "removeitem",
    removeExpired: "rmexpired",
    updateItemState: "itemstate",
    updateUser: "updateuser",
    deleteUser: "deleteuser",
    banUser: "ban",
  },
  tables: {
    user: "user",
    item: "item",
  },
};

const savpayContract = {
  account: "savactsavpay",
  chain: "lamington",
  tables: {
    tokens: "tokens",
  },
};

const defaultValue = {
  startPage: "item", //"home";
  prepDuration: 3600 * 24 * 2 * 1000, // 2 days
  shipDuration: 3600 * 24 * 5 * 1000, // 5 days
  expireDuration: 3600 * 24 * 30 * 1000, // 30 days
};

// Dark style
const darkStyle = Vue.computed({
  get: () => {
    return Quasar.Dark.isActive;
  },
  set: (value) => {
    Quasar.Dark.set(value);
  },
});

/**
 * Get the key for the article cache
 * @param data Article data
 * @returns key
 */
function getArticleKey(
  data: {
    id: number;
    category: string | bigint | number;
  } & MarketContract
) {
  return `${data.id}_${String(BigInt(data.category))}_${data.chain}_${data.account}`;
}

// Articles
const article = new Map<string, { time: number; entry: ItemTable }>();

/**
 * Get article from cache or blockchain
 * @param id Article data
 * @param forceUpdate Update the cache for this article
 * @param chain Chain name
 * @param code Contract account
 * @param table Table name
 * @returns Article otherwise undefined
 */
async function getArticle(
  data: {
    id: number;
    category: string | bigint | number;
  } & MarketContract,
  forceUpdate = false
) {
  const key = getArticleKey(data);
  const art = article.get(key);
  if (!forceUpdate && art !== undefined && art.time + 1800000 > Date.now()) {
    // Update at least after 30 minutes
    return art;
  } else {
    const category = BigInt(data.category);
    const result = await savWeb.getTableRows({
      chain: data.chain,
      code: data.account,
      table: data.tables.item,
      scope: String(category),
      entry: data.id,
    });
    if (result && "rows" in result && result.rows.length > 0) {
      const art = result.rows[0];
      article.set(key, { time: Date.now(), entry: art });
      return art;
    }
  }
  return undefined;
}

// Allowed tokens
const isGettingAvailableTokens = Vue.ref<boolean>(false);
let allowedTokens: Array<Token> = [];
let loadedAllTokensWithError = true;
async function getAvailableTokens(callback: (hasError?: boolean) => void) {
  if (loadedAllTokensWithError) {
    const aTokens = await get_available_tokens(
      isGettingAvailableTokens,
      (hasError0: boolean) => {
        loadedAllTokensWithError = hasError0;
        callback(hasError0);
      }
    );
    allowedTokens = aTokens ? aTokens : [];
  }
  return allowedTokens;
}

const loginUser = Vue.ref<PublicAccount | undefined>(undefined);
const user = Vue.ref<User>({
  user: "",
  contact: [],
  allowed: [],
  active: false,
  lastUpdate: 0,
  items: [],
  banned: false,
  pgp: "",
  note: "",
});

const defaultUserName = Vue.computed(() => {
  if (user.value.user === undefined || user.value.user === "") {
    if (loginUser.value?.name !== undefined) {
      return loginUser.value?.name;
    }
    return "";
  }
  return user.value.user;
});

const uploadPageInputs = Vue.ref<AddItem | undefined>(undefined);

// Elements of the main header and footer
const mainHeaderRef = Vue.ref<{ $el: HTMLElement } | null>(null);
const mainFooterRef = Vue.ref<{ $el: HTMLElement } | null>(null);

const thumbStyle: any = {
  borderRadius: "7px",
  backgroundColor: "#4994EC", //#4994EC
  opacity: 0.7,
};

const barStyle: any = {
  borderRadius: "9px",
  backgroundColor: "white",
  opacity: 0.2,
};

// Example data // TODO: Remove
const itemsList: Array<ItemTable> = [
  {
    id: 0,
    title: "Cheap planet with great landscapes",
    imgs: [
      "https://cdn.quasar.dev/img/mountains.jpg",
      "https://cdn.quasar.dev/img/parallax1.jpg",
      "https://cdn.quasar.dev/img/parallax2.jpg",
    ],
    pp: [{ p: 13.23, pcs: 1 }],
    seller: "yearofthesav",
    shipTo: [{ rs: "EU", p: 5.35, t: 3600 * 24 * 14 }],
    excl: "DE",
    fromR: "NL",
    // accept: [{ symbol: "4,EOS", contract: "eosio.token", chain: "eos" }],
    available: true,
    descr: "This is a very good planet",
    note: "Write me before you send the token!",
    expired: Date.now() + 3600 * 24 * 30,
    opts: ["blue", "red"],
    prepT: 3600 * 24 * 2,
  },
  {
    id: 1,
    title: "Quasar with ionic beams",
    imgs: ["https://cdn.quasar.dev/img/quasar.jpg"],
    pp: [
      { p: 13.23, pcs: 1 },
      { p: 20, pcs: 2 },
    ],
    seller: "savact",
    shipTo: [
      { rs: "DE", p: 2.1, t: 3600 * 24 },
      { rs: "AT", p: 4.23, t: 3600 * 24 * 2 },
    ],
    excl: "NL",
    fromR: "EU",
    // accept: [
    //   { symbol: "4,EOS", contract: "eosio.token", chain: "eos" },
    //   { symbol: "8,WAX", contract: "eosio.token", chain: "wax" },
    // ],
    available: true,
    descr: "This is a very good\nQuasar<br>with long ionic beams",
    note: "",
    opts: ["big", "bigger", "biggest"],
    prepT: 3600 * 24 * 2,
    expired: Date.now() + 3600 * 24 * 30,
  },
  {
    id: 2,
    title: "Cute cat or penguin for half price",
    imgs: [
      "https://cdn.quasar.dev/img/linux-avatar.png",
      "https://cdn.quasar.dev/img/cat.jpg", // Too big to load
      "https://cdn.quasar.dev/empty/not-found.png", // 404
      "https://savact.com/wp-content/uploads/2021/12/003-observatory2.png", // Blocked by server to load via script
    ],
    pp: [
      { p: 2.55, pcs: 5 },
      { p: 1, pcs: 2 },
    ],
    seller: "savactsavact",
    shipTo: [
      { rs: "DE", p: 2.1, t: 3600 * 24 },
      { rs: "US", p: 4.23, t: 3600 * 24 * 2 },
    ],
    excl: "CN",
    fromR: "EU",
    // accept: [
    //   { symbol: "4,EOS", contract: "eosio.token", chain: "eos" },
    //   { symbol: "8,WAX", contract: "eosio.token", chain: "wax" },
    // ],
    available: true,
    descr:
      "This animals are very cute. The price is infinite, half of it is still infinite. But I can send you a picture for a payable amount.",
    note: "I do not send pictures to zoophilia dogs",
    opts: ["cat", "penguin"],
    prepT: 3600 * 24 * 4,
    expired: Date.now() + 3600 * 24 * 30,
  },
];

const sellerList: { [key: string]: UserTable } = {
  savact: {
    user: "savact",
    active: false,
    banned: false,
    items: [],
    note: "I am a very good seller",
    allowed: [
      { sym: "4,EOS", contr: "eosio.token", chain: "eos" },
      { sym: "4,SAVACT", contr: "savactsavpay", chain: "lamington" },
    ],
    lastUpdate: 1689150279,
    contact: ["test1@test1.com", "t.me/test1"],
    pgp: "PGP KEY---------------PGP END",
  },
  savactsavact: {
    user: "savactsavact",
    active: false,
    banned: false,
    items: [],
    note: "I am an inactive seller",
    allowed: [],
    lastUpdate: 1679150279,
    contact: ["test2@test2.com", "t.me/test2"],
    pgp: `PGP KEY---------------PGP END`,
  },
  yearofthesav: {
    user: "yearofthesav",
    active: true,
    banned: true,
    items: [],
    note: "I am a banned seller",
    allowed: [],
    lastUpdate: 1679826294,
    contact: [
      "test3@test3.com",
      "t.me/test3",
      "https://simplex.chat/contact#/?v=1-2&smp=smp%aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaacccccccccccccccccccccccccc.onion",
    ],
    pgp: `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZMwzBBYJKwYBBAHaRw8BAQdA/+/C8lm299s9AZ8YOya+FbbuPFpV3JHr
V2mbEoQoPz7NAMKMBBAWCgA+BYJkzDMEBAsJBwgJkBQ0wwB7GCsCAxUICgQW
AAIBAhkBApsDAh4BFiEENlDVzQ1pptmiGBU+FDTDAHsYKwIAACWqAP9Pu+PK
b0cP6U4hdfFpg/ajAt6XThcFZPw5+E616apN6wEAjWi4Amd/HPBERnzFaLKb
aBkaGlhPJZf4RN8w7uBZ+QvOOARkzDMEEgorBgEEAZdVAQUBAQdANBbouTlY
uHJUZYhe0El8D+caQ5iXJREvTcpCk15+30cDAQgHwngEGBYIACoFgmTMMwQJ
kBQ0wwB7GCsCApsMFiEENlDVzQ1pptmiGBU+FDTDAHsYKwIAAGLkAP9CBgwY
U2WliTCVyjBUwZH4Dq+7ldEvYdw+UdHL0jw24AD/dfh8vv6YurfvqPRNwJnz
WkrmPMQ2vCNN/vfNRi447wg=
=Vfmh
-----END PGP PUBLIC KEY BLOCK-----

`,
  },
};

export const state = {
  contract,
  savpayContract,
  loginUser,
  user,
  defaultUserName,
  darkStyle,
  itemsList,
  sellerList,
  mainFooterRef,
  mainHeaderRef,
  thumbStyle,
  barStyle,
  getAvailableTokens,
  isGettingAvailableTokens,
  uploadPageInputs,
  defaultValue,
  getArticle,
};
