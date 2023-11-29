<template>
  <div class="q-mb-sm row">
    <div class="col-grow">
      Expired date in <span class="text-blue">{{ days }}</span
      >d <span class="text-blue">{{ String(hours).padStart(2, "0") }}</span
      >h <span class="text-blue">{{ String(minutes).padStart(2, "0") }}</span
      >m <span class="text-blue">{{ String(seconds).padStart(2, "0") }}</span
      >s
    </div>
    <q-btn
      class="col-auto q-pl-md q-pr-sm q-py-none q-my-none"
      color="primary"
      size="sm"
      rounded
      flat
      dense
      :icon-right="
        toggleExpireDate ? 'keyboard_arrow_down' : 'keyboard_arrow_up'
      "
      @click="toggleExpireDate = !toggleExpireDate"
      >{{ new Date(expired).toUTCString() }}</q-btn
    >
  </div>
  <div
    v-show="toggleExpireDate"
    class="q-gutter-md row items-start justify-center"
  >
    <q-date
      v-model="expiredStr"
      mask="YYYY-MM-DDTHH:mm:ss"
      :options="
        (date) =>
          date >= new Date().toISOString().substring(0, 10).replaceAll('-', '/')
      "
    />
    <q-time v-model="expiredStr" mask="YYYY-MM-DDTHH:mm:ss" with-seconds />
  </div>
</template>
<script lang="ts">
export default Vue.defineComponent({
  name: "dateTimeInput",
  props: {
    modelValue: {
      type: Number,
      required: true,
      default: Date.now() + 90 * 24 * 3600 * 1000,
    },
    label: {
      type: String,
      required: false,
      default: "",
    },
  },
  setup(props, { emit }) {
    const toggleExpireDate = Vue.ref<boolean>(false);
    const expiredStr = Vue.ref<string>(
      new Date(props.modelValue).toISOString().substring(0, 19)
    );
    const expired = Vue.computed(() => {
      const exp = Math.floor(Date.parse(expiredStr.value + ".000Z"));
      emit("update:modelValue", exp);
      return exp;
    });

    const expiredDuration = Vue.ref<number>(0);
    const days = Vue.ref<number>(0);
    const hours = Vue.ref<number>(0);
    const minutes = Vue.ref<number>(0);
    const seconds = Vue.ref<number>(0);

    Vue.watch(expiredDuration, () => {
      const d = expiredDuration.value / 1000;
      if (d === undefined) return;
      days.value = Math.floor(d / 86400);
      hours.value = Math.floor((d % 86400) / 3600);
      minutes.value = Math.floor((d % 3600) / 60);
      seconds.value = Math.floor(d % 60);
    });

    Vue.onMounted(() => {
      setInterval(() => {
        expiredDuration.value = expired.value - Date.now();
      }, 1000);
    });

    return {
      toggleExpireDate,
      expired,
      expiredStr,
      days,
      hours,
      minutes,
      seconds,
      expiredDuration,
    };
  },
});
</script>
