<template>
  <div>
    <div class="text-h6 text-bold col-auto"></div>
    <div class="col-grow row justify-end">
      <add-pgp-btn
        label="Create new key"
        icon="add_circle"
        class="q-px-sm"
        rounded
        :disable="!validModel"
        color="blue"
        dense
        create-new
        v-model="keys"
      ></add-pgp-btn>
    </div>
    <q-input
      class="q-mt-sm"
      type="textarea"
      outlined
      label="Public PGP Key"
      v-model="publicKey"
    ></q-input>
    <q-btn
      class="q-mt-sm q-px-md"
      :disable="
        !(validModel && modelValue !== undefined && modelValue.pub.length > 0)
      "
      :label="(editPGP ? 'Update' : 'Store') + ' PGP key on chain'"
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
      },
    },
    account: {
      type: String,
      requier: false,
      default: "",
    },
  },
  setup(props, context) {
    const keys = Vue.computed({
      get: () => props.modelValue,
      set: (v) => context.emit("update:model-value", v),
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
        if (publicKey.value.trim() != props.modelValue.pub.trim()) {
          context.emit("update:model-value", {
            pri: "",
            passphrase: "",
            pub: v,
          });
        }
      },
    });

    return {
      keys,
      hasPGP,
      editPGP,
      setPgpOnChain,
      validModel,
      publicKey,
    };
  },
});
</script>
