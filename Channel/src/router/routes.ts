import { Component } from "vue";
import index from "../pages/IndexPage.vue";
import board from "../pages/BoardPage.vue";
import thread from "../pages/ThreadPage.vue";
import ads from "../pages/AdsPage.vue";

/**
 * Here you can add more pages
 */
export const routes: Array<{
  name: string;
  component: Component;
  title?: string;
  color?: string;
}> = [
  {
    name: "index",
    component: index,
    title: "Immortal Channel",
    color: "teal-12",
  },
  {
    name: "board",
    component: board,
    title: "Board",
    color: "teal-12",
  },
  {
    name: "thread",
    component: thread,
    title: "Thread",
    color: "teal-12",
  },
  {
    name: "ads",
    component: ads,
    title: "Buy Ads",
    color: "orange-13",
  },
];
