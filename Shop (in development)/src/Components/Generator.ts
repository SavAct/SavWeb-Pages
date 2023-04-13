import { Token } from "./AntelopeHelpers";

export interface SellerResponse {
  confirm: boolean;
  buyer: string;
  memo?: string;
  time?: number;
  sigTime?: number;
}

export interface Address {
  firstName: string;
  middleNames: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  postal: string;
  addressL1: string;
  addressL2: string;
  note: string;
}

export interface UserData extends Address {
  buyer: string;
  pubPgp: string;
  itemId: number;
  pieces: number;
  token: Token;
  seller: string;
  sigDate: number;
}

export function generateRandomString(length: number) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export async function decrypt(
  text: string,
  privateKey: string,
  passphrase: string,
  verifyPublicKey: string
): Promise<string> {
  try {
    const message = await openpgp.createMessage({ text });
    const veryPublicKey =
      verifyPublicKey.length > 0
        ? await openpgp.readKey({
            armoredKey: verifyPublicKey,
          })
        : undefined;

    let privateBuyerKey = undefined;
    if (privateKey.length == 0) {
      console.log("Enter private key and passphrase");
      return "";
    }

    if (privateKey.length > 0) {
      privateBuyerKey = await openpgp.readPrivateKey({
        armoredKey: privateKey,
      });
      if (passphrase.length > 0) {
        privateBuyerKey = await openpgp.decryptKey({
          privateKey: privateBuyerKey,
          passphrase: passphrase,
        });
      }
      const decrypted = await openpgp.decrypt({
        message,
        verificationKeys: veryPublicKey,
        decryptionKeys: [privateBuyerKey],
      });
      try {
        if (veryPublicKey) {
          console.log("------Decrypted", decrypted); // TODO: Test decription with signature verification
          await decrypted.signatures[0].verified; // throws on invalid signature
          console.log("Signature is valid");
        }
        return decrypted.data.toString();
      } catch (e) {
        console.error("Signature could not be verified", e);
      }
    }
  } catch (e) {
    console.log("Error decrypting", e);
  }
  return "";
}
