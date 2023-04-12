<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Your user name"
      :caption="userName"
      :header-class="{ 'text-red': validBuyerName === false }"
      v-model="expBuyerName"
    >
      <q-card>
        <q-card-section>
          <user-input :fix-chain="token?.chain" v-model="userName"></user-input>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="enhanced_encryption"
      label="Your public PGP key"
      :header-class="{ 'text-red': validBuyerPgp === false }"
      v-model="expBuyerPgp"
    >
      <q-card>
        <q-card-section>
          <set-pgp
            v-model="pubBuyer"
            :account="userName"
            v-model:pri-pgp="bPriPgp"
            v-model:passphrase="bPassphrase"
          ></set-pgp>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <q-expansion-item
      expand-separator
      icon="home"
      label="Your address"
      :header-class="{ 'text-red': validAddress === false }"
      v-model="expAddress"
    >
      <q-card>
        <q-card-section>
          <address-input v-model="addr"></address-input>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script lang="ts">
import UserInput from "../UserInput.vue";
import SetPgp from "../SetPgp.vue";
import AddressInput from "../AddressInput.vue";
import { Address } from "../AddressInput.vue";
import { PropType } from "vue";
import { Token } from "../AntelopeHelpers";
import { UserData } from "../../pages/BuyPage.vue";
import { Seller } from "../Items";

