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
          <q-input
            class="q-mt-md"
            v-model="imageSrc"
            label="Image link"
            outlined
            @keyup.enter="addImage"
          >
            <template v-slot:prepend>
              <q-icon name="image"></q-icon>
            </template>
            <template v-slot:append>
              <q-btn
                v-if="imageSrc !== ''"
                @click="imageSrc = ''"
                round
                icon="clear"
              />
            </template>
            <template v-slot:after>
              <q-btn
                :disable="imageSrc === ''"
                icon="send"
                @click="addImage"
                :color="imageSrc !== '' ? 'green' : 'grey'"
              ></q-btn>
            </template>
          </q-input>
          <div
            v-for="(img, index) in imgSrcs"
            :key="img.id"
            class="row justify-between q-mt-md"
          >
            <div class="col-grow q-pr-md">
              <pro-img
                :src="img.src"
                style="max-height: 200px"
                fit="contain"
                class="bg-black"
              />
            </div>
            <div class="column q-gutter-sm">
              <q-btn
                class="col-grow"
                icon="clear"
                color="red"
                @click="imgSrcs.splice(index, 1)"
              ></q-btn>
              <q-btn
                :disable="index === 0"
                class="col-auto"
                color="grey"
                icon="keyboard_arrow_up"
                @click="moveStringOneFieldBefore(index)"
              ></q-btn>
              <q-btn
                :disable="index === imgSrcs.length - 1"
                class="col-auto"
                color="grey"
                icon="keyboard_arrow_down"
                @click="moveStringOneFieldAfter(index)"
              ></q-btn>
            </div>
          </div>

          <div>
            <q-input
              class="q-mt-md"
              v-model="tempOptions"
              label="Add Option"
              outlined
              @keyup.enter="pushOption"
            >
              <template v-slot:prepend>
                <q-icon name="style"></q-icon>
              </template>
              <template v-slot:append>
                <q-btn
                  v-if="tempOptions !== ''"
                  @click="tempOptions = ''"
                  round
                  icon="clear"
                />
              </template>
              <template v-slot:after>
                <q-btn
                  :disable="tempOptions === ''"
                  icon="send"
                  @click="pushOption"
                  :color="tempOptions !== '' ? 'green' : 'grey'"
                ></q-btn>
              </template>
            </q-input>

            <div v-for="(opt, o_index) in options" :key="o_index">
              <q-input
                class="q-mt-md"
                v-model="opt.value"
                :maxlength="127"
                :label="'Option ' + (o_index + 1)"
                outlined
              >
                <template v-slot:after>
                  <q-btn
                    class="col-grow"
                    icon="clear"
                    color="red"
                    @click="options.splice(o_index, 1)"
                  ></q-btn>
                </template>
              </q-input>
            </div>
          </div>
        </q-card-section>
      </q-card>
      <q-card class="q-mt-md">
        <q-card-section class="row justify-between">
          <!-- <div class="col-5 col-sm-2">
            <q-input
              v-model="units"
              label="Units per order"
              type="number"
              outlined
            ></q-input>
          </div> -->
          <div class="col-sm-5 col-12 q-mb-sm">
            <q-input
              v-model="price"
              label="Price without shipping"
              type="number"
              outlined
              min="0"
            >
              <template v-slot:append>USD</template>
            </q-input>
          </div>
        </q-card-section>
      </q-card>

      <q-card class="q-mt-md">
        <q-card-section>
          <date-time-input
            v-model="expired"
            label="Placement expired in"
          ></date-time-input>
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
            <duration-input
              class="q-mt-md"
              label="Max shipping preparation time"
              v-model="duration"
            ></duration-input>
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

      <q-card class="q-mt-md q-mb-md">
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
import ProImg from "../Components/ProImg.vue";
import DurationInput from "../Components/DurationInput.vue";
import DateTimeInput from "../Components/DateTimeInput.vue";
import { countryCodes, getRegion } from "../Components/ConvertRegion";
import { state } from "../store/globals";
import { Ref } from "vue";
import {
  ActionAddItem,
  ContractToRegion,
} from "../Components/ContractInterfaces";
import { savWeb } from "../store/connect";

