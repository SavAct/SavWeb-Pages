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

const sellerList: { [key: string]: Seller } = {
  savact: {
    available: false,
    toDate: 1689150279,
    contact: ["test1@test1.com", "t.me/test1"],
    pgp: "PGP KEY---------------PGP END",
  },
  savactsavact: {
    available: true,
    toDate: 1679150279,
    contact: ["test2@test2.com", "t.me/test2"],
    pgp: "PGP KEY-------test2--------PGP END",
  },
  yearofthesav: {
    available: true,
    toDate: 1679826294,
    contact: ["test3@test3.com", "t.me/test3"],
    pgp: "PGP KEY-------test3--------PGP END",
  },
};

export const state = {
  darkStyle,
  progress,
  savWeb,
  savConnected,
  itemsList,
  sellerList,
};
