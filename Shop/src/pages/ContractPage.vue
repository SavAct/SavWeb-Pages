<template>
  <q-page class="column">
    <div class="col q-pa-md text-center">
      <div class="q-my-md">Articel page</div>
      <div class="q-mt-lg">Presented by SavAct.</div>
    </div>
    <div class="col-auto">
      <q-linear-progress
        size="50px"
        :value="progress"
        class="q-mt-sm"
        :color="darkStyle ? 'blue-13' : 'blue-2'"
      >
        <div class="absolute-full flex flex-center">
          <q-badge
            color="transparent"
            :text-color="darkStyle ? 'white' : 'black'"
            label="Click state on counter page"
          />
        </div>
      </q-linear-progress>
    </div>
  </q-page>
</template>
<script lang="ts">
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "contractPage",
  setup() {
    return { progress: state.progress, darkStyle: state.darkStyle };
  },
});
</script>