export default Vue.defineComponent({
  name: "uploadPage",
  components: { ProImg, DurationInput, DateTimeInput },
  setup() {
    const $q = Quasar.useQuasar();
    const seller = Vue.ref<string>("");
    const title = Vue.ref<string>("");
    const imageSrc = Vue.ref<string>("");
    const imgSrcs = Vue.ref<Array<{ id: number; src: string }>>([]);

    const description = Vue.ref<string>("");
    const hasNote = Vue.ref<boolean>(false);
    const note = Vue.ref<string>("");
    const price = Vue.ref<number>(1);
    // const units = Vue.ref<number>(1);
    const duration = Vue.ref<number>(3 * 24 * 3600 * 1000);
    const expired = Vue.ref<number>(Date.now() + 30 * 24 * 3600 * 1000);
    const options = Vue.ref<Array<Ref<string>>>([]);
    const tempOptions = Vue.ref<string>("");

    function pushOption() {
      if (tempOptions.value.trim() === "") return;
      options.value.push(Vue.ref<string>(tempOptions.value));
      tempOptions.value = "";
    }

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

    let imageSrcBiggestId = 0;
    function addImage() {
      const trimed = imageSrc.value.trim();
      if (imgSrcs.value.find((s) => s.src === trimed)) return;
      imgSrcs.value.push({ id: imageSrcBiggestId++, src: trimed });
      imageSrc.value = "";
    }

    function moveStringOneFieldBefore(index: number) {
      if (index > 0) {
        const item = imgSrcs.value.splice(index, 1)[0];
        imgSrcs.value.splice(index - 1, 0, item);
      }
    }

    function moveStringOneFieldAfter(index: number) {
      if (index < imgSrcs.value.length - 1) {
        const item = imgSrcs.value.splice(index, 1)[0];
        imgSrcs.value.splice(index + 2, 0, item);
      }
    }

    function send() {
      let invalidRegion: Array<string> = [];
      for (const exc of excludeRegions.value) {
        for (const to of toRegions.value) {
          if (exc.value === to.value) {
            invalidRegion.push(to.label);
          }
        }
      }
      if (invalidRegion.length > 0) {
        $q.notify({
          position: "top",
          message: `Exclude and ship to region overlap`,
          caption: `The following regions are invalid: ${invalidRegion.join(
            ", "
          )}`,
          type: "negative",
        });
        return;
      }

      let excludeCodes: string = excludeRegions.value
        .map((r) => r.value)
        .join("")
        .toLocaleLowerCase();

      let shipTo: Array<ContractToRegion> = [];
      toRegions.value.forEach((r) => {
        const s = shipTo.find((s) => s.t === r.sd && s.p === r.sp);
        if (s === undefined) {
          shipTo.push({
            t: r.sd,
            p: r.sp,
            rs: r.value.toLocaleLowerCase(),
          });
        } else {
          s.rs += r.value.toLocaleLowerCase();
        }
      });

      const opts: Array<string> = options.value.map((o) => o.value.trim());
      for (const opt of opts) {
        if (opt.length === 0 || opt.length > 127) {
          $q.notify({
            position: "top",
            message: `Option length`,
            caption: `Each options must be between 1 and 127 characters long.`,
            type: "negative",
          });
          return;
        }
      }

      const data: ActionAddItem = {
        seller: seller.value.trim(),
        title: title.value.trim(),
        price: price.value,
        note: hasNote.value ? note.value : "",
        descr: description.value,
        imgs: imgSrcs.value.map((i) => i.src),
        available: available.value,
        category: category.value.toLocaleLowerCase().substring(0, 13),
        fromR: fromRegion.value.value.toLocaleLowerCase(),
        shipTo,
        excl: excludeCodes,
        prepT: Math.floor(duration.value / 1000),
        expired: Math.floor(expired.value / 1000),
        opts,
      };
      console.log("Transaction additem data", data);

      savWeb.transaction({
        chain: state.contract.chain,
        contract: state.contract.account,
        action: state.contract.actions.addItem,
        data,
      });

      // TODO: extra parameter to edit user table for extra transactions

      // TODO: Create preview page
    }

    // id: number;
    // imgs: Array<string>;
    // to: Array<{ region: string; sp: number; sd: number }>; // Country code, shipping price in USD and shipping duration in seconds after payment. {region: "DE", sp: 5.10, sd: 604800}, regions may be "WW", "EU", "US DE AT",

    return {
      progress: state.progress,
      darkStyle: state.darkStyle,
      seller,
      title,
      description,
      options,
      tempOptions,
      pushOption,
      price,
      // units,
      duration,
      expired,
      send,
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
      imageSrc,
      imgSrcs,
      addImage,
      moveStringOneFieldBefore,
      moveStringOneFieldAfter,
    };
  },
});
</script>
