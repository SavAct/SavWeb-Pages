import { PageIni, SavWeb } from "../Components/SavWeb";

const usedChain = "eos";
const usedContract = "savact";
const usedSaleSite = usedContract;
const usedExchangeContract = "directsavact";
const tokenContract = "token.savact";
const browserLink = "https://savact.app";
const gotoPageError = "#savactsavact";
const affiPage = "#savact/!affiliate";

// Default parameters that will be replaced at the start automatically
const paySymbol = Vue.ref("EOS");
const payPrecision = Vue.ref(4);
const conSymbol = Vue.ref("SAVACT");
const conPrecision = Vue.ref(4);

// Get browser language
let userLang = navigator.language;
if (userLang.length > 2) {
  userLang = userLang.substring(0, 2);
}
const lang = Vue.ref(userLang);

// Get coupon from url
function getPathAffi(fullpath: string) {
  let path = "";
  if (fullpath.includes("?")) {
    path = fullpath.substring(fullpath.lastIndexOf("?") + 1).trim();
  }
  let start = -1;
  if (path.startsWith("affi=")) {
    start = 5;
  } else if (path.includes("&affi=")) {
    start = path.indexOf("&affi=") + 6;
  }
  if (start > 0) {
    const end = path.indexOf("&", start);
    return end > 0 ? path.substring(start, end) : path.substring(start);
  }
  return "";
}
const coupon = Vue.ref("");

// Dark style
const darkStyle = Vue.computed({
  get: () => {
    return Quasar.Dark.isActive;
  },
  set: (value) => {
    Quasar.Dark.set(value);
  },
});

// SavWeb interface
const savConnected = Vue.ref<boolean>(false);
function onIni(msg: PageIni) {
  if (typeof msg.darkstyle == "boolean") {
    darkStyle.value = msg.darkstyle;
    savConnected.value = true;
  }
  if (typeof msg.fullPath == "string") {
    let affi = getPathAffi(msg.fullPath);
    if (affi.trim() == "be_an_affiliate") {
      affi = "";
      isIndex.value = false;
    }
    coupon.value = affi;
  }
}
const savWeb = new SavWeb(onIni);

const isIndex = Vue.ref<boolean>(true);

export const state = {
  coupon,
  lang,
  darkStyle,
  isIndex,
  conPrecision,
  conSymbol,
  paySymbol,
  payPrecision,
  savWeb,
  savConnected,
  usedChain,
  usedContract,
  usedSaleSite,
  usedExchangeContract,
  tokenContract,
  browserLink,
  gotoPageError,
  affiPage,
};
