<template>
  <q-page class="column">
    <q-resize-observer @resize="updateContentHeight" />
    <q-stepper
      class="col fit"
      v-model="step"
      animated
      active-color="blue"
      style="background-color: var(--q-color-page)"
      ref="sellStepperEl"
    >
      <q-step
        :name="1"
        prefix="1"
        :done="step > 1"
        :title="$q.screen.gt.xs ? 'Input' : ''"
        active-icon="mail"
      >
        <q-card>
          <q-card-section>
            <q-input
              type="textarea"
              v-model="buyerResponse"
              outlined
              label="Customer message"
            >
              <template v-slot:append>
                <q-icon
                  v-if="buyerResponse.length > 0"
                  name="close"
                  @click="buyerResponse = ''"
                  class="cursor-pointer"
                />
              </template>
            </q-input>
            <add-pgp-btn
              v-if="isEncrypted"
              class="q-px-sm q-mt-sm"
              v-model="keys"
              color="blue"
              dense
              label="Your PGP key"
              icon="vpn_key"
              rounded
            ></add-pgp-btn>
          </q-card-section>
        </q-card>
      </q-step>
      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        :title="$q.screen.gt.xs ? 'Confirm' : ''"
        active-icon="thumb_up"
      >
        <q-card>
          <q-scroll-area
            :style="contentHeightStr"
            :bar-style="barStyle"
            :thumb-style="thumbStyle"
          >
            <q-card-section>
              <order-item
                v-if="entry && userData"
                :entry="entry"
                v-model:price="price"
                :token="userData.token"
                :pieces="userData.pieces"
                :to-region="userData.country"
              ></order-item>
              <q-input
                v-if="note.length > 0"
                class="q-mt-md"
                v-model="note"
                outlined
                readonly
                label="Customers note"
              ></q-input>

              <div class="q-mt-md row">
                <div class="col-grow">
                  <q-btn-toggle
                    push
                    glossy
                    size="md"
                    v-model="accept"
                    toggle-color="blue"
                    :options="[
                      {
                        label:
                          '&nbsp;&nbsp;&nbsp;Agree&nbsp;&nbsp;&nbsp;&nbsp;',
                        value: true,
                      },
                      { label: '', value: null },
                      {
                        label: '&nbsp;&nbsp;Disagree&nbsp;&nbsp;',
                        value: false,
                      },
                    ]"
                  />
                </div>
              </div>
            </q-card-section>
          </q-scroll-area>
        </q-card>
      </q-step>
      <q-step
        :name="3"
        prefix="3"
        :done="step > 3"
        :title="$q.screen.gt.xs ? 'Note' : ''"
        active-icon="speaker_notes"
      >
        <q-card>
          <q-card-section>
            <q-input
              outlined
              label="Note for the customer (optional)"
              v-model="sellersNote"
            ></q-input>
            <q-input
              class="q-mt-md"
              v-if="accept === true"
              type="text"
              v-model="memo"
              outlined
              label="Memo (added to the transaction on blockchain)"
            ></q-input>
          </q-card-section>
        </q-card>
      </q-step>
      <q-step
        :name="4"
        prefix="4"
        :done="step > 4"
        :title="$q.screen.gt.xs ? 'Send' : ''"
        active-icon="send"
      >
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="col-auto text-h6 q-pb-md">
                Response the following message to the customer
              </div>
              <div class="col-grow q-pb-md row justify-end">
                <div class="col-auto">
                  <raw-data-btn
                    icon="raw_off"
                    round
                    size="sm"
                    color="blue"
                    :raw-data="rawAnswer"
                    :pub-recipient="buyerPubKey"
                  ></raw-data-btn>
                </div>
                <div class="col-auto">
                  <q-btn
                    round
                    color="blue"
                    size="sm"
                    class="q-ml-sm"
                    @click="
                      copy(encryptedAnswer, 'Copy PGP message to clipboard')
                    "
                    icon="content_copy"
                  ></q-btn>
                </div>
              </div>
            </div>
            <q-input
              type="textarea"
              readonly
              :model-value="encryptedAnswer"
              outlined
              label="Encrypted data"
            ></q-input>
          </q-card-section>
        </q-card>
      </q-step>
      <q-step
        :name="5"
        prefix="5"
        :done="step > 5"
        :title="$q.screen.gt.xs ? (isPaid ? 'Finish' : 'Wait') : ''"
        :active-icon="isPaid ? 'local_shipping' : 'hourglass_empty'"
      >
        <q-card>
          <q-card-section>
            <div class="col-auto text-h6 q-pb-md">
              {{
                isPaid
                  ? "Send the article to the customer"
                  : "Wait until the customer made the transaction and then send the article"
              }}
            </div>
            <div>Click here to check if the customer made the payment</div>
            <order-item
              v-if="entry && userData"
              :entry="entry"
              :price="price"
              :token="userData.token"
              :pieces="userData.pieces"
              :to-region="userData.country"
            ></order-item>
          </q-card-section>
        </q-card>
      </q-step>
      <template v-slot:navigation>
        <q-stepper-navigation class="q-gutter-sm" ref="sellStepNavEl">
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
              step > 2 ||
              (step === 1 && userData) ||
              (step === 2 && accept !== null)
            "
            :class="{ 'q-ml-sm': step > 1 }"
            class="q-pr-sm"
            outline
            @click="nextStep"
            color="blue"
            :label="step === 4 ? 'I have responded' : 'Next'"
            icon-right="arrow_forward_ios"
            :loading="nextLoading"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>
