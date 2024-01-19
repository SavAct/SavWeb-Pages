import { Ref } from "vue";
import { MarketContract, state } from "../store/globals";
import { ItemTable } from "./ContractInterfaces";

export class LoadFromContract {
  constructor(
    public loadMaxTries: Ref<number> = Vue.ref(1),
    public loadTries: Ref<number> = Vue.ref(0)
  ) {
    loadMaxTries.value = 1;
    loadTries.value = 0;
  }

  /**
   * Will set the item from table data
   *
   * @param data id, category and contract names
   * @param maxTries Number of tries to get the item from table
   * @param waitTime Wait time after each try
   */
  public async loadItem(
    data: { id: number; category: bigint } & MarketContract,
    maxTries = 2,
    waitTime = 1000
  ) {
    this.loadTries.value = maxTries;

    for (let i = 0; i < maxTries; i++) {
      const article = await state.getArticle(data);
      if (article) {
        this.loadTries.value = 0;
        return article as ItemTable;
      } else {
        // Wait before trying again
        await new Promise((resolve) => setTimeout(resolve, waitTime));
      }
    }

    this.loadTries.value = 0;
    return undefined;
  }
}
