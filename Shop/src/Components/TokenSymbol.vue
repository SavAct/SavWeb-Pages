<template>
  <q-chip square>
    <span class="text-bold text-h5" v-if="symbol">{{ symbol.name }}</span>
    <div class="text-caption q-ml-sm" style="line-height: 100%">
      <div>
        of <span class="text-bold">{{ contract }}</span>
      </div>
      <div>
        on <span class="text-bold">{{ chain }}</span>
      </div>
    </div>
  </q-chip>
</template>
<script lang="ts">
import { AssetSymbol } from "./AntelopeHelpers";
import { PropType } from "vue";
export default Vue.defineComponent({
  name: "tokenSymbol",
  props: {
    symbol: {
      type: Object as PropType<AssetSymbol>,
      required: true,
    },
    contract: {
      type: String,
      required: true,
    },
    chain: {
      type: String,
      required: true,
    },
  },
  setup() {
    return {};
  },
});
</script>
