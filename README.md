# Color.js [![Build Status](https://travis-ci.org/uupaa/Color.js.png)](http://travis-ci.org/uupaa/Color.js)

[![npm](https://nodei.co/npm/uupaa.color.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.color.js/)

Color functions.

## Document

- [Color.js wiki](https://github.com/uupaa/Color.js/wiki/Color)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/Color.js"></script>
<script src="lib/ColorDict.js"></script>
<script>
console.log( new Color("red") );
</script>
```

### WebWorkers

```js
importScripts("lib/Color.js");
importScripts("lib/ColorDict.js");

console.log( new Color("red") );
...
```

### Node.js

```js
require("lib/Color.js");
require("lib/ColorDict.js");

console.log( new Color("red") );
...
```
