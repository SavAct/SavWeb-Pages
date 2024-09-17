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
              <div class="q-mb-md">The customer may not know if you are still an active seller. Therefore, inform the customer that you will accept his payment by answering on his request in your chat.</div>
              <order-item
                v-if="entry && userData?.buyer"
                :entry="entry"
                v-model:price="price"
                :token="userData.token"
                :pieces="userData.pieces"
                :to-region="userData.buyer.country"
                :buyer="userData.buyer.acc"
              ></order-item>
              <q-input
                v-if="note.length > 0"
                class="q-mt-sm"
                v-model="note"
                outlined
                readonly
                dense
                label="Customers note"
              ></q-input>


              <!-- Implement when encryption is activated -->
              <!-- <div class="q-mt-md row">
                <div class="col-grow">
                  <q-btn-toggle
                    push
                    :color="chipBgColor()"
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
              </div> -->
            </q-card-section>
          </q-scroll-area>
        </q-card>
      </q-step>
      <!-- Implement when encryption is activated -->
      <!-- <q-step
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
      </q-step> -->
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
                  : "Wait until the customer made the SavPay transaction and then send the article"
              }}
            </div>
            <order-item
              v-if="entry && userData?.buyer"
              :entry="entry"
              :price="price"
              :token="userData.token"
              :pieces="userData.pieces"
              :to-region="userData.buyer.country"
              :buyer="userData.buyer.acc"
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
              (step === 2)
            "
            :class="{ 'q-ml-sm': step > 1, 'q-pr-sm': step !== 5}"
            outline
            @click="nextStep"
            color="blue"
            :label="step === 2 ? 'I have responded to the seller' : step === 5 ? 'Check payment':'Next'"
            :icon-right="step < 5?'arrow_forward_ios':undefined"
            :loading="nextLoading"
          />
          <!-- Implement when encryption is activated -->
          <!-- <q-btn
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
          /> -->
        </q-stepper-navigation>
      </template>
    </q-stepper>
    <q-dialog v-model="checkPaymentDialog" class="full-width">
      <q-card class="text-center">
        <q-card-section class="text-h6">
          Look for a transaction from <span class="text-bold">{{ buyerPayAccount }}</span> with <br>memo <span class="text-bold">{{ userData?.rId }}</span>.
        </q-card-section>
        <q-card-section>
          <div class="text-h6">
            Send the article to the customer as soon as you find the payment here:
          </div>
          <div class="q-gutter-sm row justify-center q-mt-sm">
            <q-btn class="link-btn" v-if="userData?.seller !== undefined" color="primary" icon="storefront" @click="checkPayment('savpay', 'seller')">SavPay history</q-btn><span v-if="buyerPayAccount !== undefined && userData?.seller !== undefined" class="q-px-sm">or</span><q-btn class="link-btn" color="secondary" v-if="buyerPayAccount !== undefined" icon="person" @click="checkPayment('savpay', 'buyer')">Customer SavPay history</q-btn>
          </div>
          <div class="q-mt-lg text-subtitle1">
            Burned, refunded or early finalized transactions may not be listed in the SavPay history. For that you can check the full history of your blockchain accounts here:
          </div>
          <div class="q-gutter-sm row justify-center q-mt-sm">
            <q-btn class="link-btn" v-if="userData?.seller && userData.seller.length <= 13" color="primary" icon="storefront" @click="checkPayment('bloks.io', 'seller')">Account history</q-btn> <q-btn class="link-btn" color="secondary" v-if="buyerPayAccount !== undefined && buyerPayAccount.length <= 13" icon="person" @click="checkPayment('bloks.io', 'buyer')">Customers account history</q-btn>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            flat
            color="red"
            label="Close"
            @click="checkPaymentDialog = false"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script lang="ts">
import UserLink from "../Components/UserLink.vue";
import OrderItem from "../Components/OrderItem.vue";
import AddPgpBtn, { PGP_Keys } from "../Components/AddPgpBtn.vue";
import RawDataBtn from "../Components/RawDataBtn.vue";
import {
  SellerResponse,
  OrderMsg,
  decrypt,
  encrypt,
} from "../Components/Generator";
import { state } from "../store/globals";
import { copy } from "../Components/QuasarHelpers";
import { LoadFromContract } from "../Components/MarketContractHandle";
import { ItemTable, UserTable } from "../Components/ContractInterfaces";
import { chipBgColor } from "../Components/styleHelper";
import { savWeb } from "../store/connect";
import { SavWeb } from "../Components/SavWeb";

