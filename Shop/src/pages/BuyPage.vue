<template>
  <q-page class="column">
    <q-stepper
      class="col fit"
      v-model="step"
      animated
      active-color="blue"
      style="background-color: var(--q-color-page)"
      v-if="step < 5"
    >
      <q-step
        :name="1"
        prefix="1"
        :done="step > 1"
        :title="$q.screen.gt.xs ? 'User' : ''"
        active-icon="account_circle"
      >
        <buy-step1
          v-model:buyer-data="buyerData"
          v-model:json-data="jsonData"
          v-model:encrypt="doEncryption"
          v-model:address="address"
          v-model:buyer-name="buyerName"
          v-model:buyer-pup-pgp="buyerPupPgp"
          :id="entry?.id"
          :seller="seller"
          :pieces="pieces"
          :token="token"
          @encrypted="step = 2"
          v-model:buyer-pri-pgp="buyerPriPgp"
          v-model:buyer-passphrase="buyerPassphrase"
        ></buy-step1>
      </q-step>

      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        :title="$q.screen.gt.xs ? 'Contact' : ''"
        active-icon="mark_email_read"
      >
        <buy-step2
          :encrypted="buyerData"
          :raw="jsonData"
          :seller="seller"
          v-model:contact="contact"
        ></buy-step2>
      </q-step>

      <q-step
        :name="3"
        prefix="3"
        :done="step > 3"
        :title="$q.screen.gt.xs ? 'Payment' : ''"
        active-icon="currency_bitcoin"
      >
        <buy-step3
          :entry="entry"
          :token="token"
          :price="usdPrice"
          :pieces="pieces"
          :seller="seller"
          :buyer="buyerName"
          :private-key="buyerPriPgp"
          :passphrase="buyerPassphrase"
          v-model:completed="setp3Completed"
          v-model:response="sellerResponse"
          v-model:link="transLink"
        ></buy-step3>
      </q-step>

      <q-step
        :name="4"
        prefix="4"
        :done="step > 4"
        :title="$q.screen.gt.xs ? 'Inform' : ''"
        active-icon="mark_email_read"
      >
        Send the seller the link and token price of your transaction and store
        it for yourself.<br />
        [Encrypt]<br />
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation class="q-gutter-sm">
          <q-btn
            v-if="step > 1"
            outline
            color="deep-orange"
            @click="backStep"
            label="Back"
            icon="arrow_back_ios"
          />
          <q-btn
            v-if="
              step < 2 ||
              (step === 2 && contact) ||
              (step === 3 && setp3Completed) ||
              step == 4
            "
            :class="{ 'q-ml-sm': step > 1 }"
            class="q-pr-sm"
            outline
            @click="nextStep"
            color="blue"
            :label="forwardNaviLabel"
            icon-right="arrow_forward_ios"
            :loading="doEncryption"
            :disable="doEncryption"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <div v-else class="q-ma-md">
      <q-icon name="local_shipping" color="blue"></q-icon>
      <div>
        Wait for the delivery.<br /><br />

        <div>Finalize the payment, if you receive the item.</div>
        <div>
          Burn the payment shortly before the time limit ends, if you do not got
          the item.
        </div>

        [Timer]<br />
        [Open your payment] [Sellers antwort]<br />
        [Checkbox]<br />
        [Send payment]<br />
        [Store this data to look over it on a later time]
      </div>

      <q-btn
        outline
        color="deep-orange"
        @click="backStep"
        label="Back"
        icon="arrow_back_ios"
      />
    </div>
  </q-page>
</template>
<script lang="ts">
import SetPgp from "../Components/SetPgp.vue";
import UserInput from "../Components/UserInput.vue";
import UserLink from "../Components/UserLink.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import RawDataBtn from "../Components/RawDataBtn.vue";
import AddressInput from "../Components/AddressInput.vue";
import BuyStep1 from "../Components/BuySteps/BuyStep1.vue";
import BuyStep2 from "../Components/BuySteps/BuyStep2.vue";
import BuyStep3 from "../Components/BuySteps/BuyStep3.vue";
import { Entry, Seller } from "../Components/Items";
import { state } from "../store/globals";
import { route } from "../router/simpleRouter";
import { Token } from "../Components/AntelopeHelpers";
import { Address } from "../Components/Generator";

export default Vue.defineComponent({
  components: {
    SetPgp,
    UserInput,
    UserLink,
    TokenSymbol,
    AddressInput,
    RawDataBtn,
    BuyStep1,
    BuyStep2,
    BuyStep3,
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

    const _pieces =
      route.query &&
      "pieces" in route.query &&
      typeof route.query.pieces == "number"
        ? route.query.pieces
        : 1;
    const pieces = Vue.ref<number>(_pieces);

    const usdPrice = Vue.computed(() => {
      if (entry.value) {
        console.log("---price---", pieces.value * entry.value.price);

        return pieces.value * entry.value.price; // TODO: Calculate and add delivery price
      }
      return -1;
    });

    const regionName = new Intl.DisplayNames(["en"], { type: "region" });
    const entry = Vue.ref<Entry>();
    entry.value = state.itemsList.find((item) => item.id == id);

    const seller = Vue.ref<Seller>();
    seller.value =
      entry.value && entry.value.seller.length > 0
        ? state.sellerList[entry.value.seller]
        : undefined;

    const step = Vue.ref<number>(1);

    const doEncryption = Vue.ref<boolean>(false);
    const contact = Vue.ref<{ label: string; value: string }>();

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

    const buyerData = Vue.ref<string>("");

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
      note: "",
    });

    const buyerPupPgp = Vue.ref<string>("");
    const buyerPriPgp = Vue.ref<string>("");
    const buyerPassphrase = Vue.ref<string>("");
    const setp3Completed = Vue.ref<boolean>(false);

    const sellerResponse = Vue.ref<string>("");
    const transLink = Vue.ref<string>("");

    const forwardNaviLabel = Vue.computed(() => {
      switch (step.value) {
        case 2:
          return "Got a response";
        case 4:
          return "Finish";
        default:
          return "Continue";
      }
    });

    // Dev mode
    if (false) {
      address.value = {
        firstName: "Sav",
        middleNames: "",
        lastName: "Act",
        country: "Moon",
        state: "Front side",
        city: "Crater",
        postal: "12345",
        addressL1: "Sun street 12",
        addressL2: "",
        note: "With onions please",
      };
      buyerName.value = "savact";
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
      buyerData,
      doEncryption,
      buyerPupPgp,
      seller,
      jsonData,
      address,
      setp3Completed,
      buyerPriPgp,
      buyerPassphrase,
      usdPrice,
      contact,
      forwardNaviLabel,
      sellerResponse,
      transLink,
    };
  },
});
</script>
