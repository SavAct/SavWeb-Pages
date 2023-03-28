<template>
  <div>
    <q-btn v-bind="$attrs" icon="settings" @click="show = true"></q-btn>
    <q-dialog v-model="show">
      <q-card class="bg-teal text-white" style="width: 400px">
        <q-card-section>
          <div class="text-h6">Decrypted raw data</div>
        </q-card-section>
        <q-card-section class="q-pt-none row justify-between">
          <div class="text-h6 text-bold col-auto">
            Do not send it to anyone!
          </div>
          <div class="col-grow row justify-end">
            <q-btn
              round
              color="blue"
              size="sm"
              class="float-right"
              @click="copy(rawData)"
              icon="content_copy"
            ></q-btn>
          </div>
          <q-input
            class="q-mt-sm col-12"
            type="textarea"
            label="Private PGP Key"
            readonly
            outlined
            text-color="white"
            :model-value="rawData"
          ></q-input>
        </q-card-section>
        <q-card-actions align="right" class="bg-white text-teal">
          <q-btn flat label="Back" @click="show = false" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script lang="ts">
export default Vue.defineComponent({
  name: "rawDataBtn",
  props: {
    rawData: {
      type: String,
      requier: true,
      defaut: "",
    },
  },
  setup(_props) {
    const show = Vue.ref<boolean>(false);

    async function copy(text: string | undefined) {
      if (text !== undefined) {
        try {
          await Quasar.copyToClipboard(text);

          Quasar.Notify.create({
            type: "positive",
            message: "Copy raw data to clipboard",
            caption: "Do not send it to anyone!",
            position: "top",
          });
          return;
        } catch (e) {}
      }
      Quasar.Notify.create({
        type: "negative",
        message: "Cannot copy to clipboard",
        position: "top",
      });
    }

    return {
      show,
      copy,
    };
  },
});
</script>
