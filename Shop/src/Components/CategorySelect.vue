<template>
  <div class="row q-col-gutter-x-md">
    <div class="col-auto">
      <q-btn-dropdown
        color="pink"
        :label="level0?.name"
        split
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
        <q-btn>/</q-btn>
      </div>

      <div class="col-auto">
        <q-btn-dropdown
          color="pink"
          :label="level1?.name"
          split
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
  </div>
</template>

<script lang="ts">
import { PropType } from "vue";
import {
  Category,
  categories,
  categoryBigInt,
  indexesById,
} from "./Categories";

export default Vue.defineComponent({
  name: "categorySelect",
  components: {},
  emits: ["update:modelValue"],
  props: {
    modelValue: {
      type: Object as PropType<bigint>,
      required: true,
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

    const openLevel0Btn = Vue.ref<boolean>(false);
    const openLevel1Btn = Vue.ref<boolean>(false);

    const levels = indexesById(props.modelValue);
    const level0 = Vue.ref<Category>(categoriesWithAll.value[0]);
    const level1 = Vue.ref<Category>({ name: "All", index: levels[1] });

    // Watch for changes of level0 and level1
    Vue.watch(
      () => [level0.value, level1.value],
      () => {
        const v = categoryBigInt(level0.value.index, level1.value.index);
        context.emit("update:modelValue", v);
      }
    );

    return { categoriesWithAll, level0, level1, openLevel0Btn, openLevel1Btn };
  },
});
</script>
