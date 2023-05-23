import { PageIni, SavWeb } from "../Components/SavWeb";

const usedChain = "eos";
const usedContract = "savact";
const usedSaleSite = usedContract;
const usedExchangeContract = "directsavact";
const tokenContract = "token.savact";
const browserLink = "https://savact.app";
const gotoPageError = "#savactsavact";
const affiPage = "#savact/!affiliate";
const defaultPaySymbol = "EOS"; // Will be requested at the start automatically
const defaultTokenSymbol = "SAVACT"; // Will be requested at the start automatically

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
    return end > 0 ? path.substring(start, end) : path.substr(start);
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
    coupon.value = getPathAffi(msg.fullPath);
  }
}
const savWeb = new SavWeb(onIni);

export const state = {
  coupon,
  lang,
  darkStyle,
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
  defaultPaySymbol,
  defaultTokenSymbol,
};
