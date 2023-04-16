import { Asset, Token } from "./AntelopeHelpers";

export async function getCurrentTokenPrice(
  totalUSD: number,
  token: Token
): Promise<Asset | undefined> {
  // Get price from coingecko.com
  let symApiName: string | undefined = undefined;
  if (token.chain == "eos") {
    switch (token.symbol.name) {
      case "EOS":
        if (token.symbol.precision == 4 && token.contract == "eosio.token") {
          symApiName = "eos";
        }
        break;
      case "ZEOS":
        if (token.symbol.precision == 4 && token.contract == "thezeostoken") {
          symApiName = "zeos";
        }
        break;
    }
  }
  if (token.chain == "wax") {
    switch (token.symbol.name) {
      case "WAX":
        if (token.symbol.precision == 8 && token.contract == "eosio.token") {
          symApiName = "wax";
        }
        break;
      case "TLM":
        if (token.symbol.precision == 4 && token.contract == "alien.worlds") {
          symApiName = "alien-worlds";
        }
        break;
    }
  }
  if (token.chain == "proton") {
    switch (token.symbol.name) {
      case "XPR":
        if (token.symbol.precision == 4 && token.contract == "eosio.token") {
          symApiName = "proton";
        }
        break;
    }
  }
  if (symApiName === undefined) return undefined;
  try {
    const Fetch = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${symApiName}&vs_currencies=usd`
    );
    const json = await Fetch.json();

    const price = json[symApiName].usd;

    if (typeof price !== "number") throw new Error("Price is not a number");
    const tp = (totalUSD / price) * 10 ** token.symbol.precision;

    return {
      amount: BigInt(Math.round(tp)),
      symbol: token.symbol,
    };
  } catch (e) {
    console.log("Error on fetching coingecko API request ", e);
    return undefined;
  }
}
