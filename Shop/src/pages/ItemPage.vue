<template>
  <q-page class="column">
    <div class="col q-pa-md">
      <div class="text-h5">{{ entry?.title }}</div>
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
          v-if="entry"
        >
          <div class="q-px-md">
            <div>
              Price:
              <q-chip
                icon="attach_money"
                :label="entry.price + ' USD'"
              ></q-chip>
              Units per ordered piece:
              <q-chip :label="entry.units"></q-chip>
              Price per unit:
              <q-chip
                :label="(entry.price / entry.units).toString() + ' USD'"
              ></q-chip>
            </div>

            <div class="q-my-sm">
              <span>
                From
                <user-link class="col-auto" :user="entry.seller"></user-link>
              </span>
              <span v-if="entry.from_region.length > 0"
                >in<q-chip :label="getRegion(entry.from_region)"></q-chip
                >to</span
              ><span v-else>To</span>
              <q-chip
                v-for="(to, index) in entry.to"
                :key="index"
                :label="getRegion(to.region)"
                text-color="green"
                clickable
                @click="regionClick(index)"
              ></q-chip>
              <span v-if="entry.exclude_regions">
                but especially not to
                <q-chip
                  v-for="(ex, index) in entry.exclude_regions.split(' ')"
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
                v-for="(token, index) in entry.accept"
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
            <div v-if="entry.note">
              <div>
                <div class="text-h5">Sellers note</div>
                <div>{{ entry.note }}</div>
              </div>
              <q-separator class="q-my-md" />
            </div>
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

              <q-input
                label="Pieces"
                type="number"
                v-model="pieces"
                outlined
                dense
                class="q-mb-md"
                min="1"
                step="1"
              ></q-input>

              <div v-if="totalPrice" class="col-12">
                Total price:
                <q-chip :label="totalPrice?.toString() + ' USD'"></q-chip>
                <q-chip v-if="sRegion && sToken" :label="totalTokenStr">
                </q-chip>
              </div>

              <div v-if="seller" class="row">
                <div v-if="!seller.available" class="text-red text-h5 q-mt-sm">
                  The seller is&nbsp;<span
                    v-if="seller.toDate < Date.now() / 1000"
                    >not available.</span
                  ><span v-else
                    >not available until&nbsp;<span class="text-bold">{{
                      new Date(seller.toDate * 1000).toUTCString().substring(5)
                    }}</span></span
                  >
                </div>
                <q-btn
                  v-else
                  :disable="
                    !seller.available ||
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
      <div v-if="entry && entry?.description.length > 0">
        <div class="text-h5">Description</div>
        <div>{{ entry?.description }}</div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import Gallery from "../Components/Gallery.vue";
import TokenSymbol from "../Components/TokenSymbol.vue";
import UserLink from "../Components/UserLink.vue";
import { Entry } from "../Components/Items";
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
import { GetQueryId } from "../Components/queryHelper";

export default Vue.defineComponent({
  components: { Gallery, TokenSymbol, UserLink },
  name: "itemPage",
  setup() {
    const id = GetQueryId();
    console.log("Item page query: ", id);

    const entry = Vue.ref<Entry>();
    entry.value = state.itemsList.find((item) => item.id == id);

    const imgs = Vue.computed(() => entry.value?.imgs);
    const seller = entry.value
      ? state.sellerList[entry.value.seller]
      : undefined;

    const sRegion = Vue.ref<{ value: string; label: string | undefined }>();
    const availableTo = Vue.computed(() => {
      if (entry.value !== undefined) {
        const en = entry.value;
        return en.to
          .filter((a) => {
            return !en.exclude_regions.split(" ").includes(a.region);
          })
          .map((rto) => {
            return { value: rto.region, label: getRegion(rto.region) };
          });
      }
      return undefined;
    });

    const sToken = Vue.ref<{
      value: Token;
      label: string;
    }>();

    const acceptToken = Vue.computed(() => {
      if (entry.value !== undefined) {
        return entry.value.accept.map((token) => {
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

    const totalPrice = Vue.computed(() => {
      if (entry.value && sRegion.value) {
        const to = entry.value.to.find((a) => a.region == sRegion.value?.value);
        if (to !== undefined) {
          const p = to.sp + entry.value.price;
          setTotalToken(p);
          return p;
        }
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
        if (v > 0) {
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
      if (entry.value && sRegion.value && sToken.value) {
        router.push({
          name: "buy",
          query: {
            id: entry.value.id,
            region: sRegion.value.value,
            token: sToken.value.value,
            pieces: pieces.value,
          },
        });
      }
    }

    return {
      darkStyle: state.darkStyle,
      entry,
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
    };
  },
});
</script>
