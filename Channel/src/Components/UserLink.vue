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
        window.open(`https://bloks.io/account/${props.user}`, "_blank");
      },
    };
  },
});
</script>
