export interface AssetSymbol {
  precision: number;
  name: string;
}

export interface Asset {
  amount: bigint;
  symbol: AssetSymbol;
}

export interface Token {
  symbol: AssetSymbol;
  contract: string;
  chain: string;
}

export interface InformSellerData {
  buyer: string;
  seller: string;
  token: Token;
  memo: string;
}

export function StringToSymbol(symbol_str: string): AssetSymbol {
  const [precision_str, name] = symbol_str.split(",");
  return { precision: parseInt(precision_str), name };
}

/**
 * Convert an asset in string format to an asset object
 * @param asset_str Asset as string
 * @param precision Decimal places. Convert to this, if defined.
 * @returns Asset object
 */
export function StringToAsset(asset_str: string, precision?: number) {
  // Get symbol name and amount string
  const e = asset_str.indexOf(" ");
  if (e == -1) {
    return undefined;
  }
  const name = asset_str.substring(e + 1);
  const amount_str = asset_str.substring(0, e).replace(/[^0-9.,]/g, "");

  // Get precision and amount
  const s = amount_str.indexOf(".");
  let amount: bigint;
  if (s == -1) {
    if (precision === undefined) {
      precision = 0;
      amount = BigInt(amount_str);
    } else {
      amount = BigInt(amount_str + "0".repeat(precision));
    }
  } else {
    let decimals: string;
    const sp = s + 1;
    if (precision === undefined) {
      precision = amount_str.length - sp;
      decimals = amount_str.substring(sp);
    } else {
      decimals = amount_str
        .substring(sp)
        .padEnd(precision, "0")
        .substring(0, precision);
    }
    amount = BigInt(amount_str.substring(0, s) + decimals);
  }
  return { amount, symbol: { precision, name } } as Asset;
}

export function AssetToString(asset: Asset) {
  const s = asset.amount.toString().padStart(asset.symbol.precision, "0");
  const p = s.length - asset.symbol.precision;
  const int = s.substring(0, p);
  return `${int ? int : "0"}${
    asset.symbol.precision > 0 ? "." : ""
  }${s.substring(p)} ${asset.symbol.name}`;
}

/**
 * Check if a name has valid characters or not
 * @param val User account name
 * @returns true if valid otherwise an error message
 */
function userValidChars(val: string): boolean | string {
  let valid = true;
  for (const c of val) {
    if ("abcdefghijklmnopqrstuvwxyz12345.".indexOf(c) == -1) {
      valid = false;
    }
  }
  if (valid === true) {
    if (val.startsWith("0")) {
      return "It is not allowed to start the name with a dot!";
    }
    if (val.endsWith(".")) {
      return "It is not allowed to end the name with a dot!";
    }
    return true;
  }
  return "Only characters from a to z, 1 to 5 and the dot is allowed for account names!";
}

/**
 * Check offline if a account name or public key is valid
 * @param user Accopunt name or public key
 * @returns true if valid else false
 */
export function checkUserOffline(user: string) {
  if (user.startsWith("EOS") || user.startsWith("PUB_")) {
    // Public key

    return eosjs_ecc.isValidPublic(user) ? true : "Invalid public key";
  } else {
    // User name
    if (user.length > 0 && user.length <= 13) {
      return userValidChars(user);
    }
  }
  return false;
}
