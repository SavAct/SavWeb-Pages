import { Entry, Seller } from "../Components/Items";
import { PageIni, SavWeb } from "../Components/SavWeb";

// Dark style
const darkStyle = Vue.computed({
  get: () => {
    return Quasar.Dark.isActive;
  },
  set: (value) => {
    Quasar.Dark.set(value);
  },
});

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
    savConnected.value = true;
  }
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
    units: 1,
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
    pgp: "PGP KEY-------test2--------PGP END",
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

xjMEZCLVyxYJKwYBBAHaRw8BAQdA/0EykbX9Pn7AteNUSKgZZEYA4R5HBbvz
+OQFC/DcI8HNAMKMBBAWCgA+BYJkItXLBAsJBwgJkAN/uZJn3/7RAxUICgQW
AAIBAhkBApsDAh4BFiEEvgFLzCbE2q8FqySfA3+5kmff/tEAAGv3AP9WhnfS
buP9pAItsUBYWP1v+Fo98yL26eimHG4zvrHoPAD8CpjrI9drE4dCqKEp0bCo
gq+CI9UNwM/680rq/LdEigDOOARkItXLEgorBgEEAZdVAQUBAQdAcs7c7FdD
699aOYZ1FUPbkcnz/QfYnRpMhOWFF8rrOD8DAQgHwngEGBYIACoFgmQi1csJ
kAN/uZJn3/7RApsMFiEEvgFLzCbE2q8FqySfA3+5kmff/tEAAE0PAP9U4z26
1/A66AayqVRsPsxUh8ysZMm5UHaX9zngSSZ6lwD+KbKl/4TBB+/qPk8P1y70
L7mDr4xuUpUNEUMbYc1O9A4=
=a2sb
-----END PGP PUBLIC KEY BLOCK-----
        `,
  },
};

export const state = {
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
};
