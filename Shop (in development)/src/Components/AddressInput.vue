<template>
  <div>
    <div class="row">
      <q-input
        class="col-4 q-px-sm"
        label="First Name"
        v-model="address.firstName"
      ></q-input>
      <q-input
        class="col-4 q-px-sm"
        label="Middle Names"
        v-model="address.middleNames"
      ></q-input>
      <q-input
        class="col-4 q-px-sm"
        label="Last Name"
        v-model="address.lastName"
      ></q-input>
    </div>

    <q-input
      class="q-px-sm q-pt-sm"
      label="Address Line 1"
      v-model="address.addressL1"
    ></q-input>
    <q-input
      class="q-px-sm"
      label="Address Line 2 (Optional)"
      v-model="address.addressL2"
    ></q-input>
    <div class="row">
      <q-input
        class="col-6 q-px-sm"
        label="City"
        v-model="address.city"
      ></q-input>
      <q-input
        class="col-6 q-px-sm"
        label="State / Province / Region"
        v-model="address.state"
      ></q-input>
      <q-input
        class="col-6 q-px-sm"
        label="Postal Code"
        v-model="address.postal"
      ></q-input>
      <q-input
        class="col-6 q-px-sm"
        label="Country"
        v-model="address.country"
      ></q-input>
    </div>
  </div>
</template>
<script lang="ts">
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
}

export default Vue.defineComponent({
  name: "addressInput",
  emits: ["address"],
  setup(_props, context) {
    const address = Vue.reactive({
      firstName: "",
      middleNames: "",
      lastName: "",
      country: "",
      state: "",
      city: "",
      postal: "",
      addressL1: "",
      addressL2: "",
    });

    Vue.watch(
      () => Vue.toRefs(address),
      () => {
        context.emit("address", address);
      }
    );

    return {
      address,
    };
  },
});
</script>
