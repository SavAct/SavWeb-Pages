<template>
  <q-list bordered class="q-mt-md">
    <q-expansion-item
      expand-separator
      :label="
        lang == 'de' ? 'Prüfe Sie Ihre Tokenmenge' : 'Check your Token amount'
      "
      expand-icon="info"
    >
      <q-card>
        <q-card-section>
          <q-input
            outlined
            v-model="checkUser"
            @keydown.enter.prevent="checkUserAmount"
            :label="
              lang == 'de'
                ? 'Geben Sie Ihren verwendeten Account-Namen oder Public-Key ein'
                : 'Enter your used account name or public key'
            "
          >
            <template v-slot:prepend>
              <q-icon name="account_circle"></q-icon>
            </template>
            <template v-slot:after>
              <q-btn
                round
                dense
                flat
                icon="send"
                @click="checkUserAmount"
                :loading="checkUserAmountLoading"
              ></q-btn>
            </template>
          </q-input>
          <div></div>
          <div class="q-mt-md q-mx-lg row">
            <div class="col"></div>
            <div class="text-h6 text-green-13">{{ checkedUserAmount }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </q-list>
</template>
<script lang="ts">
import { PublicKey } from "@greymass/eosio";
import { state } from "../store/globals";
import {
  assetToString,
  checkName,
  isValidPublic,
  showCongrat,
  showError,
} from "./helpers";

export default Vue.defineComponent({
  name: "TokenCheck",
  setup() {
    const checkUser = Vue.ref("");
    const checkUserAmountLoading = Vue.ref(false);
    const checkedUserAmount = Vue.ref("");

    async function checkUserAmount() {
      checkUserAmountLoading.value = true;

      const userStr = checkUser.value.trim();
      checkUser.value = userStr;

      let assets: Array<string> = [];
      let valid = false;
      if (userStr.length > 0) {
        if (userStr.length === 53 || userStr.length === 57) {
          if (isValidPublic(userStr)) {
            valid = true;
            const amount = await getKeyUserAmount(userStr);
            if (amount != undefined && amount != null && amount > 0n) {
              assets.push(
                assetToString(
                  amount,
                  state.conPrecision.value,
                  state.conSymbol.value
                )
              );
            }
          }
        } else if (userStr.length <= 12) {
          if ((await checkName(userStr)) === true) {
            valid = true;
            const temp_assets = await getNameUserAsset(userStr);
            if (temp_assets != null) {
              assets = temp_assets;
            }
          }
        }
      }

      if (valid) {
        if (typeof assets == "object" && assets != null && assets.length > 0) {
          const asset = assets.find((item) => {
            return item.substring(item.length - state.conSymbol.value.length) ==
              state.conSymbol.value
              ? true
              : false;
          });
          if (asset == undefined) {
            let msg =
              state.lang.value == "de"
                ? `Es wurden keine ${state.conSymbol.value}-Token unter der Adresse ${userStr} gefunden.`
                : `No ${state.conSymbol.value} token found for ${userStr}.`;
            showError(msg);
            checkedUserAmount.value = "";
          } else {
            let msg =
              state.lang.value == "de"
                ? `gehörden der Adresse ${userStr}.`
                : `belongs to ${userStr}.`;
            showCongrat(`${asset}`, msg);
            checkedUserAmount.value = asset;
          }
        } else {
          let msg =
            state.lang.value == "de"
              ? `Es wurden keine ${state.conSymbol.value}-Token unter der Adresse ${userStr} gefunden.`
              : `No ${state.conSymbol.value} token found for ${userStr}.`;
          showError(msg);
          checkedUserAmount.value = "";
        }
      } else {
        checkedUserAmount.value = "";
      }

      checkUserAmountLoading.value = false;
    }

    function getTableIdFromKey(pubkey: string) {
      const eosioKey = PublicKey.from(pubkey);
      const hex = eosioKey.data.hexString;
      const key = hex.substring(0, hex.length - 2 * 8);
      const revIdHex = hex.substring(hex.length - 2 * 8);
      const idHex = revIdHex
        .match(/[0-9a-f]{2}/gi)
        ?.reverse()
        .join("");
      const id = BigInt("0x" + idHex);
      return {
        hex,
        key,
        id,
      };
    }

    async function getKeyUserAmount(key: string) {
      const rowParams = getTableIdFromKey(key);

      const rPur = await state.savWeb.getTableRows(
        state.usedChain,
        state.usedContract,
        "purchased",
        state.usedContract,
        String(rowParams.id)
      );
      if (rPur == undefined) {
        showError(
          state.lang.value == "de"
            ? "Die Daten konnten nicht abgerufen werden."
            : "Unable to get the data."
        );
        return undefined;
      }
      if ("owner" in rPur && typeof rPur.owner == "object") {
        const entry = rPur.owner.find((item: { key: string }) => {
          if ("key" in item) {
            if (item.key == rowParams.key) {
              return true;
            }
          }
          return false;
        });
        if (entry != undefined && "amount" in entry) {
          return BigInt(entry.amount);
        }
      }
      return null;
    }

    async function getNameUserAsset(name: string) {
      const balances = await state.savWeb.getBalance(
        state.usedChain,
        state.tokenContract,
        name,
        state.conSymbol.value
      );
      if (balances == undefined) {
        showError(
          state.lang.value == "de"
            ? "Die Daten konnten nicht abgerufen werden."
            : "Unable to get the data."
        );
        return;
      }
      if (balances != null && Array.isArray(balances) && balances.length > 0) {
        return balances;
      }
      return null;
    }

    return {
      lang: state.lang,
      checkUserAmount,
      checkUser,
      checkedUserAmount,
      checkUserAmountLoading,
    };
  },
});
</script>
