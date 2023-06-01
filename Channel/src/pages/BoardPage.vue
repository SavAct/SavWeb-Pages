<template>
  <q-page>
    <div>
      <q-separator class="q-mt-md" />
      <post
        v-for="(p, index) in threads"
        :post="p"
        :key="index"
        v-model:checked="checked[index]"
        class="q-mb-sm"
      ></post>
    </div>
  </q-page>
</template>
<script lang="ts">
import Post, { PostData } from "../Components/Post.vue";
import { router } from "../router/simpleRouter";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "boardPage",
  components: {
    Post,
  },
  setup() {
    const loading = Vue.ref<boolean>(false);

    const checked = Vue.ref<Array<boolean>>([false, false, false]);
    const threads = Vue.ref<Array<PostData>>([
      {
        imgsrc: "https://cdn.quasar.dev/img/parallax1.jpg",
        subject: "",
        text: "Hello, this is an interesting topic.",
        date: Date.now(),
        account: "Anonymous",
        id: "1",
        replies: 251,
        rImages: 64,
      },
      {
        imgsrc: "https://cdn.quasar.dev/img/parallax2.jpg",
        subject: "Nice bridge",
        text: "A red bridge",
        date: Date.now(),
        account: "Anonymous",
        id: "2",
        replies: 0,
        rImages: 0,
      },

      {
        imgsrc:
          "https://images.pexels.com/photos/17016970/pexels-photo-17016970/free-photo-of-natur-blumen-sommer-gras.jpeg?auto=compress&cs=tinysrgb&w=400&lazy=load",
        subject: "Flowers",
        text: "Looks good, smells good, tastes good",
        date: Date.now(),
        account: "savact",
        id: "3",
        replies: 100,
        rImages: 0,
      },
      {
        imgsrc: "https://cdn.quasar.dev/img/mountains.jpg",
        subject: "Mountains are cool",
        text: "Look at my mountain!",
        date: Date.now(),
        account: "Anonymous",
        id: "4",
        replies: 0,
        rImages: 0,
      },
    ]);

    function open(thread: string) {
      router.push({ name: "thread", query: { thread } });
    }

    return {
      darkStyle: state.darkStyle,
      open,
      loading,
      threads,
      checked,
    };
  },
});
</script>
