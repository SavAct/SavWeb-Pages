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
        class="text-bold q-pt-sm q-px-sm"
        :class="$q.screen.gt.xs ? 'text-h6' : ''"
      >
        {{ entry.title }}
      </div>
      <div class="row justify-between">
        <div class="col-auto">
          <div>{{ pieces }}x {{ entry.price }} USD</div>
          <div>+ Shipping {{ 0 }} USD</div>
          <div>
            Total price
            <q-chip icon="attach_money" :label="price + ' USD'"></q-chip>
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
import { PropType } from "vue";
import { Entry } from "./Items";
import { state } from "../store/globals";
import { AssetToString, Token } from "./AntelopeHelpers";

export default Vue.defineComponent({
  name: "orderItem",
  components: { ProImg, TokenSymbol },
  emits: ["currentTokenPrice"],
  props: {
    entry: {
      type: Object as PropType<Entry>,
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
  },
  setup(props, context) {
    const currentTokenPrice = Vue.ref(BigInt(0));
    async function updateTokenPrice() {
      currentTokenPrice.value = BigInt(Math.round(props.price)); // TODO: Calculate the real current token price
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

    return { darkStyle: state.darkStyle, updateTokenPrice, totalAsset };
  },
});
</script>
