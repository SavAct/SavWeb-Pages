<template>
  <div class="row q-col-gutter-sm full-with">
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
    const categoriesWithAll = Vue.computed(() => {
      const cats = categories.slice();
      cats.unshift({ name: "All", index: 0 });
      for (let cat of cats) {
        if (cat.child !== undefined) {
          cat.child.unshift({ name: "All", index: 0 });
        }
      }
      return cats;
    });

    const isTextInput = Vue.ref<boolean>(false);
    const searchText = Vue.ref<string>("");
    const openLevel0Btn = Vue.ref<boolean>(false);
    const openLevel1Btn = Vue.ref<boolean>(false);

    const levels = indexesById(props.modelValue);
    const _level0 = Vue.ref<Category>(categoriesWithAll.value[0]);
    const level0 = Vue.computed({
      get: () => _level0.value,
      set: (value) => {
        _level0.value = value;
        level1.value = { name: "All", index: 0 };
        const v = categoryBigInt(value.index, level1.value.index);
        context.emit("update:modelValue", v);
      },
    });

    const _level1 = Vue.ref<Category>({ name: "All", index: levels[1] });
    const level1 = Vue.computed({
      get: () => _level1.value,
      set: (value) => {
        _level1.value = value;
        const v = categoryBigInt(level0.value.index, value.index);
        context.emit("update:modelValue", v);
      },
    });

    Vue.watch(
      () => level1.value,
      () => {
        const v = categoryBigInt(level0.value.index, level1.value.index);
        context.emit("update:modelValue", v);
      }
    );

    // Watch for changes of modelValue
    Vue.watch(
      () => props.modelValue,
      (id) => {
        idToIndexInputs(id);
      }
    );

    function idToIndexInputs(id: bigint | undefined) {
      if (id === undefined) {
        level0.value = categoriesWithAll.value[0];
        level1.value = { name: "All", index: 0 };
        return;
      }
      const levels = indexesById(id);
      level0.value = categoriesWithAll.value[levels[0]];
      level1.value = level0.value.child
        ? level0.value.child[levels[1]]
        : { name: "All", index: 0 };
    }

    const catValue = Vue.computed({
      get: () => props.modelValue,
      set: (value) => {
        context.emit("update:modelValue", value);
      },
    });

    function confirmClick() {
      context.emit("confirm", catValue);
    }

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
