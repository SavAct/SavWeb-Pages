<template>
  <q-card>
    <q-card-section>
      <q-input
        type="textarea"
        v-model="sellerResponse"
        outlined
        label="Sellers response"
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
        v-if="responseDecrypted.length > 0"
        class="q-mt-sm"
        type="textarea"
        v-model="responseDecrypted"
        outlined
        label="Sellers note"
      ></q-input>
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
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import ProImg from "../ProImg.vue";
import AddPgpBtn from "../AddPgpBtn.vue";
import { PropType } from "vue";
import { state } from "../../store/globals";
import { Token } from "../AntelopeHelpers";
import { Entry } from "../Items";

export default Vue.defineComponent({
  name: "buyStep3",
  components: { ProImg, AddPgpBtn },
  props: {
    entry: {
      type: Object as PropType<Entry>,
      requier: true,
      default: null,
    },
    token: {
      type: Object as PropType<Token>,
      requier: true,
      default: null,
    },
    completed: {
      type: Boolean,
      requier: false,
      default: false,
    },
  },
  setup(_props, context) {
    const publicKey = Vue.ref<string>("");
    const privateKey = Vue.ref<string>("");
    const passphrase = Vue.ref<string>("");

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

    const isEncrypted = Vue.computed(() => {
      return (
        sellerResponse.value.indexOf("-----BEGIN PGP MESSAGE-----") != -1 &&
        sellerResponse.value.indexOf("-----END PGP MESSAGE-----") != -1
      );
    });

    const responseDecrypted = Vue.ref<string>("");

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
        context.emit("update:completed", true);
        return true;
      }
      context.emit("update:completed", false);
      return false;
    });

    Vue.watch([isEncrypted, privateKey, passphrase], () => {
      if (isEncrypted.value && privateKey.value.length > 0) {
        decrypt();
      }
    });

    async function decrypt() {
      if (!isEncrypted.value) {
        // TODO: Extract the note
        responseDecrypted.value = sellerResponse.value;
        return false;
      }
      const privateKeyArmored = privateKey.value;

      try {
        let privateKey = await openpgp.readPrivateKey({
          armoredKey: privateKeyArmored,
        });
        if (passphrase.value.length > 0) {
          privateKey = await openpgp.decryptKey({
            privateKey: await openpgp.readPrivateKey({
              armoredKey: privateKeyArmored,
            }),
            passphrase: passphrase.value,
          });
        }

        const encrypted = sellerResponse.value;
        const message = await openpgp.readMessage({
          armoredMessage: encrypted, // parse armored message
        });
        const { data: decrypted, signatures } = await openpgp.decrypt({
          message,
          // verificationKeys: publicKey, // optional
          decryptionKeys: privateKey,
        });

        // check signature validity (signed messages only)
        try {
          await signatures[0].verified; // throws on invalid signature
          console.log("Signature is valid");
        } catch (e) {
          console.log("Signature could not be verified: ", e);
        }
        if (typeof decrypted == "string") {
          responseDecrypted.value = decrypted;
          return true;
        } else {
          responseDecrypted.value = "";
          return false;
        }
      } catch (e) {
        console.log("error", e);
        responseDecrypted.value = "";
        return false;
      }
    }

    return {
      darkStyle: state.darkStyle,
      sellerConfirms,
      sellerResponse,
      transLink,
      waitForTrans,
      transLinkValid,
      sendPayment,
      publicKey,
      privateKey,
      isEncrypted,
      responseDecrypted,
      decrypt,
      passphrase,
    };
  },
});
</script>
