<template>
  <div>
    <div class="row">
      <q-input class="col-4" label="First Name" v-model="firstName"></q-input>
      <q-input
        class="col-4"
        label="Middle Names"
        v-model="middleNames"
      ></q-input>
      <q-input class="col-4" label="Last Name" v-model="lastName"></q-input>
    </div>

    <q-input label="Address Line 1" v-model="addressL1"></q-input>
    <q-input label="Address Line 2" v-model="addressL2"></q-input>
    <div class="row">
      <q-input class="col-6" label="City" v-model="city"></q-input>
      <q-input
        class="col-6"
        label="State / Province / Region"
        v-model="state"
      ></q-input>
      <q-input class="col-6" label="Postal Code" v-model="postal"></q-input>
      <q-input class="col-6" label="Country" v-model="country"></q-input>
    </div>
  </div>
</template>
<script lang="ts">
export default Vue.defineComponent({
  name: "address",
  setup() {
    const firstName = Vue.ref<string>();
    const middleNames = Vue.ref<string>();
    const lastName = Vue.ref<string>();

    const country = Vue.ref<string>();
    const state = Vue.ref<string>();
    const city = Vue.ref<string>();
    const postal = Vue.ref<string>();
    const addressL1 = Vue.ref<string>();
    const addressL2 = Vue.ref<string>();

    return {
      firstName,
      middleNames,
      lastName,
      country,
      state,
      city,
      postal,
      addressL1,
      addressL2,
    };
  },
});
</script>
