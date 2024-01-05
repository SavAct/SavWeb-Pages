<template>
  <div class="row full-width">
    <div class="col-3 q-pr-sm">
      <q-input
        label="Pieces"
        v-model="modelValue.pcs"
        type="number"
        min="1"
        outlined
      />
    </div>
    <q-input
      class="col-9"
      :label="priceInputLabel"
      v-model="modelValue.p"
      type="number"
      min="0"
      outlined
    >
      <template v-slot:append>USD</template>
      <template v-slot:after v-if="rmBtn">
        <q-btn icon="clear" color="red" @click="emitRemove"></q-btn>
      </template>
    </q-input>
  </div>
</template>
<script lang="ts">
import { PropType } from "vue";

export default Vue.defineComponent({
  name: "priceAndUnit",
  props: {
    modelValue: {
      type: Object as PropType<{ p: number; pcs: number }>,
      required: true,
    },
    rmBtn: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const priceInputLabel = Vue.computed(() => {
      return `Price for ${props.modelValue.pcs} ${
        props.modelValue.pcs > 1 ? "pieces" : "piece"
      }`;
    });

    function emitRemove() {
      context.emit("remove");
    }

    return { priceInputLabel, emitRemove };
  },
});
</script>
