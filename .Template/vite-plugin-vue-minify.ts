import { Plugin } from "vite";
import { minify, Options } from "html-minifier-terser";

export function MinifyVue(options?: Options): Plugin {
  return {
    name: "vite-plugin-vue-html-minify",
    enforce: "post",
    apply: "build",
    transform(code, id) {
      if (id.endsWith(".vue")) {
        return minify(code, options);
      }
    },
  };
}

export default MinifyVue;
