<template>
  <q-page class="column">
    <q-card>
      <q-card-section>
        <q-input
          :type="buyerResponse.length > 0 ? 'text' : 'textarea'"
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
          @pub-pgp="(v) => (publicKey = v)"
          v-model:pri-pgp="privateKey"
          v-model:passphrase="passphrase"
          color="blue"
          dense
          label="Your PGP key"
          icon="vpn_key"
          rounded
        ></add-pgp-btn>
        <div v-if="entry && userData" class="q-mt-sm">
          <order-item
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

          <div class="text-h6 q-mt-md">Confirm request</div>
          <div class="q-mt-sm q-mb-md row">
            <div class="col-grow">
              <q-btn-toggle
                push
                glossy
                size="xl"
                v-model="accept"
                toggle-color="blue"
                :options="[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]"
              />
            </div>
            <div class="col-auto">
              <q-btn
                v-if="accept !== null"
                round
                outline
                size="md"
                icon="arrow_downward"
                @click="scrollToBottom"
              ></q-btn>
            </div>
          </div>

          <div v-if="accept !== null" class="q-mb-md">
            <q-input
              outlined
              label="Note for the customer"
              v-model="sellersNote"
            ></q-input>

            <q-input
              class="q-mt-sm"
              v-if="accept === true"
              type="text"
              v-model="memo"
              outlined
              label="Memo (Added to the transaction on blockchain)"
            ></q-input>

            <div class="row justify-between q-mt-md">
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
          </div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import OrderItem from "../Components/OrderItem.vue";
import AddPgpBtn from "../Components/AddPgpBtn.vue";
import {
  SellerResponse,
  UserData,
  decrypt,
  encrypt,
  generateRandomString,
} from "../Components/Generator";
import { Entry } from "../Components/Items";
import { state } from "../store/globals";
import { copy } from "../Components/QuasarHelpers";

export default Vue.defineComponent({
  components: { AddPgpBtn, OrderItem },
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
    // const buyerPublicKey = Vue.ref<string>("");
    const publicKey = Vue.ref<string>("");
    const privateKey = Vue.ref<string>("");
    const passphrase = Vue.ref<string>("");
    const responseDecrypted = Vue.ref<string>("");
    const currentTokenPrice = Vue.ref<bigint>(BigInt(0));
    const price = Vue.ref<number>(0); // TODO: Calculate current price, get price in payment token and compare
    const sellersNote = Vue.ref<string>("");
    const userData = Vue.ref<UserData>();

    async function evaluateInput() {
      if (buyerResponse.value.startsWith("-----BEGIN PGP MESSAGE-----")) {
        isEncrypted.value = true;

        if (privateKey.value.length > 0) {
          responseDecrypted.value = await decrypt(
            buyerResponse.value,
            privateKey.value,
            passphrase.value,
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
              userData.value = response;
              findEntry(response.itemId);
              if (response.note.length > 0) {
                note.value = response.note;
              }
              memo.value = requestId.value;
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

    const accept = Vue.ref<boolean | null>(null);
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
          publicKey.value,
          privateKey.value,
          passphrase.value
        );
        if (typeof encryped === "string") {
          return encryped;
        }
      }
      return "";
    });

    function scrollToBottom() {
      window.scrollTo(0, document.body.scrollHeight);
    }

    // TODO: Add stepper 1. Enter buyer response 2. Show data and confirm. 3. Enter note and memo. 4. Send Message. 5. Finish. Wait for payment, enter response -> Send item but check data. show item card.
    // TODO: Possibility to enter payment confirmation of customer in the first step and go to last one.

    return {
      buyerResponse,
      isEncrypted,
      publicKey,
      privateKey,
      passphrase,
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
      scrollToBottom,
    };
  },
});
</script>
