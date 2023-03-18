<template>
  <q-page class="column">
    <div class="col text-center">
      <div>
        <!-- Search bar -->
        <q-input class="q-ma-md" v-model="search" outlined dense>
          <template v-slot:append>
            <q-icon
              v-if="search !== ''"
              name="close"
              @click="search = ''"
              class="cursor-pointer"
            ></q-icon>
          </template>
          <template v-slot:after>
            <q-btn
              icon-right="search"
              @click="search = ''"
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
        <!-- <template v-slot:header>
          <q-tr class="cursor-pointer">
            <q-td>
              <div class="text-italic text-orange">This is an Ads</div>
              <q-img
                src="https://savact.com/wp-content/uploads/2021/12/002-space-station2.png"
              ></q-img>
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
            <!-- <trx-tool-tip :trx="props.row"></trx-tool-tip> -->

            <q-td key="img" :props="props">
              <q-img :src="props.row.img"></q-img>
            </q-td>
            <q-td key="title" colspan="3" :props="props">{{
              props.row.title
            }}</q-td>
            <q-td key="price" :props="props">{{ props.row.price }} USD</q-td>
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
import { QTableProps } from "quasar";
import { state } from "../store/globals";

export default Vue.defineComponent({
  name: "indexPage",
  setup() {
    const search = Vue.ref<string>("");

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

    interface Entry {
      id: number;
      title: string;
      img: string;
      price: number;
      pieces: number;
      seller: string;
      editDate: number;
    }
    const itemColumns: QTableProps["columns"] = [
      { name: "id", align: "left", label: "Id", field: "id", sortable: true },
      { name: "img", align: "left", label: "", field: "img" },
      { name: "title", align: "left", label: "Title", field: "title" },
      {
        name: "price",
        align: "left",
        label: "Price",
        field: "price",
        sortable: true,
      },
      { name: "pieces", align: "left", label: "Pieces", field: "pieces" },
      { name: "seller", align: "left", label: "Seller", field: "seller" },
      {
        name: "editDate",
        align: "center",
        label: "Edit date",
        field: "editDate",
        sortable: true,
      },
    ];

    const data: Array<Entry> = [
      {
        id: 0,
        title: "A white telescope",
        img: "https://savact.com/wp-content/uploads/2021/12/003-observatory2.png",
        price: 13.23,
        pieces: 3,
        seller: "yearofthesav",
        editDate: 1679155279,
      },
      {
        id: 1,
        title: "Satellite with solar pannel",
        img: "https://savact.com/wp-content/uploads/2021/12/002-space-station2.png",
        price: 2.5,
        pieces: 1,
        seller: "savact",
        editDate: 1679150279,
      },
    ];

    const itemRows = Vue.computed(() => {
      // TODO: Use filters
      return data;
    });

    return {
      progress: state.progress,
      darkStyle: state.darkStyle,
      search,
      category,
      categories,
      categoryOpen,
      loading,
      itemRows,
      itemColumns,
    };
  },
});
</script>
