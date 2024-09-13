<template>
  <q-list bordered class="rounded-borders">
    <q-expansion-item
      expand-separator
      icon="perm_identity"
      label="Your user name"
      :caption="userName"
      :header-class="{
        'text-red': validBuyerName === false,
      }"
      v-model="expBuyerName"
    >
      <q-card>
        <q-card-section>
          <user-input
            :fix-chain="typeof token?.chain === 'string'"
            v-model="userName"
          ></user-input>
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
          <set-pgp v-model="bKeys" :account="userName"></set-pgp>
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

import { PropType } from "vue";
import { Token } from "../AntelopeHelpers";

import { Address, UserData, encrypt } from "../Generator";
import { PGP_Keys } from "../AddPgpBtn.vue";
import { UserTable } from "../ContractInterfaces";

export default Vue.defineComponent({
  name: "buyStep1",
  components: { AddressInput, UserInput, SetPgp },
  emits: [
    "update:encrypt",
    "update:buyerData",
    "update:jsonData",
    "update:buyerName",
    "update:buyerKeys",
    "update:address",
    "encrypted",
  ],
  props: {
    buyerName: {
      type: String,
      required: true,
      default: "",
    },
    buyerKeys: {
      type: Object as PropType<PGP_Keys>,
      required: true,
      default: {
        pub: "",
        pri: "",
        passphrase: "",
      },
    },
    address: {
      type: Object as PropType<Address>,
      required: true,
      default: "",
    },
    token: {
      type: Object as PropType<Token>,
      required: true,
      default: undefined,
    },
    encrypt: {
      type: Boolean,
      required: true,
      default: false,
    },
    seller: {
      type: Object as PropType<UserTable>,
      required: true,
      default: undefined,
    },
    item: {
      type: Object as PropType<{ id: number; category: bigint }>,
      required: true,
      default: undefined,
    },
    pieces: {
      type: Number,
      required: true,
      default: 0,
    },
    buyerData: {
      type: String,
      required: true,
      default: "",
    },
    jsonData: {
      type: String,
      required: true,
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
        if (value.length > 0) {
          validBuyerName.value = true;
        }
        context.emit("update:buyerName", value);
        // TODO: Check if there is a public key of the buyer on blockchain and use it if there is one
      },
    });

    const bKeys = Vue.computed({
      get() {
        return props.buyerKeys;
      },
      set(value: PGP_Keys) {
        context.emit("update:buyerKeys", value);
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
        if (props.encrypt) {
          const result = await createAndEncrypt();
          context.emit("update:encrypt", false);
          if (result === true) {
            context.emit("encrypted");
          }
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
      } else if (
        props.item?.id === undefined ||
        props.item?.id < 0 ||
        props.item.category === undefined ||
        typeof props.item.category !== "bigint"
      ) {
        return "No item selected";
      } else if (props.buyerName === undefined || props.buyerName.length == 0) {
        validBuyerName.value = false;
        expBuyerName.value = true;
        return "No valid buyer name entered";
      } else if (
        props.buyerKeys.pub === undefined ||
        props.buyerKeys.pub.length == 0
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
        if (props.item === undefined) throw new Error("No item");
        const userData = props.address as UserData;
        userData.buyer = props.buyerName;
        userData.item = {
          id: props.item.id,
          category: String(props.item.category),
        };
        userData.pieces = props.pieces;
        userData.token = props.token;
        userData.seller = props.seller.user;
        userData.sigDate = Date.now();
        userData.pubPgp = props.buyerKeys.pub;
        userData.step = 1;
        userData.rBy = "buyer";

        return JSON.stringify(userData);
      } catch (e) {
        console.log("Error on stringify", e);
        return "";
      }
    }

    async function createAndEncrypt() {
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

      if (props.seller) {        
        const data = await encrypt(
          json,
          props.seller.pgp,
          props.buyerKeys.pub,
          // props.buyerKeys.pri,
          // props.buyerKeys.passphrase
        );
        if (typeof data == "string") {
          context.emit("update:buyerData", data);

          return true;
        } else if (data !== false) {
          context.emit("update:buyerData", "");
          Quasar.Notify.create({
            position: "top",
            type: "negative",
            message: "Encryption failed",
            caption: "error" in data ? data.error : undefined,
          });
        }
      }
      validBuyerPgp.value = false;
      return false;
    }

    return {
      expBuyerName,
      expBuyerPgp,
      expAddress,
      validBuyerName,
      validBuyerPgp,
      validAddress,
      userName,
      bKeys,
      addr,
    };
  },
});
</script>
