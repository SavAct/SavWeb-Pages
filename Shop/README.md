# SavAct Shop

Online shop that needs no central authority.
It relies on the SavAct fraud protection mechanism. For the communication between sellers and customers PGP encryption is implemented.

## Installation

1. [Node](https://nodejs.org) need to be installed.
2. Use `yarn` or `npm` to install the install dependencies.

```bash
yarn install
```

```bash
npm install
```

## Usage

Transpile the code to a single html file: `dist/index.html`

```bash
yarn build
```

Developing mode for instant code change update **without** SavAct browser specific functionality

```bash
yarn dev
```

Transpile the code to a single html file and show it in the SavAct browser

```bash
yarn preview
```

Developing mode for instant code change **with** update SavAct browser specific functionality

```bash
yarn show
```

## Security

To prevent harmful users from uploading too big images and therefore overwhelm visitors bandwidth, there is a custom component called `<pro-img>`. It accepts only images that are smaller than a predefined amount of bytes. Default is 512\*512 bytes. But some image hosts do not allow to load images via script, therefore this hosts can not be used.
