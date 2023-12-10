<template>
  <q-page class="q-pa-md text-center">
    <q-btn @click="getUserData" color="primary" class="q-mb-md"
      >Get user data</q-btn
    >
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
    <set-pgp class="q-mt-md" :account="pgpKey"></set-pgp>
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
    const userName = Vue.ref<string>("");
    const pgpKey = Vue.ref<string>();

    async function getUserData() {
      userName.value = userName.value.trim();
      const user =
        userName.value.length > 0 ? { name: userName.value } : undefined;

      const resultUser = await state.savWeb.getUser(user, 60000);

      console.log("Received user data", resultUser);
      if (resultUser !== undefined && resultUser.name !== undefined) {
        userName.value = resultUser.name;
        console.log("User name", resultUser.name, typeof resultUser.name);
      }
    }
    // TODO: Attention icon if no pgp key is defined

    return {
      userName,
      darkStyle,
      savConnected,
      pgpKey,
      getUserData,
    };
  },
});
</script>
