<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <index-page v-if="isIndex"></index-page>
      <affiliate v-else></affiliate>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import IndexPage from "../pages/IndexPage.vue";
import Affiliate from "../pages/Affiliate.vue";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "MainLayout",
  components: { IndexPage, Affiliate },
  setup() {
    return { isIndex: state.isIndex };
  },
});
</script>