export default Vue.defineComponent({
  name: "buyStep1",
  components: { AddressInput, UserInput, SetPgp },
  emits: [
    "update:encrypt",
    "update:buyerData",
    "update:jsonData",
    "update:buyerName",
    "update:buyerPupPgp",
    "update:buyerPriPgp",
    "update:buyerPassphrase",
    "update:address",
    "encrypted",
  ],
  props: {
    buyerName: {
      type: String,
      requier: true,
      default: "",
    },
    buyerPupPgp: {
      type: String,
      requier: true,
      default: "",
    },
    buyerPriPgp: {
      type: String,
      requier: false,
      default: "",
    },
    buyerPassphrase: {
      type: String,
      requier: false,
      default: "",
    },
    address: {
      type: Object as PropType<Address>,
      requier: true,
      default: "",
    },
    token: {
      type: Object as PropType<Token>,
      requier: true,
    },
    encrypt: {
      type: Boolean,
      requier: true,
      default: false,
    },
    seller: {
      type: Object as PropType<Seller>,
      requier: true,
      default: undefined,
    },
    id: {
      type: Number,
      requier: true,
      default: -1,
    },
    pieces: {
      type: Number,
      requier: true,
      default: 0,
    },
    buyerData: {
      type: String,
      requier: true,
      default: "",
    },
    jsonData: {
      type: String,
      requier: true,
      default: "",
    },
  },
  setup(props, context) {
    const expBuyerName = Vue.ref<boolean>(props.buyerName.length > 0);
    const expBuyerPgp = Vue.ref<boolean>(false);
    const expAddress = Vue.ref<boolean>(false);
    const validBuyerName = Vue.ref<boolean | undefined>();
    const validBuyerPgp = Vue.ref<boolean | undefined>();
    const validAddress = Vue.ref<boolean | undefined>();

    const userName = Vue.computed({
      get() {
        return props.buyerName;
      },
      set(value: string) {
        context.emit("update:buyerName", value);
      },
    });

    const pubBuyer = Vue.computed({
      get() {
        return props.buyerPupPgp;
      },
      set(value: string) {
        context.emit("update:buyerPupPgp", value);
      },
    });

    const addr = Vue.computed({
      get() {
        return props.address;
      },
      set(value: Address) {
        context.emit("update:address", value);
      },
    });

    Vue.watch(
      () => props.encrypt,
      async () => {
        const result = await encrypt();
        context.emit("update:encrypt", false);
        if (result === true) {
          context.emit("encrypted");
        }
      }
    );

    Vue.watch(
      userName,
      () => {
        if (userName.value.length > 0) {
          expBuyerName.value = false;
          if (props.buyerData.length > 0) {
            // TODO: check if buyerData is valid and set expBuyerPgp
          } else {
            expBuyerPgp.value = true;
          }
        }
      },
      { immediate: true }
    );

    function checkUserData() {
      validBuyerName.value = true;
      validBuyerPgp.value = true;
      validAddress.value = true;
      expBuyerName.value = false;
      expBuyerPgp.value = false;
      expAddress.value = false;

      if (!props.token) {
        return "No token selected";
      } else if (props.id === undefined || props.id < 0) {
        return "No item selected";
      } else if (props.buyerName === undefined || props.buyerName.length == 0) {
        validBuyerName.value = false;
        expBuyerName.value = true;
        return "No valid buyer name entered";
      } else if (
        props.buyerPupPgp === undefined ||
        props.buyerPupPgp.length == 0
      ) {
        validBuyerPgp.value = false;
        expBuyerPgp.value = true;
        return "No buyer public PGP key entered";
      }

      // Check address
      let msg: string | undefined = undefined;
      if (!props.address) {
        msg = "No address entered";
      } else if (props.address.firstName.length == 0) {
        msg = "No first name entered";
      } else if (props.address.lastName.length == 0) {
        msg = "No last name entered";
      } else if (props.address.country.length == 0) {
        msg = "No country entered";
      } else if (props.address.state.length == 0) {
        msg = "No state entered";
      } else if (props.address.city.length == 0) {
        msg = "No city entered";
      } else if (props.address.postal.length == 0) {
        msg = "No postal code entered";
      } else if (props.address.addressL1.length == 0) {
        msg = "No address line 1 entered";
      }
      if (msg !== undefined) {
        validAddress.value = false;
        expAddress.value = true;
        return msg;
      }

      return true;
    }
    function createJsonUserData() {
      try {
        if (props.token === undefined) throw new Error("No token");
        if (props.seller === undefined) throw new Error("No seller");
        const userData = props.address as UserData;
        userData.buyer = props.buyerName;
        userData.item = props.id;
        userData.pieces = props.pieces;
        userData.token = props.token;
        userData.seller = props.seller.account;
        userData.sigDate = Date.now();
        userData.pubPgp = props.buyerPupPgp;

        return JSON.stringify(userData);
      } catch (e) {
        console.log("Error on stringify", e);
        return "";
      }
    }

    async function encryptData(text: string) {
      // https://github.com/openpgpjs/openpgpjs
      if (text === undefined || text.length == 0) return false;

      try {
        const message = await openpgp.createMessage({ text });
        const publicBuyerKey = await openpgp.readKey({
          armoredKey: props.buyerPupPgp,
        });

        let privateBuyerKey = undefined;
        if (bPriPgp.value.length > 0) {
          privateBuyerKey = await openpgp.readPrivateKey({
            armoredKey: bPriPgp.value,
          });
          if (bPassphrase.value.length > 0) {
            privateBuyerKey = await openpgp.decryptKey({
              privateKey: privateBuyerKey,
              passphrase: bPassphrase.value,
            });
          }
        }

        if (props.seller) {
          const publicSellerKey = await openpgp.readKey({
            armoredKey: props.seller.pgp,
          });

          const data = (
            await openpgp.encrypt({
              message,
              encryptionKeys: [publicSellerKey, publicBuyerKey],
              signingKeys: privateBuyerKey, // optional
            })
          ).toString();
          context.emit("update:buyerData", data);
          return true;
        } else {
          return "No seller defined";
        }
      } catch (e) {
        console.error("Error on signing", e);
        context.emit("update:buyerData", "");
        return String(e);
      }
    }

    async function encrypt() {
      const result = checkUserData();
      if (typeof result === "string") {
        Quasar.Notify.create({
          position: "top",
          type: "negative",
          message: result,
        });
        context.emit("update:jsonData", "");
        return false;
      }
      const json = createJsonUserData();
      context.emit("update:jsonData", json);
      const isEncrypted = await encryptData(json);
      if (isEncrypted !== true) {
        Quasar.Notify.create({
          position: "top",
          type: "negative",
          message: "Encryption failed",
          caption: isEncrypted !== false ? isEncrypted : "",
        });
        validBuyerPgp.value = false;
        return false;
      }

      return true;
    }

    const bPriPgp = Vue.computed({
      get: () => props.buyerPriPgp,
      set: (v: string) => {
        context.emit("update:buyerPriPgp", v);
      },
    });

    const bPassphrase = Vue.computed({
      get: () => props.buyerPassphrase,
      set: (v: string) => {
        context.emit("update:buyerPassphrase", v);
      },
    });

    return {
      expBuyerName,
      expBuyerPgp,
      expAddress,
      validBuyerName,
      validBuyerPgp,
      validAddress,
      userName,
      pubBuyer,
      addr,
      bPriPgp,
      bPassphrase,
    };
  },
});
</script>
