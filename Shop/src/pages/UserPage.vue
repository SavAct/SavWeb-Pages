<template>
  <q-page class="q-pa-md text-center">
    <div v-if="!savConnected" class="q-my-md">
      This page needs to be executed in the
      <a
        href="https://savact.app#_browser_"
        target="_blank"
        :class="{ 'text-blue': darkStyle }"
        >SavAct App</a
      >.<br />You can just drag it into the address of its browser.
    </div>
    <q-card class="my-card" flat bordered>
      <q-card-actions>
        <q-btn
          @click="getUserData"
          color="primary"
          label="Get your user data"
        />
        <div class="q-ml-lg text-secondary">{{ userName }}</div>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expander === 0 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expander = expander === 0 ? -1 : 0"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expander === 0">
          <q-separator />
          <q-card-section>
            <user-input
              label="Enter your user name manually"
              v-model="userName"
              v-model:chain="userChain"
            ></user-input>
          </q-card-section>
        </div>
      </q-slide-transition>
    </q-card>
    <q-card class="my-card q-mt-md" flat bordered>
      <q-card-section>
        <set-pgp v-model="pgpKey"></set-pgp>
      </q-card-section>
    </q-card>
    <q-card class="my-card q-mt-md" flat bordered>
      <q-card-actions :class="isBanned ? 'bg-red' : ''">
        <div class="q-ml-sm text-h6" v-if="isBanned">
          You are banned as seller!
        </div>
        <div class="q-ml-sm" v-else @click="expander = expander === 1 ? -1 : 1">
          Settings as seller
        </div>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expander === 1 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expander = expander === 1 ? -1 : 1"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expander === 1">
          <q-separator />

          <div class="row q-ma-md">
            <div class="col-auto q-mr-md text-h6">
              I am available at the moment
            </div>
            <q-btn-toggle
              class="col-auto"
              v-model="sellerActive"
              spread
              no-caps
              rounded
              unelevated
              toggle-color="primary"
              color="grey-8"
              text-color="white"
              :options="[
                { label: 'Yes', value: true },
                { label: 'No', value: false },
              ]"
            />
          </div>
          <q-select
            class="q-ma-md"
            v-model="allowedTokens"
            multiple
            :options="availableTokens"
            label="Allowed tokens"
            outlined
            :loading="isGettingAvailableTokens"
            @click="checkTokens"
            :disable="isGettingAvailableTokens"
            ref="allowedTokensSelect"
            use-chips
            stack-label
          >
            <template v-slot:after-options>
              <!-- <q-separator /> -->
              <q-btn
                class="q-ma-sm full-width"
                color="grey"
                size="sm"
                rounded
                label="Close"
                @click="allowedTokensSelect?.hidePopup()"
              ></q-btn>
            </template>
          </q-select>
          <q-input
            class="q-ma-md"
            type="textarea"
            outlined
            label="Note for all customers"
            v-model="note"
          ></q-input>
          <div class="q-mt-md text-left">
            TODO: Selling items in categories of:
          </div>
        </div>
      </q-slide-transition>
    </q-card>

    <div class="q-mt-md row q-gutter-md justify-end">
      <q-btn
        class="col-grow"
        color="primary"
        @click="upload"
        icon="publish"
        label="Upload user data"
      ></q-btn>
      <q-btn
        class="col-auto"
        color="red"
        icon="person_remove"
        @click="deleteUser"
        label="Delete user"
      ></q-btn>
    </div>
  </q-page>
</template>
<script lang="ts">
import UserInput from "../Components/UserInput.vue";
import SetPgp from "../Components/SetPgp.vue";
import { state } from "../store/globals";
import { QSelect } from "quasar";
import { PGP_Keys } from "../Components/Items";

export default Vue.defineComponent({
  name: "userPage",
  components: { SetPgp, UserInput },
  setup() {
    const darkStyle = Vue.computed(() => state.darkStyle.value);
    const savConnected = Vue.computed(() => state.savConnected.value);
    const userName = Vue.ref<string>("");
    const userChain = Vue.ref<string>("eos");
    const pgpKey = Vue.ref<PGP_Keys>({
      pub: "",
      pri: "",
      passphrase: "",
    });
    const expander = Vue.ref<number>(-1);
    const allowedTokens = Vue.ref<Array<string>>([]);
    const note = Vue.ref<string>("");
    const sellerActive = Vue.ref<boolean>(true);
    const isBanned = Vue.ref<boolean>(false);
    const showPgpInput = Vue.computed<boolean>(() => {
      return pgpKey && pgpKey.value.pub.length > 0;
    });

    interface Token {
      label: string;
      symbol: { precision?: number; name: string };
      contract: string;
      chain: string;
    }

    const availableTokens = Vue.ref<Array<Token>>([]);

    async function getUserData() {
      userName.value = userName.value.trim();
      const user =
        userName.value.length > 0 ? { name: userName.value } : undefined;

      const resultUser = await state.savWeb.getUser(user, 60000);

      console.log("Received user data", resultUser);
      if (resultUser !== undefined && resultUser.name !== undefined) {
        userName.value = resultUser.name;
        if (resultUser.chain !== undefined) {
          userChain.value = resultUser.chain;
        }
        console.log("User name", resultUser.name, typeof resultUser.name);
      }
    }

    const allowedTokensSelect = Vue.ref<QSelect | undefined>(undefined);
    const openAllowedTokens = Vue.ref<boolean>(false);

    async function checkTokens() {
      const aTokens = (
        await state.getAllowedTokens((hasError?: boolean) => {
          if (hasError === true) {
            Quasar.Notify.create({
              message: "Error on getting allowed tokens.",
              caption: "Please try again later.",
              type: "negative",
              position: "top",
            });
          } else {
            setTimeout(() => {
              // setTimeout hack to let showPopup() work
              allowedTokensSelect.value?.showPopup();
            }, 0);
          }
        })
      )?.map((t) => {
        return {
          ...t,
          label: t.symbol.name + " " + t.contract + "@" + t.chain,
        };
      });
      availableTokens.value = aTokens ? aTokens : [];
    }

    function upload() {
      console.log("TODO: Upload data");
    }

    function deleteUser() {
      console.log("TODO: Delete user");
    }

    // TODO: As soon as userName is changed then get the currently selected data of the user:
    /*       
    Table name: "user", scope: "contract name" {
      name user;
      vector<tokenSymbol> allowed;
      bool active;
      uint32_t lastUpdate;
      list<idAndCategory> items;
      bool banned;  // Show red warning if true
      string pgp;   
      string note;
    } 

    struct tokenSymbol {
      symbol sym;
      name contr;
      string chain;
    };

    struct idAndCategory {
      uint64_t id;
      name category;
    };
      */
    // TODO: Upload settings

    return {
      userName,
      darkStyle,
      savConnected,
      pgpKey,
      getUserData,
      allowedTokensSelect,
      availableTokens,
      allowedTokens,
      isGettingAvailableTokens: state.isGettingAvailableTokens,
      checkTokens,
      openAllowedTokens,
      expander,
      userChain,
      note,
      sellerActive,
      isBanned,
      showPgpInput,
      upload,
      deleteUser,
    };
  },
});
</script>
