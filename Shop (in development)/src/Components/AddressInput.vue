<template>
  <div>
    <div class="row">
      <q-input
        class="col-4 q-px-sm"
        label="First Name"
        v-model="modelValue.firstName"
      ></q-input>
      <q-input
        class="col-4 q-px-sm"
        label="Middle Names"
        v-model="modelValue.middleNames"
      ></q-input>
      <q-input
        class="col-4 q-px-sm"
        label="Last Name"
        v-model="modelValue.lastName"
      ></q-input>
    </div>

    <q-input
      class="q-px-sm q-pt-md"
      label="Address Line 1"
      v-model="modelValue.addressL1"
    ></q-input>
    <q-input
      class="q-px-sm"
      label="Address Line 2 (Optional)"
      v-model="modelValue.addressL2"
    ></q-input>
    <div class="row q-mt-md">
      <q-input
        class="col-6 q-px-sm"
        label="City"
        v-model="modelValue.city"
      ></q-input>
      <q-input
        class="col-6 q-px-sm"
        label="State / Province / Region"
        v-model="modelValue.state"
      ></q-input>
      <q-input
        class="col-6 q-px-sm"
        label="Postal Code"
        v-model="modelValue.postal"
      ></q-input>
      <q-input
        class="col-6 q-px-sm"
        label="Country"
        v-model="modelValue.country"
      ></q-input>
    </div>
    <q-input
      class="full-width q-px-sm q-pt-md"
      label="Note (Optional)"
      v-model="modelValue.note"
    ></q-input>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";
export interface Address {
  firstName: string;
  middleNames: string;
  lastName: string;
  country: string;
  state: string;
  city: string;
  postal: string;
  addressL1: string;
  addressL2: string;
  note: string;
}

export default Vue.defineComponent({
  name: "addressInput",
  props: {
    modelValue: {
      type: Object as PropType<Address>,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
