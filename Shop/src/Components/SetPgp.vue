<template>
  <div>
    <div class="text-h6 text-bold col-auto"></div>
    <div class="col-grow row justify-end reverse-wrap">
      <div class="col-auto q-mt-sm">
        <span v-if="fingerprint.length >= 0">Fingerprint: </span
        ><span class="text-secondary">{{ fingerprint.substring(0, 12) }}</span>
      </div>
      <q-space />
      <add-pgp-btn
        label="Create new key"
        icon="add_circle"
        class="q-px-sm col-auto"
        rounded
        color="blue"
        dense
        create-new
        v-model="keys"
      ></add-pgp-btn>
    </div>
    <q-input
      v-if="!hideInput"
      class="q-mt-sm"
      type="textarea"
      outlined
      label="Public PGP Key"
      v-model="publicKey"
    ></q-input>
    <q-btn
      v-if="showUploadBtn"
      class="q-mt-sm q-px-md"
      :disable="
        !(validModel && modelValue !== undefined && modelValue.pub.length > 0)
      "
      :label="(editPGP ? 'Update' : 'Store') + ' PGP key on chain [TODO]'"
      @click="setPgpOnChain"
      dense
      color="blue"
      icon="publish"
    ></q-btn>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";
import AddPgpBtn from "./AddPgpBtn.vue";
import { PGP_Keys } from "./Items";

export default Vue.defineComponent({
  name: "tokenSymbol",
  components: { AddPgpBtn },
  emits: ["update:model-value"],
  props: {
    modelValue: {
      type: Object as PropType<PGP_Keys>,
      requier: true,
      default: {
        pub: "",
        pri: "",
        passphrase: "",
      } as PGP_Keys,
    },
    account: {
      type: String,
      requier: false,
      default: "",
    },
    card: {
      type: Boolean,
      requier: false,
      default: false,
    },
    hideInput: {
      type: Boolean,
      requier: false,
      default: false,
    },
    showUploadBtn: {
      type: Boolean,
      requier: false,
      default: false,
    },
  },
  setup(props, context) {
    const keys = Vue.computed({
      get: () => props.modelValue,
      set: (v) => {
        console.log("get fingerprint from mV change", v); //-

        context.emit("update:model-value", v);
        getFingerprint(v.pub);
      },
    });
    const hasPGP = Vue.ref<boolean>(false);
    const editPGP = Vue.ref<boolean>(false);
    const validModel = Vue.computed(() => {
      return typeof props.account == "string" && props.account.length > 0;
    });

    function setPgpOnChain() {
      // TODO: Check if key is valid
      // TODO: Warn that uses will get presented the new public PGP Key
      // TODO: Compress key
      // TODO: Set PGP key for this user on chain
    }

    const publicKey = Vue.computed({
      get: () => props.modelValue.pub,
      set: (v: string) => {
        v = v.trim();
        if (v !== props.modelValue.pub.trim()) {
          context.emit("update:model-value", {
            pri: "",
            passphrase: "",
            pub: v,
          });
          getFingerprint(v);
        }
      },
    });

    const fingerprint = Vue.ref<string>("");

    async function getFingerprint(pub: string) {
      if (pub.length > 0) {
        try {
          fingerprint.value = (
            await openpgp.readKey({ armoredKey: pub })
          ).getFingerprint();
        } catch (e) {
          fingerprint.value = "";
        }
      }
    }

    Vue.onMounted(() => {
      if (validModel.value && fingerprint.value.length === 0) {
        getFingerprint(props.modelValue.pub);
      }
    });

    return {
      keys,
      hasPGP,
      editPGP,
      setPgpOnChain,
      validModel,
      publicKey,
      fingerprint,
    };
  },
});
</script>
