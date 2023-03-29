<template>
  <q-btn @click="show = true" v-bind="$attrs"></q-btn>
  <q-dialog v-model="show" persistent>
    <q-card class="bg-teal text-white" style="width: 400px">
      <q-card-section>
        <div class="text-h6">Generate Private PGP Key</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-expansion-item
          dense
          expand-icon="info"
          label="What is a passphrase"
          class="bg-teal-10"
        >
          <q-card class="bg-teal-8">
            <q-card-section>
              A passphrase is an optional security feature that functions like a
              password, which is necessary to use your private key. It's crucial
              to keep both the private key and passphrase confidential. If you
              lose your private key or forget your passphrase, you will not be
              able to decrypt your messages.
            </q-card-section>
          </q-card>
        </q-expansion-item>
        <div class="row q-my-sm q-pr-sm">
          <div class="col-6">
            <q-input
              v-model="passphrase"
              outlined
              dense
              type="password"
              label="Passphrase (optional)"
            ></q-input>
          </div>
          <div class="col-6 q-pl-sm">
            <q-input
              v-model="passphraseCheck"
              outlined
              dense
              type="password"
              label="Repeart Passphrase"
            ></q-input>
          </div>
        </div>
        <div class="row justify-between">
          <div class="col-8">
            <q-btn
              class="q-mb-sm"
              rounded
              size="sm"
              color="blue"
              label="Generate new key"
              @click="generate"
              icon="restart_alt"
            ></q-btn>
          </div>
          <div class="col-2">
            <q-btn
              class="q-mt-sm float-right"
              round
              color="blue"
              size="sm"
              @click="copy(privatePGP, 'Copy private PGP key to clipboard')"
              icon="content_copy"
            ></q-btn>
          </div>
        </div>
        <q-input
          class="q-mt-sm"
          type="textarea"
          label="Private PGP Key"
          readonly
          outlined
          label-color="white"
          :input-style="{ color: 'white' }"
          :model-value="privatePGP"
        ></q-input>
        <q-checkbox
          class="q-mt-md"
          v-model="checkSafe"
          label="I use this key at my own risk. I have stored it at a private and secure place and will remember my pasphrase."
        ></q-checkbox>
      </q-card-section>
      <q-card-actions align="right" class="bg-white text-teal">
        <q-btn
          flat
          color="red"
          label="Cancel"
          @click="show = false"
          v-close-popup
        ></q-btn>
        <q-btn
          flat
          color="green"
          :disable="!checkSafe"
          @click="confirm"
          label="Use this key"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script lang="ts">
import { copy } from "./QuasarHelpers";

export default Vue.defineComponent({
  name: "addPgpBtn",
  emits: ["pub-pgp"],
  props: {
    modelValue: {
      type: Boolean,
      requier: false,
      defaut: false,
    },
  },
  setup(_props, context) {
    const show = Vue.ref<boolean>(false);
    const checkSafe = Vue.ref<boolean>(false);
    const passphrase = Vue.ref<string>("");
    const passphraseCheck = Vue.ref<string>("");
    const privatePGP = Vue.ref<string>("");
    const publicPGP = Vue.ref<string>("");

    function generate() {
      // https://github.com/openpgpjs/openpgpjs
      if (passphrase.value !== passphraseCheck.value) {
        Quasar.Notify.create({
          type: "negative",
          message: "Passphrases do not match",
          position: "top",
        });
        return;
      }

      openpgp
        .generateKey({ userIDs: { name: "" }, passphrase: "", type: "ecc" })
        .then((key) => {
          privatePGP.value = key.privateKey;
          publicPGP.value = key.publicKey;
        })
        .catch((err) => {
          console.log("Error on key generation", err);
          Quasar.Notify.create({
            type: "negative",
            message: "Cannot generate PGP key",
            position: "top",
          });
        });
    }

    function confirm() {
      context.emit("pub-pgp", publicPGP.value);
      show.value = false;
    }

    return {
      show,
      checkSafe,
      passphrase,
      passphraseCheck,
      privatePGP,
      publicPGP,
      generate,
      confirm,
      copy,
    };
  },
});
</script>
