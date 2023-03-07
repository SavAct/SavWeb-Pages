# Small one file app - Template

In order to upload an immortal website or dApp it is more efficient to upload the whole application in one file and with a minimum number of bytes. This project is a template which fulfils this requirement in an optimal way.

It uses Typescript for type safety. Vite and Quasar with Vue 3 are used for a fast development process.
The resulting file size is reduced by using the publicly hosted libraries of Qusar and Vue.

## Purpose

If you have created your appliation, you can upload it with the SavAct App, see [https://savact.app/#/_fileupload_](https://savact.app/#/_fileupload_)

You can open the application with the SavAct browser, see [https://savact.app/#/_browser_](https://savact.app/#/_browser_)

To see your application in preview, just drag and drop your `html-file` of your application into the address bar of the SavAct browser.

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

## Highlight Vue templates

Install VS Code extention `es6-string-html` and write `/*html*/` before the string

```javascript
template = /*html*/ `<div>{{counter}}</div>`;
```

## Load other icon libraries

Add other icon libraries in the header of index.html.
See here for more information: https://quasar.dev/start/umd

## Downside

If the publicly hosted libraries are down, the application will also not be shown as desired. In that case the frontend must be updated. Another option may be that these libraries will be provided by the SavWeb Browser itself in the future. But for now, on it is not expected that these libraries will be taken offline in the lifetime of a website, because they are necessary for thousands of centralized websites on the clear web.
