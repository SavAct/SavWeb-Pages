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
// export function checkUserOffline(user: string) {
//   if (user.startsWith("EOS") || user.startsWith("PUB_")) {
//     // Public key
//     return eosjs_ecc.isValidPublic(user) ? true : "Invalid public key";
//   } else {
//     // User name
//     if (user.length > 0 && user.length <= 13) {
//       return userValidChars(user);
//     }
//   }
//   return false;
// }
