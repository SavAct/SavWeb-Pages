<template>
  <q-carousel
    swipeable
    animated
    v-model="selectedImg"
    :navigation="!imgFullscreen"
    :arrows="!imgFullscreen"
    v-model:fullscreen="imgFullscreen"
    @keydown="imgKeyDown"
    tabindex="0"
    padding
    id="imgCarousel"
    class="q-pb-lg"
  >
    <q-carousel-slide
      v-for="(img, index) in srcs"
      :key="index"
      :name="index"
      class="full-width"
    >
      <q-img class="full-height" :src="img" fit="contain"></q-img>
    </q-carousel-slide>
    <template v-slot:control>
      <q-carousel-control position="bottom-right" :offset="[18, 18]">
        <q-btn
          push
          round
          dense
          text-color="white"
          :icon="imgFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="clickFullScreen"
        />
      </q-carousel-control>
    </template>
    <template
      v-slot:navigation-icon="{ active, index, onClick }"
      v-if="$q.screen.gt.xs"
    >
      <q-img
        v-if="srcs"
        style="border-radius: 5%; border: 1px solid white"
        class="bg-grey q-mx-sm"
        :height="active ? '60px' : '50px'"
        :width="active ? '90px' : '80px'"
        :src="srcs[index]"
        flat
        round
        dense
        mode="scale-down"
        @click="onClick"
      ></q-img>
    </template>
  </q-carousel>
</template>
<script lang="ts">
export default Vue.defineComponent({
  props: {
    srcs: {
      type: Array<string>,
      requier: true,
    },
  },
  name: "gallery",
  setup(props) {
    const selectedImg = Vue.ref<number>(0);
    const imgFullscreen = Vue.ref<boolean>(false);

    function imgKeyDown(event: KeyboardEvent) {
      switch (event.code) {
        case "Escape":
          imgFullscreen.value = false;
          break;
        case "ArrowRight":
          if (props.srcs && selectedImg.value < props.srcs.length - 1) {
            selectedImg.value++;
          }
          break;
        case "ArrowLeft":
          if (selectedImg.value > 0) {
            selectedImg.value--;
          }
          break;
      }
    }

    function clickFullScreen() {
      imgFullscreen.value = !imgFullscreen.value;
      setTimeout(() => document.getElementById("imgCarousel")?.focus(), 100);
    }

    return { selectedImg, imgFullscreen, imgKeyDown, clickFullScreen };
  },
});
</script>
