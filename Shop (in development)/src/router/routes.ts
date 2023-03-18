import { Component } from "vue";
import home from "../pages/IndexPage.vue";
import ads from "../pages/AdsPage.vue";
import item from "../pages/ItemPage.vue";
import user from "../pages/UserPage.vue";

/**
 * Here you can add more pages
 */
export const routes: Array<{
  name: string;
  component: Component;
  title?: string;
  color?: string;
}> = [
  { name: "home", component: home, title: "Immortal Shop", color: "teal-12" },
  {
    name: "item",
    component: item,
    title: "Item",
    color: "light-green-13",
  },
  {
    name: "ads",
    component: ads,
    title: "Buy Ads",
    color: "light-green-13",
  },
  {
    name: "user",
    component: user,
    title: "Check Account",
    color: "cyan-12",
  },
];
