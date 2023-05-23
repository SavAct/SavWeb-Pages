# Token Sale GUI

This is a GUI for a token sale on Antelope blockchains. The parameters for the dedicated token sale can be changed at `store/globals.ts`.

For any changes, you need to setup this environment as described below.

# Transpiled file

In the `dist` folder is the transpiled file which can be uploaded to the blockchain.

# Setup

1. Clone this repository

```bash
git clone <repository link>
```

2. Use [Visual Studio Code](https://code.visualstudio.com/download) to open the file `Token-Sale-GUI.code-workspace`.

3. Install the VS Code extension [Vue Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to work faster with `.vue` files.

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

Just drop the [file](./dist/index.html) into the address bar of the browser or type in its URL.

## Upload on blockchain

1. Upload the [file](./dist/index.html) with the [app](https://savact.app/#/_fileupload_) by using a [contract for file uploads](https://github.com/SavAct/SavWeb).
2. In the RAM table of this contract you find the `refs`. If you upload the file in a single transaction, it is an array with just one entry of the `transaction id` and its corresponding `block number`.

```json
// Example
[ { "Block": 123456789, "TrxId": "aabbccddeeff11223344556677889900aabbccddeeff11223344556677889900" } ]`
```

3. To use your smart contract account name as SavWeb "domain name", use the `setpage` action of your token sale contract. Enter `0` for the `key`. Use the file name and the `refs` of your uploaded file. The `attri` parameter can be left empty.
