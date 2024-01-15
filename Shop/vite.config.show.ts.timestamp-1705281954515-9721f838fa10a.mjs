// vite-plugin-inline-vue.ts
import ts from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/typescript/lib/typescript.js";
import { parse } from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js";
var configFileName = ts.findConfigFile(
  "./",
  ts.sys.fileExists,
  "tsconfig.json"
);
var configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
var configJson = configFile.config;
var parsedConfig = ts.parseJsonConfigFileContent(configJson, ts.sys, "./");
function getVueParts(file2) {
  const a = parse(file2);
  return {
    template: a.descriptor.template.content,
    script: a.descriptor.script.content,
    style: a.descriptor.styles
  };
}
function VueFileToTs(file2) {
  const { template, script, style } = getVueParts(file2);
  if (style !== void 0 && style.length > 0) {
    throw "This version does not work with style tag in .vue-files";
  }
  if (template !== void 0 && template.length > 0 && template.includes("`")) {
    throw "This version does not work with the backtick sign (`) within <template>. Instead, use the single quote sign (') or use a function within the <script> that uses the backtick.";
  }
  let s = -1;
  if (script !== void 0) {
    let l = -1;
    do {
      s = script.indexOf("Vue.");
      l = s;
      if (s >= 0) {
        s = script.indexOf("Component", s + 4);
        l = s - l;
        if (s >= 0) {
          s = script.indexOf("(", s + 9);
          if (s >= 0) {
            s = script.indexOf("{", s + 1);
          }
        }
      }
    } while (l > 14);
    if (s > -1) {
      if (template !== void 0) {
        return `${script.substring(
          0,
          s + 1
        )}template:\`${template}\`,${script.substring(s + 1)}`;
      } else {
        return script;
      }
    } else {
      if (template !== void 0) {
        return `export default Vue.defineComponent({
        template: \`${template}\`,
        setup() {
          return {};
        },
      }); ${script}`;
      } else {
        return script;
      }
    }
  } else {
    if (template !== void 0) {
      return `export default Vue.defineComponent({
      template: \`${template}\`,
      setup() {
        return {};
      },
    });`;
    } else {
      return "";
    }
  }
}
var InlineVue = () => {
  return {
    name: "vue",
    async transform(code, id) {
      if (id.endsWith(".vue")) {
        const transformedCode = VueFileToTs(code);
        const transpiled = ts.transpileModule(transformedCode, {
          compilerOptions: parsedConfig.options
        });
        return {
          code: transpiled.outputText,
          map: transpiled.sourceMapText
        };
      }
    }
  };
};
var vite_plugin_inline_vue_default = InlineVue;

// vite-plugin-vue-minify.ts
import { minify } from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/html-minifier-terser/src/htmlminifier.js";
function MinifyVue(options) {
  return {
    name: "vite-plugin-vue-html-minify",
    apply: "build",
    transform(code, id) {
      if (id.endsWith(".vue")) {
        return minify(code, options);
      }
    }
  };
}
var vite_plugin_vue_minify_default = MinifyVue;

