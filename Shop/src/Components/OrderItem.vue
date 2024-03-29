<template>
  <div class="row" style="border: 1px solid #ddd; border-radius: 4px">
    <div :class="$q.screen.lt.sm ? 'col-12' : 'col-3'">
      <pro-img
        :style="$q.screen.lt.sm ? 'max-height:120px' : 'max-height:220px'"
        v-if="entry.imgs.length > 0"
        :src="entry.imgs[0]"
        fit="contain"
        :class="darkStyle ? 'bg-grey-10' : 'bg-grey-2'"
      ></pro-img>
    </div>
    <div
      class="q-px-sm column"
      :class="$q.screen.lt.sm ? 'col-12' : 'col-9 q-pl-md'"
    >
      <div class="row justify-end q-py-sm">
        <div
          class="col-grow text-bold"
          :class="$q.screen.gt.xs ? 'text-h6' : ''"
        >
          {{ entry.title }}
        </div>
        <div class="col-auto">
          <user-link
            class="q-mr-none"
            :size="$q.screen.lt.sm ? 'sm' : ''"
            icon="storefront"
            :color="chipBgColor()"
            :user="entry.seller"
            internal
          ></user-link>
        </div>
      </div>

      <div v-if="excludedRegion" class="text-red col-auto">
        The region {{ excludedRegion }} is excluded!
      </div>
      <div class="col-grow">
        <span
          class="row"
          :class="$q.screen.lt.sm ? 'justify-between' : 'justify-left'"
        >
          <span :class="$q.screen.lt.sm ? '' : 'self-center'" class="col-auto"
            >Price:</span
          >
          <piece-price-select
            class="col-auto"
            label="Price option"
            :size="$q.screen.lt.sm ? 'sm' : ''"
            :pps="entry.pp"
            v-model:pieces="pieces"
            v-model="piecesPrice"
            disabled
            chip
          ></piece-price-select>
        </span>
        <span
          class="row"
          :class="
            (selectedShipTo === undefined ? 'text-red ' : '') +
            ($q.screen.lt.sm ? 'justify-between' : 'justify-left q-mr-sm')
          "
        >
          <span :class="$q.screen.lt.sm ? '' : 'self-center'" class="col-auto"
            >Shipping to:</span
          >
          <q-chip
            class="col-auto q-mr-none"
            :size="$q.screen.lt.sm ? 'sm' : ''"
            :color="chipBgColor()"
            :label="
              toRegionName + ' for ' + shouldShipPrice?.toFixed(2) + ' USD'
            "
          ></q-chip>
        </span>
      </div>
      <div class="col-auto row q-pb-sm justify-end">
        <div class="col-grow row">
          <span
            class="col-grow row"
            :class="$q.screen.lt.sm ? 'justify-between' : 'justify-left'"
          >
            <span
              class="col-auto"
              :style="$q.screen.lt.sm ? '' : 'padding-top:7px'"
              >Total price:</span
            >
            <q-chip
              class="col-auto q-mr-none"
              :size="$q.screen.lt.sm ? 'sm' : ''"
              :color="chipBgColor()"
              :label="price?.toFixed(2) + ' USD'"
            ></q-chip>
          </span>
        </div>

        <div class="col-auto self-end">
          <token-symbol
            class="q-mr-none"
            :amount="Number(currentTokenPrice)"
            :color="chipBgColor()"
            :chain="token?.chain"
            :contract="token?.contract"
            :symbol="token?.symbol"
            @click="updateTokenPrice"
            size="18px"
          ></token-symbol>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";
import TokenSymbol from "./TokenSymbol.vue";
import PiecePriceSelect from "./PiecePrice/PiecePriceSelect.vue";
import UserLink from "../Components/UserLink.vue";
import { PropType } from "vue";
import { state } from "../store/globals";
import { Token } from "./AntelopeHelpers";
import { ItemTable, ToRegion } from "./ContractInterfaces";
import { countryCodes, euCountryCodes, getRegion } from "./ConvertRegion";
import { chipBgColor } from "./styleHelper";

export default Vue.defineComponent({
  name: "orderItem",
  components: { ProImg, TokenSymbol, PiecePriceSelect, UserLink },
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
      piecesPrice,
      shouldItemsPrice,
      shouldShipPrice,
      selectedShipTo,
      shipDuration,
      excludedRegion,
      toRegionName,
      chipBgColor,
      currentTokenPrice,
    };
  },
});
</script>
