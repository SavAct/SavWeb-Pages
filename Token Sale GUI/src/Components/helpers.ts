import { PublicKey } from "@greymass/eosio";
import { state } from "../store/globals";

export function toClipboard(text: string) {
  Quasar.copyToClipboard(text)
    .then(() => {
      if (text.length > 0) {
        Quasar.Notify.create({
          position: "top-right",
          icon: "copy_all",
          message:
            (state.lang.value == "de"
              ? "In die Zwischenablage kopiert: "
              : "Copy to clipboard: ") + text,
        });
      }
    })
    .catch(() => {
      showError(
        state.lang.value == "de"
          ? "Das Kopieren in die Zwischenablage ist fehlgeschlagen."
          : "Can't copy to clipboard."
      );
    });
}

export function showError(text: string, caption = undefined) {
  Quasar.Notify.create({
    color: "negative",
    icon: "report_problem",
    position: "top",
    message: text,
    caption,
  });
}

export function showCongrat(
  text: string,
  caption: undefined | string = undefined
) {
  Quasar.Notify.create({
    color: "positive",
    icon: "star",
    position: "top-right",
    message: text,
    caption,
  });
}

export function isValidPublic(key: string) {
  try {
    PublicKey.from(key);
    return true;
  } catch (e) {}
  return false;
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Converts asset values to a string
 * @param amount A bigint not a number
 * @param precision The amount of decimal places
 * @param symbol Symbol as string
 * @returns A string in contract parameter format for assets
 */
export function assetToString(
  amount: bigint,
  precision: number,
  symbol: string
) {
  const strA = amount.toString().padStart(precision + 1, "0");
  const putI = strA.length - precision;
  return `${strA.slice(0, putI)}.${strA.slice(putI)} ${symbol}`;
}

export function checkNameChars(name: string) {
  for (let i = 0; i < name.length; ++i) {
    if (!".12345abcdefghijklmnopqrstuvwxyz".includes(name[i])) {
      return false;
    }
  }
  return true;
}

export async function checkName(username: string) {
  let exist = await checkNameExist(username);
  if (exist === true) {
    return true;
  }
  if (exist === false) {
    showError(
      state.lang.value == "de"
        ? `Der Name "${username}" kann nicht betsätigt werden. Er ist möglicherweise nicht vergeben.`
        : `Can not verify the name "${username}". It might not exist.`
    );
  }
  return false;
}

export async function checkNameExist(username: string) {
  if (username.trim() == "") {
    showError(
      state.lang.value == "de"
        ? "Bitte geben Sie einen Namen ein."
        : "Please enter a name."
    );
    return null;
  }
  if (!checkNameChars(username)) {
    showError(
      state.lang.value == "de"
        ? "Ungültiger Name. Erlaubte Zeichen sind die Kleinbuchstaben a-z, . und 1-5"
        : "Invalid name. Permitted characters are the lowercase letters a-z, . and 1-5"
    );
    return null;
  }
  // Check name exists
  const hasName = await state.savWeb.checkName(state.usedChain, username);

  if (hasName == undefined || hasName === false) {
    return false;
  }
  return true;
}
