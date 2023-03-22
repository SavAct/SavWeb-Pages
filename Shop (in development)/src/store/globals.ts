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
    title: "A white telescope",
    imgs: [
      "https://savact.com/wp-content/uploads/2021/12/003-observatory2.png",
      "https://cdn.quasar.dev/img/parallax1.jpg",
      "https://cdn.quasar.dev/img/parallax2.jpg",
    ],
    price: 13.23,
    units: 3,
    seller: "yearofthesav",
    editDate: 1679155279,
    shipSpan: 3600 * 24,
    to_regions: "EU",
    exclude_regions: "DE",
    from_region: "NL",
    accept: [{ symbol: "4,EOS", contract: "eosio.token", chain: "eos" }],
    available: true,
    note: "Write me before you send the token!",
  },
  {
    id: 1,
    title: "Satellite with solar pannel",
    imgs: [
      "https://savact.com/wp-content/uploads/2021/12/002-space-station2.png",
    ],
    price: 2.5,
    units: 1,
    seller: "savact",
    editDate: 1679150279,
    shipSpan: 3600 * 24 * 14,
    to_regions: "us eu",
    exclude_regions: "nl",
    from_region: "eu",
    accept: [{ symbol: "4,EOS", contract: "eosio.token", chain: "eos" }],
    available: true,
    note: "This item is realy rare",
  },
];

const sellerList: { [key: string]: Seller } = {
  savact: {
    available: false,
    contact: ["test1@test1.com", "t.me/test1"],
    pgp: "PGP KEY---------------PGP END",
  },
  savactsavact: {
    available: true,
    contact: ["test2@test2.com", "t.me/test2"],
    pgp: "PGP KEY-------test2--------PGP END",
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
