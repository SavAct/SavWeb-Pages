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
          v-model:json-data="requestJson"
          v-model:encrypt="doEncryption"
          v-model:address="address"
          v-model:buyer-name="buyerName"
          v-model:buyer-keys="buyerKeys"
          :id="entry?.id"
          :seller="seller"
          :pieces="pieces"
          :token="token"
          @encrypted="step = 2"
        ></buy-step1>
      </q-step>

      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        :title="$q.screen.gt.xs ? 'Contact' : ''"
        active-icon="mark_email_read"
      >
        <buy-step-24-send-data
          title="Make a request by sending the seller your encrypted data"
          :encrypted="buyerData"
          :raw="requestJson"
          :seller="seller"
          v-model:contact="contact"
        ></buy-step-24-send-data>
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
          :buyer-keys="buyerKeys"
          v-model:completed="setp3Completed"
          v-model:response="sellerResponse"
          v-model:link="trxLink"
          v-model:inform-data="informData"
          v-model:json-data="informJson"
        ></buy-step3>
      </q-step>

      <q-step
        :name="4"
        prefix="4"
        :done="step > 4"
        :title="$q.screen.gt.xs ? 'Inform' : ''"
        active-icon="mark_email_read"
      >
        <buy-step-24-send-data
          title="Better inform the seller about your payment by sending him this encrypted data"
          :encrypted="informData"
          :raw="informJson"
          :seller="seller"
          v-model:contact="contact"
        ></buy-step-24-send-data>
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
    <div v-else class="q-ma-lg">
      <finished
        class="q-mb-lg"
        :entry="entry"
        :token="token"
        :price="usdPrice"
        :pieces="pieces"
        :seller="seller"
        :inform-json="informJson"
      ></finished>
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
import BuyStep24SendData from "../Components/BuySteps/BuyStep24SendData.vue";
import BuyStep3 from "../Components/BuySteps/BuyStep3.vue";
import Finished from "../Components/BuySteps/Finished.vue";
import { state } from "../store/globals";
import { Token } from "../Components/AntelopeHelpers";
import { Address } from "../Components/Generator";
import { ItemTable, UserTable } from "../Components/ContractInterfaces";
import { PGP_Keys } from "../Components/AddPgpBtn.vue";
import { LoadFromContract } from "../Components/MarketContractHandle";
import { getRegion } from "../Components/ConvertRegion";
import { GetQueryOrderRequest } from "../Components/queryHelper";

