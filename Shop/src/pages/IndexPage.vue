<template>
  <q-page class="column">
    <div class="col text-center">
      <div>
        <!-- Search bar -->
        <q-input class="q-ma-md" v-model="searchText" outlined dense>
          <template v-slot:append>
            <q-icon
              v-if="searchText !== ''"
              name="close"
              @click="searchText = ''"
              class="cursor-pointer"
            ></q-icon>
          </template>
          <template v-slot:after>
            <q-btn
              icon-right="search"
              @click="search"
              class="cursor-pointer bg-blue"
              color="white"
            ></q-btn>
          </template>
          <template v-slot:before>
            <q-btn-dropdown
              style="width: 150px"
              color="pink"
              :label="category.name"
              split
              v-model="categoryOpen"
              @click="categoryOpen = !categoryOpen"
            >
              <q-list>
                <q-item
                  v-for="(cat, index) in categories"
                  :key="index"
                  clickable
                  v-close-popup
                  @click="category = cat"
                >
                  <q-item-section>
                    <q-item-label>{{ cat.name }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-btn-dropdown>
          </template>
        </q-input>
      </div>
      <!-- result list -->
      <q-table
        title="Items"
        class="q-ma-md card"
        :rows="itemRows"
        :columns="itemColumns"
        :row-key="(row) => row.id"
        color="amber"
        :loading="loading"
        no-data-label="No items found"
      >
        <template v-slot:top>
          <q-toggle
            v-model="isPricePerUnit"
            label="Price per unit"
            left-label
          />
        </template>

        <!-- <template v-slot:header>
          <q-tr class="cursor-pointer">
            <q-td>
              <div class="text-italic text-orange">This is an Ads</div>
              <pro-img
                src="https://savact.com/wp-content/uploads/2021/12/002-space-station2.png"
              ></pro-img>
              <div class="text-italic text-orange">--------------</div>
            </q-td>
            <q-td colspan="2">Super satellite payed Item</q-td>
            <q-td>1.00 USD</q-td>
            <q-td> by hans </q-td>
            <q-td>
              <template>
                {{ new Date(Date.now()).toLocaleTimeString() }}
              </template>
            </q-td>
          </q-tr>
        </template> -->
        <template v-slot:body="props">
          <q-tr :props="props" class="cursor-pointer">
            <q-td
              key="imgs"
              :props="props"
              clickable
              @click="openItem(props.row)"
            >
              <pro-img
                v-if="props.row.imgs.length > 0"
                :src="props.row.imgs[0]"
              ></pro-img>
            </q-td>
            <q-td key="title" colspan="3" :props="props"
              ><div clickable @click="openItem(props.row)">
                {{ props.row.title }}
              </div></q-td
            >
            <q-td key="price" :props="props">
              <div v-if="isPricePerUnit">{{ props.row.price }} USD</div>
              <div v-else>
                {{ props.row.price }} USD for {{ props.row.units }} units
              </div>
            </q-td>
            <q-td key="seller" :props="props">
              #{{ props.row.id }} {{ props.row.seller }}
            </q-td>
            <q-td key="editDate" :props="props">
              <template v-if="props.row.editDate > 1">
                {{ new Date(props.row.editDate * 1000).toLocaleTimeString() }}
              </template>
              <template v-else>-</template>
            </q-td>
          </q-tr>
        </template>
        <template v-slot:no-data="{ message }">
          <div class="full-width row flex-center q-gutter-sm">
            <span>{{ message }}</span>
          </div>
        </template>
      </q-table>
      <div class="q-mt-lg">Presented by SavAct.</div>
    </div>
  </q-page>
</template>
<script lang="ts">
import ProImg from "../Components/ProImg.vue";
import { QTableProps } from "quasar";
import { Entry } from "../Components/Items";
import { router } from "../router/simpleRouter";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "indexPage",
  components: {
    ProImg,
  },
  setup() {
    const searchText = Vue.ref<string>("");
    const isPricePerUnit = Vue.ref<boolean>(false);

    async function search() {
      const { h64ToString } = await xxhash();
      const split = searchText.value.split(" "); // Should remove special signs?

      const hashes: Array<string> = [];
      for (const v of split) {
        const t = v.trim();
        if (t.length > 0) {
          // For convenience, get hash as string of its zero-padded hex representation
          hashes.push(h64ToString(v.toLowerCase())); // "502b0c5fc4a5704c" (Hex String) //hasher.h64(v); // 5776724552493396044n (BigInt)
        }
      }
      console.log(hashes);
      // TODO: Search for each hash in contract table
    }

    const categories = Vue.ref<Array<{ name: string; value: string }>>([
      { name: "All", value: "all" },
      { name: "Hardware", value: "hard" },
      { name: "Software", value: "soft" },
    ]);

    const _category = Vue.ref<{ name: string; value: string }>(
      categories.value[0]
    );

    const category = Vue.computed({
      get: () => {
        return _category.value;
      },
      set: (value: { name: string; value: string }) => {
        // TODO: Start filter
        _category.value = value;
      },
    });

    const categoryOpen = Vue.ref<boolean>(false);

    const loading = Vue.ref<boolean>(false);

    const itemColumns: QTableProps["columns"] = [
      { name: "id", align: "left", label: "Id", field: "id", sortable: true },
      { name: "imgs", align: "left", label: "", field: "imgs" },
      { name: "title", align: "left", label: "Title", field: "title" },
      {
        name: "price",
        align: "left",
        label: "Price",
        field: "price",
        sortable: true,
      },
      {
        name: "units",
        align: "left",
        label: "Units",
        field: "units",
        sortable: true,
      },
      { name: "seller", align: "left", label: "Seller", field: "seller" },
      {
        name: "editDate",
        align: "center",
        label: "Edit date",
        field: "editDate",
        sortable: true,
      },
    ];

    const itemRows = Vue.computed(() => {
      // TODO: Use filters

      return state.itemsList.map((item) => {
        return {
          ...item,
          price: isPricePerUnit.value ? item.price / item.units : item.price,
        };
      });
    });

    function openItem(item: Entry) {
      router.push({ name: "item", query: { id: item.id } });
    }

    // TODO: Consider small screen size for the table
    // TODO: Filter for currency and users country
    // TODO: Sort option for lowest total price, file name, shipping time and date

    /* TODO: Search for items.
       Search primary for kategories.
       -------
       Search secondary for decisive words in a contract table with this prosedure (This pricedure is too RAM expensive, see below for alternative):
       Title is split into a list of decisive words.
       The words are sorted by character.
       Hash of the combination of each word, but by keeping the sorted order of the words. ("c a b" will create the hash of "a b c", "a b", "a", "b" and "c")
       (Hash of "a b c" and "c b a" is the same)
       The first 8 bytes of each hash are used as scope of a contract table.
       The table holds the index of all items that are regarding to this hash.
       -------
       Alternative:
       Split title in words.
       Create 8 byte hash of each word with xxhash.
       Use the hashes as primary key of an RAM table and store all item indexes in a sorted array.
       Any access of an item of this array is done by a binary search.
    */

    return {
      darkStyle: state.darkStyle,
      isPricePerUnit,
      searchText,
      category,
      categories,
      categoryOpen,
      loading,
      itemRows,
      itemColumns,
      openItem,
      search,
    };
  },
});
</script>
