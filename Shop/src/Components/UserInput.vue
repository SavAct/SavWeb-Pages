<template>
  <q-input
    rounded
    outlined
    dense
    v-model="userName"
    :rules="rules"
    :loading="isLoading"
    @keydown.enter="checkName"
    hide-bottom-space
  >
    <template v-slot:before>
      <q-select
        :disable="fixChain.length > 0"
        style="width: 90px"
        outlined
        dense
        v-model="chain"
        :options="chainOptions"
        :hide-dropdown-icon="fixChain.length > 0"
      />
    </template>
    <template v-slot:after>
      <q-btn
        @click="checkName"
        :disable="isLoading"
        color="blue"
        rounded
        icon="send"
      ></q-btn>
    </template>
  </q-input>
</template>
<script lang="ts">
import { state } from "../store/globals";
import { checkUserOffline } from "./AntelopeHelpers";

export default Vue.defineComponent({
  name: "userInput",
  emits: ["update:model-value"],
  props: {
    modelValue: {
      type: String,
      requier: true,
      default: "",
    },
    fixChain: {
      type: String,
      requier: false,
      default: "",
    },
  },
  setup(props, context) {
    const userName = Vue.ref<string>(props.modelValue);
    const nameError = Vue.ref<boolean>(false);
    const isLoading = Vue.ref<boolean>(false);
    const darkStyle = Vue.computed(() => state.darkStyle.value);
    const savConnected = Vue.computed(() => state.savConnected.value);
    const pgpKey = Vue.ref<string>();

    const rules = [(val: string) => checkUserOffline(val)];

    async function checkName() {
      if (isLoading.value) {
        return;
      }
      if (checkUserOffline(userName.value) === true) {
        isLoading.value = true;
        const result = await state.savWeb.checkName(
          chain.value.value,
          userName.value
        );
        isLoading.value = false;

        if (result === true) {
          context.emit("update:model-value", userName.value);
          Quasar.Notify.create({
            type: "positive",
            message: "Account is valid",
            position: "top",
          });
          return;
        } else if (result === false) {
          Quasar.Notify.create({
            type: "negative",
            message: "Not found",
            caption: "The account does not exist on the selected network",
            position: "top",
          });
        } else {
          Quasar.Notify.create({
            type: "negative",
            message: "Connection fail",
            caption:
              "Could not check the account, there seems to be an error with the connection",
            position: "top",
          });
        }
      }
      context.emit("update:model-value", "");
    }

    const chainOptions: Array<{ label: string; value: string }> =
      props.fixChain.length > 0
        ? [{ label: props.fixChain.toUpperCase(), value: props.fixChain }]
        : [
            {
              label: "EOS",
              value: "eos",
            },
            {
              label: "WAX",
              value: "wax",
            },
          ];
    const chain = Vue.ref<{ label: string; value: string }>(chainOptions[0]);
    return {
      userName,
      nameError,
      checkName,
      isLoading,
      rules,
      chainOptions,
      chain,
      darkStyle,
      savConnected,
      pgpKey,
    };
  },
});
</script>
