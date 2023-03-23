<template>
  <q-page class="column">
    <div class="col q-pa-md text-center">
      <div class="q-my-md text-h5">{{ entry?.title }}</div>
      <div class="row">
        <gallery class="col-12 col-md-6" height="300px" :srcs="imgs"></gallery>
        <div
          class="text-left q-px-md"
          :class="$q.screen.lt.md ? 'q-pt-md' : ''"
          v-if="entry"
        >
          <div>Price: {{ entry.price }} USD</div>
          <div>Units per order: {{ entry.units }}</div>
          <div>Price per unit: {{ entry.price / entry.units }}</div>

          <div>From {{ getRegion(entry.from_region) }}</div>
          <div>
            To
            <span class="text-italic text-green">{{
              getRegions(entry.to_regions)
            }}</span
            ><span v-if="entry.exclude_regions"
              >, but especially not to
              <span class="text-italic text-red">{{
                getRegions(entry.exclude_regions)
              }}</span>
            </span>
          </div>
          <div>
            <div>Accept payments of</div>

            <token-symbol
              v-for="(token, index) in entry.accept"
              :key="index"
              :symbol="StringToSymbol(token.symbol)"
              :contract="token.contract"
              :chain="token.chain"
            ></token-symbol>
          </div>
          <div>Sellers note: "{{ entry.note }}"</div>
          <q-btn v-if="seller" :disable="!seller.available" label="Buy"></q-btn>
        </div>
      </div>
    </div>
    <!-- <div class="col-auto">
      <q-linear-progress
        size="50px"
        :value="progress"
        class="q-mt-sm"
        :color="darkStyle ? 'blue-13' : 'blue-2'"
      >
        <div class="absolute-full flex flex-center">
          <q-badge
            color="transparent"
            :text-color="darkStyle ? 'white' : 'black'"
            label="Click state on counter page"
          />
        </div>
      </q-linear-progress>
    </div> -->
  </q-page>
</template>
<script lang="ts">
import Gallery from "../Components/Gallery.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import { Entry } from "../Components/Items";
import { state } from "../store/globals";
import { StringToSymbol } from "../Components/AntelopeHelpers";

export default Vue.defineComponent({
  components: { Gallery, TokenSymbol },
  name: "itemPage",
  setup() {
    // TODO: Show item by query
    const id = 0;
    const regionName = new Intl.DisplayNames(["en"], { type: "region" });

    const entry = Vue.ref<Entry>();
    entry.value = state.itemsList.find((item) => item.id == id);

    function getRegion(code: string) {
      const c = regionName.of(code);
      if (c !== undefined) {
        return c;
      } else {
        switch (code) {
          case "ww":
            return "World Wide";
        }
      }
      return undefined;
    }

    function getRegions(r: string) {
      return r !== undefined
        ? r
            .split(" ")
            .map((v) => getRegion(v))
            .join(", ")
        : undefined;
    }

    const imgs = Vue.computed(() => entry.value?.imgs);
    const seller = entry.value
      ? state.sellerList[entry.value.seller]
      : undefined;

    return {
      progress: state.progress,
      darkStyle: state.darkStyle,
      entry,
      imgs,
      getRegion,
      getRegions,
      seller,
      StringToSymbol,
    };
  },
});
</script>
