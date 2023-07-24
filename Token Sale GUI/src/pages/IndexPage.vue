<template>
  <q-page class="column">
    <div class="col q-pa-md">
      <div v-if="saleStatus">
        <div v-if="saleStatus.frozen">
          {{
            lang == "de" ? "Dieser Sale ist pausiert" : "This sale is paused"
          }}
        </div>
        <div v-else-if="saleStart" class="text-center">
          {{ lang == "de" ? "Dieser Sale startet in" : "This sale starts in" }}
          <div class="text-h2 q-my-md">{{ saleStart }}</div>
          <div class="text-subtitle2">{{ saleDate }}</div>
          <div class="q-mt-md">
            {{
              lang == "de"
                ? "Stellen Sie sicher ausreichend " +
                  paySymbol +
                  " für die Teilnahme zu besitzen."
                : "Make sure to have enough " + paySymbol + " to participate."
            }}
          </div>
          <q-btn
            class="q-mt-md"
            size="15px"
            text-color="red"
            icon="smart_display"
            :label="'Video' + (lang == 'de' ? '-Anleitung' : ' Tutorial')"
            @click="
              openURL(
                lang == 'de'
                  ? 'https://www.youtube.com/watch?v=VpcGB6Rt1jA&list=PLlqxjSlFPsipp-mvQubWy0qNJLDUXHVi0&index=1'
                  : 'https://www.youtube.com/watch?v=l0mSchE4J90&list=PLlqxjSlFPsipp-mvQubWy0qNJLDUXHVi0&index=2'
              )
            "
          />
        </div>
        <div v-else>
          <div class="row">
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
                label-position="bottom"
                color="orange"
                @click="ledDialog = true"
                icon="usb"
                label="Ledger"
              ></q-fab-action>
              <q-fab-action
                square
                external-label
                label-position="bottom"
                color="deep-purple-5"
                @click="isIndex = false"
                icon="groups"
                label="Affiliate"
              ></q-fab-action>
              <q-fab-action
                square
                external-label
                label-position="bottom"
                color="secondary"
                @click="reset"
                icon="restart_alt"
                label="Reset"
              ></q-fab-action>
              <q-fab-action
                square
                external-label
                label-position="bottom"
                color="blue-grey-6"
                @click="lang = lang == 'de' ? 'en' : 'de'"
                icon="translate"
                :label="lang == 'de' ? 'English' : 'Deutsch'"
              ></q-fab-action>
              <q-fab-action
                square
                external-label
                label-position="bottom"
                :color="darkStyle ? 'white' : 'black'"
                :text-color="darkStyle ? 'black' : 'white'"
                ic
                @click="darkStyle = !darkStyle"
                icon="brightness_medium"
                label="Style"
              ></q-fab-action>
            </q-fab>
            <q-linear-progress
              v-show="!optionOpen"
              class="col q-mx-md"
              :class="darkStyle ? 'bg-grey-10' : 'bg-grey-2'"
              size="55px"
              :value="progress1"
              color="cyan-13"
              :track-color="darkStyle ? 'grey-8' : 'bg-grey-2'"
              :buffer="progress1 > 0.8 ? 1 : 0.9"
            >
              <div class="absolute-full flex flex-center">
                <q-badge
                  color="white"
                  text-color="blue"
                  :label="progressLabel1"
                />
              </div>
            </q-linear-progress>
            <q-btn
              v-show="!optionOpen"
              color="secondary"
              icon-right="update"
              @click="checkSaleState()"
              rounded
              size="md"
            />
          </div>

          <div
            class="q-pt-md q-pb-sm row justify-center items-center text-center"
          >
            <div class="q-ma-sm">
              {{
                lang == "de"
                  ? "Füllen Sie das Formular aus, um am SavAct Tokensale teilzunehmen."
                  : "Fill in the form to participate in the SavAct Tokensale."
              }}
            </div>
            <q-btn
              class="q-mx-lg q-px-lg"
              size="13px"
              text-color="red"
              :color="darkStyle ? 'blue-grey-9' : 'blue-grey-1'"
              icon="smart_display"
              :label="'Video' + (lang == 'de' ? '-Anleitung' : ' Tutorial')"
              @click="
                openURL(
                  lang == 'de'
                    ? 'https://www.youtube.com/watch?v=VpcGB6Rt1jA&list=PLlqxjSlFPsipp-mvQubWy0qNJLDUXHVi0&index=1'
                    : 'https://www.youtube.com/watch?v=l0mSchE4J90&list=PLlqxjSlFPsipp-mvQubWy0qNJLDUXHVi0&index=2'
                )
              "
            />
          </div>

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
              :title="
                lang == 'de' ? 'Wählen Sie Ihren Fall aus' : 'Select your case'
              "
              icon="account_circle"
              :done="done1"
              :header-nav="step > 1"
            >
              <div class="q-gutter-lg">
                <div class="q-gutter-sm">
                  <div>
                    {{
                      lang == "de"
                        ? "Besitzten Sie einen " + paySymbol + "-Account?"
                        : "Do you have an " + paySymbol + " account?"
                    }}
                  </div>
                  <div class="row">
                    <q-radio
                      class="col-6 col-sm-3 col-md-2 col-lg-1"
                      v-model="hasacc"
                      val="true"
                      :label="lang == 'de' ? 'Ja' : 'Yes'"
                    ></q-radio>
                    <q-radio
                      class="col-6 col-sm-3 col-md-2 col-lg-1"
                      v-model="hasacc"
                      val="false"
                      :label="lang == 'de' ? 'Nein' : 'No'"
                    ></q-radio>
                  </div>
                </div>
                <div class="q-gutter-sm" v-show="hasacc === 'false'">
                  <div>
                    {{
                      lang == "de"
                        ? "Möchten Sie gleichzeitig einen " +
                          paySymbol +
                          "-Account erstellen?"
                        : "Would you also like to create an " +
                          paySymbol +
                          " account?"
                    }}
                  </div>
                  <div class="row">
                    <div class="col-6 col-sm-3 col-md-2 col-lg-1">
                      <q-badge
                        outline
                        :color="wantacc == 'true' ? 'blue' : 'blue-10'"
                        class="text-white q-pr-md q-py-none"
                      >
                        <q-radio
                          color="blue"
                          :class="'text-' + (darkStyle ? 'white' : 'black')"
                          v-model="wantacc"
                          val="true"
                          :label="lang == 'de' ? 'Ja' : 'Yes'"
                        ></q-radio>
                        <q-tooltip>{{
                          lang == "de" ? "Empfohlen" : "Recommended"
                        }}</q-tooltip>
                      </q-badge>
                    </div>
                    <div class="col-6 col-sm-3 col-md-2 col-lg-1">
                      <q-radio
                        v-model="wantacc"
                        val="false"
                        :label="lang == 'de' ? 'Nein' : 'No'"
                      ></q-radio>
                    </div>
                  </div>
                </div>
                <div v-show="hasacc === 'true' || wantacc">
                  <q-input
                    outlined
                    v-model="username"
                    v-if="hasacc == 'true'"
                    :label="
                      lang == 'de'
                        ? 'Ihr ' + paySymbol + '-Account-Name'
                        : 'Your ' + paySymbol + ' account name'
                    "
                    counter
                    maxlength="12"
                  >
                    <template v-slot:prepend>
                      <q-icon name="account_box"></q-icon>
                    </template>
                  </q-input>
                  <div v-else>
                    <div
                      v-if="wantacc == 'true'"
                      class="row q-gutter-md justify-end q-ml-none q-mb-md"
                    >
                      <q-input
                        class="col-12 col-sm"
                        outlined
                        v-model="username"
                        :label="
                          lang == 'de'
                            ? 'Gewünschter Account-Name'
                            : 'Desired account name'
                        "
                        counter
                        maxlength="12"
                      >
                        <template v-slot:prepend>
                          <q-icon name="account_box"></q-icon>
                        </template>
                      </q-input>
                    </div>
                    <div
                      v-else
                      class="q-ml-md q-mt-none q-mb-md row items-center q-pa-sm"
                    >
                      <q-icon
                        name="warning"
                        color="orange-10"
                        class="col-auto"
                        size="sm"
                      ></q-icon>
                      <span class="col q-pl-sm">{{
                        lang == "de"
                          ? "Benutzen Sie für diese Option nur einen Public-Key auf dessen Private-Key Sie in Textform Zugriff haben. Verwenden Sie hier keinen Public-Key eines Ledger."
                          : "Use only a public key for this option whose private key you can access in text form. Therefore, do not use a public key of a Ledger here."
                      }}</span>
                    </div>
                    <div class="row q-gutter-md justify-end q-ml-none">
                      <q-input
                        class="col-12 col-sm"
                        outlined
                        v-model="userkey"
                        :label="
                          lang == 'de'
                            ? 'Ihr ' + paySymbol + '-Public-Key'
                            : 'Your ' + paySymbol + ' public key'
                        "
                      ></q-input>
                      <q-btn
                        class="col-auto"
                        outline
                        unelevated
                        icon-right="help_center"
                        :label="
                          lang == 'de'
                            ? 'Ich benötige einen Key'
                            : 'Need a key pair'
                        "
                        @click="createKeyDialog = true"
                      ></q-btn>
                    </div>
                  </div>
                </div>
              </div>
              <q-stepper-navigation>
                <q-btn
                  @click="checkStep1"
                  color="primary"
                  :label="lang == 'de' ? 'Weiter' : 'Continue'"
                  :disable="
                    hasacc == '' || (hasacc === 'false' && wantacc == '')
                  "
                  :loading="check1Loading"
                ></q-btn>
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="2"
              :title="lang == 'de' ? 'Zweck' : 'Purpose'"
              icon="lightbulb"
              :done="done2"
              :header-nav="step > 2"
            >
              <div class="q-gutter-lg">
                <div class="q-gutter-sm">
                  <div>
                    {{
                      lang == "de"
                        ? "Möchten Sie mit der Zahlung einen bestimmten Bereich von SavAct unterstützen?"
                        : "Do you want to support a specific area of SavAct with your payment?"
                    }}
                    <br />{{
                      lang == "de"
                        ? "(Dies beeinflusst nicht die Token-Ausgabe)"
                        : "(Does not effect the tokensale)"
                    }}
                  </div>
                  <div class="row q-mb-none">
                    <q-radio
                      class="col-6 col-sm-3 col-md-2 col-lg-1"
                      v-model="wantpurpose"
                      val="true"
                      :label="lang == 'de' ? 'Ja' : 'Yes'"
                    ></q-radio>
                    <q-radio
                      class="col-6 col-sm-3 col-md-2 col-lg-1"
                      v-model="wantpurpose"
                      val="false"
                      :label="lang == 'de' ? 'Nein' : 'No'"
                    ></q-radio>
                  </div>
                </div>
                <div class="row justify-between" v-if="wantpurpose == 'true'">
                  <div class="col-12">
                    <q-radio
                      v-model="specialpurpose"
                      val="0"
                      :label="
                        lang == 'de'
                          ? 'Generell für SavAct'
                          : 'Generally for SavAct'
                      "
                    ></q-radio>
                  </div>
                  <div class="col-12">
                    <q-radio
                      class="q-my-sm"
                      v-model="specialpurpose"
                      val="1"
                      :label="
                        lang == 'de'
                          ? 'SavAct-Zahlungen (Unabhängiger Betrugsschutz)'
                          : 'SavAct Payments (Independent fraud protection)'
                      "
                    ></q-radio>
                  </div>
                  <div class="col-12">
                    <q-radio
                      class="q-my-sm"
                      v-model="specialpurpose"
                      val="2"
                      :label="
                        lang == 'de'
                          ? 'SavAct-Abstimmungen (Das System um sich finanziell an Abstimmungsergebnisse zu binden)'
                          : 'SavAct Votings (The system to obey voteing results to get funds)'
                      "
                    ></q-radio>
                  </div>
                  <div class="col-12">
                    <q-radio
                      class="q-my-sm"
                      v-model="specialpurpose"
                      val="3"
                      :label="
                        lang == 'de'
                          ? 'SavWeb (Browser für dezentrale Webseiten)'
                          : 'SavWeb (Browser for decentralized websites)'
                      "
                    ></q-radio>
                  </div>
                  <div class="col-12">
                    <q-radio
                      v-model="specialpurpose"
                      val="4"
                      :label="
                        'SavAct Wallet App ' +
                        (lang == 'de'
                          ? '(Ergonomie und weitere Software-Tools)'
                          : '(Ergonomy and further software tools)')
                      "
                    ></q-radio>
                  </div>
                </div>
              </div>
              <q-stepper-navigation>
                <q-btn
                  @click="
                    () => {
                      done2 = true;
                      step = 3;
                    }
                  "
                  color="primary"
                  :label="lang == 'de' ? 'Weiter' : 'Continue'"
                  :disable="wantpurpose == ''"
                ></q-btn>
                <q-btn
                  flat
                  @click="step = 1"
                  color="primary"
                  :label="lang == 'de' ? 'Zurück' : 'Back'"
                  class="q-ml-sm"
                ></q-btn>
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="3"
              :title="lang == 'de' ? 'Menge' : 'Amount'"
              icon="monetization_on"
              :done="done3"
              :header-nav="step > 3"
            >
              <div class="q-gutter-lg">
                <q-input
                  outlined
                  v-model.number="payAmountPointed"
                  type="number"
                  :label="lang == 'de' ? 'Betrag' : 'Amount'"
                  :hint="'~' + estimateToken"
                >
                  <template v-slot:prepend>
                    <q-icon name="monetization_on"></q-icon>
                  </template>
                  <template v-slot:append>
                    <q-avatar>{{ paySymbol }}</q-avatar>
                  </template>
                </q-input>
                <q-input
                  outlined
                  v-model="coupon"
                  :label="lang == 'de' ? 'Coupon-Code' : 'Coupon code'"
                  :hint="
                    hascoupon && coupon.length > 0
                      ? (lang == 'de' ? 'Zusätzliche' : 'Added') +
                        '~' +
                        estimateExtraToken
                      : ''
                  "
                >
                  <template v-slot:prepend>
                    <q-icon name="stars"></q-icon>
                  </template>
                  <template v-slot:after>
                    <q-btn
                      round
                      dense
                      flat
                      icon="control_point"
                      @click="checkCoupon"
                    ></q-btn>
                  </template>
                </q-input>
              </div>
              <q-stepper-navigation>
                <q-btn
                  @click="checkStep3"
                  color="primary"
                  :label="lang == 'de' ? 'Weiter' : 'Continue'"
                  :disable="payAmountPointed <= 0"
                  :loading="check3Loading"
                ></q-btn>
                <q-btn
                  flat
                  @click="step = 2"
                  color="primary"
                  :label="lang == 'de' ? 'Zurück' : 'Back'"
                  class="q-ml-sm"
                ></q-btn>
              </q-stepper-navigation>
            </q-step>

            <q-step
              :name="4"
              :title="lang == 'de' ? 'Zahlung' : 'Payment'"
              icon="account_balance"
              :done="done4"
              :header-nav="step > 4"
            >
              <div class="q-gutter-md">
                <div class="q-gutter-sm">
                  <q-btn
                    color="primary"
                    icon="description"
                    label="White Paper"
                    @click="openURL('https://savact.com/wp_en.pdf')"
                  ></q-btn>
                  <q-btn
                    color="secondary"
                    icon="code"
                    label="Token Sale Contract"
                    @click="openURL('https://github.com/SavAct/TokenSale')"
                  ></q-btn>
                </div>
                <div class="q-gutter-sm">
                  <q-checkbox
                    v-model="gtcChecked"
                    :label="
                      lang == 'de'
                        ? 'Ich habe das SavAct-White-Paper vollständig gelesen. Ich akzeptiere, dass im Falle von Verlusten keine Entschädigung verlangt werden kann und dass SavAct-Token nach dem Algorithmus des SavAct-Tokensale-Contracts ausgegeben werden.'
                        : 'I have read the full SavAct White Paper. I accept that no compensation can be claimed in case of losses and that SavAct tokens are issued according to the algorithm of the SavAct Token Sale Contract.'
                    "
                  ></q-checkbox>
                </div>
                <div v-show="gtcChecked">
                  <div>
                    <div class="row">
                      <div class="col-12 col-md-8">
                        <div class="q-mt-sm">
                          {{
                            lang == "de"
                              ? "Verwenden Sie die folgenden Überweisungsdaten, wenn Sie über eine Tauschbörse teilnehmen möchten:"
                              : "Use the following transfer information if you wish to participate through an exchange:"
                          }}
                        </div>
                        <q-item
                          clickable
                          v-ripple
                          :active="activePayment"
                          active-class="bg-teal-1 text-grey-8"
                          @click="toClipboard(usedExchangeContract)"
                        >
                          <q-item-section class="payitemname" side
                            >Account</q-item-section
                          >
                          <q-item-section>{{
                            usedExchangeContract
                          }}</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="copy_all"></q-icon>
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          :active="activePayment"
                          active-class="bg-teal-1 text-grey-8"
                          @click="toClipboard(fund)"
                        >
                          <q-item-section class="payitemname" side
                            >Amount</q-item-section
                          >
                          <q-item-section>{{ fund }}</q-item-section>
                          <q-item-section avatar>
                            <q-icon name="copy_all"></q-icon>
                          </q-item-section>
                        </q-item>
                        <q-item
                          clickable
                          v-ripple
                          :active="activePayment"
                          active-class="bg-teal-1 text-grey-8"
                          @click="toClipboard(memo)"
                        >
                          <q-item-section class="payitemname" side
                            >Memo</q-item-section
                          >
                          <q-item-section class="full-width"
                            ><q-scroll-area
                              class="q-ma-none items-center"
                              :visible="true"
                              style="height: 35px"
                              ><div class="q-mt-sm items-center">
                                {{ memo }}
                              </div></q-scroll-area
                            ></q-item-section
                          >
                          <q-item-section avatar>
                            <q-icon name="copy_all"></q-icon>
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <q-stepper-navigation>
                <q-btn
                  class="q-mt-sm"
                  no-caps
                  color="primary"
                  @click="sendToFinish"
                  :label="
                    lang == 'de'
                      ? 'Die Zahlung alternativ mit einer Wallet absenden'
                      : 'Send the payment alternatively with a wallet'
                  "
                  :disable="!gtcChecked"
                ></q-btn>
                <q-btn
                  class="q-ml-sm q-mt-sm"
                  flat
                  @click="step = 3"
                  color="primary"
                  :label="lang == 'de' ? 'Zurück' : 'Back'"
                ></q-btn>
              </q-stepper-navigation>
            </q-step>
          </q-stepper>
        </div>
      </div>
      <div v-else>
        <q-spinner
          v-if="saleStatus != null"
          size="50px"
          color="primary"
        ></q-spinner>
        <div v-else class="text-center">
          {{
            lang == "de"
              ? "Warten Sie ein paar Sekunden, damit sich mit dem Sale verbunden werden kann. "
              : "Wait some seconds to connect to the sale."
          }}
          <a :href="browserLink + '#' + usedContract">{{
            lang == "de"
              ? "Wenn Sie gerade nicht die SavAct-App verwendest, dann klicke bitte hier."
              : "If you are not using the SavAct App than click here."
          }}</a>
        </div>
      </div>
    </div>
    <token-check></token-check>
    <gen-dialog v-model="createKeyDialog"></gen-dialog>
    <ledger-dialog v-model="ledDialog"></ledger-dialog>
  </q-page>
