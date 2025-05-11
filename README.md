# Node api without any dependencies

This repo is a demonstration of how to create a simple API using only the built-in modules of Node.js, without relying on any third-party libraries or frameworks.

Why ?

Why not ? Latest Node.js releases include a lot of features which might replace existing libraries (i.e dotenv, node-fetch)

## Prerequisites

- Node.js >= 24.0.0

# How to run ?

Run

```bash
$ npm run start
```

Visit sample routes in the browser:

- [http://localhost:3000/v1/bitcoin/rates](http://localhost:3000/v1/bitcoin/rates)
- [http://localhost:3000/v1/bitcoin/rates/USD](http://localhost:3000/v1/bitcoin/rates/USD)
- [http://localhost:3000/v1/version](http://localhost:3000/v1/version)

The API will fetch data from [blockchain.info](https://blockchain.info) cache them in-memory and return them to the client.

## Used features

- "native" Typescript, "type stripping" [source](https://nodejs.org/dist/latest-v24.x/docs/api/typescript.html#type-stripping)
- "fetch" implementation - node-fetch package killer [source](https://nodejs.org/dist/latest-v24.x/docs/api/globals.html#fetch)
- loading environment variables from a file - dotenv package killer [source](https://nodejs.org/dist/latest-v24.x/docs/api/cli.html#--env-fileconfig)
- Asynchronous context tracking [source](https://nodejs.org/dist/latest-v24.x/docs/api/async_context.html)
- in-memory cache with SQLite [source](https://nodejs.org/dist/latest-v24.x/docs/api/sqlite.html#sqlite_sqlite3)
- unit tests with built-in test runner [source](https://nodejs.org/dist/latest-v24.x/docs/api/test.html)
- mocking with built-in test runner [source](https://nodejs.org/dist/latest-v24.x/docs/api/test.html#test_mocking)
- import attributes support [source](https://nodejs.org/dist/latest-v24.x/docs/api/esm.html#esm_import_attributes)

# How to run tests ?

Run

```bash
$ npm run test
```
