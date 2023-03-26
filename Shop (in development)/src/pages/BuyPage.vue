<template>
  <q-page class="column">
    <q-stepper
      class="col fit"
      v-model="step"
      animated
      active-color="blue"
      style="background-color: var(--q-color-page)"
    >
      <q-step
        :name="1"
        prefix="1"
        :done="step > 1"
        title="Contact Seller"
        active-icon="mail"
      >
        <div class="text-h6">Enter your user name</div>
        <user-input
          :fix-chain="token?.chain"
          v-model="buyerName"
          class="q-mt-md"
        ></user-input>
        <div class="q-my-sm">
          <div class="text-h6">Enter your public PGP key</div>
          <set-pgp v-model="buyerPupPgp" :account="buyerName"></set-pgp>
        </div>
        <div class="text-h6">Enter your address</div>
        <address-input @address="setAddress"></address-input>
        <div class="text-h6 q-mt-md">Send the seller your encrypted data</div>
        <q-input
          type="textarea"
          readonly
          :model-value="buyerData"
          outlined
          label="Encrypted data"
        ></q-input>
      </q-step>

      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        title="Send Payment"
        active-icon="currency_bitcoin"
      >
        <q-input
          type="textarea"
          v-model="sellerResponse"
          outlined
          label="Sellers response"
        ></q-input>
        [If it is encrypted, enter your private key to decrypt]<br />
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
                <q-chip
                  icon="attach_money"
                  :label="entry.price + ' USD'"
                ></q-chip>
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
          <q-btn
            class="full-width"
            color="blue"
            label="Send Payment"
            @click="sendPayment"
          ></q-btn>
        </div>
        <q-input
          class="q-mt-md"
          label="Transaction link"
          v-model="transLink"
          :loading="waitForTrans"
          outlined
          dense
        ></q-input>
      </q-step>

      <q-step
        :name="3"
        prefix="3"
        :done="step > 3"
        title="Inform Seller"
        active-icon="mark_email_read"
      >
        Send the seller the link of your transaction and store it for
        yourself.<br />
        [Encrypt]<br />
      </q-step>

      <q-step :name="4" title="Finish" active-icon="local_shipping">
        Wait for the delivery.<br /><br />

        <div>Finalize the payment, if you receive the item.</div>
        <div>
          Burn the payment shortly before the time limit ends, if you do not got
          the item.
        </div>

        [Timer]<br />
        [Open your payment] [Sellers antwort]<br />
        [Checkbox]<br />
        [Send payment]
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="step > 1"
            outline
            color="deep-orange"
            @click="backStep"
            label="Back"
            icon="arrow_back_ios"
          />
          <q-btn
            v-if="step < 2 || step == 3 || (step === 2 && transLinkValid)"
            :class="{ 'q-ml-sm': step > 1 }"
            class="q-pr-sm"
            outline
            @click="nextStep"
            color="blue"
            :label="step === 3 ? 'Finish' : 'Continue'"
            icon-right="arrow_forward_ios"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>
<script lang="ts">
import SetPgp from "../Components/SetPgp.vue";
import UserInput from "../Components/UserInput.vue";
import UserLink from "../Components/UserLink.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import AddressInput, { Address } from "../Components/AddressInput.vue";
import { Entry } from "../Components/Items";
import { state } from "../store/globals";
import { route } from "../router/simpleRouter";
import { Token } from "../Components/AntelopeHelpers";

export interface UserData extends Address {
  buyer: string;
  pubPgp: string;
  item: number;
  pieces: number;
  token: Token;
  seller: string;
  sigDate: number;
}

export default Vue.defineComponent({
  components: { SetPgp, UserInput, UserLink, TokenSymbol, AddressInput },
  name: "buyPage",
  setup() {
    const id =
      route.query && "id" in route.query && typeof route.query.id == "number"
        ? route.query.id
        : -1;
    const token =
      route.query &&
      "token" in route.query &&
      typeof route.query.token == "object"
        ? (route.query.token as Token)
        : undefined;

    const regionName = new Intl.DisplayNames(["en"], { type: "region" });
    const entry = Vue.ref<Entry>();
    entry.value = state.itemsList.find((item) => item.id == id);

    const pieces = Vue.ref<number>(1);

    const step = Vue.ref<number>(1);

    function nextStep() {
      if (step.value < 4) step.value++;
    }

    function backStep() {
      if (step.value > 1) step.value--;
    }

    function getRegion(code: string) {
      const c = regionName.of(code);
      if (c !== undefined) {
        return c;
      } else {
        switch (code) {
          case "ww":
            return "World Wide";
        }
      }
      return undefined;
    }

    function getRegions(r: string) {
      return r !== undefined
        ? r
            .split(" ")
            .map((v) => getRegion(v))
            .join(", ")
        : undefined;
    }

    const buyerName = Vue.ref<string>("");

    function sendPayment() {
      waitForTrans.value = true;
    }
    const transLink = Vue.ref<string>("");
    const waitForTrans = Vue.ref<boolean>(false);
    const transLinkValid = Vue.computed(() => {
      if (
        transLink.value.length > 0 &&
        transLink.value.toLocaleLowerCase().includes("savact.app")
      ) {
        return true;
      }
      return false;
    });

    const buyerData = Vue.ref<string>("");

    const sellerConfirms = Vue.ref<boolean>(false);
    const _sellerResponse = Vue.ref<string>("");
    const sellerResponse = Vue.computed({
      get() {
        return _sellerResponse.value;
      },
      set(v) {
        // TODO: Defined by response of the seller deadline.minTime and deadline.maxTime
        if (v.trim().toLocaleLowerCase().startsWith("yes")) {
          sellerConfirms.value = true;
        } else {
          // TODO: try to decrypt and check then if it is a yes
          sellerConfirms.value = false;
        }
        _sellerResponse.value = v;
      },
    });

    const address = Vue.ref<Address>();
    function setAddress(event: Address) {
      address.value = event;
      encrypt();
    }

    const buyerPupPgp = Vue.ref<string>("");
    const sellerPupPgp = Vue.ref<string>("");

    const jsonData = Vue.computed(() => {
      if (
        !token ||
        !entry.value ||
        buyerName.value.length == 0 ||
        buyerPupPgp.value.length == 0
      )
        return;
      const userData = address.value as UserData;
      userData.buyer = buyerName.value;
      userData.item = id;
      userData.pieces = pieces.value;
      userData.token = token;
      userData.seller = entry.value.seller;
      userData.sigDate = Date.now();
      userData.pubPgp = buyerPupPgp.value;

      return JSON.stringify(userData);
    });

    async function encrypt() {
      // https://github.com/openpgpjs/openpgpjs
      if (jsonData.value === undefined) return;
      console.log("sign", jsonData.value);

      try {
        const message = await openpgp.createMessage({ text: jsonData.value });
        const publicKey = await openpgp.readKey({
          armoredKey: buyerPupPgp.value,
        });

        buyerData.value = (
          await openpgp.encrypt({
            message,
            encryptionKeys: new Array(publicKey),
          })
        ).toString();
      } catch (e) {
        console.error("Error on signing", e);
        buyerData.value = "";
      }
    }

    return {
      progress: state.progress,
      darkStyle: state.darkStyle,
      entry,
      getRegions,
      step,
      nextStep,
      backStep,
      pieces,
      buyerName,
      token,
      transLink,
      waitForTrans,
      sendPayment,
      transLinkValid,
      sellerResponse,
      sellerConfirms,
      buyerData,
      setAddress,
      buyerPupPgp,
      sellerPupPgp,
      jsonData,
    };
  },
});
</script>
