# 🔗 Simple Anchor

[![CI](https://github.com/jakejarvis/simple-anchor/actions/workflows/ci.yml/badge.svg)](https://github.com/jakejarvis/simple-anchor/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/simple-anchor?logo=npm)](https://www.npmjs.com/package/simple-anchor)
[![MIT License](https://img.shields.io/github/license/jakejarvis/simple-anchor?color=violet)](LICENSE)

A JavaScript utility for adding deep anchor links ([like these](https://ux.stackexchange.com/q/36304/33248)) to existing page content. Zero dependencies and [only ~1kB gzipped!](https://bundlephobia.com/package/simple-anchor)

## Changes from [AnchorJS](https://github.com/bryanbraun/anchorjs)

- Styling of `.anchorjs-link` elements is completely on you. The non-optional and hefty [base styles](https://github.com/bryanbraun/anchorjs/blob/7a2e93892fc8c1eeba0a9de5025feabf79372158/anchor.js#L305) of AnchorJS have been removed for a slimmer module. (This includes the default 🔗 icon.)
- Element IDs are also left to you — this package will **not** generate an element's ID automatically if one is not already set (eg. `<h2 id="installation">Installation</h2>`). Elements without one are automatically ignored.

Otherwise, the [AnchorJS docs](https://www.bryanbraun.com/anchorjs/) still serve as a good reference.

## Usage

### Browser

```html
<script src="https://unpkg.com/simple-anchor/dist/simple-anchor.min.js"></script>
<script>
  var anchor = new SimpleAnchor();
  anchors.add({
   icon: '#'
  });
</script>
```

### Node

```bash
npm install simple-anchor
# or...
yarn add simple-anchor
```

```js
import SimpleAnchor from 'simple-anchor';
// or...
// const SimpleAnchor = require('simple-anchor');

const anchors = new SimpleAnchor();
anchors.add({
   icon: '#'
});
```

Since AnchorJS's default CSS has been removed as mentioned above, it's up to you to style the `.anchorjs-link` element.

## Examples

- [https://jarv.is/](https://jarv.is/) ([Source](https://github.com/jakejarvis/jarv.is))

## License

MIT
