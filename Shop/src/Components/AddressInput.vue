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

      <q-select
        class="col-6 q-px-sm self-end"
        v-model="region"
        label="Country"
        outlined
        :options="regionOptions"
        @filter="filterRegionInput"
        clearable
        use-input
        dense
        input-debounce="0"
        behavior="menu"
        @keyup.enter="
          if (regionOptions.length === 1) region = regionOptions[0];
        "
      >
      </q-select>
    </div>
    <q-input
      class="full-width q-px-sm q-pt-md"
      label="Note (Optional)"
      v-model="modelValue.note"
    ></q-input>
  </div>
</template>
<script lang="ts">
import { PropType, Ref } from "vue";
import { Address } from "./Generator";
import { countryCodesNoGroups, getRegion } from "./ConvertRegion";

export default Vue.defineComponent({
  name: "addressInput",
  props: {
    modelValue: {
      type: Object as PropType<Address>,
      required: true,
    },
  },
  setup(props, context) {
    const region = Vue.computed({
      get: () => {
        return props.modelValue?.country !== undefined
          ? {
              label: getRegion(props.modelValue?.country.toUpperCase()) ?? "",
              value: props.modelValue?.country,
            }
          : undefined;
      },
      set: (value) => {
        context.emit("update:modelValue", {
          ...props.modelValue,
          country: value?.value ?? "",
        });
      },
    });
    const regionOptions = Vue.ref<Array<{ label: string; value: string }>>([]);
    const countries = Vue.ref<Array<{ label: string; value: string }>>(
      countryCodesNoGroups.map((c) => {
        return { label: getRegion(c) ?? "", value: c };
      })
    );

    function regionFilter(
      search: string,
      update: Function,
      resultOptions: Ref<Array<{ label: string; value: string }>>
    ) {
      const needle = search.toLowerCase();
      update(() => {
        let options = [];
        for (let c of countries.value) {
          if (c.label.toLowerCase().includes(needle)) {
            options.push(c);
          }
        }
        resultOptions.value = options;
      });
    }

    function filterRegionInput(search: string, update: Function) {
      regionFilter(search, update, regionOptions);
    }
    return { region, regionOptions, filterRegionInput };
  },
});
</script>
