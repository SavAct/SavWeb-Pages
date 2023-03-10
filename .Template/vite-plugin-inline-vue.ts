import { Plugin } from "vite";
import ts from "typescript";

/* This PlugIn converts a Vue file with TypeScript to a pure JavaScript file.
 * Note: The plugin just search for the needed tags and a Vue component in the script part.
 *       The code will not analyzie all tags nor the whole scipt and may be a fast solution.
 *       But therefore, double definition of tags and Vue components in the same vue file can result in transpiling errors.
 */

const configFileName = ts.findConfigFile(
  "./",
  ts.sys.fileExists,
  "tsconfig.json"
); // Automatisches Auffinden der tsconfig.json-Datei

// Lesen der tsconfig.json-Datei
const configFile = ts.readConfigFile(configFileName, ts.sys.readFile);
const configJson = configFile.config;

// Parsen der Compiler-Optionen aus der tsconfig.json
const parsedConfig = ts.parseJsonConfigFileContent(configJson, ts.sys, "./");

function getMainTags(file: string) {
  let script: string = undefined;
  let style: string = undefined;
  let template: string = undefined;
  let no_script: string;
  let no_style_script: string;

  // Get script
  let s1_script = file.indexOf("<script");
  if (s1_script >= 0) {
    const e1_script = file.indexOf(">", s1_script) + 1;
    if (e1_script == 0) {
      throw "Error on style tag";
    }
    const s2_script = file.lastIndexOf("</script");
    if (s2_script == -1) {
      throw "Error no closing tag of script";
    }
    const e2_script = file.indexOf(">", s2_script) + 1;
    if (e2_script == 0) {
      throw "Error on closing tag of script";
    }
    script = file.substring(e1_script, s2_script);
    no_script = file.substring(0, s1_script) + file.substring(e2_script);
  } else {
    no_script = file;
  }

  // Get style
  const s1_style = no_script.lastIndexOf("<style");

  if (s1_style >= 0) {
    const e1_style = no_script.indexOf(">", s1_style) + 1;
    if (e1_style == 0) {
      throw "Error on style tag";
    }
    const s2_style = no_script.indexOf("</style", e1_style);
    if (s2_style == -1) {
      throw "Error no closing tag of style";
    }
    const e2_style = no_script.indexOf(">", s2_style) + 1;
    if (e2_style == 0) {
      throw "Error on closing tag of style";
    }

    style = no_script.substring(e1_style, s2_style);
    no_style_script =
      no_script.substring(0, s1_style) + no_script.substring(e2_style);
  } else {
    no_style_script = no_script;
  }

  // Get template
  const s1_template = no_style_script.indexOf("<template");
  if (s1_template >= 0) {
    const e1_template = no_style_script.indexOf(">", s1_template) + 1;
    if (e1_template == 0) {
      throw "Error on template tag";
    }
    const s2_template = no_style_script.lastIndexOf("</template");
    if (s2_template == -1) {
      throw "Error no closing tag of template";
    }
    const e2_template = no_style_script.indexOf(">", s2_template) + 1;
    if (e2_template == 0) {
      throw "Error on closing tag of template";
    }
    template = no_style_script.substring(e1_template, s2_template);
  }

  return { template, script, style };
}

function VueFileToTs(file: string) {
  const { template, script, style } = getMainTags(file);

  if (style !== undefined) {
    throw "This version does not work with style tag in .vue-files";
  }

  let s = -1;
  if (script !== undefined) {
    // Search for vue.***Component***(***{
    let l: number = -1;
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
      if (template !== undefined) {
        // Vue script and template
        return `${script.substring(
          0,
          s + 1
        )}template:\`${template}\`,${script.substring(s + 1)}`;
      } else {
        // Vue script but no template
        return script;
      }
    } else {
      if (template !== undefined) {
        // Template but no Vue script
        return `export default Vue.defineComponent({
        template: \`${template}\`,
        setup() {
          return {};
        },
      }); ${script}`;
      } else {
        // No template and no Vue script
        return script;
      }
    }
  } else {
    if (template !== undefined) {
      // No script but template
      return `export default Vue.defineComponent({
      template: \`${template}\`,
      setup() {
        return {};
      },
    });`;
    } else {
      // No script no template
      return "";
    }
  }
}

const InlineVue = (): Plugin => {
  return {
    name: "vue",
    async transform(code, id) {
      if (id.endsWith(".vue")) {
        const transformedCode = VueFileToTs(code);
        const transpiled = ts.transpileModule(transformedCode, {
          compilerOptions: parsedConfig.options,
        });

        return {
          code: transpiled.outputText,
          map: transpiled.sourceMapText,
        };
      }
    },
  };
};

export default InlineVue;
