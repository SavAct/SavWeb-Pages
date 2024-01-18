<template>
  <q-page class="column">
    <q-inner-loading
      :showing="loadTryPercentage != 100"
      :label="loadTryPercentage + '%'"
      label-class="text-teal"
      style="z-index: 99; background-color: #000000a0"
    />
    <q-btn
      v-if="isPreview"
      class="bg-grey-8 text-white"
      label="Close Preview"
      color="white"
      outline
      @click="goBack()"
    ></q-btn>
    <div class="col q-pa-md">
      <div class="text-h5">{{ item?.title }}</div>
      <div class="q-mt-md row">
        <gallery
          class="col-12 col-md-6"
          height="400px"
          :srcs="imgs"
          :file-size="2117632"
        ></gallery>
        <div
          class="col-12 col-md-6"
          :class="$q.screen.lt.md ? 'q-pt-md' : ''"
          v-if="item"
        >
          <div class="q-px-md">
            <piece-price-select
              class="q-mb-sm"
              label="Price option"
              :pps="item.pp"
              v-model:pieces="pieces"
              v-model="piecesPrice"
            ></piece-price-select>
            <div class="q-my-sm">
              <span>
                From
                <user-link class="col-auto" :user="item.seller"></user-link>
              </span>
              <span v-if="item.fromR.length > 0"
                >in<q-chip :label="getRegion(item.fromR)"></q-chip>to</span
              ><span v-else>To</span>
              <q-chip
                v-for="(to, index) in item.shipTo"
                :key="index"
                :label="getRegion(to.rs)"
                text-color="green"
                clickable
                @click="regionClick(index)"
              ></q-chip>
              <span v-if="item.excl">
                but especially not to
                <q-chip
                  v-for="(ex, index) in item.excl.split(' ')"
                  :key="index"
                  text-color="red"
                  :label="getRegion(ex)"
                  icon="do_not_disturb"
                ></q-chip>
              </span>
            </div>
            <div>
              <div>Accept payments of</div>

              <token-symbol
                v-for="(token, index) in accepted"
                :key="index"
                :symbol="StringToSymbol(token.symbol)"
                :contract="token.contract"
                :chain="token.chain"
                size="18px"
                clickable
                @click="tokenClick(index)"
              ></token-symbol>
            </div>
          </div>
          <div :class="{ 'q-mx-md': $q.screen.gt.sm }">
            <q-separator class="q-my-md" />
            <div>
              <q-select
                outlined
                v-model="sRegion"
                :options="availableTo"
                label="Select your region"
                dense
                color="green"
                class="q-mt-sm"
              ></q-select>

              <q-select
                outlined
                v-model="sToken"
                :options="acceptToken"
                label="Token you want to pay with"
                dense
                color="green"
                class="q-my-sm"
              ></q-select>

              <div class="row justify-between q-col-gutter-x-sm">
                <div v-if="price" class="col-auto">
                  Price:
                  <q-chip :label="price?.toFixed(2) + ' USD'"></q-chip>
                </div>
                <div v-if="shipPrice !== undefined" class="col-auto">
                  Shipping:
                  <q-chip
                    :label="
                      'within ' +
                      shipDuration +
                      ' for ' +
                      shipPrice?.toFixed(2) +
                      ' USD'
                    "
                  ></q-chip>
                </div>
                <div v-if="totalPrice" class="col-auto">
                  Total price:
                  <q-chip :label="totalPrice?.toFixed(2) + ' USD'"></q-chip>
                  <q-chip v-if="sToken" :label="totalTokenStr"> </q-chip>
                </div>
              </div>

              <div v-if="seller" class="row">
                <div v-if="!seller.active" class="text-red text-h5 q-mt-sm">
                  The seller is&nbsp;<span
                    v-if="seller.lastUpdate < Date.now() / 1000"
                    >not available.</span
                  ><span v-else
                    >not available until&nbsp;<span class="text-bold">{{
                      new Date(seller.lastUpdate * 1000)
                        .toUTCString()
                        .substring(5)
                    }}</span></span
                  >
                </div>
                <q-btn
                  v-else
                  :disable="
                    !seller.active ||
                    typeof totalPrice != 'number' ||
                    !sToken?.value
                  "
                  class="bg-green col-12"
                  label="Buy"
                  color="white"
                  outline
                  @click="buyClick"
                ></q-btn>
              </div>
            </div>
          </div>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div v-if="item && item?.descr.length > 0">
        <div class="text-h5">Description</div>
        <div>{{ item?.descr }}</div>
      </div>
      <div v-if="item?.note">
        <q-separator class="q-my-md" />
        <div>
          <div class="text-h5">Sellers note</div>
          <div>{{ item.note }}</div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import Gallery from "../Components/Gallery.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import UserLink from "../Components/UserLink.vue";
