import InlineVue from "./vite-plugin-inline-vue";
import MinifyVue from "./vite-plugin-vue-minify";
import express from "express";
import { PluginOption, defineConfig } from "vite";
import { viteSingleFile } from "vite-plugin-singlefile";
import { ViteMinifyPlugin } from "vite-plugin-minify";
import { createServer } from "http";
import { join } from "path";
import { spawn } from "child_process";

const folder = "/savact.app";
const file = "index.html";
const port = 8000;

export default defineConfig(() => {
  let plugins: PluginOption = [];
  let neededPlugins: PluginOption = [
    InlineVue(),
    viteSingleFile({ removeViteModuleLoader: true }),
  ];

  // Minify only in production
  if (process.argv.includes("--dev") || process.argv.includes("-d")) {
    plugins = neededPlugins;
  } else {
    let devPlugins: PluginOption = [
      ViteMinifyPlugin({ collapseWhitespace: true }),
      MinifyVue({
        collapseWhitespace: true,
        removeAttributeQuotes: false,
        keepClosingSlash: true,
      }),
    ];
    plugins = [...devPlugins, ...neededPlugins];
  }

  return {
    plugins,
  };
});

if (process.env.NODE_ENV != "production") {
  throw new Error("This config needs the production mode");
}

// Create server for SavAct browser
const app = express();
const httpServer = createServer(app);
const open = process.platform === "win32" ? "start" : "open";

app.use(express.static(join(__dirname)));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, `${folder}/${file}`));
});

httpServer.listen(8000, () => {
  const url = `http://localhost:${port}/savact.app#_browser_`;
  console.info("Server runs on", url);
});
