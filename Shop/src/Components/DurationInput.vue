<template>
  <q-input
    v-model="durationNumber"
    type="number"
    min="0"
    :label="label"
    outlined
  >
    <template v-slot:append>
      <q-select
        v-model="durationUnit"
        filled
        :options="['months', 'weeks', 'days', 'hours', 'minutes']"
      />
    </template>
  </q-input>
</template>
<script lang="ts">
const hourInMin = 60;
const dayInMin = 24 * hourInMin;
const weekInMin = 7 * dayInMin;
const monthInMin = 30 * dayInMin;

const minInMs = 60 * 1000;
const hourInMs = 60 * minInMs;
const dayInMs = 24 * hourInMs;
const weekInMs = 7 * dayInMs;
const monthInMs = 30 * dayInMs;

export default Vue.defineComponent({
  name: "durationInput",
  props: {
    modelValue: {
      type: Number,
      required: false,
      default: 3 * 24 * 3600000,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props, { emit }) {
    const _duractionUnit = Vue.ref<
      "months" | "weeks" | "days" | "hours" | "minutes"
    >(getInitialDurationUnit(props.modelValue));
    const durationUnit = Vue.computed({
      get: () => _duractionUnit.value,
      set: (value) => {
        _duractionUnit.value = value;
        emit("update:modelValue", duration.value);
        emit("update:modelValue", getDuration(value, durationNumber.value));
      },
    });

    const _durationNumber = Vue.ref<number>(3);
    const durationNumber = Vue.computed({
      get: () => _durationNumber.value,
      set: (value) => {
        _durationNumber.value = value;
        emit("update:modelValue", getDuration(durationUnit.value, value));
      },
    });

    /**
     * Get the initial duration unit based on the value
     * @param msValue Duration in milliseconds
     */
    function getInitialDurationUnit(msValue: number) {
      const value = Math.floor(msValue / 60000);
      if (value % monthInMin === 0) {
        return "months";
      } else if (value % weekInMin === 0) {
        return "weeks";
      } else if (value % dayInMin === 0) {
        return "days";
      } else if (value % hourInMin === 0) {
        return "hours";
      } else if (value % 1 === 0) {
        return "minutes";
      }
      return "days";
    }

    /**
     * Get the duration in milliseconds
     * @param unit Duration unit
     * @param value Duration number in duration unit
     */
    function getDuration(
      unit: "months" | "weeks" | "days" | "hours" | "minutes",
      value: number
    ) {
      switch (unit) {
        case "months":
          return value * monthInMs;
        case "weeks":
          return value * weekInMs;
        case "days":
          return value * dayInMs;
        case "hours":
          return value * hourInMs;
        case "minutes":
          return value * minInMs;
      }
    }
    const duration = Vue.computed(() => {
      switch (durationUnit.value) {
        case "months":
          return durationNumber.value * 30 * 24 * 3600;
        case "weeks":
          return durationNumber.value * 7 * 24 * 3600;
        case "days":
          return durationNumber.value * 24 * 3600;
        case "hours":
          return durationNumber.value * 3600;
        case "minutes":
          return durationNumber.value * 60;
      }
    });

    return { durationNumber, durationUnit };
  },
});
</script>
