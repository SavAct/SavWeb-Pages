<template>
  <q-page class="column">
    <q-stepper class="col q-pa-md" v-model="step" animated active-color="blue">
      <q-step
        :name="1"
        prefix="1"
        :done="step > 1"
        title="Contact Seller"
        active-icon="mail"
      >
        [Product and seller details lable]<br />
        [Enter your name]<br />
        [Enter your key if not online else expandable key lable]<br />
        [Enter your address data]
      </q-step>

      <q-step
        :name="2"
        prefix="2"
        :done="step > 2"
        title="Send Payment"
        active-icon="currency_bitcoin"
      >
        [Enter sellers antwort]<br />
        [If it is encrypted, enter your private key to decrypt]<br />
        <!-- [Checkbox]<br /> -->
        [Send payment]=>[Wait for it]=>Step 3
      </q-step>

      <q-step
        :name="3"
        prefix="3"
        :done="step > 3"
        title="Inform Seller"
        active-icon="mark_email_read"
      >
        Send the seller the link of your transaction and store it for
        yourself.<br />
        [Encrypt]<br />
      </q-step>

      <!-- <template v-slot:default> Wait for delivery </template> -->
      <q-step :name="4" title="Finish" active-icon="local_shipping">
        Wait for the delivery.<br /><br />

        <div>Finalize the payment, if you receive the item.</div>
        <div>
          Burn the payment shortly before the time limit ends, if you do not got
          the item.
        </div>

        [Timer]<br />
        [Open your payment] [Sellers antwort]<br />
        [Checkbox]<br />
        [Send payment]
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            v-if="step > 1"
            outline
            color="deep-orange"
            @click="backStep"
            label="Back"
            icon="arrow_back_ios"
          />
          <q-btn
            v-if="step <= 3"
            :class="{ 'q-ml-sm': step > 1 }"
            class="q-pr-sm"
            outline
            @click="nextStep"
            color="blue"
            :label="step === 4 ? 'Finish' : 'Continue'"
            icon-right="arrow_forward_ios"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-page>
</template>
<script lang="ts">
import { Entry } from "../Components/Items";
import { state } from "../store/globals";

export default Vue.defineComponent({
  components: {},
  name: "buyPage",
  setup() {
    // TODO: Buy item by query
    const id = 1;
    const regionName = new Intl.DisplayNames(["en"], { type: "region" });
    const entry = Vue.ref<Entry>();
    entry.value = state.itemsList.find((item) => item.id == id);

    const pieces = Vue.ref<number>(1);

    const step = Vue.ref<number>(1);

    function nextStep() {
      if (step.value < 4) step.value++;
    }

    function backStep() {
      if (step.value > 1) step.value--;
    }

    function getRegion(code: string) {
      const c = regionName.of(code);
      if (c !== undefined) {
        return c;
      } else {
        switch (code) {
          case "ww":
            return "World Wide";
        }
      }
      return undefined;
    }

    function getRegions(r: string) {
      return r !== undefined
        ? r
            .split(" ")
            .map((v) => getRegion(v))
            .join(", ")
        : undefined;
    }

    return {
      progress: state.progress,
      darkStyle: state.darkStyle,
      entry,
      getRegions,
      step,
      nextStep,
      backStep,
      pieces,
    };
  },
});
</script>
