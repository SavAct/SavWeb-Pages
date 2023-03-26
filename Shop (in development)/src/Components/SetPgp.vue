<template>
  <div>
    <label v-if="hasPGP && !editPGP" for="pgpKey"></label>
    <add-pgp :disable="!validModel" @pub-pgp="(v) => (pgpKey = v)"></add-pgp>
    <q-input
      class="q-mt-sm"
      type="textarea"
      outlined
      label="Public PGP Key"
      v-model="pgpKey"
    ></q-input>
    <q-btn
      class="q-mt-sm"
      :disable="
        !(validModel && modelValue !== undefined && modelValue.length > 0)
      "
      :label="(editPGP ? 'Update' : 'Store') + ' PGP key on chain'"
      @click="setPgpOnChain"
    ></q-btn>
  </div>
</template>
<script lang="ts">
import AddPgp from "./AddPgp.vue";
export default Vue.defineComponent({
  name: "tokenSymbol",
  components: { AddPgp },
  emits: ["update:model-value"],
  props: {
    modelValue: {
      type: String,
      requier: true,
    },
    account: {
      type: String,
      requier: false,
      default: "",
    },
  },
  setup(props, context) {
    const pgpKey = Vue.computed({
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

    return {
      pgpKey,
      hasPGP,
      editPGP,
      setPgpOnChain,
      validModel,
    };
  },
});
</script>
