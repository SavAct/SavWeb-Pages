<template>
  <q-page class="q-pa-md text-center">
    <q-card class="my-card" flat bordered>
      <q-card-actions>
        <q-btn
          @click="getLoginUser()"
          color="primary"
          label="Get your user data"
          :disable="checkingUserData"
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
          I am a seller
        </div>
        <q-toggle
          class="q-ml-sm"
          v-model="isSeller"
          :label="isSeller ? 'Yes' : 'No'"
        />
        <q-space />
        <q-btn
          v-if="isSeller"
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
            <div class="col-auto q-mr-md flex flex-center">
              I am available at the moment
            </div>
            <div class="flex flex-center">
              <q-toggle
                class="col-auto"
                v-model="sellerActive"
                :label="sellerActive ? 'Yes' : 'No'"
              />
            </div>
          </div>
          <div @click="checkTokens()">
            <q-select
              class="q-ma-md"
              v-model="allowedTokens"
              multiple
              :options="availableTokens"
              label="Allowed tokens"
              outlined
              :loading="isGettingAvailableTokens"
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
          </div>
          <div class="q-mx-md q-my-lg">
            <div class="row q-gutter-sm">
              <q-input
                class="col-grow"
                v-model="contactInput"
                outlined
                label="Contact"
                dense
                @keyup.enter="addContact"
              ></q-input>
              <q-btn
                class="col-auto q-pl-sm"
                :class="contactInput.length === 0 ? 'q-pr-sm' : 'q-pr-md'"
                color="green"
                icon="add"
                dense
                @click="addContact"
                :label="shortContactInput"
                :disable="!validContactInput"
              ></q-btn>
            </div>
            <div>
              <div class="row q-mt-sm q-gutter-sm" v-for="(c, i) in contacts">
                <q-btn
                  v-if="shortContact(c).length > 0"
                  :key="i"
                  class="col-auto"
                  dense
                  :label="shortContact(c)"
                  @click="openLinkOrMail(c)"
                ></q-btn>
                <q-input disable class="col-grow" v-model="c" dense></q-input>
                <q-btn
                  class="col-auto"
                  color="red"
                  icon="delete"
                  dense
                  @click="contacts.splice(i, 1)"
                >
                </q-btn>
              </div>
              <q-separator class="q-mt-sm" />
            </div>
          </div>
          <q-input
            class="q-ma-md"
            type="textarea"
            outlined
            label="Note for all customers"
            v-model="note"
          ></q-input>
        </div>
      </q-slide-transition>
    </q-card>

    <q-card class="my-card q-mt-md" flat bordered v-if="items !== undefined">
      <q-card-actions>
        <div class="q-ml-sm" @click="expander = expander === 3 ? -1 : 3">
          Listed items: <span class="text-secondary">{{ items.length }}</span>
        </div>
        <q-space />
        <q-btn
          color="grey"
          round
          flat
          dense
          :icon="expander === 0 ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
          @click="expander = expander === 3 ? -1 : 3"
        />
      </q-card-actions>

      <q-slide-transition>
        <div v-show="expander === 3">
          <q-separator />
          <q-card-section class="text-left">
            <q-chip
              v-for="(c, index) in items"
              :key="index"
              :label="formatItem(c)"
              class="q-ma-sm"
              color="primary"
              clickable
              @click="openItem(c.id)"
            ></q-chip>
          </q-card-section>
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
import { savWeb } from "../store/connect";
import {
  Deleteuser,
  IdAndCategory,
  TokenSymbol,
  Updateuser,
  UserTable,
} from "../Components/ContractInterfaces";
import {
  messengerShortName,
  openLinkOrMail,
  urlStartByDomainName,
} from "../Components/LinkConverter";
import { PublicAccount } from "../Components/SavWeb";
import {
  StringToSymbol,
  getKnownChainId,
  isSameChain,
  isTableResultWithEntries,
} from "../Components/AntelopeHelpers";
import { router } from "../router/simpleRouter";

