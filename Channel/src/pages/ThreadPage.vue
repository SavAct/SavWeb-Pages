<template>
  <q-page class="column">
    <div class="col text-center">
      <div class="text-h4">Thread</div>
      <div>Japanese Culture</div>
    </div>
  </q-page>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";

import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "boardPage",
  components: {
    ProImg,
  },
  setup() {
    const loading = Vue.ref<boolean>(false);

    return {
      darkStyle: state.darkStyle,
      open,
      loading,
    };
  },
});
</script>
