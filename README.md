# wk-bridge

> Bridge between Native and Web, based on WKWebView and compatible Android

[![node](https://img.shields.io/node/v/@cqlinkoff/wk-bridge.svg)](https://www.npmjs.com/package/@cqlinkoff/wk-bridge)
[![npm](https://img.shields.io/npm/v/@cqlinkoff/wk-bridge.svg)](https://www.npmjs.com/package/@cqlinkoff/wk-bridge)
[![license](https://img.shields.io/npm/l/@cqlinkoff/wk-bridge.svg)](https://github.com/cqlinkoff/wk-bridge/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/cqlinkoff/wk-bridge.svg?branch=master)](https://travis-ci.org/cqlinkoff/wk-bridge)
[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](http://standardjs.com/)
[![Coverage Status](https://coveralls.io/repos/github/cqlinkoff/wk-bridge/badge.svg?branch=master)](https://coveralls.io/github/cqlinkoff/wk-bridge?branch=master)

## Install

```bash
npm i @cqlinkoff/wk-bridge
```

## Use

```js
import WKBridge from '@cqlinkoff/wk-bridge'

const bridge = new WKBridge({
  namespace: 'namespace'
})

bridge.postMessage(handler, data)
```

## API

### `new WKBridge(options)`

> create WKBridge instance

- `options`:

  - `namespace`: namespace which inject by Android WebView

### `postMessage(handler, data)`

> call native method

- `handler`: native method name
- `data`: arguments
