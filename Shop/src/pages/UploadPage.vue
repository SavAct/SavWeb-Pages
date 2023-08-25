<template>
  <q-page class="column">
    <div class="col q-px-md">
      <q-card class="q-mt-md">
        <q-card-section>
          <q-input
            class="q-mb-sm"
            v-model="title"
            label="Title"
            outlined
          ></q-input>
          <q-select
            class="q-mb-sm"
            v-model="category"
            outlined
            :options="categoryOptions"
            label="Category"
          />
          <q-input
            v-model="description"
            label="Description"
            type="textarea"
            outlined
          ></q-input>
          TODO: images
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md">
        <q-card-section class="row justify-between">
          <div class="col-5 col-sm-2">
            <q-input
              v-model="units"
              label="Units per order"
              type="number"
              outlined
            ></q-input>
          </div>
          <div class="col-5 q-mb-sm">
            <q-input
              v-model="price"
              label="Price"
              type="number"
              outlined
              min="0"
            >
              <template v-slot:append>USD</template>
            </q-input>
          </div>
          <div class="col-12 col-sm-4">
            <q-select
              v-model="allowedTokens"
              multiple
              :options="availableTokens"
              label="Allowed tokens"
              outlined
            />
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <duration-input
            label="Max review duration"
            v-model="duration"
          ></duration-input>
          <q-checkbox
            v-model="available"
            label="Items are available from now on"
          ></q-checkbox>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <q-select
            v-model="fromRegion"
            label="From region"
            outlined
            :options="countries"
          >
          </q-select>
          <div class="q-mt-md">
            <q-select
              v-model="toRegions"
              multiple
              :options="countries"
              label="Ship to regions"
              outlined
              label-color="green"
            />
            <q-select
              class="q-mt-sm"
              v-model="excludeRegions"
              multiple
              :options="countries"
              label="Explicit exclude regions"
              outlined
              label-color="red"
            />
            <q-card v-for="region in toRegions" class="q-mt-sm">
              <q-card-section>
                <div class="row justify-between">
                  <div>
                    {{ region.label }}
                  </div>
                  <q-btn
                    class="q-mb-xs"
                    dense
                    color="red"
                    icon="clear"
                    size="sm"
                    @click="
                      toRegions = toRegions.filter(
                        (r) => r.value !== region.value
                      )
                    "
                  ></q-btn>
                </div>
                <div class="row justify-between">
                  <q-input
                    class="q-mb-xs col-12 col-sm-5"
                    v-model="region.sp"
                    label="Delivery price"
                    type="number"
                    outlined
                    min="0"
                  >
                    <template v-slot:append>USD</template>
                  </q-input>
                  <duration-input
                    class="col-12 col-sm-6"
                    v-model="region.sd"
                    label="Max delivery duration"
                  ></duration-input>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <q-checkbox v-model="hasNote" label="Note for customers"></q-checkbox>
          <q-input
            v-show="hasNote"
            outlined
            v-model="note"
            label="Note"
            type="textarea"
          ></q-input>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <q-input v-model="seller" label="Seller account name" outlined>
            <template v-slot:after>
              <q-btn
                @click="send"
                label="Send"
                color="primary"
                icon-right="send"
              />
            </template>
          </q-input>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>
<script lang="ts">
import DurationInput from "../Components/DurationInput.vue";
import { countryCodes, getRegion } from "../Components/ConvertRegion";
import { state } from "../store/globals";
import { Ref } from "vue";

export default Vue.defineComponent({
  name: "uploadPage",
  components: { DurationInput },
  setup() {
    // const item = Vue.ref<Entry>();
    const seller = Vue.ref<string>("");
    const title = Vue.ref<string>("");

    const description = Vue.ref<string>("");
    const hasNote = Vue.ref<boolean>(false);
    const note = Vue.ref<string>("");
    const price = Vue.ref<number>(1);
    const units = Vue.ref<number>(1);
    const duration = Vue.ref<number>(3 * 24 * 3600 * 1000);
    const allowedTokens = Vue.ref<Array<string>>([]);
    const availableTokens = Vue.ref<
      Array<{ label: string; symbol: string; contract: string; chain: string }>
    >([
      { label: "EOS", symbol: "EOS", contract: "eosio.token", chain: "eos" },
      { label: "ZEOS", symbol: "ZEOS", contract: "thezeostoken", chain: "eos" },
      { label: "PEOS", symbol: "PEOS", contract: "thepeostoken", chain: "eos" },
    ]);
    const category = Vue.ref<string>("");
    const categoryOptions = Vue.ref<Array<string>>([
      "Art",
      "Electronic",
      "Software",
      "House",
      "Vehicles",
      "Clothing",
      "Other",
    ]); // Got categories from a table that defines all allowed categiories with an uint64.
    const available = Vue.ref<boolean>(true);

    const countries = Vue.ref<Array<{ label: string; value: string }>>(
      countryCodes.map((c) => {
        return { label: getRegion(c) ?? "", value: c };
      })
    );
    const fromRegion = Vue.ref<{ label: string; value: string }>({
      label: "",
      value: "",
    });
    const toRegions = Vue.ref<
      Array<{ label: string; value: string; sp: Ref<number>; sd: Ref<number> }>
    >([]);
    const excludeRegions = Vue.ref<Array<{ label: string; value: string }>>([]);

    function send() {
      for (const exc of excludeRegions.value) {
        for (const to of toRegions.value) {
          if (exc.value === to.value) {
            // Quasar.Notify({ message: `Exclude region ${to.value} and ship to regions overlap.`, type: 'negative' })
            return alert(
              `${to.label} can not be a ship to regions and an excluded region at the same time.`
            );
          }
        }
      }
      console.log(duration.value); //-
    }
    // id: number;
    // imgs: Array<string>;
    // to: Array<{ region: string; sp: number; sd: number }>; // Country code, shipping price in USD and shipping duration in seconds after payment. {region: "DE", sp: 5,10, sd: 604800}, regions may be "WW", "EU", "US DE AT",

    return {
      progress: state.progress,
      darkStyle: state.darkStyle,
      seller,
      title,
      description,
      price,
      units,
      duration,
      send,
      availableTokens,
      allowedTokens,
      hasNote,
      note,
      available,
      fromRegion,
      category,
      categoryOptions,
      getRegion,
      countries,
      toRegions,
      excludeRegions,
    };
  },
});
</script>
