<template>
  <q-page class="column full-width">
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
    <div class="col q-pa-md full-width">
      <div class="row full-width">
        <div class="col text-h5 q-pr-sm no-text-overflow">
          {{ item?.title }}
          <q-tooltip anchor="top middle" style="word-wrap: break-word">{{
            item?.title
          }}</q-tooltip>
        </div>
        <div class="col-auto">
          <q-btn
            icon="settings"
            size="sm"
            round
            v-if="!isPreview"
            @click="openSettings()"
          ></q-btn>
        </div>
      </div>
      <div class="q-mt-md row">
        <gallery
          class="col-12 col-md-6"
          :height="$q.screen.lt.sm ? '250px' : '400px'"
          :srcs="imgs"
          :file-size="2117632"
        ></gallery>
        <div
          class="col-12 col-md-6"
          :class="$q.screen.lt.md ? 'q-pt-md' : 'q-pl-md'"
          v-if="item"
        >
          <q-card>
            <q-card-section>
              <div class="q-mb-sm">
                <span>
                  <user-link
                    :color="chipBgColor()"
                    class="col-auto"
                    :user="item.seller"
                  ></user-link>
                </span>
                <span v-if="item.fromR.length > 0"
                  >from<q-chip
                    :color="chipBgColor()"
                    :label="getRegion(item.fromR.toUpperCase())"
                  ></q-chip></span
                ><span>ships to</span>
                <span class="q-mr-sm">
                  <q-chip
                    v-for="(to, index) in item.shipTo"
                    :key="index"
                    :style="chipBorderStyle(to.rs === sRegion?.value)"
                    :color="chipBgColor(to.rs === sRegion?.value)"
                    :label="getRegion(to.rs.toUpperCase())"
                    text-color="green"
                    clickable
                    @click="regionClick(index)"
                  ></q-chip>
                </span>
                <div v-if="item.excl">
                  <q-chip
                    v-for="(ex, index) in item.excl.split(' ')"
                    :key="index"
                    :color="chipBgColor()"
                    text-color="red"
                    :label="getRegion(ex.toUpperCase())"
                    icon="do_not_disturb"
                  ></q-chip>
                </div>
              </div>
              <div>
                <div>Accept payments of</div>

                <token-symbol
                  v-for="(token, index) in acceptToken"
                  :key="index"
                  :style="chipBorderStyle(token.label === sToken?.label)"
                  :color="chipBgColor(token.label === sToken?.label)"
                  :symbol="token.value.symbol"
                  :contract="token.value.contract"
                  :chain="token.value.chain"
                  size="18px"
                  clickable
                  @click="tokenClick(index)"
                ></token-symbol>
              </div>

              <div>
                <div>Options</div>

                <q-chip
                  v-for="(opt, index) in item?.opts"
                  :key="index"
                  :label="opt"
                  :style="chipBorderStyle(option === opt)"
                  :color="chipBgColor(option === opt)"
                  clickable
                  @click="optClick(index)"
                ></q-chip>
              </div>
            </q-card-section>
          </q-card>
          <!-- <q-separator class="q-my-md" /> -->
          <q-card class="q-mt-md">
            <q-card-section>
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
                class="q-mt-sm"
              ></q-select>

              <q-select
                v-if="item?.opts && item.opts.length > 0"
                outlined
                v-model="option"
                :options="item.opts"
                label="Select an option"
                dense
                color="green"
                class="q-my-sm"
              ></q-select>

              <piece-price-select
                class="q-mb-sm"
                label="Price option"
                :pps="item.pp"
                v-model:pieces="pieces"
                v-model="piecesPrice"
              ></piece-price-select>

              <div class="row justify-between q-col-gutter-x-sm">
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
                  <q-chip
                    :color="chipBgColor()"
                    :label="totalPrice?.toFixed(2) + ' USD'"
                  ></q-chip>
                  <q-chip
                    v-if="sToken"
                    :color="chipBgColor()"
                    :label="totalTokenStr"
                  >
                  </q-chip>
                </div>
              </div>
              <q-spinner-grid v-if="loadingSeller" class="q-mt-md" />
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
            </q-card-section>
          </q-card>
        </div>
      </div>
      <q-separator class="q-my-md" />
      <div v-if="item && item?.descr.length > 0">
        <div class="text-h5 no-text-overflow">Description</div>
        <div>{{ item?.descr }}</div>
      </div>
      <div v-if="item?.note">
        <q-separator class="q-my-md" />
        <div>
          <div class="text-h5 no-text-overflow">Note</div>
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
import { state } from "../store/globals";
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
import { ItemTable, UserTable } from "../Components/ContractInterfaces";
import { LoadFromContract } from "../Components/MarketContractHandle";

