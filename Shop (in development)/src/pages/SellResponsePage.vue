<template>
  <q-page class="column">
    <q-card>
      <q-card-section>
        <q-input
          type="textarea"
          v-model="buyerResponse"
          outlined
          label="Customer message"
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
          v-if="note.length > 0"
          class="q-mt-sm"
          v-model="note"
          outlined
          readonly
          label="Customers note"
        ></q-input>
        <div v-if="entry && userData" class="q-mt-sm">
          <order-item
            :entry="entry"
            :price="price"
            :token="userData.token"
            :pieces="userData.pieces"
          ></order-item>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<script lang="ts">
import OrderItem from "../Components/OrderItem.vue";
import AddPgpBtn from "../Components/AddPgpBtn.vue";
import {
  UserData,
  decrypt,
  generateRandomString,
} from "../Components/Generator";
import { Entry } from "../Components/Items";
import { state } from "../store/globals";

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

    function findEntry(id: number) {
      entry.value = state.itemsList.find((item) => item.id == id);
      console.log("found entry", id, userData.value);
    }

    // TODO: Create sellers response, get own public key from chain, encrypt with own and buyers public key, send to buyer

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
    };
  },
});
</script>
