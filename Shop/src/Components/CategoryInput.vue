<template>
  <q-select
    class="q-mb-sm"
    v-model="category"
    outlined
    :options="categoryOptions"
    use-input
    input-debounce="0"
    behavior="menu"
    label="Category"
    clearable
    @filter="filterCategoryInput"
    @keyup.enter="enterClick"
  >
  </q-select>
</template>
<script lang="ts">
import { PropType } from "vue";
import { categoryPathsById } from "./Categories";

export default Vue.defineComponent({
  name: "categoryInput",
  props: {
    modelValue: {
      type: Object as PropType<bigint | undefined>,
      required: true,
    },
  },
  emits: ["update:modelValue"],
  setup(props, context) {
    const _category = Vue.ref<{ value: bigint; label: string } | undefined>(
      props.modelValue !== undefined
        ? {
            value: props.modelValue,
            label: categoryPathsById[String(props.modelValue)],
          }
        : undefined
    );
    const category = Vue.computed({
      get: () => _category.value,
      set: (value) => {
        _category.value = value;
        context.emit("update:modelValue", value?.value);
      },
    });

    function enterClick() {
      if (categoryOptions.value.length === 1) {
        category.value = categoryOptions.value[0];
      }
    }

    function getCategoryOptions() {
      const options = [];
      for (let id in categoryPathsById) {
        options.push({
          label: categoryPathsById[id],
          value: BigInt(id),
        });
      }
      return options;
    }
    const categoryOptions =
      Vue.ref<Array<{ label: string; value: bigint }>>(getCategoryOptions());

    function filterCategoryInput(search: string, update: Function) {
      const needle = search.toLocaleLowerCase();
      update(() => {
        let options = [];
        for (let id in categoryPathsById) {
          if (categoryPathsById[id].toLocaleLowerCase().includes(needle)) {
            options.push({ value: BigInt(id), label: categoryPathsById[id] });
          }
        }
        categoryOptions.value = options;
      });
    }

    return {
      category,
      categoryOptions,
      filterCategoryInput,
      enterClick,
    };
  },
});
</script>
