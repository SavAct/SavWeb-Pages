<template>
  <div>
    <q-btn
      label="Create new PGP key"
      @click="show = true"
      :disable="disable"
    ></q-btn>
    <q-dialog v-model="show" persistent>
      <q-card class="bg-teal text-white" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Generate Private PGP Key</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <div class="row justify-between">
            <div class="col-8">
              <q-btn
                rounded
                size="sm"
                color="blue"
                label="Generate new key"
                @click="generate"
                icon="restart_alt"
              ></q-btn>
            </div>
            <div class="col-2">
              <q-btn
                round
                color="blue"
                size="sm"
                class="float-right"
                @click="copy(privatePGP)"
                icon="content_copy"
              ></q-btn>
            </div>
          </div>
          <q-input
            class="q-mt-sm"
            type="textarea"
            label="Private PGP Key"
            readonly
            outlined
            text-color="white"
            :model-value="privatePGP"
          ></q-input>
          <q-checkbox
            class="q-mt-md"
            v-model="checkSafe"
            label="I use this key at my own risk. I have stored it at a private and secure place."
          ></q-checkbox>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn
            flat
            color="red"
            label="Cancel"
            @click="show = false"
            v-close-popup
          ></q-btn>
          <q-btn
            flat
            color="green"
            :disable="!checkSafe"
            @click="confirm"
            label="Use this key"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
export default Vue.defineComponent({
  name: "addPgp",
  emits: ["pub-pgp"],
  props: {
    modelValue: {
      type: Boolean,
      requier: false,
      defaut: false,
    },
    disable: {
      type: Boolean,
      requier: false,
      defaut: false,
    },
  },
  setup(_props, context) {
    const show = Vue.ref<boolean>(false);
    const checkSafe = Vue.ref<boolean>(false);
    const privatePGP = Vue.ref<string>("");
    const publicPGP = Vue.ref<string>("");

    function generate() {
      // TODO: Generate PGP key https://github.com/openpgpjs/openpgpjs
      privatePGP.value = "Private-PGP----Templalate-----";
      publicPGP.value = "Public-PGP----Templalate-----";
    }
    generate();

    function confirm() {
      context.emit("pub-pgp", publicPGP.value);
      show.value = false;
    }

    function copy(text: string) {
      Quasar.copyToClipboard(text)
        .then(() => {
          Quasar.Notify.create({
            type: "positive",
            message: "Copy to clipboard",
            caption: text,
            position: "top",
          });
        })
        .catch(() => {
          Quasar.Notify.create({
            type: "negative",
            message: "Cannot copy to clipboard",
            position: "top",
          });
        });
    }
    return {
      show,
      checkSafe,
      privatePGP,
      publicPGP,
      generate,
      confirm,
      copy,
    };
  },
});
</script>