export default Vue.defineComponent({
  components: {
    SetPgp,
    UserInput,
    UserLink,
    TokenSymbol,
    AddressInput,
    RawDataBtn,
    BuyStep1,
    BuyStep24SendData,
    BuyStep3,
    Finished,
  },
  name: "buyPage",
  setup() {
    const id = Vue.ref<number>();
    const category = Vue.ref<bigint>();

    const token = Vue.ref<Token>();
    const pieces = Vue.ref<number>();
    const toRegion = Vue.ref<string>(); // Compare with data entry

    const usdPrice = Vue.computed(() => {
      // TODO:
      // if (entry.value) {
      //   console.log("---price---", pieces.value * entry.value.price);

      //   return pieces.value * entry.value.price; // TODO: Calculate and add delivery price
      // }
      return -1;
    });

    const entry = Vue.ref<ItemTable>();

    const loadMaxTries = Vue.ref<number>(0);
    const loadTries = Vue.ref<number>(0);
    const loadTryPercentage = Vue.computed(() => {
      if (loadMaxTries.value > 0) {
        return Math.round(
          (1 - (loadMaxTries.value - loadTries.value) / loadMaxTries.value) *
            100
        );
      }

      return 100;
    });

    const seller = Vue.ref<UserTable | undefined>(undefined);
    const loadingSeller = Vue.ref<boolean>(false);
    async function getSellerByItem() {
      if (
        entry.value &&
        entry.value.seller !== undefined &&
        entry.value.seller.length > 0
      ) {
        loadingSeller.value = true;
        seller.value = await state.getUser(entry.value.seller, state.contract);
        loadingSeller.value = false;
      }
    }

    async function findEntry(
      id: number,
      category: bigint,
      contract = state.contract
    ) {
      entry.value = await new LoadFromContract(
        loadMaxTries,
        loadTries
      ).loadItem({
        id,
        category,
        ...contract,
      });
      if (!entry.value) {
        // No entry found
        Quasar.Notify.create({
          type: "negative",
          message: "Item not found",
          position: "top",
        });
      } else {
        getSellerByItem();
      }
    }

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
    const informData = Vue.ref<string>("");

    const requestJson = Vue.ref<string>("");
    const informJson = Vue.ref<string>("");
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

    const buyerKeys = Vue.ref<PGP_Keys>({
      pub: "",
      pri: "",
      passphrase: "",
    });
    const setp3Completed = Vue.ref<boolean>(false);

    const sellerResponse = Vue.ref<string>("");
    const trxLink = Vue.ref<string>("");

    const forwardNaviLabel = Vue.computed(() => {
      switch (step.value) {
        case 2:
          return "Got a response";
        case 4:
          return "Informing is done";
        default:
          return "Continue";
      }
    });

    Vue.onMounted(async () => {
      const orderRequest = GetQueryOrderRequest();
      if (
        orderRequest?.id !== undefined &&
        orderRequest.category !== undefined
      ) {
        id.value = orderRequest.id;
        category.value = orderRequest.category;
        await findEntry(id.value, category.value);

        token.value = orderRequest.token;
        pieces.value = orderRequest.pieces;
        toRegion.value = orderRequest.toRegion;
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

      buyerKeys.value.pri = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xVgEZHceshYJKwYBBAHaRw8BAQdAATe7K3EKTISl+ydnlYPRBt9/6umNrgHB
0IVX0MdF/b8AAQCGTxcG2PzIOf4VttpjY56QYNDNfcB7Im0GdnV5myGJEA9i
zQDCjAQQFgoAPgWCZHcesgQLCQcICZD0y5TvjrHEvwMVCAoEFgACAQIZAQKb
AwIeARYhBOTkwymjLFxmWn2QKPTLlO+OscS/AACsgQD+MGYZgrTFb16/c9Cj
08miHKAQu94gsN6ygCnYyXeenxYBAOalhOYVLkVSZaliCMLoUhcU026jdUD6
nx0HYM6bOp0Gx10EZHceshIKKwYBBAGXVQEFAQEHQMXwAuKpAPalRmHi3uS+
DIPuzN/nn4HuYDHE3bvKVLFUAwEIBwAA/3JjTLYhYmGpweNp2jjamtBDvvu0
CuThqiZroEf6/rTYE+vCeAQYFggAKgWCZHcesgmQ9MuU746xxL8CmwwWIQTk
5MMpoyxcZlp9kCj0y5TvjrHEvwAAtdIBAMQcsynLyHx4gNvKIbVE7/6dezuH
+Tii1Ro3cc+WYk9oAP9X3aTvv1GsDDvxBs1fp74WsEtJKL1wXKjuS6Avdvcv
Cg==
=Z/vq
-----END PGP PRIVATE KEY BLOCK-----
`;

      buyerKeys.value.pub = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZHceshYJKwYBBAHaRw8BAQdAATe7K3EKTISl+ydnlYPRBt9/6umNrgHB
0IVX0MdF/b/NAMKMBBAWCgA+BYJkdx6yBAsJBwgJkPTLlO+OscS/AxUICgQW
AAIBAhkBApsDAh4BFiEE5OTDKaMsXGZafZAo9MuU746xxL8AAKyBAP4wZhmC
tMVvXr9z0KPTyaIcoBC73iCw3rKAKdjJd56fFgEA5qWE5hUuRVJlqWIIwuhS
FxTTbqN1QPqfHQdgzps6nQbOOARkdx6yEgorBgEEAZdVAQUBAQdAxfAC4qkA
9qVGYeLe5L4Mg+7M3+efge5gMcTdu8pUsVQDAQgHwngEGBYIACoFgmR3HrIJ
kPTLlO+OscS/ApsMFiEE5OTDKaMsXGZafZAo9MuU746xxL8AALXSAQDEHLMp
y8h8eIDbyiG1RO/+nXs7h/k4otUaN3HPlmJPaAD/V92k779RrAw78QbNX6e+
FrBLSSi9cFyo7kugL3b3Lwo=
=XIte
-----END PGP PUBLIC KEY BLOCK-----
`;

      contact.value = {
        label: "Telegram",
        value: "t.me/test3",
      };

      sellerResponse.value = `{ "confirm": true,"buyer": "savact", "time": 1706111323}`;
      // trxLink.value =
      // "https://savact.app/#/_trx_/history?user=yearofthesav&to=savact&chain=eos";
    }

    return {
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
      informData,
      doEncryption,
      buyerKeys,
      seller,
      requestJson,
      informJson,
      address,
      setp3Completed,
      usdPrice,
      contact,
      forwardNaviLabel,
      sellerResponse,
      trxLink,

      // TODO: Show loading of the following
      loadMaxTries,
      loadTries,
      loadTryPercentage,
      loadingSeller,
    };
  },
});
</script>
