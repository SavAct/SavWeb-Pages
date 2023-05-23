# Token Sale GUI

This is a GUI for a token sale on Antelope blockchains. The parameters for the dedicated token sale can be changed at `store/globals.ts`.

For any changes, you need to setup this environment as described below.

# Transpiled file

In the `dist` is the transpiled file which can be uploaded to the blockchain.

# Setup

1. Clone this repository

```bash
git clone <repository link>
```

2. Use [Visual Studio Code](https://code.visualstudio.com/download) to open the file `Token-Sale-GUI.code-workspace`.

3. Install the VS Code extention [Vue Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to work faster with `.vue` files.

## Commands

Install dependencies

```bash
yarn install
```

Developing mode for instant code change update

```bash
yarn dev
```

Transpile the code to a single html file

```bash
yarn build
```

Transpile the code to a single html file and show it in the SavAct browser

```bash
yarn show
```

## Load other icon libraries

Add other icon libraries in the header of index.html.
See here for more information: https://quasar.dev/start/umd

# Access immortal dApps and websites

You can open the application with the SavAct browser, see [https://savact.app/#/\_browser\_](https://savact.app/#/_browser_)
