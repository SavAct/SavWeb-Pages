<template>
  <q-card>
    <q-card-section>
      <q-checkbox v-model="sellerConfirms" label="The seller has responded to me and agreed to the purchase." />
      <!-- Removed until pgp encrption should be implemented -->
      <!-- <q-input
        type="textarea"
        :rows="sellerResponse.length > 1 ? 1 : 5"
        v-model="sellerResponse"
        outlined
        label="Sellers response"
      >
        <template v-slot:append>
          <q-icon
            v-if="sellerResponse.length > 0"
            name="close"
            @click="sellerResponse = ''"
            class="cursor-pointer"
          />
        </template>
      </q-input> -->
      <add-pgp-btn
        v-if="isEncrypted"
        class="q-px-sm q-mt-sm"
        v-model="buyerKeys"
        color="blue"
        dense
        label="Your PGP key"
        icon="vpn_key"
        rounded
      ></add-pgp-btn>
      <q-input
        v-if="responseDecrypted.length > 0"
        class="q-mt-sm"
        type="textarea"
        v-model="responseDecrypted"
        outlined
        label="Sellers note"
      ></q-input>
      <div v-if="entry && sellerConfirms" class="q-mt-sm">
        <order-item
          :entry="entry"
          v-model:price="usdPrice"
          :token="token"
          :pieces="pieces"
          :to-region="toRegion"
          @current-token-price="currentTokenPrice = $event"
        ></order-item>
        <div v-if="maxPayTime" class="q-mt-md q-mx-sm q-mb-sm">
          <span class="q-mr-sm"> Payment must be sent before </span>
          <span>
            {{ new Date(maxPayTime * 1000).toLocaleString() }}
          </span>
          <div v-if="restTime">
            {{ formatDuration(restTime) }}
          </div>
        </div>
        <q-btn
          v-if="!maxPayTime || restTime > 10 * 60"
          v-show="!transLinkValid"
          class="full-width"
          color="blue"
          label="Send Payment"
          @click="sendPayment"
        ></q-btn>
        <div v-else>
          The sellers condition until this payment should have been succeeded is
          {{ restTime > 0 ? "almost over!" : "over!" }}<br />
          If you have not sent the payment yet, you may initiate a new request
          for the item and reach out to the seller once again.
        </div>
      </div>
      <q-input
        v-if="sellerConfirms"
        class="q-mt-md"
        label="Transaction link"
        v-model="transLink"
        :loading="waitForTrans"
        outlined
        dense
      ></q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import AddPgpBtn, { PGP_Keys } from "../AddPgpBtn.vue";
import OrderItem from "../OrderItem.vue";
import { PropType } from "vue";
import { state } from "../../store/globals";
import { AssetToString, InformSellerData, Token } from "../AntelopeHelpers";
import { formatDuration } from "../ConvertTime";
import {
  SellerResponse,
  decrypt,
  encrypt,
  generateRandomString,
} from "../Generator";
import { savWeb } from "../../store/connect";
import { ItemTable, UserTable } from "../ContractInterfaces";

