<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="col-auto text-h6 q-pb-md">
          Send the seller your encrypted data
        </div>
        <div class="col-grow q-pb-md row justify-end">
          <div class="col-auto">
            <raw-data-btn
              icon="raw_off"
              round
              size="sm"
              color="blue"
              :raw-data="raw"
              :pub-recipient="pubPgp"
            ></raw-data-btn>
          </div>
          <div class="col-auto">
            <q-btn
              round
              color="blue"
              size="sm"
              class="q-ml-sm"
              @click="copy(encrypted, 'Copy PGP message to clipboard')"
              icon="content_copy"
            ></q-btn>
          </div>
        </div>
      </div>
      <q-input
        type="textarea"
        readonly
        :model-value="encrypted"
        outlined
        label="Encrypted data"
      ></q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import { copy } from "../QuasarHelpers";
import RawDataBtn from "../RawDataBtn.vue";

export default Vue.defineComponent({
  name: "buyStep2",
  components: {
    RawDataBtn,
  },
  props: {
    raw: {
      type: String,
      requier: true,
      default: "",
    },
    encrypted: {
      type: String,
      requier: true,
      default: "",
    },
    pubPgp: {
      type: String,
      requier: true,
      default: "",
    },
  },
  setup() {
    return {
      copy,
    };
  },
});
</script>
