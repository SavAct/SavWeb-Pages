<template>
  <q-chip
    icon="person"
    :label="user"
    clickable
    @click="click"
    :color="color"
  ></q-chip>
</template>
<script lang="ts">
import { openLinkOrMail } from "./LinkConverter";

export default Vue.defineComponent({
  name: "userLink",
  props: {
    user: {
      type: String,
      requier: true,
    },
    color: {
      type: String,
      requier: false,
      default: undefined,
    },
  },
  setup(props) {
    return {
      click: () => {
        openLinkOrMail(`https://bloks.io/account/${props.user}`);
      },
    };
  },
});
</script>
