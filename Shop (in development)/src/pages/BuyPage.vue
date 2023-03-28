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
        title="User"
        active-icon="account_circle"
      >
        <buy-step-1
          v-model:buyer-data="buyerData"
          v-model:json-data="jsonData"
          v-model:encrypt="doEncryption"
          v-model:address="address"
          v-model:buyer-name="buyerName"
          v-model:buyer-pup-pgp="buyerPupPgp"
          :id="entry?.id"
          :seller="entry?.seller"
          :pieces="pieces"
          :token="token"
          @encrypted="step = 2"
        ></buy-step-1>
      </q-step>

      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        title="Contact"
        active-icon="mark_email_read"
      >
        <div class="row justify-between">
          <div class="col-auto text-h6 q-pb-md">
            Send the seller your encrypted data
          </div>
          <div class="col-grow q-pb-md row justify-end">
            <div class="col-auto">
              <raw-data-btn
                round
                size="sm"
                color="blue"
                :raw-data="jsonData"
              ></raw-data-btn>
            </div>
            <div class="col-auto">
              <q-btn
                round
                color="blue"
                size="sm"
                class="q-ml-sm"
                @click="copyPgpMsg(buyerData)"
                icon="content_copy"
              ></q-btn>
            </div>
          </div>
        </div>
        <q-input
          type="textarea"
          readonly
          :model-value="buyerData"
          outlined
          label="Encrypted data"
        ></q-input>
      </q-step>

      <q-step
        :name="3"
        prefix="3"
        :done="step > 3"
        title="Payment"
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
        :name="4"
        prefix="4"
        :done="step > 4"
        title="Inform"
        active-icon="mark_email_read"
      >
        Send the seller the link of your transaction and store it for
        yourself.<br />
        [Encrypt]<br />
      </q-step>

      <q-step :name="5" title="Finish" active-icon="local_shipping">
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
            v-if="step < 3 || step == 4 || (step === 3 && transLinkValid)"
            :class="{ 'q-ml-sm': step > 1 }"
            class="q-pr-sm"
            outline
            @click="nextStep"
            color="blue"
            :label="step === 3 ? 'Finish' : 'Continue'"
            icon-right="arrow_forward_ios"
            :loading="doEncryption"
            :disable="doEncryption"
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
import RawDataBtn from "../Components/RawDataBtn.vue";
import AddressInput, { Address } from "../Components/AddressInput.vue";
import BuyStep1 from "../Components/BuySteps/BuyStep1.vue";
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
  components: {
    SetPgp,
    UserInput,
    UserLink,
    TokenSymbol,
    AddressInput,
    RawDataBtn,
    BuyStep1,
  },
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

    const doEncryption = Vue.ref<boolean>(false);
    async function nextStep() {
      if (step.value == 1) {
        doEncryption.value = true;
        return;
      }
      if (step.value < 5) step.value++;
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

    const jsonData = Vue.ref<string>("");
    const address = Vue.ref<Address>({
      firstName: "",
      middleNames: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      postal: "",
      addressL1: "",
      addressL2: "",
    });

    const buyerPupPgp = Vue.ref<string>("");
    const sellerPupPgp = Vue.ref<string>("");

    function copyPgpMsg(text: string) {
      Quasar.copyToClipboard(text)
        .then(() => {
          Quasar.Notify.create({
            type: "positive",
            message: "Copy PGP message to clipboard",
            position: "top",
          });
        })
        .catch(() => {
          Quasar.Notify.create({
            type: "negative",
            message: "Cannot copy to clipboard",
            position: "top",
          });
        });
    }

    //- Default for test
    //     buyerName.value = "savact";
    //     buyerPupPgp.value = `-----BEGIN PGP PUBLIC KEY BLOCK-----

    // xjMEZCKAJxYJKwYBBAHaRw8BAQdAfw9y51Ua2AysnsxM1izayvkfB2LYjIbK
    // yhdGYJCfM0/NAMKMBBAWCgA+BYJkIoAnBAsJBwgJkI4s12BvgWWjAxUICgQW
    // AAIBAhkBApsDAh4BFiEEdTgZRZAKKhgdlUk6jizXYG+BZaMAAGXwAQDmjnlg
    // B1XjnCp4tX+jnRVwZM2pNTgD4U4ecrZeiIPPbQEAr9BcgQaM0OZ/vDUSRNXi
    // gUqDrVoC7O6I9Av3kMwh5grOOARkIoAnEgorBgEEAZdVAQUBAQdAT+w35HNV
    // FpC953E6092UdcuKduOMRqnTcsLVNr1KUGUDAQgHwngEGBYIACoFgmQigCcJ
    // kI4s12BvgWWjApsMFiEEdTgZRZAKKhgdlUk6jizXYG+BZaMAAAXVAQDWPPY1
    // FapepFbedf6bNFOQ8xLpsKzOSk7HPjxbCNjOdwEAquFcoiYYDKrMj3JtaTsB
    // 14tgQTuri+kOA0cZ/3+66wc=
    // =6UQU
    // -----END PGP PUBLIC KEY BLOCK-----
    // `;
    //     address.value.firstName = "Savact";
    //     address.value.lastName = "Test";
    //     address.value.country = "US";
    //     address.value.state = "CA";
    //     address.value.city = "Los Angeles";
    //     address.value.postal = "90001";
    //     address.value.addressL1 = "123 Main St";
    //     address.value.addressL2 = "Apt 1";
    //     //-

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
      doEncryption,
      buyerPupPgp,
      sellerPupPgp,
      jsonData,
      address,
      copyPgpMsg,
    };
  },
});
</script>