import PiecePriceSelect from "../Components/PiecePrice/PiecePriceSelect.vue";
import { MarketContract, state } from "../store/globals";
import {
  Asset,
  AssetToString,
  StringToSymbol,
  Token,
} from "../Components/AntelopeHelpers";
import { getCurrentTokenPrice } from "../Components/ConvertPrices";
import { router } from "../router/simpleRouter";
import { getRegion } from "../Components/ConvertRegion";
import {
  GetQueryIdAndCategory,
  GetQueryMode,
  ItemPageMode,
} from "../Components/queryHelper";
import { ItemTable } from "../Components/ContractInterfaces";

export default Vue.defineComponent({
  components: { Gallery, TokenSymbol, UserLink, PiecePriceSelect },
  name: "itemPage",
  setup() {
    // TODO: Handle wait mode
    // TODO: Load item from RAM table
    // TODO: Load seller from RAM table
    const mode = GetQueryMode();
    console.log("Item page mode: ", mode);

    const id = Vue.ref<number>();
    const category = Vue.ref<bigint>();
    const item = Vue.ref<ItemTable>();

    const imgs = Vue.computed(() => item.value?.imgs);
    const seller = item.value ? state.sellerList[item.value.seller] : undefined;

    const sRegion = Vue.ref<{ value: string; label: string | undefined }>();
    const availableTo = Vue.computed(() => {
      if (item.value !== undefined) {
        const en = item.value;
        return en.shipTo
          .filter((a) => {
            return !en.excl.split(" ").includes(a.rs);
          })
          .map((rto) => {
            return { value: rto.rs, label: getRegion(rto.rs) };
          });
      }
      return undefined;
    });

    const piecesPrice = Vue.ref<{ p: number; pcs: number }>({
      p: 0,
      pcs: 0,
    });

    const accepted = Vue.ref<
      Array<{ symbol: string; contract: string; chain: string }>
    >([]); // TODO: Load from RAM table

    const sToken = Vue.ref<{
      value: Token;
      label: string;
    }>();

    const acceptToken = Vue.computed(() => {
      if (item.value !== undefined) {
        return accepted.value.map((token) => {
          const sym = StringToSymbol(token.symbol);
          return {
            value: {
              symbol: StringToSymbol(token.symbol),
              contract: token.contract,
              chain: token.chain,
            },
            label: `${sym.name} (${token.contract} on ${token.chain})`,
          };
        });
      }
      return undefined;
    });

    const price = Vue.computed(() => {
      return (piecesPrice.value.p * pieces.value) / piecesPrice.value.pcs;
    });

    const shiptTo = Vue.computed(() => {
      if (item.value !== undefined) {
        return item.value.shipTo.find((a) => a.rs == sRegion.value?.value);
      }
      return undefined;
    });

    const shipDuration = Vue.computed(() => {
      if (shiptTo.value !== undefined) {
        return Number(shiptTo.value.t) / 3600 / 24 + " days";
      }
      return undefined;
    });

    const shipPrice = Vue.computed(() => {
      if (shiptTo.value !== undefined) {
        return Number(shiptTo.value.p);
      }
      return undefined;
    });

    const totalPrice = Vue.computed(() => {
      if (shipPrice.value !== undefined && price.value !== undefined) {
        const p = shipPrice.value + price.value;
        setTotalToken(p);
        return p;
      }
      totalToken.value = undefined;
      return undefined;
    });

    const totalToken = Vue.ref<Asset | undefined>();
    async function setTotalToken(price: number) {
      if (price !== undefined && sToken.value !== undefined) {
        totalToken.value = await getCurrentTokenPrice(
          price,
          sToken.value.value
        );
      } else {
        totalToken.value = undefined;
      }
    }

    const totalTokenStr = Vue.computed(() => {
      if (totalToken.value) {
        return AssetToString(totalToken.value);
      }
      return undefined;
    });

    const _pieces = Vue.ref<number>(1);
    const pieces = Vue.computed({
      get: () => _pieces.value,
      set: (v) => {
        if (Number(v) > 0) {
          _pieces.value = Math.round(v);
        }
      },
    });

    function tokenClick(index: number) {
      if (acceptToken.value) {
        sToken.value = acceptToken.value[index];
      }
    }
    function regionClick(index: number) {
      if (availableTo.value) {
        sRegion.value = availableTo.value[index];
      }
    }

    function buyClick() {
      if (item.value && sRegion.value && sToken.value) {
        router.push({
          name: "buy",
          query: {
            id: item.value.id,
            region: sRegion.value.value,
            token: sToken.value.value,
            pieces: pieces.value,
          },
        });
      }
    }

    const loadMaxTries = Vue.ref<number>(1);
    const loadTries = Vue.ref<number>(0);
    const loadTryPercentage = Vue.computed(() => {
      if (loadMaxTries.value > 0) {
        return Math.round(
          ((loadMaxTries.value - loadTries.value) / loadMaxTries.value) * 100
        );
      }
      return 0;
    });

    function setItemFromTable(
      data: { id: number; category: bigint } & MarketContract,
      maxTries = 2,
      waitTime = 1000
    ) {
      loadMaxTries.value = maxTries;
      void requestItemFromTable(data, maxTries, waitTime);
    }

    async function requestItemFromTable(
      data: { id: number; category: bigint } & MarketContract,
      maxTries: number,
      waitTime: number
    ) {
      loadTries.value = maxTries;

      if (maxTries <= 0) {
        // Stop trying
        Quasar.Notify.create({
          type: "negative",
          message: "Item not found",
          position: "top",
        });
        loadTries.value = 0;
        return;
      }

      const article = await state.getArticle(data);
      if (article) {
        item.value = article;
        loadTries.value = 0;
        return;
      } else {
        // Try again
        setTimeout(() => {
          requestItemFromTable(data, maxTries - 1, waitTime);
        }, waitTime);
      }
    }

    Vue.onMounted(async () => {
      switch (mode) {
        case ItemPageMode.Preview:
          const settings = state.uploadPageInputs.value;
          if (settings) {
            item.value = {
              id: 0,
              ...settings,
            };
          }
          break;
        case ItemPageMode.Wait:
          // TODO: Wait for item to be added to RAM table. Find it without knowing the id in sellers table entry items.
          break;
        case ItemPageMode.Standard:
          let id_category = GetQueryIdAndCategory(); // TODO: Set to constant after testing
          id_category = { id: 0, category: 290482175965396992n }; // TODO: Remove after testing
          if (
            id_category?.id === undefined ||
            id_category?.id == -1 ||
            id_category?.category === undefined
          ) {
            // If no id or category is given, go back. Go to index page if not possible
            if (!router.back()) {
              router.push({ name: "home" });
            }
            return;
          }
          setItemFromTable({ ...id_category, ...state.contract });
          break;
      }

      // TODO: Check seller accepted token from RAM table
      //accept: settings.accept,
    });

    // TODO: Link for more items on the same category
    // TODO: Link to seller items

    function goBack() {
      if (!router.back()) {
        Quasar.Notify.create({
          type: "negative",
          message: "No page to go back to",
          position: "top",
        });
      }
    }

    return {
      darkStyle: state.darkStyle,
      item,
      imgs,
      getRegion,
      seller,
      StringToSymbol,
      sRegion,
      availableTo,
      sToken,
      acceptToken,
      totalPrice,
      totalTokenStr,
      tokenClick,
      regionClick,
      buyClick,
      pieces,
      piecesPrice,
      price,
      shipPrice,
      shipDuration,
      accepted,
      goBack,
      isPreview: mode == ItemPageMode.Preview,
      loadTryPercentage,
      id,
      category,
    };
  },
});
</script>
