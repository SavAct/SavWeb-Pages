<template>
  <span :class="$q.screen.lt.sm ? 'row justify-between' : ''">
    <span :class="{ column: $q.screen.lt.sm }">
      <span v-if="post.subject.length > 0" class="text-bold"
        >{{ post.subject }}&nbsp;</span
      >
      <span class="text-green-9 text-bold">{{ post.account }}</span>
    </span>
    <span
      class="self-start"
      :class="$q.screen.lt.sm ? 'col-grow text-right' : ''"
    >
      <span v-if="dateVisible">
        &nbsp;{{ new Date(post.date).toLocaleString() }}
      </span>
      &nbsp;No.<span>{{ post.id }}</span>
    </span>
  </span>
</template>
<script lang="ts">
import { PropType } from "vue";
import { PostData } from "./Post.vue";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "postTitle",
  props: {
    post: {
      type: Object as PropType<PostData>,
      required: true,
    },
  },
  setup() {
    return { dateVisible: state.dateVisible };
  },
});
</script>