export default Vue.defineComponent({
  components: { Gallery, TokenSymbol, UserLink, PiecePriceSelect },
  name: "itemPage",
  setup() {
    // TODO: Handle wait mode
    // TODO: Link to find more items on the same category
    // TODO: Link to all of sellers items
    // Show and select options

    const mode = GetQueryMode();
    console.log("Item page mode: ", mode);

    const id = Vue.ref<number>();
    const category = Vue.ref<bigint>();
    const item = Vue.ref<ItemTable>();

    const imgs = Vue.computed(() => item.value?.imgs);
    const seller = Vue.ref<UserTable | undefined>(undefined);

    const loadingSeller = Vue.ref<boolean>(false);

    const sRegion = Vue.ref<{ value: string; label: string | undefined }>();
    const availableTo = Vue.computed(() => {
      if (item.value !== undefined) {
        const en = item.value;
        return en.shipTo
          .filter((a) => {
            return !en.excl.split(" ").includes(a.rs);
          })
          .map((rto) => {
            return { value: rto.rs, label: getRegion(rto.rs.toUpperCase()) };
          });
      }
      return undefined;
    });

    const piecesPrice = Vue.ref<{ p: number; pcs: number }>({
      p: 0,
      pcs: 0,
    });

    const sToken = Vue.ref<{
      value: Token;
      label: string;
    }>();

    const acceptToken = Vue.computed(() => {
      if (seller.value?.allowed !== undefined) {
        return seller.value.allowed.map((token) => {
          const sym = StringToSymbol(token.sym);
          return {
            value: {
              symbol: StringToSymbol(token.sym),
              contract: token.contr,
              chain: token.chain,
            },
            label: `${sym.name} (${token.contr} on ${token.chain})`,
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
          (1 - (loadMaxTries.value - loadTries.value) / loadMaxTries.value) *
            100
        );
      }

      return 100;
    });

    async function getSellerByItem() {
      if (
        item.value &&
        item.value.seller !== undefined &&
        item.value.seller.length > 0
      ) {
        loadingSeller.value = true;
        seller.value = await state.getSeller(item.value.seller, state.contract);
        loadingSeller.value = false;
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
            getSellerByItem();
          }
          break;
        case ItemPageMode.Wait:
          const settingsNoId = state.uploadPageInputs.value;
          // TODO: Wait for item to be added to RAM table. Find it without knowing the id in sellers table entry items.
          router.push({ name: "user", query: { user: settingsNoId?.seller } });
          break;
        case ItemPageMode.Standard:
          let id_category = GetQueryIdAndCategory(); // TODO: Set to constant after testing
          id_category = { id: 2, category: 144396663052566528n }; // TODO: Remove after testing
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
          id.value = id_category.id;
          category.value = id_category.category;

          (async () => {
            item.value = await new LoadFromContract(
              loadMaxTries,
              loadTries
            ).loadItem({
              ...id_category,
              ...state.contract,
            });
            if (!item.value) {
              // No entry found
              Quasar.Notify.create({
                type: "negative",
                message: "Item not found",
                position: "top",
              });
            } else {
              getSellerByItem();
            }
          })();
          break;
      }
    });

    function goBack() {
      if (!router.back()) {
        Quasar.Notify.create({
          type: "negative",
          message: "No page to go back to",
          position: "top",
        });
      }
    }

    function openSettings() {
      router.push({
        name: "upload",
        query: { id: id.value, category: category.value },
      });
    }

    const option = Vue.ref<string | undefined>();

    function optClick(index: number) {
      console.log("optClick", index);

      if (item.value && index < item.value.opts.length) {
        option.value = item.value.opts[index];
      }
    }

    function chipBgColor(selected = false) {
      return state.darkStyle.value
        ? selected
          ? "grey-10"
          : "grey-9"
        : selected
          ? "grey-1"
          : "";
    }

    function chipBorderStyle(selected = false) {
      return state.darkStyle.value
        ? selected
          ? "border: 1px solid #333333"
          : ""
        : selected
          ? "border: 1px solid #aaaaaa"
          : "";
    }

    return {
      darkStyle: state.darkStyle,
      chipBgColor,
      chipBorderStyle,
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
      goBack,
      isPreview: mode == ItemPageMode.Preview,
      loadTryPercentage,
      id,
      category,
      openSettings,
      loadingSeller,
      optClick,
      option,
    };
  },
});
</script>
