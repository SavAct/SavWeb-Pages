import { Token } from "./AntelopeHelpers";

export interface SellerResponse {
  confirm: boolean;
  buyer: string;
  note?: string;
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

export async function encrypt(
  text: string,
  recipientPublicKey: string,
  senderPublicKey: string,
  signingPrivateKey?: string,
  signingPassphrase?: string
) {
  // https://github.com/openpgpjs/openpgpjs
  if (text === undefined || text.length == 0) return false;

  try {
    const message = await openpgp.createMessage({ text });
    const senderPupKey = await openpgp.readKey({
      armoredKey: senderPublicKey,
    });

    let singingPriKey = undefined;
    if (signingPrivateKey !== undefined && signingPrivateKey.length > 0) {
      singingPriKey = await openpgp.readPrivateKey({
        armoredKey: signingPrivateKey,
      });
      if (signingPassphrase !== undefined && signingPassphrase.length > 0) {
        singingPriKey = await openpgp.decryptKey({
          privateKey: singingPriKey,
          passphrase: signingPassphrase,
        });
      }
    }

    if (recipientPublicKey) {
      const recipientPupKey = await openpgp.readKey({
        armoredKey: recipientPublicKey,
      });

      const data = (
        await openpgp.encrypt({
          message,
          encryptionKeys: [recipientPupKey, senderPupKey],
          signingKeys: singingPriKey, // optional
        })
      ).toString();
      return data;
    } else {
      return { error: "No recipient defined" };
    }
  } catch (e) {
    console.error("Error on signing", e);
    return { error: String(e) };
  }
}
