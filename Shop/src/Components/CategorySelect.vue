<template>
  <div class="row q-col-gutter-sm full-width q-pa-none">
    <div class="col-auto">
      <q-btn
        v-bind="$props"
        :icon="isTextInput ? 'mouse' : 'keyboard'"
        @click="isTextInput = !isTextInput"
        class="bg-grey-8"
        color="white"
      ></q-btn>
    </div>
    <template v-if="!isTextInput">
      <div class="col-auto">
        <q-btn-dropdown
          color="grey-8"
          :label="level0?.name"
          split
          v-bind="$props"
          v-model="openLevel0Btn"
          @click="openLevel0Btn = !openLevel0Btn"
          no-caps
        >
          <q-list>
            <q-item
              v-for="(cat, index) in categoriesWithAll"
              :key="index"
              clickable
              v-close-popup
              @click="level0 = cat"
            >
              <q-item-section>
                <q-item-label>{{ cat.name }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
      <template v-if="level0.child !== undefined && level0.child.length > 0">
        <div class="col-auto">
          <q-btn v-bind="$props" dense>/</q-btn>
        </div>

        <div class="col-auto">
          <q-btn-dropdown
            color="grey-8"
            :label="level1?.name"
            split
            v-bind="$props"
            v-model="openLevel1Btn"
            @click="openLevel1Btn = !openLevel1Btn"
            no-caps
          >
            <q-list>
              <q-item
                v-for="(cat, index) in level0.child"
                :key="index"
                clickable
                v-close-popup
                @click="level1 = cat"
              >
                <q-item-section>
                  <q-item-label>{{ cat.name }}</q-item-label>
                </q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </template>
    </template>
    <template v-else>
      <category-input class="col" dense v-model="catValue"></category-input>
    </template>
    <div class="col-auto">
      <q-btn
        v-bind="$props"
        icon="search"
        @click="confirmClick"
        class="bg-blue"
        color="white"
      ></q-btn>
    </div>
  </div>
</template>

<script lang="ts">
import CategoryInput from "./CategoryInput.vue";
import { PropType } from "vue";
import {
  Category,
  categories,
  categoryBigInt,
  indexesById,
} from "./Categories";
import { deepCopy } from "./GeneralJSHelper";

export default Vue.defineComponent({
  name: "categorySelect",
  components: { CategoryInput },
  emits: ["update:modelValue", "confirm"],
  props: {
    modelValue: {
      type: Object as PropType<bigint>,
      required: true,
    },
    size: {
      type: String,
      default: "md",
    },
  },
  setup(props, context) {
    const level0All = { name: "All", index: 0 };
    const level1All = { name: "All", index: 0 };

    const categoriesWithAll = deepCopy(categories);
    categoriesWithAll.unshift(level0All);
    for (let cat of categoriesWithAll) {
      if (cat.child !== undefined) {
        cat.child.unshift(level1All);
      }
    }

    const isTextInput = Vue.ref<boolean>(false);
    const searchText = Vue.ref<string>("");
    const openLevel0Btn = Vue.ref<boolean>(false);
    const openLevel1Btn = Vue.ref<boolean>(false);

    let _level0 = Vue.ref<Category>(level0All);
    let _level1 = Vue.ref<Category>(level1All);
    const level0 = Vue.computed({
      get: () => _level0.value,
      set: (value) => {
        console.log("level0", value, _level0);
        if (_level0.value.index !== value.index) {
          catValue.value = categoryBigInt(value.index, 0);
        }
      },
    });

    const level1 = Vue.computed({
      get: () => _level1.value,
      set: (value) => {
        console.log("level1", value);
        catValue.value = categoryBigInt(level0.value.index, value.index);
      },
    });

    // Vue.watch(
    //   () => level1.value,
    //   () => {
    //     const v = categoryBigInt(level0.value.index, level1.value.index);
    //     context.emit("update:modelValue", v);
    //   }
    // );

    // Watch for changes of modelValue
    // Vue.watch(
    //   () => props.modelValue,
    //   (id) => {
    //     if (id !== undefined) {
    //       idToIndexInputs(BigInt(id));
    //     }
    //   }
    // );

    function idToIndexInputs(id: bigint) {
      const levels = indexesById(id);
      _level0.value = categoriesWithAll[levels[0]];
      _level1.value = _level0.value.child
        ? _level0.value.child[levels[1]]
        : level1All;
    }

    const catValue = Vue.computed({
      get: () => BigInt(props.modelValue),
      set: (value) => {
        idToIndexInputs(value);
        context.emit("update:modelValue", value);
      },
    });

    function confirmClick() {
      context.emit("confirm", catValue);
    }

    idToIndexInputs(catValue.value);

    return {
      categoriesWithAll,
      level0,
      level1,
      openLevel0Btn,
      openLevel1Btn,
      isTextInput,
      searchText,
      catValue,
      confirmClick,
    };
  },
});
</script>
