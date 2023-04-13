<template>
  <q-card>
    <q-card-section>
      <q-input
        type="textarea"
        v-model="sellerResponse"
        outlined
        label="Sellers response"
      ></q-input>
      <add-pgp-btn
        v-if="isEncrypted"
        class="q-px-sm q-mt-sm"
        @pub-pgp="(v) => (publicKey = v)"
        v-model:pri-pgp="privateKey"
        v-model:passphrase="passphrase"
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
      <!-- [Checkbox]<br /> -->
      <div
        v-if="entry && sellerConfirms"
        class="row"
        style="border: 1px solid #ddd; border-radius: 4px"
      >
        <div class="col-3">
          <pro-img
            v-if="entry.imgs.length > 0"
            :src="entry.imgs[0]"
            fit="contain"
            :class="darkStyle ? 'bg-grey-10' : 'bg-grey-2'"
          ></pro-img>
        </div>
        <div class="col-9 q-px-md">
          <div
            class="text-bold q-pt-sm q-px-sm"
            :class="$q.screen.gt.xs ? 'text-h6' : ''"
          >
            {{ entry.title }}
          </div>
          <div class="row justify-between">
            <div class="col-auto">
              <div>{{ pieces }}x {{ entry.price }} USD</div>
              <div>+ Shipping {{ 0 }} USD</div>
              <div>
                Total price
                <q-chip icon="attach_money" :label="price + ' USD'"></q-chip>
                Current token price
                <q-chip
                  icon="currency_bitcoin"
                  :label="totalAsset"
                  clickable
                  @click="updateTokenPrice"
                ></q-chip>
              </div>
            </div>
            <user-link class="col-auto" :user="entry.seller"></user-link>
          </div>

          <token-symbol
            :chain="token?.chain"
            :contract="token?.contract"
            :symbol="token?.symbol"
            size="18px"
          ></token-symbol>
        </div>
        <div v-if="maxPayTime" class="q-mt-md q-mx-sm q-mb-sm">
          <span class="q-mr-sm"> Payment must be sent before </span>
          <span>
            {{ new Date(maxPayTime * 1000).toLocaleString() }}
          </span>
          <div>
            {{ formatDuration(restTime) }}
          </div>
        </div>
        <q-btn
          v-if="!maxPayTime || restTime > 10 * 60"
          class="full-width"
          color="blue"
          label="Send Payment"
          @click="sendPayment"
        ></q-btn>
        <div v-else>
          The sellers condition until this payment should have been succeeded is
          {{ restTime > 0 ? "over!" : "almost over!" }}<br />
          If you have not sent the payment yet, you may initiate a new request
          for the item and reach out to the seller once again.
        </div>
      </div>
      <q-input
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
import ProImg from "../ProImg.vue";
import AddPgpBtn from "../AddPgpBtn.vue";
import { PropType } from "vue";
import { state } from "../../store/globals";
import { AssetToString, Token } from "../AntelopeHelpers";
import { Entry, Seller } from "../Items";
import { formatDuration } from "../ConverTime";
import { generateRandomString } from "../Generator";

interface Response {
  confirm: boolean;
  buyer: string;
  memo?: string;
  time?: number;
  sigTime?: number;
}

export default Vue.defineComponent({
  name: "buyStep3",
  components: { ProImg, AddPgpBtn },
  props: {
    entry: {
      type: Object as PropType<Entry>,
      requier: true,
      default: null,
    },
    token: {
      type: Object as PropType<Token>,
      requier: true,
      default: null,
    },
    price: {
      type: Number,
      requier: true,
      default: 0,
    },
    pieces: {
      type: Number,
      requier: true,
      default: 1,
    },
    completed: {
      type: Boolean,
      requier: false,
      default: false,
    },
    seller: {
      type: Object as PropType<Seller>,
      requier: true,
      default: undefined,
    },
    buyer: {
      type: String,
      requier: true,
      default: "",
    },
  },
  setup(props, context) {
    const publicKey = Vue.ref<string>("");
    const privateKey = Vue.ref<string>("");
    const passphrase = Vue.ref<string>("");

    const sellerConfirms = Vue.ref<boolean>(false);
    const _sellerResponse = Vue.ref<string>("");
    const sellerResponse = Vue.computed({
      get() {
        return _sellerResponse.value;
      },
      set(v) {
        checkResponse(v.trim());
        _sellerResponse.value = v;
      },
    });

    const response = Vue.ref<Response | undefined>();
    const maxPayTime = Vue.ref<number>();

    async function checkResponse(text: string) {
      if (!props.seller) return;
      if (text.startsWith("-----BEGIN PGP MESSAGE-----")) {
        text = await decrypt(text);
      } else if (!text.startsWith("{")) {
        text = "";
      }

      if (text.length > 0) {
        try {
          response.value = JSON.parse(text) as Response;
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

    async function decrypt(text: string): Promise<string> {
      if (!props.seller) return "";
      const message = await openpgp.createMessage({ text });
      const publicSellerKey = await openpgp.readKey({
        armoredKey: props.seller.pgp,
      });

      let privateBuyerKey = undefined;
      if (privateKey.value.length == 0) {
        // TODO: await on dialog for private key and passphrase request
      }

      if (privateKey.value.length > 0) {
        privateBuyerKey = await openpgp.readPrivateKey({
          armoredKey: privateKey.value,
        });
        if (passphrase.value.length > 0) {
          privateBuyerKey = await openpgp.decryptKey({
            privateKey: privateBuyerKey,
            passphrase: passphrase.value,
          });
        }
        const decrypted = await openpgp.decrypt({
          message,
          verificationKeys: publicSellerKey,
          decryptionKeys: [privateBuyerKey],
        });
        try {
          console.log("------Decrypted", decrypted); // TODO: Test decription with signature verification
          await decrypted.signatures[0].verified; // throws on invalid signature
          console.log("Signature is valid");
          return decrypted.data.toString();
        } catch (e) {
          console.error("Signature could not be verified", e);
        }
      }
      return "";
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

    async function sendPayment() {
      await updateTokenPrice();
      const assetStr = `${totalAsset.value} ${props.token.contract}`;
      state.savWeb.payment(
        props.token.chain,
        props.entry.seller,
        assetStr,
        response.value?.memo ? response.value.memo : generateRandomString(8)
      );
      waitForTrans.value = true;
      // TODO: Receive transaction result
    }

    const transLink = Vue.ref<string>("");
    const waitForTrans = Vue.ref<boolean>(false);
    const transLinkValid = Vue.computed(() => {
      if (
        transLink.value.length > 0 &&
        transLink.value.toLocaleLowerCase().includes("savact.app")
      ) {
        context.emit("update:completed", true);
        return true;
      }
      context.emit("update:completed", false);
      return false;
    });

    Vue.watch([isEncrypted, privateKey, passphrase], () => {
      if (isEncrypted.value && privateKey.value.length > 0) {
        checkResponse(sellerResponse.value);
      }
    });

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

    return {
      darkStyle: state.darkStyle,
      sellerConfirms,
      sellerResponse,
      transLink,
      waitForTrans,
      transLinkValid,
      sendPayment,
      publicKey,
      privateKey,
      isEncrypted,
      responseDecrypted,
      decrypt,
      passphrase,
      updateTokenPrice,
      totalAsset,
      maxPayTime,
      restTime,
      formatDuration,
    };
  },
});
</script>
