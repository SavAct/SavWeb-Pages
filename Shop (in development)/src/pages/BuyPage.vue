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
        :title="$q.screen.gt.xs ? 'User' : ''"
        active-icon="account_circle"
      >
        <buy-step-1
          v-model:buyer-data="buyerData"
          v-model:json-data="jsonData"
          v-model:encrypt="doEncryption"
          v-model:address="address"
          v-model:buyer-name="buyerName"
          v-model:buyer-pup-pgp="buyerPupPgp"
          v-model:seller-pup-pgp="sellerPupPgp"
          :id="entry?.id"
          :seller="entry?.seller"
          :pieces="pieces"
          :token="token"
          @encrypted="step = 2"
          v-model:buyer-pri-pgp="buyerPriPgp"
          v-model:buyer-passphrase="buyerPassphrase"
        ></buy-step-1>
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
          :pub-pgp="sellerPupPgp"
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
          v-bind:completed="setp3Completed"
        ></buy-step3>
      </q-step>

      <q-step
        :name="4"
        prefix="4"
        :done="step > 4"
        :title="$q.screen.gt.xs ? 'Inform' : ''"
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
            v-if="step < 3 || step == 4 || (step === 3 && setp3Completed)"
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
import BuyStep2 from "../Components/BuySteps/BuyStep2.vue";
import BuyStep3 from "../Components/BuySteps/BuyStep3.vue";
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
    const sellerPupPgp = Vue.ref<string>("");
    const setp3Completed = Vue.ref<boolean>(false);

    //- Default for test
    buyerName.value = "savact";
    sellerPupPgp.value = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZCLVyxYJKwYBBAHaRw8BAQdA/0EykbX9Pn7AteNUSKgZZEYA4R5HBbvz
+OQFC/DcI8HNAMKMBBAWCgA+BYJkItXLBAsJBwgJkAN/uZJn3/7RAxUICgQW
AAIBAhkBApsDAh4BFiEEvgFLzCbE2q8FqySfA3+5kmff/tEAAGv3AP9WhnfS
buP9pAItsUBYWP1v+Fo98yL26eimHG4zvrHoPAD8CpjrI9drE4dCqKEp0bCo
gq+CI9UNwM/680rq/LdEigDOOARkItXLEgorBgEEAZdVAQUBAQdAcs7c7FdD
699aOYZ1FUPbkcnz/QfYnRpMhOWFF8rrOD8DAQgHwngEGBYIACoFgmQi1csJ
kAN/uZJn3/7RApsMFiEEvgFLzCbE2q8FqySfA3+5kmff/tEAAE0PAP9U4z26
1/A66AayqVRsPsxUh8ysZMm5UHaX9zngSSZ6lwD+KbKl/4TBB+/qPk8P1y70
L7mDr4xuUpUNEUMbYc1O9A4=
=a2sb
-----END PGP PUBLIC KEY BLOCK-----
    `;
    address.value.firstName = "Savact";
    address.value.lastName = "Test";
    address.value.country = "US";
    address.value.state = "CA";
    address.value.city = "Los Angeles";
    address.value.postal = "90001";
    address.value.addressL1 = "123 Main St";
    address.value.addressL2 = "Apt 1";
    address.value.note = "No note";
    //-

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
      sellerPupPgp,
      jsonData,
      address,
      setp3Completed,
      buyerPriPgp,
      buyerPassphrase,
    };
  },
});
</script>
