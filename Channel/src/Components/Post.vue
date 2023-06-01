<template>
  <q-card class="my-card" :class="{ 'q-pb-sm': expandPost }">
    <q-card-actions>
      <q-btn
        size="xs"
        color="red"
        :icon="expandPost ? 'remove' : 'add'"
        dense
        class="q-mr-sm"
        style="padding: 0 1px 0 1px"
        @click="expandPost = !expandPost"
      ></q-btn>
      <span v-if="expandPost">
        File:&nbsp;
        <span class="clickable-span" @click="openFile(post.imgsrc)" clickable>{{
          fileText
        }}</span
        >&nbsp;<span>({{ fsize_str }},&nbsp;{{ fPixels_str }})</span></span
      >
      <post-title v-else :post="post"></post-title>
    </q-card-actions>
    <q-card-section horizontal class="q-px-md" v-if="expandPost">
      <pro-img
        class="col-sm-2 col-4"
        position="top"
        :src="post.imgsrc"
        fit="contain"
        @size="fsize = $event"
        @natural-height="fheight = $event"
        @natural-width="fwidth = $event"
      />

      <q-card-section class="q-pt-none">
        <div class="q-mb-md">
          <q-checkbox
            style="padding: 0; margin: 0"
            v-if="pchecked !== undefined"
            v-model="pchecked"
            size="xs"
          />
          <post-title :post="post"></post-title>
          <span class="q-ml-md"
            >[<span class="clickable-span" @click="openThread">Reply</span
            >]</span
          >
        </div>
        <div>{{ post.text }}</div>
        <div v-if="post.replies" class="q-mt-lg">
          <q-btn
            size="xs"
            color="red"
            :icon="expandThread ? 'remove' : 'add'"
            dense
            class="q-mr-sm"
            style="padding: 0 1px 0 1px"
            @click="expandThread = !expandThread"
          ></q-btn>
          +{{ post.replies }}&nbsp;replies and&nbsp;{{
            post.rImages
          }}&nbsp;images omitted.&nbsp;<span
            class="clickable-span"
            @click="openThread"
            >Click here</span
          >&nbsp;to view.
        </div>
      </q-card-section>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import PostTitle from "./PostTitle.vue";
import ProImg from "../Components/ProImg.vue";
import { router } from "../router/simpleRouter";
import { state } from "../store/globals";
import { SavWeb } from "./SavWeb";
import { PropType } from "vue";

export interface PostData {
  id: string;
  account: string;
  date: number;
  subject: string;
  text: string;
  imgsrc: string;
  replies: number;
  rImages: number;
}

export default Vue.defineComponent({
  name: "post",
  components: {
    ProImg,
    PostTitle,
  },
  props: {
    post: {
      type: Object as PropType<PostData>,
      required: true,
    },
    checked: {
      type: Boolean,
      required: false,
      default: undefined,
    },
  },
  emits: ["update:checked"],
  setup(props, context) {
    const fsize = Vue.ref<number>(0);
    const fwidth = Vue.ref<number>(0);
    const fheight = Vue.ref<number>(0);

    const expandPost = Vue.ref<boolean>(true);
    const expandThread = Vue.ref<boolean>(false);

    const fPixels_str = Vue.computed(() => {
      return fwidth.value + "x" + fheight.value;
    });

    const fsize_str = Vue.computed(() => {
      let unit: string;
      let fsizeU: number;
      if (fsize.value < 1000) {
        unit = "B";
        fsizeU = fsize.value;
      } else if (fsize.value < 1000000) {
        unit = "KB";
        fsizeU = fsize.value / 1000;
      } else if (fsize.value < 1000000000) {
        unit = "MB";
        fsizeU = fsize.value / 1000000;
      } else {
        unit = "GB";
        fsizeU = fsize.value / 1000000000;
      }
      return `${fsizeU.toFixed(2)} ${unit}`;
    });

    const pchecked = Vue.computed({
      get() {
        return props.checked;
      },
      set(val: boolean | undefined) {
        context.emit("update:checked", val);
      },
    });

    function getFileName(path: string) {
      const split = path.split("/");
      if (split.length > 4) {
        return `${split[0]}/${split[1]}/${split[2]}/.../${
          split[split.length - 1]
        }`;
      }
      return split;
    }

    const fileText = Vue.computed(() => {
      return props.post.imgsrc.length > 0 ? getFileName(props.post.imgsrc) : "";
    });

    function openFile(file: string) {
      SavWeb.goTo(file, "_blank");
    }

    function openThread() {
      router.push({ name: "thread", query: { thread: props.post } });
    }

    return {
      darkStyle: state.darkStyle,
      openFile,
      expandPost,
      expandThread,
      fsize_str,
      fPixels_str,
      openThread,
      pchecked,
      fileText,
      fsize,
      fwidth,
      fheight,
    };
  },
});
</script>