</template>
<script lang="ts">
import GenDialog from "../Components/GenDialog.vue";
import LedgerDialog from "../Components/LedgerDialog.vue";
import TokenCheck from "../Components/TokenCheck.vue";
import { state } from "../store/globals";
import {
  assetToString,
  checkName,
  checkNameExist,
  isValidPublic,
  showCongrat,
  showError,
  sleep,
  toClipboard,
} from "../Components/helpers";

interface Star {
  amount: bigint | string;
  user: string;
  mark: bigint | string;
  gain: bigint | string;
}

interface SaleStatus {
  id: bigint | string;
  start: number;
  started: boolean;
  frozen: boolean;
  release: boolean;
  sold: bigint | string;
  total: string;
  endprice: string;
  sp: bigint | string;
  stars: Array<Star>;
}

export default Vue.defineComponent({
  name: "indexPage",
  components: { GenDialog, LedgerDialog, TokenCheck },
  setup() {
    const coupon = state.coupon;

    const ledDialog = Vue.ref(false);
    const createKeyDialog = Vue.ref(false);

    const optionOpen = Vue.ref(false);

    const step = Vue.ref(1);
    const done1 = Vue.ref(false);
    const done2 = Vue.ref(false);
    const done3 = Vue.ref(false);
    const done4 = Vue.ref(false);
    const check1Loading = Vue.ref(false);
    const check3Loading = Vue.ref(false);
    const hasacc = Vue.ref("");
    const wantacc = Vue.ref("");
    const hascoupon = Vue.ref(false);
    const wantpurpose = Vue.ref("false");
    const specialpurpose = Vue.ref("0");
    const payAmountPointed = Vue.ref(1);
    const gtcChecked = Vue.ref(false);
    const username = Vue.ref("");
    const userkey = Vue.ref("");

    const saleStatus = Vue.ref<undefined | null | SaleStatus>(undefined);
    const saleStart = Vue.ref("");
    const saleDate = Vue.ref("");

    const activePayment = Vue.ref(false);

    const progress1 = Vue.ref(0);
    const lastPrice = Vue.ref<bigint>(BigInt(0));
    const progressLabel1 = Vue.computed(() => {
      return `Price: ${assetToString(
        lastPrice.value,
        state.payPrecision.value,
        state.paySymbol.value
      )}`;
    });

    function reset() {
      step.value = 1;
      done1.value = false;
      done2.value = false;
      done3.value = false;
      done4.value = false;
      hasacc.value = "";
      wantacc.value = "";
      hascoupon.value = false;
      wantpurpose.value = "false";
      specialpurpose.value = "0";
      payAmountPointed.value = 1;
      gtcChecked.value = false;
      coupon.value = "";
      username.value = "";
      userkey.value = "";
    }

    const fund = Vue.computed(() => {
      return `${payAmountPointed.value.toFixed(state.payPrecision.value)} ${
        state.paySymbol.value
      }`;
    });

    const memo = Vue.computed(() => {
      let m;
      if (gtcChecked.value) {
        if (hasacc.value === "true") {
          m = username.value;
        } else if (wantacc.value === "true") {
          m = username.value;
          if (wantacc.value === "true") {
            m += "-" + userkey.value;
          }
        } else {
          m = userkey.value;
        }

        if (coupon.value.length > 0) {
          m += "#" + coupon.value;
        }
        if (specialpurpose.value !== "0" && wantpurpose.value == "true") {
          m += "@" + specialpurpose.value;
        }
        return m;
      }
      return "";
    });

    let pP = {
      sp: 0n,
      ct: 0n,
      a: 0,
      k: 0,
      s: 0n,
      tt: 0n,
      epA: 0n,
      p: 0,
    };
    let stars: Array<Star> | null = null;

    let runningSaleId = 0;
    async function checkSaleState(progressDelay = 0) {
      await sleep(progressDelay);
      const rStatus = await savWeb.getTableRows(
        state.usedChain,
        state.usedContract,
        "stat",
        state.usedContract,
        0
      );
      if (rStatus == undefined) {
        showError(
          state.lang.value == "de"
            ? "Die Verbindung zum Sale konnte nicht hergestellt werden."
            : "Unable to connect to the sale."
        );
        return;
      }
      if (
        "frozen" in rStatus &&
        "sold" in rStatus &&
        "start" in rStatus &&
        "total" in rStatus &&
        "endprice" in rStatus &&
        "sp" in rStatus
      ) {
        saleStatus.value = rStatus;
        runningSaleId++;
        progress1.value = 0;

        // Get end price amount, payment symbol and precision
        const endPrice = getAssetFromString(rStatus.endprice);
        const totalToken = getAssetFromString(rStatus.total);
        if (endPrice === undefined || totalToken === undefined) {
          showError(
            state.lang.value == "de"
              ? "Fehler beim Abrufen der Sale-Daten."
              : "Error on requesting the sale data.."
          );
          return;
        }
        state.payPrecision.value = endPrice.precision;
        state.paySymbol.value = endPrice.symbol;
        // Get total token amount, token symbol and precision
        state.conPrecision.value = totalToken.precision;
        state.conSymbol.value = totalToken.symbol;

        // Calculate parameters to descripe the linear chart
        pP.sp = BigInt(rStatus.sp); // Start price as bigint amount
        // let sp_Number = Number(pP.sp) / Math.pow(10, payPrecision.value);
        pP.a = Number(endPrice.amount - pP.sp) / Number(totalToken.amount); // Gradient of the linear function for integral calculation
        pP.k = 2.0 / (pP.a / Math.pow(10, state.payPrecision.value)); // Parameter for integral calculation
        pP.s = BigInt(Math.floor(Number(pP.sp) / pP.a)); // Parameter for integral calculation
        pP.ct = BigInt(rStatus.sold); // Sold token amount
        pP.tt = totalToken.amount; // Total amount of token
        pP.epA = endPrice.amount; // End price as bigint amount
        pP.p = Number(pP.ct) / Number(pP.tt); // Fraction of sold token

        // Get the milestones form the stars for the progressbar
        stars = "stars" in rStatus ? rStatus.stars : null;

        // Show last price
        lastPrice.value = calcLastPrice();

        let restTime = updateSaleStartTime(); // Update remaining time each second until token sale starts
        if (restTime === undefined) {
          console.log("Unexpected sale status. It is undefined.");
          return;
        }
        if (restTime !== false) {
          // Show sale date and wait until the start date
          saleDate.value = new Date(rStatus.start * 1000).toString().substr(4);
          console.log(`Check the sale state again in ${restTime} ms.`);
          setTimeout(() => {
            checkSaleState(Math.random() * 30000);
          }, restTime); // Check the state of the sale and start the progressbar. Wait a random number for the request to reduce the load of a single endpoint
        } else {
          // Start progressbar
          if (pP.p < 1) {
            // setTimeout(()=>{ runningSale(runningSaleId) }, progressDelay)
            runningSale(runningSaleId);
          } else {
            progress1.value = 1;
          }
        }
      } else {
        saleStatus.value = null;
      }
    }

    function calcLastPrice() {
      return BigInt(Math.floor(pP.a * Number(pP.ct) + Number(pP.sp)));
    }

    function getAssetFromString(assetStr: string) {
      const assetVec = assetStr.split(" ");
      if (assetVec.length != 2) {
        return undefined;
      }
      const pIndex = assetVec[0].indexOf(".") + 1;

      return {
        amount: BigInt(assetVec[0].replace(".", "")),
        precision: pIndex > 0 ? assetVec[0].length - pIndex : 0,
        symbol: assetVec[1],
      };
    }

    const estimateAmount = Vue.computed(() => {
      const p =
        Number(
          Number(payAmountPointed.value).toFixed(state.payPrecision.value)
        ) * Math.pow(10, state.payPrecision.value);
      const oldS = Number(pP.ct + pP.s);
      let newSoldTotal =
        BigInt(Math.floor(Math.sqrt(pP.k * p + oldS * oldS))) - pP.s;

      return newSoldTotal - pP.ct;
    });

    const estimateToken = Vue.computed(() => {
      return assetToString(
        estimateAmount.value,
        state.conPrecision.value,
        state.conSymbol.value
      );
    });

    const estimateExtraToken = Vue.computed(() => {
      return assetToString(
        (estimateAmount.value * 5n) / 100n,
        state.conPrecision.value,
        state.conSymbol.value
      );
      return "";
    });

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
            userkey.value = userkey.value.trim();
            if (
              userkey.value.length > 3 &&
              userkey.value.substr(0, 3) != "EOS"
            ) {
              showError(
                state.lang.value == "de"
                  ? "Nur Public-Keys die mit EOS anfangen sind erlaubt."
                  : "Only public keys beginning with EOS are accepted."
              );
              return;
            }
            if (!isValidPublic(userkey.value)) {
              showError(
                state.lang.value == "de"
                  ? "Ungültiger Public-Key."
                  : "Invalid public key."
              );
              return;
            }
            if (wantacc.value === "true") {
              if (username.value.length != 12) {
                showError(
                  state.lang.value == "de"
                    ? "Der Name muss genau 12 Zeichen lang sein."
                    : "The name has to be 12 characters long."
                );
                return;
              } else if (username.value.indexOf(".") > -1) {
                showError(
                  state.lang.value == "de"
                    ? "Punkte sind bei der Erstellung eines neuen Accounts nicht erlaubt."
                    : "Dots are not allowed for new account creation."
                );
                return;
              }
              let existName = await checkNameExist(username.value);
              if (existName === true) {
                showError(
                  state.lang.value == "de"
                    ? `Der Name ${username.value} ist bereits vergeben.`
                    : `The name ${username.value} already exists.`
                );
                return;
              } else if (existName === null) {
                return;
              }
            }
          }

          done1.value = true;
          step.value = 2;
        }
      })();
      check1Loading.value = false;
    }

    async function validateCoupon() {
      coupon.value = coupon.value.trim();
      if (coupon.value.length > 0) {
        if (coupon.value.length === 53) {
          if (hasacc.value === "false" && coupon.value == userkey.value) {
            showError(
              state.lang.value == "de"
                ? "Hier kann nicht die eigene Adresse verwendet werden."
                : "Can not use youreself."
            );
            return false;
          }
          if (isValidPublic(coupon.value)) {
            showCongrat(
              state.lang.value == "de"
                ? "Glückwunsch, Sie erhalten +5% mehr Token!"
                : "Congratulation, you get +5% more tokens!"
            );
            return true;
          }
        } else if (coupon.value.length <= 12) {
          if (
            (hasacc.value === "true" || wantacc.value === "true") &&
            coupon.value == username.value
          ) {
            showError(
              state.lang.value == "de"
                ? "Hier können Sie nicht den eigenen Accout-Namen verwenden."
                : "Can not use youreself."
            );
            return false;
          }
          if ((await checkName(coupon.value)) === true) {
            showCongrat(
              state.lang.value == "de"
                ? "Glückwunsch, Sie erhalten +5% mehr Token!"
                : "Congratulation, you get +5% more tokens!"
            );
            return true;
          }
          return false;
        }
        showError(
          state.lang.value == "de"
            ? "Ungültiger Coupon-Code."
            : "Invalid coupon code."
        );
        coupon.value = "";
        return false;
      }
      return undefined;
    }
    async function checkCoupon() {
      const r = await validateCoupon();
      hascoupon.value = r === true ? true : false;
      return r;
    }

    async function checkStep3() {
      check3Loading.value = true;
      // Check coupon
      const result = await checkCoupon();
      if (result === false) {
        check3Loading.value = false;
        return;
      }
      // Check amount
      if (
        hasacc.value == "false" &&
        wantacc.value == "true" &&
        payAmountPointed.value < 10
      ) {
        showError(
          state.lang.value == "de"
            ? "Der Mindestbetrag, um Token zu erhalten und gleichzeitig ein neues Konto zu erstellen, beträgt 10 EOS."
            : "The minimum amount to receive tokens and create a new account at the same time is 10 EOS."
        );
      } else if (payAmountPointed.value >= 0.1) {
        done3.value = true;
        step.value = 4;
      } else {
        showError(
          state.lang.value == "de"
            ? "Die Mindestmenge beträgt 0.1 EOS."
            : "Minimum amount is 0.1 EOS."
        );
      }
      check3Loading.value = false;
    }

    const savWeb = state.savWeb;

    function sendToFinish() {
      done4.value = true;
      savWeb.payment(
        state.usedChain,
        state.usedContract,
        fund.value,
        memo.value
      );
    }

    function getCurrentTimeStamp() {
      return Math.floor(Date.now() / 1000);
    }

    function updateSaleStartTime() {
      if (saleStatus.value == undefined) {
        return undefined;
      }
      const timespan = saleStatus.value.start - getCurrentTimeStamp();
      if (timespan > 0) {
        let diff = timespan;
        const days = Math.floor(diff / 86400);
        diff -= days * 86400;

        const hours = Math.floor(diff / 3600);
        diff -= hours * 3600;

        const mins = Math.floor(diff / 60);
        diff -= mins * 60;

        const seconds = Math.floor(diff);

        const daysStr =
          days > 1
            ? `${days} ${state.lang.value == "de" ? "Tagen und" : "days and"}`
            : `${days} ${state.lang.value == "de" ? "Tag und" : "day and"}`;
        saleStart.value = `${days > 0 ? daysStr : ""} ${String(hours).padStart(
          2,
          "0"
        )}:${String(mins).padStart(2, "0")}:${String(seconds).padStart(
          2,
          "0"
        )}`;

        setTimeout(updateSaleStartTime, 1000);
        return timespan;
      } else {
        saleStart.value = ""; // Set sale status as started
        return false;
      }
    }

    function runningSale(id: number) {
      if (runningSaleId != id) {
        return;
      }
      if (stars != null) {
        let v = null;
        for (let s of stars) {
          let currentGoal = BigInt(s.mark);
          if ((currentGoal * 9n) / 10n > pP.ct) {
            v = Number(pP.ct) / Number(currentGoal);
            console.log(
              `${v * 100}% of the next step to ${currentGoal} is reached.`
            );
            break;
          }
        }
        progress1.value = v != null ? v : pP.p;
      }
    }

    // Check sale state as soon it is connected
    Vue.watch(
      state.savWeb.initialized,
      (value) => {
        if (value) {
          console.log("Initial check sale state");
          checkSaleState(0);
        }
      },
      { immediate: true }
    );

    return {
      isIndex: state.isIndex,
      createKeyDialog,
      ledDialog,
      checkSaleState,
      optionOpen,
      progress1,
      progressLabel1,
      paySymbol: state.paySymbol,
      estimateToken,
      estimateExtraToken,
      saleStatus,
      saleStart,
      saleDate,
      step,
      done1,
      done2,
      done3,
      done4,
      check1Loading,
      check3Loading,
      sendToFinish,
      reset,
      hasacc,
      wantacc,
      gtcChecked,
      wantpurpose,
      specialpurpose,
      payAmountPointed,
      usedContract: state.usedContract,
      usedExchangeContract: state.usedExchangeContract,
      memo,
      fund,
      userkey,
      username,
      coupon,
      checkStep1,
      checkStep3,
      checkCoupon,
      activePayment,
      toClipboard,
      openURL: Quasar.openURL,
      hascoupon,
      browserLink: state.browserLink,
      lang: state.lang,
      darkStyle: state.darkStyle,
    };
  },
});
</script>
