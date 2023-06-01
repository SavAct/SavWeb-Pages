<template>
  <q-img
    :src="protSrc"
    @load="getFileData"
    ref="imageRef"
    @click="fopen = !fopen"
  ></q-img>
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
    open: {
      type: Boolean,
      requier: false,
      default: false,
    },
  },
  emits: ["size", "type", "natural-width", "natural-height", "update:open"],
  setup(props, context) {
    const protSrc = Vue.ref<string>("");
    const imageRef = Vue.ref(null);
    const fopen = Vue.computed({
      get: () => {
        return props.open;
      },
      set: (v) => context.emit("update:open", v),
    });

    Vue.onMounted(async () => {
      if (props.src.length > 0) {
        const f = await GetUrlFile(props.src, props.fileSize);
        if (f) {
          protSrc.value = f.src;

          context.emit("size", f.blob.size);
          context.emit("type", f.blob.type);
        } else {
          console.log("Cannot load the image");
        }
      }
    });

    function getFileData() {
      const ref = (imageRef.value as any).$el as HTMLImageElement;
      const img = ref.getElementsByClassName(
        "q-img__image"
      )[0] as HTMLImageElement;

      if (img && "naturalWidth" in img && "naturalHeight" in img) {
        context.emit("natural-width", img.naturalWidth);
        context.emit("natural-height", img.naturalHeight);
      }
    }

    return {
      protSrc,
      getFileData,
      imageRef,
      fopen,
    };
  },
});
</script>
