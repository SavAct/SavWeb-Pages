<template>
  <q-img :src="protSrc"></q-img>
</template>
<script lang="ts">
import { GetUrlFile } from "../store/dlFiles";
export default Vue.defineComponent({
  name: "proImg",
  props: {
    src: {
      type: String,
      requier: false,
      default: "",
    },
    fileSize: {
      type: Number,
      requier: false,
    },
  },
  setup(props) {
    const protSrc = Vue.ref<string>("");
    Vue.onMounted(async () => {
      if (props.src.length > 0) {
        console.log("check", props.src, props.fileSize);

        protSrc.value = await GetUrlFile(props.src, props.fileSize);
      }
    });

    return {
      protSrc,
    };
  },
});
</script>
