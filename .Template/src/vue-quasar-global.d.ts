import _vue from "vue";
import _quasar from "quasar";

// Define just the types of the components
declare global {
  const Vue: typeof _vue;
  const Quasar: typeof _quasar;
}
