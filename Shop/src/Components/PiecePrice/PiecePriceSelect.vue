<template>
  <q-select
    v-model="pricePiece"
    outlined
    :options="selectOptions"
    :option-label="ppLine"
  >
    <!-- <template v-slot:option="{ opt, selected }">
      <div class="q-pa-sm" :class="selected ? 'bg-grey' : ''">
        <div>
          {{ opt.pcs }} {{ opt.pcs == 1 ? "piece" : "pieces" }} for
          {{ opt.p }} USD
        </div>
        <div>{{ opt.p / opt.pcs }} USD/pcs</div>
      </div>
    </template> -->
  </q-select>
</template>
<script lang="ts">
import { PropType } from "vue";
import { PiecesPrice } from "../ContractInterfaces";
import { GetParamsFromTablePricePiece } from "./ContractTablePriceOption";

export default Vue.defineComponent({
  name: "piecePriceSelect",
  props: {
    modelValue: {
      type: Object as PropType<PiecesPrice | undefined>,
      required: true,
    },
    pp: {
      type: Object as PropType<Array<PiecesPrice>>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const pricePiece = Vue.computed({
      get: () => props.modelValue,
      set: (value) => {
        context.emit("update:modelValue", value);
      },
    });

    const options = GetParamsFromTablePricePiece(props.pp);

    if (props.modelValue !== undefined) {
      // Find and select the lowest price option
      if (options.piecePrices && options.piecePrices.length > 0) {
        pricePiece.value = options.piecePrices.reduce(
          (min, current) => (current.p < min.p ? current : min),
          options.piecePrices[0]
        );
      }
    }

    function ppLine(opt: PiecesPrice) {
      return `${opt.p} USD for ${opt.pcs} ${
        opt.pcs == 1 ? "piece" : "pieces"
      } | ${Number(opt.p) / opt.pcs} USD/pcs`;
    }

    return { pricePiece, selectOptions: options.piecePrices, ppLine };
  },
});
</script>