export default Vue.defineComponent({
  components: { AddPgpBtn, OrderItem, RawDataBtn, UserLink },
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
    const userData = Vue.ref<OrderMsg>();
    const nextLoading = Vue.ref<boolean>(false);

    const checkPaymentDialog = Vue.ref<boolean>(false);

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
          const response = JSON.parse(responseDecrypted.value) as OrderMsg;
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
            // if (response.rBy === "buyer") {
              switch (response.step) {
                case 1:
                  if (response.token && response.buyer) {
                    // TODO: Check all parameters like price, token, pieces
                    // TODO: Check if buyers public key is on blockchain and check if it is identical
                    userData.value = Vue.reactive(response);

                    buyerPubKey.value = response.buyer.pubPgp;
                    await findEntry(id, category);
                    if (response.buyer.note.length > 0) {
                      note.value = response.buyer.note;
                    }
                    memo.value = userData.value.rId;

                    // TODO: Decide for step                    
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
          // }
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

    const entry = Vue.ref<ItemTable>();
    const memo = Vue.ref<string>("");

    const buyerPayAccount = Vue.computed(() => {
      if (userData.value) {
        if(userData.value.trx?.from !== undefined) {
          return userData.value.trx.from;
        }
        if(userData.value.buyer) {
          return userData.value.buyer.acc;
        }
      }
      return "";
    });

    const loadMaxTries = 3;
    const loadTries = Vue.ref<number>(0);
    const loadingCompleted = Vue.ref<boolean>(false);
    const loadTryPercentage = Vue.computed(() => {
      if(loadingCompleted.value) {
        return 100;
      }
      if (loadMaxTries > 0) {
        return Math.round((loadTries.value / loadMaxTries) * 100);
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
      loadingCompleted.value = false;
      entry.value = await new LoadFromContract(
        loadTries
      ).loadItem({
        id,
        category,
        ...contract,
      });
      loadingCompleted.value = true;
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
      if (accept.value !== null && userData.value?.buyer) {
        return JSON.stringify({
          confirm: accept.value,
          buyer: userData.value.buyer.acc,
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

    // TODO: Display buyer and memo on last step
    // TODO: Display textarea to enter buyers payment confirmation on last step, change last step wait status to deliver status by setting isPaid = true
    // TODO: Open the history page of the SavAct app with the mentioned buyer as sender and seller as receiver
    // TODO: Possibility to enter a payment confirmation of the customer also in the first step and go automatically to the last step.

    // TODO: Store step content while processing, so that you can go back after clicking on a user chip
    // TODO: Display invalidation time

    async function checkPayment(type: "savpay" | "bloks.io", role: "seller" | "buyer") {
      if(!userData.value?.buyer){
        Quasar.Notify.create({
          type: "negative",
          message: "Missing user data",
          position: "top",
        });
        return;
      }
      // https://savact.app/#/_trx_/history?user=whatdevssaid
      if(type == "savpay") {
        savWeb.openHistory({
          chain: userData.value?.token.chain,
          user: role == "seller" ? userData.value?.seller : buyerPayAccount.value,
          to: role == "seller" ? '' : userData.value?.seller,
        });
      } else {
        SavWeb.goTo(`https://bloks.io/account/${role == "seller" ? userData.value?.seller : buyerPayAccount.value}`, '_blank');
      }
    }

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
      if(state.DISABLE_ENCRYPTION && step.value == 2) {
        step.value = 5;
        return;
      }
      if(step.value == 5) {
        checkPaymentDialog.value = true;
      }
      if (step.value < 5) step.value++;
    }
    function backStep() {
      if(state.DISABLE_ENCRYPTION && step.value == 5) {
        step.value = 2;
        return;
      }
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
      chipBgColor,
      DISABLE_ENCRYPTION: state.DISABLE_ENCRYPTION,
      checkPaymentDialog,
      checkPayment,

      // TODO: Show loading of the following
      loadingCompleted,
      loadTryPercentage,
      seller,
      loadingSeller,

      subContentHeight,
      buyerPayAccount,
    };
  },
});
</script>
