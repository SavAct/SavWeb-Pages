import { AssetSymbol, Token } from "../Components/AntelopeHelpers";
import { get_available_tokens } from "../Components/AvailableTokens";
import { AddItem, UserTable } from "../Components/ContractInterfaces";
import { Entry, Seller } from "../Components/Items";
import { PublicAccount } from "../Components/SavWeb";

export interface ExtendedTokenSymbol {
  symbol: AssetSymbol;
  contract: string;
  chain: string;
}

export interface User extends Omit<UserTable, "allowed"> {
  allowed: Array<ExtendedTokenSymbol>;
}

const contract = {
  account: "infiniteshop",
  chain: "eos",
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
  chain: "eos",
  tables: {
    tokens: "tokens",
  },
};

const defaultValue = {
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
const itemsList: Array<Entry> = [
  {
    id: 0,
    title: "Cheap planet with great landscapes",
    imgs: [
      "https://cdn.quasar.dev/img/mountains.jpg",
      "https://cdn.quasar.dev/img/parallax1.jpg",
      "https://cdn.quasar.dev/img/parallax2.jpg",
    ],
    price: 13.23,
    units: 3,
    seller: "yearofthesav",
    maxTd: 3600 * 24 * 14,
    to: [{ region: "EU", sp: 5.35, sd: 3600 * 24 * 14 }],
    exclude_regions: "DE",
    from_region: "NL",
    accept: [{ symbol: "4,EOS", contract: "eosio.token", chain: "eos" }],
    available: true,
    description: "This is a very good planet",
    note: "Write me before you send the token!",
  },
  {
    id: 1,
    title: "Quasar with ionic beams",
    imgs: ["https://cdn.quasar.dev/img/quasar.jpg"],
    price: 2.55,
    units: 2,
    seller: "savact",
    maxTd: 3600 * 24 * 7,
    to: [
      { region: "DE", sp: 2.1, sd: 3600 * 24 },
      { region: "AT", sp: 4.23, sd: 3600 * 24 * 2 },
    ],
    exclude_regions: "NL",
    from_region: "EU",
    accept: [
      { symbol: "4,EOS", contract: "eosio.token", chain: "eos" },
      { symbol: "8,WAX", contract: "eosio.token", chain: "wax" },
    ],
    available: true,
    description: "This is a very good\nQuasar<br>with long ionic beams",
    note: "",
  },
  {
    id: 2,
    title: "Cute cat or pinguin for half price",
    imgs: [
      "https://cdn.quasar.dev/img/linux-avatar.png",
      "https://cdn.quasar.dev/img/cat.jpg", // Too big to load
      "https://cdn.quasar.dev/empty/not-found.png", // 404
      "https://savact.com/wp-content/uploads/2021/12/003-observatory2.png", // Blocked by server to load via script
    ],
    price: 2.55,
    units: 1,
    seller: "savactsavact",
    maxTd: 3600 * 24 * 7,
    to: [
      { region: "DE", sp: 2.1, sd: 3600 * 24 },
      { region: "US", sp: 4.23, sd: 3600 * 24 * 2 },
    ],
    exclude_regions: "CN",
    from_region: "EU",
    accept: [
      { symbol: "4,EOS", contract: "eosio.token", chain: "eos" },
      { symbol: "8,WAX", contract: "eosio.token", chain: "wax" },
    ],
    available: true,
    description:
      "This animals are very cute. The price is infinite, half of it is still infinite. But I can send you a picture for a payable amount.",
    note: "I do not send pictures to zoophilia dogs",
  },
];

const sellerList: { [key: string]: Seller } = {
  savact: {
    account: "savact",
    available: false,
    toDate: 1689150279,
    contact: ["test1@test1.com", "t.me/test1"],
    pgp: "PGP KEY---------------PGP END",
  },
  savactsavact: {
    account: "savactsavact",
    available: true,
    toDate: 1679150279,
    contact: ["test2@test2.com", "t.me/test2"],
    pgp: `PGP KEY---------------PGP END`,
  },
  yearofthesav: {
    account: "yearofthesav",
    available: true,
    toDate: 1679826294,
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
};
