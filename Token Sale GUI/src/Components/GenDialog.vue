<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog
      v-model="open"
      persistent
      transition-show="scale"
      transition-hide="scale"
    >
      <q-card class="bg-teal text-white" style="max-width: 600px">
        <q-card-section class="q-pb-none">
          <div class="text-h5 text-center">
            {{
              lang == "de"
                ? "Generiere ein Key-Pair (Schlüsselpaar)"
                : "Generate a key pair"
            }}
          </div>
        </q-card-section>

        <q-card-section class="q-my-none q-py-none">
          <div class="text-h6">
            {{ lang == "de" ? "Achtung" : "Attention" }}
          </div>
          <div>
            {{
              lang == "de"
                ? "Notieren Sie sich Ihren Private-Key (privaten Schlüssel) und verwahren Sie diese Notiz sicher auf! Stellen Sie sicher, dass keine andere Person Zugang zu Ihren Private-Key hat. Bei Verlust oder falscher Schreibweise Ihres Private-Keys sind alle damit verbunden Mittel, somit auch Ihre Token, dauerhaft verloren und können nicht wiederhergestellt werden. Das Gleiche gilt für den unbefugten Zugriff Dritter, wie beispielsweise durch Spionagesoftware auf ihrem Computer."
                : "Write your private key down and keep it safe! Make sure that no other person has access to the private key. In the event of loss or misspelling your private key all funds are permanently lost and cannot be restored. The same applies to unauthorized access of third parties for example like spyware which monitors and gathers information about your computer."
            }}
          </div>
          <q-checkbox
            v-model="createKeyConfirmed"
            :label="
              lang == 'de'
                ? 'Ich akzeptiere und verstehe das Risiko.'
                : 'I understand and accept the risk.'
            "
          ></q-checkbox>
          <div v-if="createKeyConfirmed">
            <q-btn
              class="q-mt-sm"
              color="primary"
              @click="createKeyPair"
              icon="rotate_left"
              :label="
                lang == 'de'
                  ? 'Generiere neues Key-Pair'
                  : 'Generate new key pair'
              "
              size="sm"
            ></q-btn>
            <div class="row">
              <div class="payitemname q-ma-sm">Private key</div>
              <div class="col-grow q-ma-sm items-center">
                <q-scroll-area :visible="true" style="height: 35px">{{
                  myPriKey
                }}</q-scroll-area>
              </div>
              <q-icon
                class="q-ma-sm cursor-pointer"
                name="copy_all"
                @click="toClipboard(myPriKey)"
              ></q-icon>
            </div>
            <div class="row">
              <div class="payitemname q-ma-sm">Public key</div>
              <div class="col-grow q-ma-sm items-center">
                <q-scroll-area :visible="true" style="height: 35px">{{
                  myPubKey
                }}</q-scroll-area>
              </div>
              <q-icon
                class="q-ma-sm cursor-pointer"
                name="copy_all"
                @click="toClipboard(myPubKey)"
              ></q-icon>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn
            flat
            :label="
              createKeyConfirmed
                ? lang == 'de'
                  ? 'Ich habe meinen Private-Key sicher hinterlegt'
                  : 'I have stored my private key safely'
                : lang == 'de'
                ? 'Zurück'
                : 'Cancel'
            "
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { KeyType, PrivateKey } from "@greymass/eosio";
import { state } from "../store/globals";
import { showError, toClipboard } from "./helpers";

export default Vue.defineComponent({
  name: "GenDialog",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(params, context) {
    const myPriKey = Vue.ref("");
    const myPubKey = Vue.ref("");
    const createKeyConfirmed = Vue.ref(false);

    const open = Vue.computed({
      get: () => params.modelValue,
      set: (val) => context.emit("update:modelValue", val),
    });

    function createKeyPair() {
      try {
        const privateKey = PrivateKey.generate(KeyType.K1);
        myPriKey.value = privateKey.toString();
        myPubKey.value = privateKey.toPublic().toLegacyString();
      } catch (e) {
        showError(
          state.lang.value == "de"
            ? "Es konnte kein Schlüsselpaar erstellt werden. Benutze ein anderes Gerät oder erstelle ein Schlüsselpaar mit einer EOS-Wallet."
            : "Unable to create key pair. Use another device or create a key pair with an EOS wallet."
        );
      }
    }

    return {
      lang: state.lang,
      toClipboard,
      createKeyPair,
      myPriKey,
      myPubKey,
      createKeyConfirmed,
      open,
    };
  },
});
</script>
