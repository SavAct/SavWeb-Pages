<template>
  <q-page class="column">
    <div class="q-pa-md">
      <div class="col q-py-md row">
        <q-fab
          square
          v-model="optionOpen"
          color="primary"
          glossy
          icon="keyboard_arrow_right"
          direction="right"
        >
          <q-fab-action
            square
            external-label
            label-position="top"
            color="secondary"
            @click="reset"
            icon="restart_alt"
            label="Reset"
          ></q-fab-action>
          <q-fab-action
            square
            external-label
            label-position="top"
            :color="stylemode ? 'white' : 'black'"
            :text-color="stylemode ? 'black' : 'white'"
            ic
            @click="stylemode = !stylemode"
            icon="brightness_medium"
            label="Style"
          ></q-fab-action>
        </q-fab>
      </div>

      <div>
        <div>
          <q-stepper
            v-model="step"
            header-nav
            ref="stepper"
            color="primary"
            animated
            vertical
          >
            <q-step
              :name="1"
              title="Select an option to create an affiliate link"
              icon="account_circle"
              :done="done1"
            >
              <div class="q-gutter-lg">
                <div class="q-gutter-sm">
                  <div>What do you want to use? Your</div>
                  <div class="row">
                    <q-radio
                      class="col-6 col-sm-3 col-md-2 col-lg-1"
                      v-model="hasacc"
                      val="false"
                      label="Public Key"
                    ></q-radio>
                    <q-radio
                      class="col-6 col-sm-3 col-md-2 col-lg-1"
                      v-model="hasacc"
                      val="true"
                      :label="`${paySymbol} Account`"
                    ></q-radio>
                  </div>
                </div>
              </div>
              <div>
                <div
                  v-show="hasacc === 'true'"
                  class="row q-gutter-md justify-end q-ml-sm q-mt-xs"
                >
                  <q-input
                    class="col-12 col-sm"
                    outlined
                    v-model="username"
                    :label="`Your ${paySymbol} account name`"
                  >
                    <template v-slot:prepend
                      ><q-icon name="account_box"></q-icon
                    ></template>
                  </q-input>
                  <q-btn
                    class="col-auto"
                    glossy
                    unelevated
                    icon-right="help_center"
                    label="Need an account"
                    @click="
                      openURL('https://eosauthority.com/wallet/create-account')
                    "
                  ></q-btn>
                </div>
                <div
                  v-show="hasacc === 'false'"
                  class="row q-gutter-md justify-end q-ml-sm q-mt-xs"
                >
                  <q-input
                    class="col-12 col-sm"
                    outlined
                    v-model="userkey"
                    :label="`Your ${paySymbol} public key`"
                  ></q-input>
                  <q-btn
                    class="col-auto"
                    glossy
                    unelevated
                    icon-right="help_center"
                    label="Need a key pair"
                    @click="createKeyDialog = true"
                  ></q-btn>
                </div>
              </div>

              <q-stepper-navigation>
                <q-btn
                  @click="checkStep1"
                  color="primary"
                  label="Continue"
                  :disable="hasacc == ''"
                  :loading="check1Loading"
                ></q-btn>
              </q-stepper-navigation>
            </q-step>
          </q-stepper>

          <div v-show="step == 2">
            <q-item
              clickable
              v-ripple
              active-class="bg-teal-1 text-grey-8"
              @click="toClipboard(affiLink)"
            >
              <q-item-section class="itemname" side
                >Affiliate link</q-item-section
              >
              <q-item-section class="scroll">{{ affiLink }}</q-item-section>
              <q-item-section avatar>
                <q-icon name="copy_all"></q-icon>
              </q-item-section>
            </q-item>
            <q-item
              clickable
              v-ripple
              active-class="bg-teal-1 text-grey-8"
              @click="toClipboard(coupon)"
            >
              <q-item-section class="itemname" side>Coupon</q-item-section>
              <q-item-section class="scroll">{{ coupon }}</q-item-section>
              <q-item-section avatar>
                <q-icon name="copy_all"></q-icon>
              </q-item-section>
            </q-item>
          </div>
        </div>
      </div>
    </div>
  </q-page>
</template>
<script lang="ts">
import GenDialog from "../Components/GenDialog.vue";
import { state } from "../store/globals";

import {
  checkName,
  isValidPublic,
  showError,
  toClipboard,
} from "../Components/helpers";

export default Vue.defineComponent({
  name: "affiliatePage",
  components: { GenDialog },
  setup() {
    const createKeyDialog = Vue.ref(false);

    const coupon = Vue.computed(() => {
      if (hasacc.value === "true") {
        return username.value;
      } else if (hasacc.value === "false") {
        return userkey.value;
      }
      return "";
    });

    const affiLink = Vue.computed(() => {
      return `${state.browserLink}#${state.usedSaleSite}?affi=${coupon.value}`;
    });

    const step = Vue.ref(1);
    const done1 = Vue.ref(false);
    const check1Loading = Vue.ref(false);
    const hasacc = Vue.ref("");
    const username = Vue.ref("");
    const userkey = Vue.ref("");
    const optionOpen = Vue.ref(false);

    function reset() {
      step.value = 0;
      done1.value = false;
      hasacc.value = "";
      username.value = "";
      userkey.value = "";
    }

    async function checkStep1() {
      check1Loading.value = true;
      await (async () => {
        // Check user
        if (hasacc.value) {
          if (hasacc.value === "true") {
            if ((await checkName(username.value)) !== true) {
              return;
            }
          } else {
            if (!isValidPublic(userkey.value)) {
              showError("Invalid public key.");
              return;
            }
          }

          done1.value = true;
          step.value = 2;
        }
      })();
      check1Loading.value = false;
    }

    return {
      createKeyDialog,
      affiLink,
      step,
      done1,
      check1Loading,
      reset,
      hasacc,
      stylemode: state.darkStyle,
      userkey,
      username,
      coupon,
      checkStep1,
      toClipboard,
      openURL: Quasar.openURL,
      paySymbol: state.defaultPaySymbol,
      optionOpen,
    };
  },
});
</script>
