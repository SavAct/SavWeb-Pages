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
                :price="price"
                :token="userData.token"
                :pieces="userData.pieces"
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
                  : "Wait until the customer made the tranaction and then send the article"
              }}
            </div>
            <div>Click here to check if the customer made the payment</div>
            <order-item
              v-if="entry && userData"
              :entry="entry"
              :price="price"
              :token="userData.token"
              :pieces="userData.pieces"
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
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>
<script lang="ts">
import OrderItem from "../Components/OrderItem.vue";
import AddPgpBtn from "../Components/AddPgpBtn.vue";
import RawDataBtn from "../Components/RawDataBtn.vue";
import {
  SellerResponse,
  UserData,
  decrypt,
  encrypt,
  generateRandomString,
} from "../Components/Generator";
import { Entry, PGP_Keys } from "../Components/Items";
import { state } from "../store/globals";
import { copy } from "../Components/QuasarHelpers";

export default Vue.defineComponent({
  components: { AddPgpBtn, OrderItem, RawDataBtn },
  name: "sellResponsePage",
  setup() {
    const _buyerResponse = Vue.ref<string>("");
    const buyerResponse = Vue.computed<string>({
      get: () => _buyerResponse.value,
      set: (v) => {
        _buyerResponse.value = v;
        evaluateInput();
      },
    });
    const isEncrypted = Vue.ref<boolean>(false);
    const keys = Vue.ref<PGP_Keys>({ passphrase: "", pri: "", pub: "" }); // TODO: Get the public key of the seller from blockchain
    const responseDecrypted = Vue.ref<string>("");
    const currentTokenPrice = Vue.ref<bigint>(BigInt(0));
    const price = Vue.ref<number>(0); // TODO: Calculate current price, get price in payment token and compare
    const sellersNote = Vue.ref<string>("");
    const userData = Vue.ref<UserData>();

    async function evaluateInput() {
      if (buyerResponse.value.startsWith("-----BEGIN PGP MESSAGE-----")) {
        isEncrypted.value = true;

        if (keys.value.pri.length > 0) {
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
            response.itemId != undefined &&
            typeof response.itemId == "number"
          ) {
            if (response.token) {
              // TODO: Check all parameters like price, token, pieces
              // TODO: Check if buyers public key is on blockchain and check if it is identical
              userData.value = response;
              findEntry(response.itemId);
              if (response.note.length > 0) {
                note.value = response.note;
              }
              memo.value = requestId.value;
              step.value = 2;
              return;
            }
            // TODO: Other responses
          } else {
            console.log("Invalid response");
          }
        } catch (e) {
          console.log("Error on parsing JSON", e);
        }
      }
      note.value = "";
      entry.value = undefined;
      userData.value = undefined;
    }

    const note = Vue.ref<string>("");

    const requestId = Vue.ref<string>(generateRandomString(8));

    const entry = Vue.ref<Entry>();
    const memo = Vue.ref<string>("");

    function findEntry(id: number) {
      entry.value = state.itemsList.find((item) => item.id == id);
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
    const encryptedAnswer = Vue.computed(() => {
      if (accept.value !== null && userData.value) {
        const encryped = encrypt(
          rawAnswer.value,
          buyerPubKey.value,
          keys.value.pub,
          keys.value.pri,
          keys.value.passphrase
        );
        if (typeof encryped === "string") {
          return encryped;
        }
      }
      return "";
    });

    // TODO: Display buyer and memo on last step
    // TODO: Display textarea to enter buyers payment confirmation on last step, change last step wait status to deliver status by setting isPaid = true
    // TODO: Open the history page of the SavAct app with the mentioned buyer as sender and seller as receiver
    // TODO: Possibility to enter a payment confirmation of the customer also in the first step and go automatically to the last step.

    const step = Vue.ref<number>(1);
    async function nextStep() {
      if (step.value == 1) {
        evaluateInput();
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
        state.mainHeaderRef.value &&
        state.mainFooterRef.value
      ) {
        subContentHeight.value =
          state.mainHeaderRef.value.$el.clientHeight +
          state.mainFooterRef.value.$el.clientHeight +
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
    };
  },
});
</script>
