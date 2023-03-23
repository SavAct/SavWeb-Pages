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
      :disable="!(validModel && pgpKey.length > 0)"
      :label="(editPGP ? 'Update' : 'Upload') + ' PGP key'"
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
  },
  setup(props) {
    const pgpKey = Vue.ref<string>("");
    const hasPGP = Vue.ref<boolean>(false);
    const editPGP = Vue.ref<boolean>(false);
    const validModel = Vue.computed(() => {
      return typeof props.modelValue == "string" && props.modelValue.length > 0;
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
