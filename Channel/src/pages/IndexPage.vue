<template>
  <q-page class="column">
    <div class="col text-center">
      <div class="text-h4">Boards</div>
      <div>Japanese Culture</div>
      <div @click="open('anime')">Anime</div>
    </div>
  </q-page>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";
import { router } from "../router/simpleRouter";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "indexPage",
  components: {
    ProImg,
  },
  setup() {
    const loading = Vue.ref<boolean>(false);

    function open(topic: string) {
      router.push({ name: "board", query: { topic } });
    }

    return {
      darkStyle: state.darkStyle,
      open,
      loading,
    };
  },
});
</script>
