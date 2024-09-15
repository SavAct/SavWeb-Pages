<template>
<div class="row justify-between q-col-gutter-x-sm q-mt-sm">
  <div v-if="price" class="col-auto">
    Price:
    <q-chip
      :color="chipBgColor()"
      :label="price?.toFixed(2) + ' USD'"
    ></q-chip>
  </div>
  <div v-if="shipPrice !== undefined" class="col-auto">
    Shipping:
    <q-chip
      :color="chipBgColor()"
      :label="
        'Within ' +
        shipDurationStr +
        ' for ' +
        shipPrice?.toFixed(2) +
        ' USD'
      "
    ></q-chip>
  </div>
  <div v-if="totalPrice" class="col-auto">
    Total price:
    <q-chip
      :color="chipBgColor()"
      :label="totalPrice?.toFixed(2) + ' USD'"
    ></q-chip>
    <q-chip
      v-if="token"
      :color="chipBgColor()"
      :label="totalTokenStr"
    >
    </q-chip>
  </div>
</div>
</template>
<script lang="ts">
import { PropType } from "vue";
import { chipBgColor } from "./styleHelper";
import { Asset, AssetToString, Token } from "./AntelopeHelpers";
import { getCurrentTokenPrice } from "./ConvertPrices";

export default Vue.defineComponent({
  name: "prices",
  emits: ["totalPrice"],
  props: {
    token: {
      type: Object as PropType<{value: Token; label: string}>,
      required: true,
      default: undefined,
    },
    shipToPrice: {
      type: Object as PropType<{ t: number; p: number }>,
      required: false,
      default: true,
    },
    prepTime: {
      type: Number,
      required: true,
      default: 0,
    },
    piecesPrice: {
      type: Object as PropType<{ p: number; pcs: number }>,
      required: true,
      default: { p: 0, pcs: 1 },
    },
    pieces: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  setup(props, contex) {
   
    const shipDurationStr = Vue.computed(() => {
      if (props.shipToPrice !== undefined) {
        return Number(props.shipToPrice.t) + Number(props.prepTime) / 3600 / 24 + " days";
      }
      return undefined;
    });

    const shipPrice = Vue.computed(() => {
      if (props.shipToPrice !== undefined) {
        return Number(props.shipToPrice.p);
      }
      return undefined;
    });

    const totalPrice = Vue.computed(() => {
      if (shipPrice.value !== undefined && price.value !== undefined) {
        const p = shipPrice.value + price.value;
        setTotalToken(p);
        contex.emit("totalPrice", p);
        return p;
      }
      totalToken.value = undefined;
      return undefined;
    });

    const totalToken = Vue.ref<Asset | undefined>();
    async function setTotalToken(price: number) {
      if (price !== undefined && props.token !== undefined) {
        totalToken.value = await getCurrentTokenPrice(
          price,
          props.token.value
        );
      } else {
        totalToken.value = undefined;
      }
    }

    const totalTokenStr = Vue.computed(() => {
      if (totalToken.value) {
        return "~ " + AssetToString(totalToken.value);
      }
      return undefined;
    });

    const price = Vue.computed(() => {
      return (props.piecesPrice.p * props.pieces) / props.piecesPrice.pcs;
    });

    return {
      chipBgColor,
      shipDurationStr,
      totalPrice,
      shipPrice,
      totalTokenStr,
      price
    };
  },
});
</script>
