import { Component } from "vue";
import home from "../pages/IndexPage.vue";
import count from "../pages/CountPage.vue";
import user from "../pages/UserPage.vue";

/**
 * Here you can add more pages
 */
export const routes: Array<{ name: string; component: Component }> = [
  { name: "home", component: home },
  { name: "count", component: count },
  { name: "user", component: user },
];
