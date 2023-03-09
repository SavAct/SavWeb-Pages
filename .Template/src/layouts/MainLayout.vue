<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="brightStyle ? 'bg-blue-grey-6' : 'bg-dark'">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="leftDrawerOpen = !leftDrawerOpen"
        />
        <q-btn
          v-if="hasParent"
          flat
          round
          dense
          class="q-ml-sm"
          icon="arrow_back_ios_new"
          aria-label="Back"
          @click="goBack"
        />
        <q-toolbar-title :class="{ 'text-subtitle1': $q.screen.lt.sm }">
          <span>SavAct Template</span>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>
    <q-page-container v-show="route.name == 'home'">
      <IndexPage />
    </q-page-container>
  </q-layout>
</template>
<script lang="ts">
import IndexPage from "../pages/IndexPage.vue";

export default Vue.defineComponent({
  name: "MainLayout",
  components: { IndexPage },
  setup() {
    const route = Vue.ref<{ name: string }>({ name: "home" });
    const hasParent = Vue.ref<boolean>(false);
    const leftDrawerOpen = Vue.ref<boolean>(false);
    const brightStyle = Vue.ref<boolean>(false);

    function goBack() {
      alert("Go back click");
    }
    return { hasParent, leftDrawerOpen, route, brightStyle, goBack };
  },
});
</script>
