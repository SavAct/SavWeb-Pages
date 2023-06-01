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

const dateVisible = Vue.ref<boolean>(true);

export const state = {
  darkStyle,
  savWeb,
  savConnected,
  mainFooterRef,
  mainHeaderRef,
  thumbStyle,
  barStyle,
  dateVisible,
};
