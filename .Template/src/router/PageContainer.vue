<template>
  <q-page-container>
    <index-page v-if="route.name == 'home'" />
    <count-page v-if="route.name == 'count'" />
    <user-page v-if="route.name == 'user'" />
  </q-page-container>
</template>
<script lang="ts">
import IndexPage from "../pages/IndexPage.vue";
import CountPage from "../pages/CountPage.vue";
import UserPage from "../pages/UserPage.vue";
import { route, router } from "./simpleRouter";

export default Vue.defineComponent({
  name: "page-container",
  components: { IndexPage, CountPage, UserPage },
  setup() {
    // Start page
    router.push({ name: "home" });
    return { route };
  },
});
</script>