export default Vue.defineComponent({
  name: "userPage",
  components: { SetPgp, UserInput },
  setup() {
    const darkStyle = Vue.computed(() => state.darkStyle.value);
    const _userName = Vue.ref<string>(state.defaultUserName.value);
    const userName = Vue.computed<string>({
      get: () => _userName.value,
      set: (v) => {
        if (_userName.value !== v) {
          _userName.value = v;
          getUserData();
        } else {
          checkingUserData.value = false;
        }
      },
    });
    const contractChainId = getKnownChainId(state.contract.chain);
    const userChain = Vue.ref<string>(
      contractChainId !== undefined ? contractChainId : "eos"
    );
    const pgpKey = Vue.ref<PGP_Keys>({
      pub: "",
      pri: "",
      passphrase: "",
    });
    const expander = Vue.ref<number>(-1);
    const allowedTokens = Vue.ref<Array<Token>>([]);
    const note = Vue.ref<string>("");
    const sellerActive = Vue.ref<boolean>(true);
    const isBanned = Vue.ref<boolean>(false);
    const _isSeller = Vue.ref<boolean>(false);
    const isSeller = Vue.computed<boolean>({
      get: () => _isSeller.value,
      set: (v) => {
        if (_isSeller.value !== v) {
          _isSeller.value = v;
          expander.value = v ? 1 : -1;
        }
      },
    });
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

    const allowedTokensSelect = Vue.ref<QSelect | undefined>(undefined);
    const openAllowedTokens = Vue.ref<boolean>(false);

    let tokensChecked = false;
    let tokensIsChecking = false;

    async function checkTokens() {
      if (tokensChecked === true || tokensIsChecking === true) return;
      tokensIsChecking = true;

      const aTokens = (
        await state.getAvailableTokens((hasError?: boolean) => {
          if (hasError === true) {
            Quasar.Notify.create({
              message: "Error on getting allowed tokens.",
              caption: "Please try again later.",
              type: "negative",
              position: "top",
            });
          } else {
            tokensChecked = true;
          }
        })
      )?.map((t) => {
        return {
          ...t,
          label: t.symbol.name + " " + t.contract + "@" + t.chain,
        };
      });

      availableTokens.value = aTokens ? aTokens : [];
      tokensIsChecking = false;

      if (availableTokens.value.length > 0) {
        await Vue.nextTick();
        allowedTokensSelect.value?.showPopup();
      }
    }

    function upload() {
      // Check user data
      if (userName.value.length === 0) {
        Quasar.Notify.create({
          message: "User name is missing",
          caption: "Please enter a user name.",
          type: "negative",
          position: "top",
        });
        return;
      }

      if (pgpKey.value.pub.length === 0) {
        Quasar.Notify.create({
          message: "Public PGP key is missing",
          caption: "Please enter a public PGP key.",
          type: "negative",
          position: "top",
        });
        return;
      } else if (
        pgpKey.value.fingerprint === undefined ||
        pgpKey.value.fingerprint.length === 0
      ) {
        Quasar.Notify.create({
          message: "Public PGP key is invalid",
          caption: "Please enter a valid public PGP key.",
          type: "negative",
          position: "top",
        });
        return;
      }

      if (isSeller.value && allowedTokens.value.length === 0) {
        Quasar.Notify.create({
          message: "No allowed tokens",
          caption: "Please select at least one token.",
          type: "negative",
          position: "top",
        });
        return;
      }

      if (isSeller.value && contacts.value.length === 0) {
        Quasar.Notify.create({
          message: "No contact",
          caption:
            "Please enter at least one contact like an email address or Telegram account (t.me/username).",
          type: "negative",
          position: "top",
        });
        return;
      }

      const allowed: Array<TokenSymbol> = isSeller.value
        ? allowedTokens.value.map((t) => {
            return {
              sym: `${t.symbol.precision},${t.symbol.name}`,
              contr: t.contract,
              chain: t.chain,
            };
          })
        : [];

      const data: Updateuser = {
        user: userName.value,
        contact: contacts.value.map((c) => c.trim()),
        allowed,
        active: isSeller.value ? sellerActive.value : false,
        pgp: pgpKey.value.pub,
        note: isSeller.value ? note.value : "",
      };

      savWeb.transaction({
        chain: state.contract.chain,
        contract: state.contract.account,
        action: state.contract.actions.updateUser,
        data,
        permission: state.loginUser.value?.permission,
      });
    }

    const checkingUserData = Vue.ref<boolean>(false);

    async function getLoginUser(name?: string) {
      if (checkingUserData.value === true) return;
      checkingUserData.value = true;

      let user: PublicAccount | undefined = undefined;
      if (name !== undefined) {
        name = name.trim();
        user = name.length > 0 ? { name } : undefined;
      } else {
        user = undefined;
      }

      const resultUser = await savWeb.getUser(user, 60000);

      // Check if chain is the same as the shop contract
      if (
        resultUser &&
        resultUser.chain !== undefined &&
        isSameChain(resultUser.chain, state.contract.chain) !== true
      ) {
        Quasar.Notify.create({
          message: "Wrong chain",
          caption: `Please connect the browser with an account on the ${state.contract.chain} chain.`,
          type: "negative",
          position: "top",
        });
        return;
      }

      state.loginUser.value = resultUser;

      if (resultUser?.name !== undefined) {
        if (resultUser.name === userName.value) {
          // Update user data by button click
          getUserData();
        } else {
          userName.value = resultUser.name;
          // getUserData will already be executed when userName changes
        }
      } else {
        userName.value = "";
      }
    }

    function deleteUser() {
      const data: Deleteuser = {
        user: userName.value,
      };
      savWeb.transaction({
        chain: state.contract.chain,
        contract: state.contract.account,
        action: state.contract.actions.deleteUser,
        data,
        permission: state.loginUser.value?.permission,
      });
    }

    function shortContact(c: string) {
      const short = messengerShortName(urlStartByDomainName(c));
      return short !== undefined ? short : "";
    }

    const shortContactInput = Vue.computed<string>(() => {
      return shortContact(contactInput.value);
    });

    const contacts = Vue.ref<Array<string>>([]);
    const contactInput = Vue.ref<string>("");
    function addContact() {
      if (contactInput.value.length > 0) {
        const contact = contactInput.value;
        contactInput.value = "";
        contacts.value.push(shortenUrl(contact));
      }
    }

    /**
     * Remove beginning http(s):// from url. Remove also www. if it starts with the protocol http or https
     * @param url
     * @returns
     */
    function shortenUrl(url: string) {
      url = url.trim();
      if (url.startsWith("www.")) {
        return url.replace(/^www\./, "");
      }
      const l = url.length;
      url = url.replace(/^https?:\/\//, "").replace(/^http?:\/\//, "");
      if (l !== url.length) {
        return url.replace(/^www\./, "");
      }
      return url;
    }

    const validContactInput = Vue.computed<boolean>(() => {
      if (contactInput.value.length > 0) {
        // Check if it is a valid known format
        if (shortContactInput.value.length > 0) {
          return true;
        }
        // Check if it is a valid link
        const link = shortenUrl(contactInput.value);
        const dotIndex = link.indexOf(".");
        if (dotIndex > 0) {
          const slashIndex = link.indexOf("/", dotIndex);
          if (slashIndex > 0 && link.length - slashIndex > 1) {
            return true;
          }
        }
      }
      return false;
    });

    const items = Vue.ref<Array<IdAndCategory> | undefined>(undefined);

    async function getUserData() {
      checkingUserData.value = true;
      const result = await savWeb.getTableRows({
        chain: state.contract.chain,
        code: state.contract.account,
        scope: state.contract.account,
        table: state.contract.tables.user,
        entry: userName.value,
      });

      if (isTableResultWithEntries(result)) {
        const user = (result as { rows: Array<UserTable> }).rows[0];
        if (
          user.pgp !== undefined &&
          user.contact !== undefined &&
          user.allowed !== undefined &&
          user.note !== undefined &&
          user.active !== undefined &&
          user.banned !== undefined
        ) {
          // Adopt new global user state
          state.user.value = {
            ...user,
            active: Boolean(user.active),
            allowed: user.allowed.map((t: TokenSymbol) => {
              return {
                symbol: StringToSymbol(t.sym),
                contract: t.contr,
                chain: t.chain,
              };
            }),
          };

          pgpKey.value = {
            pub: user.pgp,
            pri: "",
            passphrase: "",
          };
          note.value = user.note;
          sellerActive.value = Boolean(user.active);
          isBanned.value = user.banned;
          contacts.value = user.contact;
          allowedTokens.value = user.allowed.map((t: TokenSymbol) => {
            return {
              label: `${t.sym} ${t.contr}@${t.chain}`,
              symbol: StringToSymbol(t.sym),
              contract: t.contr,
              chain: t.chain,
            };
          });
          items.value = user.items;
        }
      }
      checkingUserData.value = false;
    }

    function formatItem(item: IdAndCategory) {
      return `#${item.id} (${item.category})`;
    }

    function openItem(id: string | number | bigint | undefined) {
      router.push({ name: "item", query: { id: String(id) } });
    }

    return {
      userName,
      darkStyle,
      pgpKey,
      getLoginUser,
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
      shortContact,
      contactInput,
      shortContactInput,
      validContactInput,
      addContact,
      contacts,
      openLinkOrMail,
      checkingUserData,
      items,
      formatItem,
      openItem,
      isSeller,
    };
  },
});
</script>
