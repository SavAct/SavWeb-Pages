export default Vue.defineComponent({
  name: "page-error-404",

  template: /*html*/ `<div class="q-pa-md text-center">
  <div class=" q-my-md">Small file size template by using</div>
  <div class="text-h2 q-mt-lg">Quasar + Vue 3 + TypeScript + Vite</div>
  <div class="row q-mt-lg justify-center">
    <q-btn class="col-sm-3 col-md-2 col-12" icon-right="add" @click="btnClick" label="Count"></q-btn>
    <div class="col-sm-2 col-12">
      <div :class="$q.screen.lt.sm?'q-mt-md':'q-mt-sm'">Value is <span class="number-color q-pa-sm">{{ counter }}</span></div>
    </div>
  </div>
  <div class="q-mt-lg">Presented by SavAct.</div>
</div>`,
  setup() {
    function btnClick() {
      counter.value++;
    }

    const counter = Vue.ref<number>(0);

    return { counter, btnClick };
  },
});
