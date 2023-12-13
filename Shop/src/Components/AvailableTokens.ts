import { Ref } from "vue";
import { StringToSymbol, Token } from "./AntelopeHelpers";
import { state } from "../store/globals";

async function getTokensData(tokenContract: string, chain: string) {
  const t_data = await state.savWeb.getTableRows(
    chain,
    "savactsavpay",
    "tokens",
    tokenContract
  );
  if (t_data) {
    let allTokens = [];
    for (let i = 0; i < t_data.length; i++) {
      if (!t_data[i].token) {
        return undefined;
      }
      const symbol = StringToSymbol(t_data[i].token);
      const t: Token = {
        contract: tokenContract,
        chain,
        symbol,
      };
      allTokens.push(t);
    }
    if (allTokens.length > 0) return allTokens;
  }
  return undefined;
}

export async function get_available_tokens(
  isGetting: Ref<boolean>,
  callBack: (hasError: boolean) => void
) {
  if (isGetting.value) return;
  isGetting.value = true;
  let noError = true;
  const chain = "eos";
  const result = await state.savWeb.getTableByScope(
    chain,
    "savactsavpay",
    "tokens"
  );
  const availableTokens = [];
  if (result && result.length > 0) {
    for (let i = 0; i < result.length; i++) {
      const tokenContract = result[i];
      const t = await getTokensData(tokenContract.scope, chain);
      if (t) {
        console.log("Token", t);
        availableTokens.push(...t);
      } else {
        noError = false;
      }
    }
  } else {
    noError = false;
  }
  callBack(!noError);
  isGetting.value = false;
  return availableTokens;
}
