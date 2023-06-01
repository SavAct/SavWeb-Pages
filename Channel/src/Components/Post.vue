<template>
  <div class="row no-wrap">
    <div v-if="!thread && $q.screen.gt.xs" class="q-ml-sm q-mr-xs col-auto">
      &gt;&gt;
    </div>
    <div class="col-grow" :class="{ 'q-pl-sm': !thread && $q.screen.lt.sm }">
      <q-card class="my-card" :class="{ 'q-pb-sm': expandPost }">
        <q-card-actions
          class="q-py-xs row"
          :class="{ 'bg-grey': $q.screen.lt.sm }"
        >
          <div class="col-auto q-pr-sm self-start">
            <q-btn
              v-if="thread"
              size="xs"
              color="red"
              :icon="expandPost ? 'remove' : 'add'"
              dense
              style="padding: 0 1px 0 1px"
              @click="expandPost = !expandPost"
            ></q-btn>
          </div>
          <div class="col-grow">
            <div v-if="!thread" class="fit">
              <q-checkbox
                class="self-start"
                style="padding: 0; margin: 0"
                v-if="pchecked !== undefined && $q.screen.gt.xs"
                v-model="pchecked"
                size="xs"
              />
              <post-title :post="post"></post-title>
            </div>
            <span v-if="post.imgsrc.length > 0">
              <span v-if="expandPost && $q.screen.gt.xs">
                File:&nbsp;
                <span
                  class="clickable-span"
                  @click="openFile(post.imgsrc)"
                  clickable
                  >{{ fileText }}</span
                >&nbsp;
                <span>({{ fsize_str }},&nbsp;{{ fPixels_str }})</span>
                <span v-if="fileOpen && ftypeContent != 'image'"
                  >-[
                  <span class="clickable-span" @click="fileOpen = false"
                    >Close</span
                  >]</span
                >
              </span>
            </span>
            <post-title
              v-if="thread && !(expandPost && $q.screen.gt.xs)"
              :post="post"
            ></post-title>
          </div>
        </q-card-actions>
        <q-card-section class="q-px-md q-py-sm row" v-if="expandPost">
          <div
            v-if="post.imgsrc.length > 0"
            :class="fileOpen ? 'col-12 q-mb-sm' : 'col-sm-2 col-4'"
          >
            <pro-img
              position="top"
              :src="post.imgsrc"
              fit="contain"
              @size="fsize = $event"
              @natural-height="fheight = $event"
              @natural-width="fwidth = $event"
              @type="ftype = $event"
              v-model:open="fileOpen"
            />
            <div v-if="$q.screen.lt.sm" class="text-center text-grey-6">
              {{ fsize_str }}&nbsp;{{ ftypeName }}
            </div>
          </div>

          <q-card-section class="q-pt-none">
            <div class="q-mb-md" v-if="$q.screen.gt.xs && thread">
              <q-checkbox
                class="self-start"
                style="padding: 0; margin: 0"
                v-if="pchecked !== undefined"
                v-model="pchecked"
                size="xs"
              />
              <post-title :post="post"></post-title>
              <span v-if="thread" class="q-ml-md"
                >[<span class="clickable-span" @click="openThread">Reply</span
                >]</span
              >
            </div>
            <div>{{ post.text }}</div>
            <div
              v-if="post.replies && $q.screen.gt.xs && thread"
              class="q-mt-lg"
            >
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

        <q-card-section
          v-if="$q.screen.lt.sm && thread"
          class="row justify-between q-py-xs bg-grey"
        >
          <div class="col" v-if="post.replies">
            {{ post.replies }}&nbsp;Replies
            <span v-if="post.rImages">
              &nbsp;/&nbsp;{{ post.rImages }}&nbsp;Images
            </span>
          </div>
          <div class="col-grow">
            <q-btn
              class="float-right q-px-sm q-py-none"
              size="sm"
              dense
              no-caps
              label="View Thread"
              @click="openThread"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
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
    thread: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["update:checked"],
  setup(props, context) {
    const fsize = Vue.ref<number>(0);
    const fwidth = Vue.ref<number>(0);
    const fheight = Vue.ref<number>(0);
    const ftype = Vue.ref<string>("");

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
      let fixes: number;
      if (fsizeU > 100) {
        fixes = 0;
      } else if (fsizeU > 10) {
        fixes = 1;
      } else {
        fixes = 2;
      }
      return `${fsizeU.toFixed(fixes)} ${unit}`;
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
        let last = split[split.length - 1];
        let s = last.indexOf("?");
        if (s > 0 && last.length > s + 5) {
          last = last.substring(0, s + 1) + "...";
        }
        return `${split[0]}/${split[1]}/${split[2]}/.../${last}`;
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

    const ftypeName = Vue.computed(() => {
      if (ftype.value.length > 0) {
        return ftype.value
          .split("/")
          .pop()
          ?.toUpperCase()
          .replace("JPEG", "JPG");
      }
      return ftype.value;
    });
    const ftypeContent = Vue.computed(() => {
      if (ftype.value.length > 0) {
        return ftype.value.split("/").shift()?.toLowerCase();
      }
      return ftype.value;
    });

    const fileOpen = Vue.ref<boolean>(false);

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
      ftype,
      ftypeName,
      ftypeContent,
      fileOpen,
    };
  },
});
</script>
