# Sample Node api without any dependencies

Goal of this repo is to proof that we can create a simple node api without any NPM dependencies.

Why ?

Why not ? Latest Node.js releases include a lot of features which will replace existing libraries (i.e dotenv, node-fetch)

## Prerequisites

- Node.js >= 23.0.0

# How to run ?

Run

```bash
$ npm run start
```

Visit sample routes in the browser:

- [http://localhost:3000/v1/bitcoin/rate](http://localhost:3000/v1/bitcoin/rate)
- [http://localhost:3000/v1/bitcoin/rate/USD](http://localhost:3000/v1/bitcoin/rate/USD)
- [http://localhost:3000/v1/version](http://localhost:3000/v1/version)

## Used features

- "native" Typescript, "type stripping" [source](https://nodejs.org/en/learn/typescript/run-natively)
- "fetch" implementation [source](https://nodejs.org/en/learn/getting-started/fetch)
- support for .env files [source](https://nodejs.org/dist/latest-v22.x/docs/api/cli.html#--env-fileconfig)
- import attributes support [source](https://nodejs.org/dist/latest-v22.x/docs/api/esm.html#esm_import_attributes)
