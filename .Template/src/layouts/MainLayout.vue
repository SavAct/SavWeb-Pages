<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated :class="darkStyle ? 'bg-dark' : 'bg-indigo-10'">
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
        <q-btn
          :icon="darkStyle ? 'dark_mode' : 'wb_sunny'"
          round
          @click="darkStyle = !darkStyle"
        ></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container v-show="route.name == 'home'">
      <index-page />
    </q-page-container>
    <q-page-container v-show="route.name == 'count'">
      <count-page />
    </q-page-container>
    <q-page-container v-show="route.name == 'user'">
      <user-page />
    </q-page-container>
    <q-footer
      elevated
      :class="darkStyle ? 'bg-dark' : 'bg-indigo-10'"
      class="text-white"
    >
      <q-tabs
        v-model="route.name"
        class="fit text-white"
        :indicator-color="indicatorColor"
        :active-color="indicatorColor"
        switch-indicator
      >
        <q-route-tab
          @click="route.name = 'home'"
          name="home"
          icon="home"
          class="col-2"
        />
        <q-route-tab
          @click="route.name = 'count'"
          name="count"
          icon="functions"
          class="col-2"
        />
        <q-route-tab
          @click="route.name = 'user'"
          name="user"
          icon="person"
          class="col-2"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>
<script lang="ts">
import IndexPage from "../pages/IndexPage.vue";
import CountPage from "../pages/CountPage.vue";
import UserPage from "../pages/UserPage.vue";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "MainLayout",
  components: { IndexPage, CountPage, UserPage },
  setup() {
    const route = Vue.ref<{ name: string }>({ name: "home" });
    const hasParent = Vue.ref<boolean>(true);
    const leftDrawerOpen = Vue.ref<boolean>(false);

    const darkStyle = state.darkStyle;
    darkStyle.value = true;

    const indicatorColor = Vue.computed(() => {
      switch (route.value.name) {
        case "home":
          return "teal-12";
        case "count":
          return "light-green-13";
        case "user":
          return "cyan-12";
        default:
          return "white";
      }
    });

    function goBack() {
      Quasar.Notify.create({
        type: "negative",
        message: "Go back click",
        position: "top",
      });
    }

    return {
      hasParent,
      leftDrawerOpen,
      route,
      darkStyle,
      goBack,
      indicatorColor,
    };
  },
});
</script>
