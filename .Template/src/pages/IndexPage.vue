<template>
  <q-page class="q-pa-md text-center">
    <div class="q-my-md">Small file size template by using</div>
    <div class="text-h2 q-mt-lg">Quasar + Vue 3 + TypeScript + Vite</div>
    <counter></counter>
    <div class="q-mt-lg">Presented by SavAct.</div>
  </q-page>
</template>
<script lang="ts">
import Counter from "../Components/Counter.vue";

export default Vue.defineComponent({
  name: "indexPage",
  components: { Counter },
  setup() {
    return {};
  },
});
</script>
