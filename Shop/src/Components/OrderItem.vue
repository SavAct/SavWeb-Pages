<template>
  <div class="row" style="border: 1px solid #ddd; border-radius: 4px">
    <div class="col-3">
      <pro-img
        v-if="entry.imgs.length > 0"
        :src="entry.imgs[0]"
        fit="contain"
        :class="darkStyle ? 'bg-grey-10' : 'bg-grey-2'"
      ></pro-img>
    </div>
    <div class="col-9 q-px-md">
      <div
        class="text-bold q-py-sm q-pr-sm"
        :class="$q.screen.gt.xs ? 'text-h6' : ''"
      >
        {{ entry.title }}
      </div>
      <div class="row justify-between">
        <div class="col-auto">
          <piece-price-select
            class="q-mb-sm"
            label="Price option"
            :pps="entry.pp"
            v-model:pieces="pieces"
            v-model="piecesPrice"
            disabled
            dense
          ></piece-price-select>
          <div v-if="excludedRegion" class="text-red">
            The region {{ excludedRegion }} is excluded!
          </div>
          <div>
            <span> {{ shouldItemsPrice?.toFixed(2) }} USD + </span>
            <span :class="selectedShipTo === undefined ? 'text-red' : ''"
              >Shipping to <span class="text-bold">{{ toRegionName }}</span> for
              {{ shouldShipPrice?.toFixed(2) }} USD</span
            >
          </div>

          <div>
            Total price
            <q-chip
              icon="attach_money"
              :label="price?.toFixed(2) + ' USD'"
            ></q-chip>
            Current token price
            <q-chip
              icon="currency_bitcoin"
              :label="totalAsset"
              clickable
              @click="updateTokenPrice"
            ></q-chip>
          </div>
        </div>
        <user-link class="col-auto" :user="entry.seller"></user-link>
      </div>

      <token-symbol
        :chain="token?.chain"
        :contract="token?.contract"
        :symbol="token?.symbol"
        size="18px"
      ></token-symbol>
    </div>
  </div>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";
import TokenSymbol from "./TokenSymbol.vue";
import PiecePriceSelect from "./PiecePrice/PiecePriceSelect.vue";
import { PropType } from "vue";
import { state } from "../store/globals";
import { AssetToString, Token } from "./AntelopeHelpers";
import { ItemTable, ToRegion } from "./ContractInterfaces";
import { countryCodes, euCountryCodes, getRegion } from "./ConvertRegion";

export default Vue.defineComponent({
  name: "orderItem",
  components: { ProImg, TokenSymbol, PiecePriceSelect },
  emits: ["currentTokenPrice", "update:price"],
  props: {
    entry: {
      type: Object as PropType<ItemTable>,
      required: true,
    },
    pieces: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    token: {
      type: Object as PropType<Token>,
      required: true,
    },
    toRegion: {
      type: String,
      required: true,
    },
  },
  setup(props, context) {
    const piecesPrice = Vue.ref<{ p: number; pcs: number }>({
      p: 0,
      pcs: props.pieces,
    });

    const shouldItemsPrice = Vue.computed(() => {
      return piecesPrice.value.p * piecesPrice.value.pcs;
    });

    const shipTo = Vue.computed(() => {
      if (props.entry !== undefined) {
        return props.entry.shipTo.map((to) => {
          return { p: Number(to.p), t: Number(to.t), rs: to.rs.match(/../g) };
        });
      }
      return undefined;
    });

    const excludedRegion = Vue.computed(() => {
      if (props.entry !== undefined && props.entry.excl !== undefined) {
        const result = props.entry.excl
          .match(/../g)
          ?.find((r) => r == props.toRegion || r == selectedShipTo.value?.rs);
        if (result) {
          return getRegion(result.toUpperCase()) ?? "";
        }
      }
      return undefined;
    });

    const selectedShipTo = Vue.computed(() => {
      if (shipTo.value !== undefined && props.toRegion !== undefined) {
        let EU: ToRegion | undefined = undefined;
        let WW: ToRegion | undefined = undefined;
        const result = shipTo.value.find((a) =>
          a.rs?.find((r) => {
            // Check if there are group regions defined
            if (r == "eu") EU = { p: a.p, t: a.t, rs: "eu" };
            if (r == "ww") WW = { p: a.p, t: a.t, rs: "ww" };
            return r == props.toRegion;
          })
        );
        if (result) return { p: result.p, t: result.t, rs: props.toRegion };

        // If no result, check if the region is in the group EU or WW
        const toR = props.toRegion.toUpperCase();
        if (EU) {
          const euResult = euCountryCodes.find((r) => r == toR);
          if (euResult !== undefined) return EU;
        }
        if (WW !== undefined) {
          const wwResult = countryCodes.find((r) => r == toR);
          if (wwResult) return WW;
        }
      }
      return undefined;
    });

    const shipDuration = Vue.computed(() => {
      if (selectedShipTo.value !== undefined) {
        return Number(selectedShipTo.value.t) / 3600 / 24 + " days";
      }
      return undefined;
    });

    const shouldShipPrice = Vue.computed(() => {
      if (selectedShipTo.value !== undefined) {
        return Number(selectedShipTo.value.p);
      }
      return undefined;
    });

    const currentTokenPrice = Vue.ref(BigInt(0));
    async function updateTokenPrice() {
      currentTokenPrice.value = BigInt(Math.round(props.price)); // TODO: Calculate the real current token price like in ItemPage.vue
      context.emit("currentTokenPrice", currentTokenPrice.value);
      // TODO: Warn if price changed below -5% that the seller might not accept the payment
      // TODO: Combine with step 3
    }

    const totalAsset = Vue.computed(() => {
      const asset = AssetToString({
        amount: currentTokenPrice.value,
        symbol: props.token.symbol,
      });
      return asset;
    });

    const toRegionName = Vue.computed(() => {
      if (props.toRegion !== undefined) {
        return getRegion(props.toRegion.toUpperCase());
      }
      return undefined;
    });

    Vue.watch(
      () => [shouldItemsPrice.value, shouldShipPrice.value],
      ([newItemsPrice, newShipPrice]) => {
        if (newItemsPrice !== undefined && newShipPrice !== undefined) {
          context.emit("update:price", newItemsPrice + newShipPrice);
        }
      }
    );

    // TODO: Smartphone view by putting the image on an own line
    // TODO: EOS Price before the symbol button

    return {
      darkStyle: state.darkStyle,
      updateTokenPrice,
      totalAsset,
      piecesPrice,
      shouldItemsPrice,
      shouldShipPrice,
      selectedShipTo,
      shipDuration,
      excludedRegion,
      toRegionName,
    };
  },
});
</script>
