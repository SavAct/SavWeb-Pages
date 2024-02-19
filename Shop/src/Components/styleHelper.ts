import { state } from "../store/globals";

export function chipBgColor(selected = false) {
  return state.darkStyle.value
    ? selected
      ? "grey-10"
      : "grey-9"
    : selected
      ? "grey-1"
      : "";
}
