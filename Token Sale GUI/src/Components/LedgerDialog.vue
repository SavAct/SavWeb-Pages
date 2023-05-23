<template>
  <div class="q-pa-md q-gutter-sm">
    <q-dialog v-model="open" transition-show="scale" transition-hide="scale">
      <q-card class="bg-orange-8 text-white" style="max-width: 600px">
        <q-card-section class="q-pb-none">
          <div class="text-h5 text-center">
            {{ lang == "de" ? "Verwendung eines Ledgers" : "Use of a Ledger" }}
          </div>
        </q-card-section>

        <q-card-section class="q-mt-md q-mb-none q-py-none">
          <div class="text-center">
            <div>
              {{
                lang == "de"
                  ? "Befolgen Sie diese Anleitung zur Einrichtung des Ledgers für die EOS-Blockchain: "
                  : "Follow these instructions to set up the Ledger for the EOS Blockchain:"
              }}
            </div>
            <a
              href="https://samveku.medium.com/how-to-add-eos-account-to-your-ledger-nano-x-s-using-anchor-wallet-79ae9917cf53"
              target="_blank"
              rel="noopener"
            >
              How to add EOS account to your Ledger Nano X/S using Anchor wallet
            </a>
          </div>
          <div class="row items-center q-pa-sm q-my-md">
            <q-icon
              name="warning"
              color="red-10"
              class="col-auto"
              size="md"
            ></q-icon>
            <span class="col q-pl-sm">{{
              lang == "de"
                ? "Benutzen Sie den Public-Key des Ledgers nicht um ohne Account am Sale teilzunehmen! Allerdings können Sie gleichzeitig einen Account mittels diesem Teilnahme-Formular erstellen."
                : "Do not use the public key of a Ledger to participate without an EOS account! However, you can create the account at the same time using this participation form."
            }}</span>
          </div>
        </q-card-section>

        <q-card-actions align="right" class="bg-white text-primary">
          <q-btn
            flat
            :label="lang == 'de' ? 'Zurück' : 'Cancel'"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "LedgerDialog",
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
  },
  setup(params, context) {
    const open = Vue.computed({
      get: () => params.modelValue,
      set: (val) => context.emit("update:modelValue", val),
    });

    return {
      lang: state.lang,

      open,
    };
  },
});
</script>
