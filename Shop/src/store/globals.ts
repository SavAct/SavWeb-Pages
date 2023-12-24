import { Token } from "../Components/AntelopeHelpers";
import { get_available_tokens } from "../Components/AvailableTokens";
import { Entry, Seller } from "../Components/Items";
import { PageIni, SavWeb } from "../Components/SavWeb";
import { router } from "../router/simpleRouter";

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
};

function resolvePage(pIni: PageIni) {
  let pageName: string;
  const paths = (
    pIni.path.length > 0 && pIni.path[0] === "/"
      ? pIni.path.substring(1)
      : pIni.path
  ).split("/");
  if (paths === undefined || paths.length === 1) {
    pageName = paths[0];
  } else {
    contract.account = paths[0]; // Change contract account if path has more than one "folder"
    pageName = paths[1];
    console.log("Use contract account:", contract.account);
  }

  console.log("resolvePage", pageName, pIni.query);

  router.push({
    name: pageName.length > 0 ? pageName : "home",
    query: pIni.query,
  });
}

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
async function getAllowedTokens(callback: (hasError?: boolean) => void) {
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

// Counter clicks transformation in progress which is shown on the home page
const _progress = Vue.ref<number>(0);
const progress = Vue.computed({
  get: () => {
    return _progress.value;
  },
  set: (value) => {
    // From 0.0 to 1.0 in tenth steps
    _progress.value = (value % 11) / 10;
  },
});

// SavWeb interface
const savConnected = Vue.ref<boolean>(false);
function onIni(msg: PageIni) {
  if (typeof msg.darkstyle == "boolean") {
    darkStyle.value = msg.darkstyle;
  }
  savConnected.value = true;
  resolvePage(msg);

  console.log("PageIni", msg);
}
const savWeb = new SavWeb(onIni);

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

const messengers = [
  { name: "Telegram", link: "t.me/" }, // Checked
  { name: "Simplex", link: "simplex.chat/" }, // Checked
  { name: "Threema", link: "threema.id/" }, // Checked
  { name: "Line", link: "line.me/" }, // Checked
  { name: "Facebook", link: "facebook.com/" }, // Checked
  { name: "Twitter", link: "twitter.com/" }, // Checked
  { name: "Instagram", link: "instagram.com/" }, // Checked
  { name: "WhatsApp", link: "wa.me/" }, // Checked
  { name: "Discord", link: "discord." },
  { name: "Signal", link: "signal." },
  { name: "Keybase", link: "keybase." },
  { name: "Matrix", link: "matrix." },
  { name: "XMPP", link: "xmpp." },
  { name: "IRC", link: "irc." },
  { name: "Email", link: "mailto" },
  { name: "Wire", link: "wire." },
  { name: "WeChat", link: "weixin.qq.com/" },
  { name: "Viber", link: "viber." },
  { name: "KakaoTalk", link: "kakao" },
  { name: "Snapchat", link: "snapchat.com/" },
  { name: "TikTok", link: "tiktok.com/" },
  { name: "Reddit", link: "reddit.com/" },
  { name: "Wickr", link: "wickr.com/" },
  { name: "Ricochet", link: "ricochet." },
  { name: "Dust", link: "dust." },
  { name: "Hushed", link: "hushed." },
  { name: "CoverMe", link: "coverme." },
  { name: "GhostChat", link: "ghostchat." },
];

const allChains = [
  {
    label: "EOS",
    value: "eos",
    id: "aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906",
  },
  {
    label: "WAX",
    value: "wax",
    id: "1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4",
  },
  {
    label: "BEOS",
    value: "beos",
    id: "cbef47b0b26d2b8407ec6a6f91284100ec32d288a39d4b4bbd49655f7c484112",
  },
  {
    label: "BOS",
    value: "bos",
    id: "d5a3d18fbb3c084e3b1f3fa98c21014b5f3db536cc15d08f9f6479517c6a3d86",
  },

  {
    label: "FIO",
    value: "fio",
    id: "21dcae42c0182200e93f954a074011f9048a7624c6fe81d3c9541a614a88bd1c",
  },
  {
    label: "Insights",
    value: "insights",
    id: "b042025541e25a472bffde2d62edd457b7e70cee943412b1ea0f044f88591664",
  },
  {
    label: "MEET.ONE",
    value: "meetone",
    id: "cfe6486a83bad4962f232d48003b1824ab5665c36778141034d75e57b956e422",
  },
  {
    label: "Proton",
    value: "proton",
    id: "384da888112027f0321850a169f737c33e53b388aad48b5adace4bab97f437e0",
  },
  {
    label: "Telos",
    value: "telos",
    id: "4667b205c6838ef70ff7988f6e8257e8be0e1284a2f59699054a018f743b1d11",
  },
  {
    label: "Worbli",
    value: "worbli",
    id: "73647cde120091e0a4b85bced2f3cfdb3041e266cbbe95cee59b73235a1b3b6f",
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
  darkStyle,
  progress,
  savWeb,
  savConnected,
  itemsList,
  sellerList,
  messengers,
  mainFooterRef,
  mainHeaderRef,
  thumbStyle,
  barStyle,
  getAllowedTokens,
  isGettingAvailableTokens,
  allChains,
};
