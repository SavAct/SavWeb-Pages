import { defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import inlineVuePlugin from "./inline-vue-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    inlineVuePlugin(),
    viteSingleFile({ removeViteModuleLoader: true }),
  ],
});
