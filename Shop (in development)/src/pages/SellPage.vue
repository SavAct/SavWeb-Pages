<template>
  <q-page class="column">
    {{ requestId }}
  </q-page>
</template>
<script lang="ts">
import { generateRandomString } from "../Components/Generator";

export default Vue.defineComponent({
  components: {},
  name: "sellPage",
  setup() {
    const requestId = Vue.ref<string>(generateRandomString(8));

    return {
      requestId,
    };
  },
});
</script>