<script lang="ts">
import OrderItem from "../Components/OrderItem.vue";
import AddPgpBtn, { PGP_Keys } from "../Components/AddPgpBtn.vue";
import RawDataBtn from "../Components/RawDataBtn.vue";
import {
  SellerResponse,
  UserData,
  decrypt,
  encrypt,
  generateRandomString,
} from "../Components/Generator";
import { state } from "../store/globals";
import { copy } from "../Components/QuasarHelpers";
import { LoadFromContract } from "../Components/MarketContractHandle";
import { ItemTable, UserTable } from "../Components/ContractInterfaces";

export default Vue.defineComponent({
  components: { AddPgpBtn, OrderItem, RawDataBtn },
  name: "sellResponsePage",
  setup() {
    const _buyerResponse = Vue.ref<string>("");
    const buyerResponse = Vue.computed<string>({
      get: () => _buyerResponse.value,
      set: (v) => {
        _buyerResponse.value = v.trim();
        void evaluateInput();
      },
    });
    const isEncrypted = Vue.ref<boolean>(false);
    const keys = Vue.ref<PGP_Keys>({ passphrase: "", pri: "", pub: "" }); // TODO: Get the public key of the seller from blockchain
    const responseDecrypted = Vue.ref<string>("");
    const currentTokenPrice = Vue.ref<bigint>(BigInt(0));
    const price = Vue.ref<number>(0); // TODO: Compare the prices between buyer and seller
    const sellersNote = Vue.ref<string>("");
    const userData = Vue.ref<UserData>();
    const nextLoading = Vue.ref<boolean>(false);

    async function evaluateInput() {
      if (
        buyerResponse.value.trim().startsWith("-----BEGIN PGP MESSAGE-----")
      ) {
        isEncrypted.value = true;

        if (keys.value.pri.length > 0) {
          console.log(keys.value.pri);
          responseDecrypted.value = await decrypt(
            buyerResponse.value,
            keys.value.pri,
            keys.value.passphrase,
            ""
          );
        }
      } else if (buyerResponse.value.startsWith("{")) {
        isEncrypted.value = false;
        responseDecrypted.value = buyerResponse.value;
      } else {
        isEncrypted.value = false;
        responseDecrypted.value = "";
      }

      if (responseDecrypted.value) {
        try {
          const response = JSON.parse(responseDecrypted.value) as UserData;
          if (
            response.item?.id != undefined &&
            typeof response.item.id == "number" &&
            response.item.category != undefined &&
            (typeof response.item.category == "string" ||
              typeof response.item.category == "number" ||
              typeof response.item.category == "bigint")
          ) {
            const id = response.item.id;
            const category = BigInt(response.item.category);

            if (response.rBy === "buyer") {
              switch (response.step) {
                case 1:
                  if (response.token) {
                    // TODO: Check all parameters like price, token, pieces
                    // TODO: Check if buyers public key is on blockchain and check if it is identical
                    userData.value = Vue.reactive(response);

                    buyerPubKey.value = response.pubPgp;
                    await findEntry(id, category);
                    if (response.note.length > 0) {
                      note.value = response.note;
                    }
                    memo.value = requestId.value;
                    step.value = 2;

                    return;
                  } else {
                    console.log("No token in response");
                  }
                  break;
                default:
                  console.log("Undefined step");
              }
            } else {
              // TODO: Other responses
              console.log("Not a response from buyer");
            }
          }
        } catch (e) {
          console.log("Error on parsing JSON", e);
        }
        console.log("finished evaluating input");
      }
      note.value = "";
      entry.value = undefined;
      userData.value = undefined;
    }

    const note = Vue.ref<string>("");

    const requestId = Vue.ref<string>(generateRandomString(8));

    const entry = Vue.ref<ItemTable>();
    const memo = Vue.ref<string>("");

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
      console.log("found entry", id, userData.value);
    }

    const _accept = Vue.ref<boolean | null>(null);
    const accept = Vue.computed<boolean | null>({
      get: () => _accept.value,
      set: (v) => {
        _accept.value = v;
        if (v !== null) step.value = 3;
      },
    });
    const buyerPubKey = Vue.ref<string>("");
    const rawAnswer = Vue.computed(() => {
      if (accept.value !== null && userData.value) {
        return JSON.stringify({
          confirm: accept.value,
          buyer: userData.value.buyer,
          memo: memo.value,
          note: sellersNote.value,
          sigTime: Math.round(Date.now() / 1000),
        } as SellerResponse);
      } else {
        return "";
      }
    });

    const encryptedAnswer = Vue.ref<string>("");
    async function encryptAnswer() {
      if (accept.value !== null && userData.value) {
        const encrypted = await encrypt(
          rawAnswer.value,
          buyerPubKey.value,
          keys.value.pub,
          keys.value.pri,
          keys.value.passphrase
        );
        if (typeof encrypted === "string") {
          encryptedAnswer.value = encrypted;
          return;
        }
      }
      encryptedAnswer.value = "";
    }

    // dev mode
    if (true) {
      (keys.value.pub = `-----BEGIN PGP PUBLIC KEY BLOCK-----

xjMEZMwzBBYJKwYBBAHaRw8BAQdA/+/C8lm299s9AZ8YOya+FbbuPFpV3JHr
V2mbEoQoPz7NAMKMBBAWCgA+BYJkzDMEBAsJBwgJkBQ0wwB7GCsCAxUICgQW
AAIBAhkBApsDAh4BFiEENlDVzQ1pptmiGBU+FDTDAHsYKwIAACWqAP9Pu+PK
b0cP6U4hdfFpg/ajAt6XThcFZPw5+E616apN6wEAjWi4Amd/HPBERnzFaLKb
aBkaGlhPJZf4RN8w7uBZ+QvOOARkzDMEEgorBgEEAZdVAQUBAQdANBbouTlY
uHJUZYhe0El8D+caQ5iXJREvTcpCk15+30cDAQgHwngEGBYIACoFgmTMMwQJ
kBQ0wwB7GCsCApsMFiEENlDVzQ1pptmiGBU+FDTDAHsYKwIAAGLkAP9CBgwY
U2WliTCVyjBUwZH4Dq+7ldEvYdw+UdHL0jw24AD/dfh8vv6YurfvqPRNwJnz
WkrmPMQ2vCNN/vfNRi447wg=
=Vfmh
-----END PGP PUBLIC KEY BLOCK-----

`),
        (keys.value.pri = `-----BEGIN PGP PRIVATE KEY BLOCK-----

xYYEZMwzBBYJKwYBBAHaRw8BAQdA/+/C8lm299s9AZ8YOya+FbbuPFpV3JHr
V2mbEoQoPz7+CQMIV/9D7bpVhl3gFklYCb60b2FRBlg1G2DC8BPM3JfWI/2f
DjcmEHQFqv8oPpWcGMIPupj37NJO5qu67QzXZ4OBLBAsObi9wr8NsHnX6Ho3
3c0AwowEEBYKAD4FgmTMMwQECwkHCAmQFDTDAHsYKwIDFQgKBBYAAgECGQEC
mwMCHgEWIQQ2UNXNDWmm2aIYFT4UNMMAexgrAgAAJaoA/0+748pvRw/pTiF1
8WmD9qMC3pdOFwVk/Dn4TrXpqk3rAQCNaLgCZ38c8ERGfMVosptoGRoaWE8l
l/hE3zDu4Fn5C8eLBGTMMwQSCisGAQQBl1UBBQEBB0A0Fui5OVi4clRliF7Q
SXwP5xpDmJclES9NykKTXn7fRwMBCAf+CQMIjxocGQKmzZPg+ENih7UkHjeM
qwKsl/Vdcg4xb/vDRZ1kgSoF6vSfRyPkRnlw1pjnXIsVce/7+2/XDhPNDMuk
Q+d/+zrW5JwhjfmSch4MisJ4BBgWCAAqBYJkzDMECZAUNMMAexgrAgKbDBYh
BDZQ1c0NaabZohgVPhQ0wwB7GCsCAABi5AD/QgYMGFNlpYkwlcowVMGR+A6v
u5XRL2HcPlHRy9I8NuAA/3X4fL7+mLq376j0TcCZ81pK5jzENrwjTf73zUYu
OO8I
=pGPL
-----END PGP PRIVATE KEY BLOCK-----
`);
      keys.value.passphrase = "abc";
    }

    // TODO: Display buyer and memo on last step
    // TODO: Display textarea to enter buyers payment confirmation on last step, change last step wait status to deliver status by setting isPaid = true
    // TODO: Open the history page of the SavAct app with the mentioned buyer as sender and seller as receiver
    // TODO: Possibility to enter a payment confirmation of the customer also in the first step and go automatically to the last step.

    const step = Vue.ref<number>(1);
    async function nextStep() {
      if (step.value == 1) {
        nextLoading.value = true;
        await evaluateInput();
        nextLoading.value = false;
        return;
      }
      if (step.value == 3) {
        nextLoading.value = true;
        await encryptAnswer();
        nextLoading.value = false;
        step.value++;
        return;
      }
      if (step.value < 5) step.value++;
    }
    function backStep() {
      if (step.value > 1) step.value--;
    }

    Vue.watch(step, () => {
      Vue.nextTick(updateContentHeight);
    });

    const isPaid = Vue.ref<boolean>(false);

    // Calculate height of content for scrollbar
    const sellStepperEl = Vue.ref<{ $el: HTMLElement }>();
    const sellStepNavEl = Vue.ref<{ $el: HTMLElement }>();
    function updateContentHeight() {
      if (
        sellStepperEl.value?.$el.firstElementChild &&
        sellStepNavEl.value &&
        state.mainHeaderRef.value
      ) {
        subContentHeight.value =
          state.mainHeaderRef.value.$el.clientHeight +
          sellStepNavEl.value.$el.clientHeight +
          sellStepperEl.value.$el.firstElementChild.clientHeight +
          45;
      } else {
        subContentHeight.value = 0;
      }
    }
    const subContentHeight = Vue.ref<number>(0);
    const contentHeightStr = Vue.computed(() => {
      if (subContentHeight.value != 0) {
        return `height: ${Quasar.Screen.height - subContentHeight.value}px`;
      }
      return "";
    });

    return {
      buyerResponse,
      isEncrypted,
      keys,
      requestId,
      responseDecrypted,
      currentTokenPrice,
      entry,
      darkStyle: state.darkStyle,
      userData,
      price,
      note,
      sellersNote,
      accept,
      buyerPubKey,
      encryptedAnswer,
      rawAnswer,
      copy,
      memo,
      step,
      nextStep,
      backStep,
      evaluateInput,
      isPaid,
      sellStepperEl,
      sellStepNavEl,
      contentHeightStr,
      state,
      updateContentHeight,
      thumbStyle: state.thumbStyle,
      barStyle: state.barStyle,
      nextLoading,

      // TODO: Show loading of the following
      loadMaxTries,
      loadTries,
      loadTryPercentage,
      seller,
      loadingSeller,

      subContentHeight,
    };
  },
});
</script>
