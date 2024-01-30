<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="col-12 col-sm-10 text-h6 q-pb-md">
          {{ title }}
        </div>
        <div class="col-12 col-sm-2 q-pb-md row justify-end items-end">
          <div class="col-auto">
            <raw-data-btn
              icon="raw_off"
              round
              size="sm"
              color="blue"
              :raw-data="raw"
              :pub-recipient="seller?.pgp"
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

      <q-input class="q-mt-md" readonly :model-value="selectedContect?.value">
        <template v-slot:before>
          <q-select
            label="Contact"
            outlined
            v-model="selectedContect"
            :options="contactOptions"
          ></q-select>
        </template>
        <template v-slot:append>
          <q-btn
            v-show="showSend"
            round
            icon="content_copy"
            @click="
              copy(
                selectedContect?.value,
                'Copy ' + selectedContect?.label + ' address to clipboard'
              )
            "
          ></q-btn>
        </template>
        <template v-slot:after>
          <q-btn
            v-show="showSend"
            class="plopOnShow"
            round
            icon="send"
            color="blue"
            @click="
              selectedContect !== undefined
                ? openLinkOrMail(selectedContect.value)
                : undefined
            "
          ></q-btn>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import RawDataBtn from "../RawDataBtn.vue";
import { PropType } from "vue";
import { copy } from "../QuasarHelpers";
import {
  messengerShortName,
  openLinkOrMail,
  urlStartByDomainName,
} from "../LinkConverter";
import { UserTable } from "../ContractInterfaces";

export default Vue.defineComponent({
  name: "buyStep24SendData",
  emits: ["update:contact"],
  components: {
    RawDataBtn,
  },
  props: {
    title: {
      type: String,
      required: true,
      default: "",
    },
    raw: {
      type: String,
      required: true,
      default: "",
    },
    encrypted: {
      type: String,
      required: true,
      default: "",
    },
    seller: {
      type: Object as PropType<UserTable>,
      required: true,
      default: undefined,
    },
    contact: {
      type: Object as PropType<{ label: string; value: string }>,
      required: false,
      default: undefined,
    },
  },
  setup(props, context) {
    const contactOptions = Vue.computed(() => {
      // Get shown name for each contact
      return props.seller?.contact.map((c) => {
        const sN = messengerShortName(urlStartByDomainName(c));
        return {
          label: sN,
          value: c,
        };
      });
    });

    const _selectedContect = Vue.ref<{ label: string; value: string }>();
    if (props.contact) {
      _selectedContect.value = {
        value: props.contact.value,
        label: props.contact.label,
      };
    }
    const selectedContect = Vue.computed({
      get() {
        return _selectedContect.value;
      },
      set(value) {
        console.log("selected", value);

        _selectedContect.value = value;
        context.emit("update:contact", value);
        plopAnimation();
      },
    });

    const showSend = Vue.ref(selectedContect.value !== undefined);
    function plopAnimation() {
      showSend.value = false;
      setTimeout(() => {
        showSend.value = true;
      }, 100);
    }

    return {
      copy,
      contactOptions,
      selectedContect,
      openLinkOrMail,
      showSend,
    };
  },
});
</script>
