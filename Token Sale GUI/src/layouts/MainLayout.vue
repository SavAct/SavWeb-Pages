<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <index-page></index-page>
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import IndexPage from "../pages/IndexPage.vue";
export default Vue.defineComponent({
  name: "MainLayout",
  components: { IndexPage },
});
</script>