// vite.config.show.ts
import express from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/express/index.js";
import { defineConfig } from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/vite/dist/node/index.js";
import { viteSingleFile } from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/vite-plugin-singlefile/dist/esm/index.js";
import { ViteMinifyPlugin } from "file:///C:/Users/Ich/GitHub/SavWeb-Pages/Shop/node_modules/vite-plugin-minify/dist/index.js";
import { createServer } from "http";
import { join } from "path";
import { spawn } from "child_process";
var __vite_injected_original_dirname = "C:\\Users\\Ich\\GitHub\\SavWeb-Pages\\Shop";
var folder = "/savact.app";
var file = "index.html";
var port = 8e3;
var vite_config_show_default = defineConfig(() => {
  let plugins = [];
  let neededPlugins = [
    vite_plugin_inline_vue_default(),
    viteSingleFile({ removeViteModuleLoader: true })
  ];
  if (process.argv.includes("--dev") || process.argv.includes("-d")) {
    plugins = neededPlugins;
  } else {
    let devPlugins = [
      ViteMinifyPlugin({ collapseWhitespace: true }),
      vite_plugin_vue_minify_default({
        collapseWhitespace: true,
        removeAttributeQuotes: false,
        keepClosingSlash: true
      })
    ];
    plugins = [...devPlugins, ...neededPlugins];
  }
  return {
    plugins
  };
});
if (process.env.NODE_ENV != "production") {
  throw new Error("This config needs the production mode");
}
var app = express();
var httpServer = createServer(app);
var open = process.platform === "win32" ? "start" : "open";
app.use(express.static(join(__vite_injected_original_dirname)));
app.get("/", (req, res) => {
  res.sendFile(join(__vite_injected_original_dirname, `${folder}/${file}`));
});
httpServer.listen(8e3, () => {
  const url = `http://localhost:${port}/savact.app#_browser_`;
  console.info("Server runs on", url);
  spawn(open, [url], { shell: true });
});
export {
  vite_config_show_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS1wbHVnaW4taW5saW5lLXZ1ZS50cyIsICJ2aXRlLXBsdWdpbi12dWUtbWluaWZ5LnRzIiwgInZpdGUuY29uZmlnLnNob3cudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJY2hcXFxcR2l0SHViXFxcXFNhdldlYi1QYWdlc1xcXFxTaG9wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJY2hcXFxcR2l0SHViXFxcXFNhdldlYi1QYWdlc1xcXFxTaG9wXFxcXHZpdGUtcGx1Z2luLWlubGluZS12dWUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0ljaC9HaXRIdWIvU2F2V2ViLVBhZ2VzL1Nob3Avdml0ZS1wbHVnaW4taW5saW5lLXZ1ZS50c1wiO2ltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB0cyBmcm9tIFwidHlwZXNjcmlwdFwiO1xyXG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gXCJAdnVlL2NvbXBpbGVyLXNmY1wiO1xyXG5cclxuLyogVGhpcyBQbHVnSW4gY29udmVydHMgYSBWdWUgZmlsZSB3aXRoIFR5cGVTY3JpcHQgdG8gYSBwdXJlIEphdmFTY3JpcHQgZmlsZS4gKi9cclxuXHJcbmNvbnN0IGNvbmZpZ0ZpbGVOYW1lID0gdHMuZmluZENvbmZpZ0ZpbGUoXHJcbiAgXCIuL1wiLFxyXG4gIHRzLnN5cy5maWxlRXhpc3RzLFxyXG4gIFwidHNjb25maWcuanNvblwiXHJcbik7IC8vIEF1dG9tYXRpYyBkZXRlY3Rpb24gb2YgdGhlIHRzY29uZmlnLmpzb24gZmlsZVxyXG5cclxuLy8gUmVhZGluZyB0aGUgdHNjb25maWcuanNvbiBmaWxlXHJcbmNvbnN0IGNvbmZpZ0ZpbGUgPSB0cy5yZWFkQ29uZmlnRmlsZShjb25maWdGaWxlTmFtZSwgdHMuc3lzLnJlYWRGaWxlKTtcclxuY29uc3QgY29uZmlnSnNvbiA9IGNvbmZpZ0ZpbGUuY29uZmlnO1xyXG5cclxuLy8gUGFyc2luZyB0aGUgY29tcGlsZXIgb3B0aW9ucyBmcm9tIHRoZSB0c2NvbmZpZy5qc29uXHJcbmNvbnN0IHBhcnNlZENvbmZpZyA9IHRzLnBhcnNlSnNvbkNvbmZpZ0ZpbGVDb250ZW50KGNvbmZpZ0pzb24sIHRzLnN5cywgXCIuL1wiKTtcclxuXHJcbmZ1bmN0aW9uIGdldFZ1ZVBhcnRzKGZpbGU6IHN0cmluZykge1xyXG4gIGNvbnN0IGEgPSBwYXJzZShmaWxlKTtcclxuICByZXR1cm4ge1xyXG4gICAgdGVtcGxhdGU6IGEuZGVzY3JpcHRvci50ZW1wbGF0ZS5jb250ZW50LFxyXG4gICAgc2NyaXB0OiBhLmRlc2NyaXB0b3Iuc2NyaXB0LmNvbnRlbnQsXHJcbiAgICBzdHlsZTogYS5kZXNjcmlwdG9yLnN0eWxlcyxcclxuICB9O1xyXG59XHJcblxyXG5mdW5jdGlvbiBWdWVGaWxlVG9UcyhmaWxlOiBzdHJpbmcpIHtcclxuICBjb25zdCB7IHRlbXBsYXRlLCBzY3JpcHQsIHN0eWxlIH0gPSBnZXRWdWVQYXJ0cyhmaWxlKTtcclxuXHJcbiAgaWYgKHN0eWxlICE9PSB1bmRlZmluZWQgJiYgc3R5bGUubGVuZ3RoID4gMCkge1xyXG4gICAgdGhyb3cgXCJUaGlzIHZlcnNpb24gZG9lcyBub3Qgd29yayB3aXRoIHN0eWxlIHRhZyBpbiAudnVlLWZpbGVzXCI7XHJcbiAgfVxyXG5cclxuICBpZiAodGVtcGxhdGUgIT09IHVuZGVmaW5lZCAmJiB0ZW1wbGF0ZS5sZW5ndGggPiAwICYmIHRlbXBsYXRlLmluY2x1ZGVzKFwiYFwiKSkge1xyXG4gICAgdGhyb3cgXCJUaGlzIHZlcnNpb24gZG9lcyBub3Qgd29yayB3aXRoIHRoZSBiYWNrdGljayBzaWduIChgKSB3aXRoaW4gPHRlbXBsYXRlPi4gSW5zdGVhZCwgdXNlIHRoZSBzaW5nbGUgcXVvdGUgc2lnbiAoJykgb3IgdXNlIGEgZnVuY3Rpb24gd2l0aGluIHRoZSA8c2NyaXB0PiB0aGF0IHVzZXMgdGhlIGJhY2t0aWNrLlwiO1xyXG4gIH1cclxuXHJcbiAgbGV0IHMgPSAtMTtcclxuICBpZiAoc2NyaXB0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgIC8vIFNlYXJjaCBmb3IgdnVlLioqKkNvbXBvbmVudCoqKigqKip7XHJcbiAgICBsZXQgbDogbnVtYmVyID0gLTE7XHJcbiAgICBkbyB7XHJcbiAgICAgIHMgPSBzY3JpcHQuaW5kZXhPZihcIlZ1ZS5cIik7XHJcbiAgICAgIGwgPSBzO1xyXG4gICAgICBpZiAocyA+PSAwKSB7XHJcbiAgICAgICAgcyA9IHNjcmlwdC5pbmRleE9mKFwiQ29tcG9uZW50XCIsIHMgKyA0KTtcclxuICAgICAgICBsID0gcyAtIGw7XHJcbiAgICAgICAgaWYgKHMgPj0gMCkge1xyXG4gICAgICAgICAgcyA9IHNjcmlwdC5pbmRleE9mKFwiKFwiLCBzICsgOSk7XHJcbiAgICAgICAgICBpZiAocyA+PSAwKSB7XHJcbiAgICAgICAgICAgIHMgPSBzY3JpcHQuaW5kZXhPZihcIntcIiwgcyArIDEpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSB3aGlsZSAobCA+IDE0KTtcclxuXHJcbiAgICBpZiAocyA+IC0xKSB7XHJcbiAgICAgIGlmICh0ZW1wbGF0ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgLy8gVnVlIHNjcmlwdCBhbmQgdGVtcGxhdGVcclxuICAgICAgICByZXR1cm4gYCR7c2NyaXB0LnN1YnN0cmluZyhcclxuICAgICAgICAgIDAsXHJcbiAgICAgICAgICBzICsgMVxyXG4gICAgICAgICl9dGVtcGxhdGU6XFxgJHt0ZW1wbGF0ZX1cXGAsJHtzY3JpcHQuc3Vic3RyaW5nKHMgKyAxKX1gO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIFZ1ZSBzY3JpcHQgYnV0IG5vIHRlbXBsYXRlXHJcbiAgICAgICAgcmV0dXJuIHNjcmlwdDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRlbXBsYXRlICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAvLyBUZW1wbGF0ZSBidXQgbm8gVnVlIHNjcmlwdFxyXG4gICAgICAgIHJldHVybiBgZXhwb3J0IGRlZmF1bHQgVnVlLmRlZmluZUNvbXBvbmVudCh7XHJcbiAgICAgICAgdGVtcGxhdGU6IFxcYCR7dGVtcGxhdGV9XFxgLFxyXG4gICAgICAgIHNldHVwKCkge1xyXG4gICAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICAgIH0sXHJcbiAgICAgIH0pOyAke3NjcmlwdH1gO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE5vIHRlbXBsYXRlIGFuZCBubyBWdWUgc2NyaXB0XHJcbiAgICAgICAgcmV0dXJuIHNjcmlwdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0gZWxzZSB7XHJcbiAgICBpZiAodGVtcGxhdGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAvLyBObyBzY3JpcHQgYnV0IHRlbXBsYXRlXHJcbiAgICAgIHJldHVybiBgZXhwb3J0IGRlZmF1bHQgVnVlLmRlZmluZUNvbXBvbmVudCh7XHJcbiAgICAgIHRlbXBsYXRlOiBcXGAke3RlbXBsYXRlfVxcYCxcclxuICAgICAgc2V0dXAoKSB7XHJcbiAgICAgICAgcmV0dXJuIHt9O1xyXG4gICAgICB9LFxyXG4gICAgfSk7YDtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIE5vIHNjcmlwdCBubyB0ZW1wbGF0ZVxyXG4gICAgICByZXR1cm4gXCJcIjtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbmNvbnN0IElubGluZVZ1ZSA9ICgpOiBQbHVnaW4gPT4ge1xyXG4gIHJldHVybiB7XHJcbiAgICBuYW1lOiBcInZ1ZVwiLFxyXG4gICAgYXN5bmMgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XHJcbiAgICAgIGlmIChpZC5lbmRzV2l0aChcIi52dWVcIikpIHtcclxuICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZENvZGUgPSBWdWVGaWxlVG9Ucyhjb2RlKTtcclxuICAgICAgICBjb25zdCB0cmFuc3BpbGVkID0gdHMudHJhbnNwaWxlTW9kdWxlKHRyYW5zZm9ybWVkQ29kZSwge1xyXG4gICAgICAgICAgY29tcGlsZXJPcHRpb25zOiBwYXJzZWRDb25maWcub3B0aW9ucyxcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGNvZGU6IHRyYW5zcGlsZWQub3V0cHV0VGV4dCxcclxuICAgICAgICAgIG1hcDogdHJhbnNwaWxlZC5zb3VyY2VNYXBUZXh0LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH0sXHJcbiAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IElubGluZVZ1ZTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJY2hcXFxcR2l0SHViXFxcXFNhdldlYi1QYWdlc1xcXFxTaG9wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJY2hcXFxcR2l0SHViXFxcXFNhdldlYi1QYWdlc1xcXFxTaG9wXFxcXHZpdGUtcGx1Z2luLXZ1ZS1taW5pZnkudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0ljaC9HaXRIdWIvU2F2V2ViLVBhZ2VzL1Nob3Avdml0ZS1wbHVnaW4tdnVlLW1pbmlmeS50c1wiO2ltcG9ydCB7IFBsdWdpbiB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IG1pbmlmeSwgT3B0aW9ucyB9IGZyb20gXCJodG1sLW1pbmlmaWVyLXRlcnNlclwiO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIE1pbmlmeVZ1ZShvcHRpb25zPzogT3B0aW9ucyk6IFBsdWdpbiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIG5hbWU6IFwidml0ZS1wbHVnaW4tdnVlLWh0bWwtbWluaWZ5XCIsXHJcbiAgICBhcHBseTogXCJidWlsZFwiLFxyXG4gICAgdHJhbnNmb3JtKGNvZGUsIGlkKSB7XHJcbiAgICAgIGlmIChpZC5lbmRzV2l0aChcIi52dWVcIikpIHtcclxuICAgICAgICByZXR1cm4gbWluaWZ5KGNvZGUsIG9wdGlvbnMpO1xyXG4gICAgICB9XHJcbiAgICB9LFxyXG4gIH07XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IE1pbmlmeVZ1ZTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJY2hcXFxcR2l0SHViXFxcXFNhdldlYi1QYWdlc1xcXFxTaG9wXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxJY2hcXFxcR2l0SHViXFxcXFNhdldlYi1QYWdlc1xcXFxTaG9wXFxcXHZpdGUuY29uZmlnLnNob3cudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL0ljaC9HaXRIdWIvU2F2V2ViLVBhZ2VzL1Nob3Avdml0ZS5jb25maWcuc2hvdy50c1wiO2ltcG9ydCBJbmxpbmVWdWUgZnJvbSBcIi4vdml0ZS1wbHVnaW4taW5saW5lLXZ1ZVwiO1xyXG5pbXBvcnQgTWluaWZ5VnVlIGZyb20gXCIuL3ZpdGUtcGx1Z2luLXZ1ZS1taW5pZnlcIjtcclxuaW1wb3J0IGV4cHJlc3MgZnJvbSBcImV4cHJlc3NcIjtcclxuaW1wb3J0IHsgUGx1Z2luT3B0aW9uLCBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xyXG5pbXBvcnQgeyB2aXRlU2luZ2xlRmlsZSB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zaW5nbGVmaWxlXCI7XHJcbmltcG9ydCB7IFZpdGVNaW5pZnlQbHVnaW4gfSBmcm9tIFwidml0ZS1wbHVnaW4tbWluaWZ5XCI7XHJcbmltcG9ydCB7IGNyZWF0ZVNlcnZlciB9IGZyb20gXCJodHRwXCI7XHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tIFwicGF0aFwiO1xyXG5pbXBvcnQgeyBzcGF3biB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCI7XHJcblxyXG5jb25zdCBmb2xkZXIgPSBcIi9zYXZhY3QuYXBwXCI7XHJcbmNvbnN0IGZpbGUgPSBcImluZGV4Lmh0bWxcIjtcclxuY29uc3QgcG9ydCA9IDgwMDA7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKCkgPT4ge1xyXG4gIGxldCBwbHVnaW5zOiBQbHVnaW5PcHRpb24gPSBbXTtcclxuICBsZXQgbmVlZGVkUGx1Z2luczogUGx1Z2luT3B0aW9uID0gW1xyXG4gICAgSW5saW5lVnVlKCksXHJcbiAgICB2aXRlU2luZ2xlRmlsZSh7IHJlbW92ZVZpdGVNb2R1bGVMb2FkZXI6IHRydWUgfSksXHJcbiAgXTtcclxuXHJcbiAgLy8gTWluaWZ5IG9ubHkgaW4gcHJvZHVjdGlvblxyXG4gIGlmIChwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItLWRldlwiKSB8fCBwcm9jZXNzLmFyZ3YuaW5jbHVkZXMoXCItZFwiKSkge1xyXG4gICAgcGx1Z2lucyA9IG5lZWRlZFBsdWdpbnM7XHJcbiAgfSBlbHNlIHtcclxuICAgIGxldCBkZXZQbHVnaW5zOiBQbHVnaW5PcHRpb24gPSBbXHJcbiAgICAgIFZpdGVNaW5pZnlQbHVnaW4oeyBjb2xsYXBzZVdoaXRlc3BhY2U6IHRydWUgfSksXHJcbiAgICAgIE1pbmlmeVZ1ZSh7XHJcbiAgICAgICAgY29sbGFwc2VXaGl0ZXNwYWNlOiB0cnVlLFxyXG4gICAgICAgIHJlbW92ZUF0dHJpYnV0ZVF1b3RlczogZmFsc2UsXHJcbiAgICAgICAga2VlcENsb3NpbmdTbGFzaDogdHJ1ZSxcclxuICAgICAgfSksXHJcbiAgICBdO1xyXG4gICAgcGx1Z2lucyA9IFsuLi5kZXZQbHVnaW5zLCAuLi5uZWVkZWRQbHVnaW5zXTtcclxuICB9XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBwbHVnaW5zLFxyXG4gIH07XHJcbn0pO1xyXG5cclxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9IFwicHJvZHVjdGlvblwiKSB7XHJcbiAgdGhyb3cgbmV3IEVycm9yKFwiVGhpcyBjb25maWcgbmVlZHMgdGhlIHByb2R1Y3Rpb24gbW9kZVwiKTtcclxufVxyXG5cclxuLy8gQ3JlYXRlIHNlcnZlciBmb3IgU2F2QWN0IGJyb3dzZXJcclxuY29uc3QgYXBwID0gZXhwcmVzcygpO1xyXG5jb25zdCBodHRwU2VydmVyID0gY3JlYXRlU2VydmVyKGFwcCk7XHJcbmNvbnN0IG9wZW4gPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcInN0YXJ0XCIgOiBcIm9wZW5cIjtcclxuXHJcbmFwcC51c2UoZXhwcmVzcy5zdGF0aWMoam9pbihfX2Rpcm5hbWUpKSk7XHJcblxyXG5hcHAuZ2V0KFwiL1wiLCAocmVxLCByZXMpID0+IHtcclxuICByZXMuc2VuZEZpbGUoam9pbihfX2Rpcm5hbWUsIGAke2ZvbGRlcn0vJHtmaWxlfWApKTtcclxufSk7XHJcblxyXG5odHRwU2VydmVyLmxpc3Rlbig4MDAwLCAoKSA9PiB7XHJcbiAgY29uc3QgdXJsID0gYGh0dHA6Ly9sb2NhbGhvc3Q6JHtwb3J0fS9zYXZhY3QuYXBwI19icm93c2VyX2A7XHJcbiAgY29uc29sZS5pbmZvKFwiU2VydmVyIHJ1bnMgb25cIiwgdXJsKTtcclxuICBzcGF3bihvcGVuLCBbdXJsXSwgeyBzaGVsbDogdHJ1ZSB9KTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFDQSxPQUFPLFFBQVE7QUFDZixTQUFTLGFBQWE7QUFJdEIsSUFBTSxpQkFBaUIsR0FBRztBQUFBLEVBQ3hCO0FBQUEsRUFDQSxHQUFHLElBQUk7QUFBQSxFQUNQO0FBQ0Y7QUFHQSxJQUFNLGFBQWEsR0FBRyxlQUFlLGdCQUFnQixHQUFHLElBQUksUUFBUTtBQUNwRSxJQUFNLGFBQWEsV0FBVztBQUc5QixJQUFNLGVBQWUsR0FBRywyQkFBMkIsWUFBWSxHQUFHLEtBQUssSUFBSTtBQUUzRSxTQUFTLFlBQVlBLE9BQWM7QUFDakMsUUFBTSxJQUFJLE1BQU1BLEtBQUk7QUFDcEIsU0FBTztBQUFBLElBQ0wsVUFBVSxFQUFFLFdBQVcsU0FBUztBQUFBLElBQ2hDLFFBQVEsRUFBRSxXQUFXLE9BQU87QUFBQSxJQUM1QixPQUFPLEVBQUUsV0FBVztBQUFBLEVBQ3RCO0FBQ0Y7QUFFQSxTQUFTLFlBQVlBLE9BQWM7QUFDakMsUUFBTSxFQUFFLFVBQVUsUUFBUSxNQUFNLElBQUksWUFBWUEsS0FBSTtBQUVwRCxNQUFJLFVBQVUsVUFBYSxNQUFNLFNBQVMsR0FBRztBQUMzQyxVQUFNO0FBQUEsRUFDUjtBQUVBLE1BQUksYUFBYSxVQUFhLFNBQVMsU0FBUyxLQUFLLFNBQVMsU0FBUyxHQUFHLEdBQUc7QUFDM0UsVUFBTTtBQUFBLEVBQ1I7QUFFQSxNQUFJLElBQUk7QUFDUixNQUFJLFdBQVcsUUFBVztBQUV4QixRQUFJLElBQVk7QUFDaEIsT0FBRztBQUNELFVBQUksT0FBTyxRQUFRLE1BQU07QUFDekIsVUFBSTtBQUNKLFVBQUksS0FBSyxHQUFHO0FBQ1YsWUFBSSxPQUFPLFFBQVEsYUFBYSxJQUFJLENBQUM7QUFDckMsWUFBSSxJQUFJO0FBQ1IsWUFBSSxLQUFLLEdBQUc7QUFDVixjQUFJLE9BQU8sUUFBUSxLQUFLLElBQUksQ0FBQztBQUM3QixjQUFJLEtBQUssR0FBRztBQUNWLGdCQUFJLE9BQU8sUUFBUSxLQUFLLElBQUksQ0FBQztBQUFBLFVBQy9CO0FBQUEsUUFDRjtBQUFBLE1BQ0Y7QUFBQSxJQUNGLFNBQVMsSUFBSTtBQUViLFFBQUksSUFBSSxJQUFJO0FBQ1YsVUFBSSxhQUFhLFFBQVc7QUFFMUIsZUFBTyxHQUFHLE9BQU87QUFBQSxVQUNmO0FBQUEsVUFDQSxJQUFJO0FBQUEsUUFDTixDQUFDLGNBQWMsUUFBUSxNQUFNLE9BQU8sVUFBVSxJQUFJLENBQUMsQ0FBQztBQUFBLE1BQ3RELE9BQU87QUFFTCxlQUFPO0FBQUEsTUFDVDtBQUFBLElBQ0YsT0FBTztBQUNMLFVBQUksYUFBYSxRQUFXO0FBRTFCLGVBQU87QUFBQSxzQkFDTyxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUEsWUFJbEIsTUFBTTtBQUFBLE1BQ1osT0FBTztBQUVMLGVBQU87QUFBQSxNQUNUO0FBQUEsSUFDRjtBQUFBLEVBQ0YsT0FBTztBQUNMLFFBQUksYUFBYSxRQUFXO0FBRTFCLGFBQU87QUFBQSxvQkFDTyxRQUFRO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQUt4QixPQUFPO0FBRUwsYUFBTztBQUFBLElBQ1Q7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFNLFlBQVksTUFBYztBQUM5QixTQUFPO0FBQUEsSUFDTCxNQUFNO0FBQUEsSUFDTixNQUFNLFVBQVUsTUFBTSxJQUFJO0FBQ3hCLFVBQUksR0FBRyxTQUFTLE1BQU0sR0FBRztBQUN2QixjQUFNLGtCQUFrQixZQUFZLElBQUk7QUFDeEMsY0FBTSxhQUFhLEdBQUcsZ0JBQWdCLGlCQUFpQjtBQUFBLFVBQ3JELGlCQUFpQixhQUFhO0FBQUEsUUFDaEMsQ0FBQztBQUVELGVBQU87QUFBQSxVQUNMLE1BQU0sV0FBVztBQUFBLFVBQ2pCLEtBQUssV0FBVztBQUFBLFFBQ2xCO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLGlDQUFROzs7QUNySGYsU0FBUyxjQUF1QjtBQUV6QixTQUFTLFVBQVUsU0FBMkI7QUFDbkQsU0FBTztBQUFBLElBQ0wsTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLElBQ1AsVUFBVSxNQUFNLElBQUk7QUFDbEIsVUFBSSxHQUFHLFNBQVMsTUFBTSxHQUFHO0FBQ3ZCLGVBQU8sT0FBTyxNQUFNLE9BQU87QUFBQSxNQUM3QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0Y7QUFFQSxJQUFPLGlDQUFROzs7QUNiZixPQUFPLGFBQWE7QUFDcEIsU0FBdUIsb0JBQW9CO0FBQzNDLFNBQVMsc0JBQXNCO0FBQy9CLFNBQVMsd0JBQXdCO0FBQ2pDLFNBQVMsb0JBQW9CO0FBQzdCLFNBQVMsWUFBWTtBQUNyQixTQUFTLGFBQWE7QUFSdEIsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTSxTQUFTO0FBQ2YsSUFBTSxPQUFPO0FBQ2IsSUFBTSxPQUFPO0FBRWIsSUFBTywyQkFBUSxhQUFhLE1BQU07QUFDaEMsTUFBSSxVQUF3QixDQUFDO0FBQzdCLE1BQUksZ0JBQThCO0FBQUEsSUFDaEMsK0JBQVU7QUFBQSxJQUNWLGVBQWUsRUFBRSx3QkFBd0IsS0FBSyxDQUFDO0FBQUEsRUFDakQ7QUFHQSxNQUFJLFFBQVEsS0FBSyxTQUFTLE9BQU8sS0FBSyxRQUFRLEtBQUssU0FBUyxJQUFJLEdBQUc7QUFDakUsY0FBVTtBQUFBLEVBQ1osT0FBTztBQUNMLFFBQUksYUFBMkI7QUFBQSxNQUM3QixpQkFBaUIsRUFBRSxvQkFBb0IsS0FBSyxDQUFDO0FBQUEsTUFDN0MsK0JBQVU7QUFBQSxRQUNSLG9CQUFvQjtBQUFBLFFBQ3BCLHVCQUF1QjtBQUFBLFFBQ3ZCLGtCQUFrQjtBQUFBLE1BQ3BCLENBQUM7QUFBQSxJQUNIO0FBQ0EsY0FBVSxDQUFDLEdBQUcsWUFBWSxHQUFHLGFBQWE7QUFBQSxFQUM1QztBQUVBLFNBQU87QUFBQSxJQUNMO0FBQUEsRUFDRjtBQUNGLENBQUM7QUFFRCxJQUFJLFFBQVEsSUFBSSxZQUFZLGNBQWM7QUFDeEMsUUFBTSxJQUFJLE1BQU0sdUNBQXVDO0FBQ3pEO0FBR0EsSUFBTSxNQUFNLFFBQVE7QUFDcEIsSUFBTSxhQUFhLGFBQWEsR0FBRztBQUNuQyxJQUFNLE9BQU8sUUFBUSxhQUFhLFVBQVUsVUFBVTtBQUV0RCxJQUFJLElBQUksUUFBUSxPQUFPLEtBQUssZ0NBQVMsQ0FBQyxDQUFDO0FBRXZDLElBQUksSUFBSSxLQUFLLENBQUMsS0FBSyxRQUFRO0FBQ3pCLE1BQUksU0FBUyxLQUFLLGtDQUFXLEdBQUcsTUFBTSxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ25ELENBQUM7QUFFRCxXQUFXLE9BQU8sS0FBTSxNQUFNO0FBQzVCLFFBQU0sTUFBTSxvQkFBb0IsSUFBSTtBQUNwQyxVQUFRLEtBQUssa0JBQWtCLEdBQUc7QUFDbEMsUUFBTSxNQUFNLENBQUMsR0FBRyxHQUFHLEVBQUUsT0FBTyxLQUFLLENBQUM7QUFDcEMsQ0FBQzsiLAogICJuYW1lcyI6IFsiZmlsZSJdCn0K
