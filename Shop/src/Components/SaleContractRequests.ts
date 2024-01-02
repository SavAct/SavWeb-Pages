import { savWeb } from "../store/connect";
import { state } from "../store/globals";
import { StringToSymbol, isTableResultWithEntries } from "./AntelopeHelpers";
import { TokenSymbol, UserTable } from "./ContractInterfaces";

export function isUserTableEntryValid(userTableEntry: UserTable) {
  return (
    userTableEntry.pgp !== undefined &&
    userTableEntry.contact !== undefined &&
    userTableEntry.allowed !== undefined &&
    userTableEntry.note !== undefined &&
    userTableEntry.active !== undefined &&
    userTableEntry.banned !== undefined
  );
}

export function userTableEntryToUser(userTableEntry: UserTable) {
  return {
    ...userTableEntry,
    active: Boolean(userTableEntry.active),
    allowed: userTableEntry.allowed.map((t: TokenSymbol) => {
      return {
        symbol: StringToSymbol(t.sym),
        contract: t.contr,
        chain: t.chain,
      };
    }),
  };
}

/**
 * Get User data from the blockchain and save it to the global state
 * @param userName User account name
 * @returns true if user data was found and saved to the global state
 */
export async function getUserDataToState(userName: string) {
  const result = await savWeb.getTableRows({
    chain: state.contract.chain,
    code: state.contract.account,
    scope: state.contract.account,
    table: state.contract.tables.user,
    entry: userName,
  });

  if (isTableResultWithEntries(result)) {
    const user = (result as { rows: Array<UserTable> }).rows[0];
    if (isUserTableEntryValid(user)) {
      state.user.value = userTableEntryToUser(user); // Adopt new global user state
      return true;
    }
  }
  return false;
}
