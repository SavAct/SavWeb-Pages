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
          :disable="!canBack"
          flat
          round
          dense
          class="q-ml-sm"
          icon="arrow_back_ios_new"
          aria-label="Back"
          @click="goBack"
        />
        <q-btn
          :disable="!canForward"
          flat
          round
          dense
          class="q-ml-sm"
          icon="arrow_forward_ios"
          aria-label="Forward"
          @click="goForward"
        />
        <q-toolbar-title :class="{ 'text-subtitle1': $q.screen.lt.sm }">
          <span>{{ route.title }}</span>
        </q-toolbar-title>
        <q-btn
          :icon="darkStyle ? 'dark_mode' : 'wb_sunny'"
          round
          @click="darkStyle = !darkStyle"
        ></q-btn>
      </q-toolbar>
    </q-header>
    <page-container></page-container>
    <q-footer
      elevated
      :class="darkStyle ? 'bg-dark' : 'bg-indigo-10'"
      class="text-white"
    >
      <q-tabs
        class="fit text-white"
        :indicator-color="route.color"
        :active-color="route.color"
        switch-indicator
        :model-value="route.name"
      >
        <q-route-tab
          @click="to('home')"
          name="home"
          icon="home"
          class="col-2"
        />
        <q-route-tab
          @click="to('user')"
          name="user"
          icon="person"
          class="col-2"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>
<script lang="ts">
import PageContainer from "../router/PageContainer";
import { state } from "../store/globals";
import { route, router } from "../router/simpleRouter";

export default Vue.defineComponent({
  name: "MainLayout",
  components: { PageContainer },
  setup() {
    const leftDrawerOpen = Vue.ref<boolean>(false);

    const darkStyle = state.darkStyle;
    darkStyle.value = true;

    function goBack() {
      if (!router.back()) {
        Quasar.Notify.create({
          type: "negative",
          message: "You are already at the first visited page",
          position: "top",
        });
      }
    }

    function goForward() {
      if (!router.forward()) {
        Quasar.Notify.create({
          type: "negative",
          message: "You are already at the last visited page",
          position: "top",
        });
      }
    }

    return {
      canBack: router.canBack,
      canForward: router.canForward,
      leftDrawerOpen,
      route,
      darkStyle,
      goBack,
      goForward,
      to: router.push,
    };
  },
});
</script>