export default Vue.defineComponent({
  name: "buyStep3",
  components: { AddPgpBtn, OrderItem },
  emits: [
    "update:privateKey",
    "update:passphrase",
    "update:completed",
    "update:response",
    "update:link",
    "update:jsonData",
    "update:informData",
    "update:price",
  ],
  props: {
    entry: {
      type: Object as PropType<ItemTable>,
      required: true,
      default: null,
    },
    token: {
      type: Object as PropType<Token>,
      required: true,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    toRegion: {
      type: String,
      required: true,
      default: "",
    },
    pieces: {
      type: Number,
      required: true,
      default: 1,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    seller: {
      type: Object as PropType<UserTable>,
      required: true,
      default: undefined,
    },
    buyer: {
      type: String,
      required: true,
      default: "",
    },
    response: {
      type: String,
      required: false,
      default: "",
    },
    link: {
      type: String,
      required: false,
      default: "",
    },
    informData: {
      type: String,
      required: true,
      default: "",
    },
    jsonData: {
      type: String,
      required: true,
      default: "",
    },
    buyerKeys: {
      type: Object as PropType<PGP_Keys>,
      required: true,
      default: "",
    },
  },
  setup(props, context) {
    const sellerConfirms = Vue.ref<boolean>(false);
    const _sellerResponse = Vue.ref<string>(props.response);
    const sellerResponse = Vue.computed({
      get() {
        return _sellerResponse.value;
      },
      set(v) {
        checkResponse(v.trim());
        _sellerResponse.value = v;
      },
    });

    const usdPrice = Vue.computed({
      get() {
        return props.price;
      },
      set(v) {
        context.emit("update:price", v);
      },
    });

    const response = Vue.ref<SellerResponse | undefined>();
    const maxPayTime = Vue.ref<number>();

    async function checkResponse(text: string) {
      if (!props.seller) return;
      if (text.startsWith("-----BEGIN PGP MESSAGE-----")) {
        text = await decrypt(
          text,
          props.buyerKeys.pri,
          props.buyerKeys.passphrase,
          props.seller.pgp
        );
      } else if (!text.startsWith("{")) {
        text = "";
      }

      if (text.length > 0) {
        try {
          response.value = JSON.parse(text) as SellerResponse;
          if (response.value.confirm) {
            if (response.value.buyer == props.buyer) {
              if (typeof response.value.time == "number") {
                maxPayTime.value = response.value.time;
                startTimer();
              }
              sellerConfirms.value = true;
              return;
            }
            console.log("Wrong buyer", response.value.buyer, props.buyer);
            Quasar.Notify.create({
              position: "top",
              type: "negative",
              message: "This message does not match to your account!",
            });
          }
        } catch (e) {
          console.log("Error parsing JSON", e, text);
        }
      }
      response.value = undefined;
      sellerConfirms.value = false;
    }

    const isEncrypted = Vue.computed(() => {
      return (
        sellerResponse.value.indexOf("-----BEGIN PGP MESSAGE-----") != -1 &&
        sellerResponse.value.indexOf("-----END PGP MESSAGE-----") != -1
      );
    });

    const responseDecrypted = Vue.ref<string>("");
    const currentTokenPrice = Vue.ref<bigint>(BigInt(0));
    const totalAsset = Vue.computed(() => {
      return AssetToString({
        amount: currentTokenPrice.value,
        symbol: props.token.symbol,
      });
    });

    const memo = Vue.ref<string>(
      response.value?.memo ? response.value.memo : generateRandomString(8)
    ); // TODO: all further messages should contain the same memo

    async function sendPayment() {
      await updateTokenPrice();
      const assetStr = `${totalAsset.value} ${props.token.contract}`;
      waitForTrans.value = true;
      const result = await savWeb.payment({
        chain: props.token.chain,
        to: props.entry.seller,
        pay: assetStr,
        memo: memo.value,
        // TODO: Use SavPay instead of a normal payment
      });

      if (result) {
        let link = "";
        if ("to" in result && "chain" in result) {
          let from = "from" in result ? result.from : props.buyer;
          if ("index" in result) {
            link = `https://savact.app/#/_trx_/action?user=${from}&to=${result.to}&id=${result.index}&chain=${result.chain}`;
          } else {
            link = `https://savact.app/#/_trx_/history?user=${result.to}&to=${from}&chain=${result.chain}`;
          }
        }
        transLink.value = link;
      } else {
        Quasar.Notify.create({
          position: "top",
          type: "negative",
          message: "Cannot find a transaction",
        });
        transLink.value = "";
      }

      waitForTrans.value = false;
    }

    const transLink = Vue.ref<string>(props.link);
    const waitForTrans = Vue.ref<boolean>(false);
    const transLinkValid = Vue.computed(() => {
      if (
        transLink.value.length > 0 &&
        transLink.value.toLocaleLowerCase().includes("savact.app")
      ) {
        if (
          props.response != sellerResponse.value ||
          props.link != transLink.value ||
          props.completed != true
        ) {
          context.emit("update:response", sellerResponse.value);
          context.emit("update:link", transLink.value);

          delayedCreatAndEncrypt();
        }
        return true;
      }
      context.emit("update:response", "");
      context.emit("update:link", "");
      context.emit("update:completed", false);
      return false;
    });

    Vue.watch([isEncrypted, props.buyerKeys], () => {
      if (isEncrypted.value && props.buyerKeys.pri.length > 0) {
        checkResponse(sellerResponse.value);
      }
    });

    let createAndEncryptId = 0;
    function delayedCreatAndEncrypt() {
      createAndEncryptId++;
      const encryptId = createAndEncryptId;
      setTimeout(() => {
        if (encryptId == createAndEncryptId) {
          createAndEncrypt();
        }
      }, 1000);
    }

    async function createAndEncrypt() {
      const json = createInformJson();
      context.emit("update:jsonData", json);
      let fail = true;
      if (props.seller) {
        if (state.DISABLE_ENCRYPTION) {
          fail = false;
          context.emit("update:informData", json);
        } else {
          // Encrypt
          const data = await encrypt(
            json,
            props.seller.pgp,
            props.buyerKeys.pub,
            props.buyerKeys.pri,
            props.buyerKeys.passphrase
          );
          if (typeof data == "string") {
            context.emit("update:informData", data);
            fail = false;
          } else if (data !== false) {
            context.emit("update:informData", "");
            fail = true;
            Quasar.Notify.create({
              position: "top",
              type: "negative",
              message: "Encryption failed",
              caption: "error" in data ? data.error : undefined,
            });
          }
        }
      } else {
        context.emit("update:informData", json);
        fail = false;
      }
      context.emit("update:completed", !fail);
      if (!fail) {
        Quasar.Notify.create({
          position: "top",
          type: "positive",
          message: "Looks fine. Now continue to inform the seller.",
        });
      }
    }

    async function updateTokenPrice() {
      currentTokenPrice.value = BigInt(Math.round(props.price)); // TODO: Calculate the real current token price
      // TODO: Warn if price changed below -5% that the seller might not accept the payment
    }
    updateTokenPrice();

    const restTime = Vue.ref<number>(0);
    let timerActive = false;
    function startTimer() {
      timerActive = true;
      timer();
    }
    function timer() {
      if (timerActive && maxPayTime.value) {
        restTime.value = maxPayTime.value - Date.now() / 1000;
        setTimeout(timer, 1000);
      } else {
        restTime.value = 0;
      }
    }

    function createInformJson() {
      try {
        if (props.token === undefined) throw new Error("No token");
        if (props.seller === undefined) throw new Error("No seller");
        if (props.buyer === undefined) throw new Error("No buyer");
        if (memo.value === undefined) throw new Error("No memo");
        const jsonData: InformSellerData = {
          buyer: props.buyer,
          seller: props.seller.user,
          token: props.token,
          memo: memo.value,
        };

        return JSON.stringify(jsonData);
      } catch (e) {
        console.log("Error on stringify", e);
        return "";
      }
    }

    if (_sellerResponse.value.length > 0) {
      checkResponse(_sellerResponse.value);
    }

    return {
      darkStyle: state.darkStyle,
      sellerConfirms,
      sellerResponse,
      transLink,
      waitForTrans,
      transLinkValid,
      sendPayment,
      isEncrypted,
      responseDecrypted,
      decrypt,
      updateTokenPrice,
      totalAsset,
      maxPayTime,
      restTime,
      formatDuration,
      currentTokenPrice,
      usdPrice
    };
  },
});
</script>
