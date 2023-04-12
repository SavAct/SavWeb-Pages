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
            @click="openLink"
          ></q-btn>
        </template>
      </q-input>
    </q-card-section>
  </q-card>
</template>
<script lang="ts">
import RawDataBtn from "../RawDataBtn.vue";
import { PropType } from "vue";
import { Seller } from "../Items";
import { copy } from "../QuasarHelpers";
import { state } from "../../store/globals";
import { SavWeb } from "../SavWeb";

export default Vue.defineComponent({
  name: "buyStep2",
  emits: ["update:contact"],
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
    seller: {
      type: Object as PropType<Seller>,
      requier: true,
      default: undefined,
    },
    contact: {
      type: Object as PropType<{ label: string; value: string }>,
      requier: false,
      default: undefined,
    },
  },
  setup(props, context) {
    function isValidEmail(email: string) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    }

    const contactOptions = Vue.computed(() => {
      // Get shown name for each contact
      return props.seller?.contact.map((c) => {
        let label = c.startsWith("https://")
          ? c.substring(8)
          : c.startsWith("http://")
          ? c.substring(7)
          : c;
        if (label.startsWith("www.")) {
          label = label.substring(4);
        }
        const found = state.messengers.find((m) => {
          return label.startsWith(m.link);
        });
        if (found) {
          label = found.name;
        } else if (isValidEmail(label)) {
          let s = label.indexOf("@");
          if (s) {
            s++;
            const e = label.indexOf(".", s);
            if (e) label = label.substring(s, e);
          }
        }
        return {
          label,
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

    function openLink() {
      if (selectedContect.value) {
        let link = selectedContect.value.value;
        if (!link.startsWith("https://") && !link.startsWith("mailto:")) {
          if (link.startsWith("http://")) {
            link = "https://" + link.substring(7);
          } else if (isValidEmail(link)) {
            link = "mailto:" + link;
          } else {
            link = "https://" + link;
          }
        }
        SavWeb.goTo(link, "_blank");
      }
    }

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
      openLink,
      showSend,
    };
  },
});
</script>
