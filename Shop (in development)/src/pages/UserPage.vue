<template>
  <q-page class="q-pa-md text-center">
    <div v-if="!savConnected" class="q-my-md">
      This page needs to be executed in the
      <a
        href="https://savact.app#_browser_"
        target="_blank"
        :class="{ 'text-blue': darkStyle }"
        >SavAct App</a
      >.<br />You can just drag it into the address of its browser.
    </div>

    <user-input label="Enter your user name" v-model="userName"></user-input>
    <set-pgp class="q-mt-md" :account="userName"></set-pgp>
  </q-page>
</template>
<script lang="ts">
import UserInput from "../Components/UserInput.vue";
import SetPgp from "../Components/SetPgp.vue";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "userPage",
  components: { SetPgp, UserInput },
  setup() {
    const darkStyle = Vue.computed(() => state.darkStyle.value);
    const savConnected = Vue.computed(() => state.savConnected.value);
    const userName = Vue.ref<string>();
    const pgpKey = Vue.ref<string>();

    // TODO: Attention icon if no pgp key is defined

    return {
      userName,
      darkStyle,
      savConnected,
      pgpKey,
    };
  },
});
</script>
