[![Apache 2 License][license-shield]][license-url]
[![npm package][npm-shield]][npm-url]
![size][size-shield]
![coverage][coverage-shield]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <h1 align="center">map.js</h1>

  <p align="center">
    A lightweight library to create interactive maps.
    <br />
    <br />
    <a href="https://github.com/kaosdev/map.js/issues">Report Bug</a>
    ·
    <a href="https://github.com/kaosdev/map.js/issues">Request Feature</a>
  </p>
</p>

## About the Project

Maps are great to learn and understand a concept, and they are even better if you can interact with them.

I created this library because I have not found another library to create maps the way I wanted.

### HTML not canvas

This library create the map as html, and not a canvas.
This is because crawlers (like googlebot) do not understand canvas elements.
Plus canvas are not really accessible.

### Lightweight

This library is also lightweight, just 7kb minified and gzipped.

## Demo

Are you curious to see hot it looks like?
Read this [introduction to RxJS built with this library](https://www.elialotti.com/it/roadmap/rxjs)

## Installation

map.js is published as an esm module. It can be installed via npm, using a cdn, or hosting it yourself.

### npm

Install it with npm if you use a module bundler like webpack or rollup.

```sh
npm install @kaosdev/map-js
```

### CDN or hosted

You can also install map.js from a CDN or by downloading the dist files and hosting them yourself.

In the html you need to add a script of type module, and inside this script you can import map.js

```html
<script type="module">
  /**
   *  Here we import from unpkg,
   *  But the url can be changed
   *  to match your hosting.
   */
  import { SketchMap } from "https://unpkg.com/@kaosdev/map-js@0.3.1/esm/map.min.js";

  // use SketchMap
</script>
```

## Styles

Once installed you can choose to import the default styles or
theme the components yourself.

If you are using webpack, you can use [css-loader][css-loader-url]
and [mini-css-extract-plugin][mini-css-plugin-url]
to import the css directly in your js/ts scripts.

```js
import "map-js/css/styles.css";
```

Else you can add a link in the head of the html to import the css from unpkg or your hosting.

```html
<head>
  ...

  <link
    href="https://unpkg.com/@kaosdev/map-js@0.3.1/css/styles.css"
    rel="stylesheet"
  />

  ...
</head>
```

## Usage

Create a placeholder `div` in the html.

```html
<div class="roadmap"></div>
```

Then you can create a new `SketchMap` passing the definitions of the
labels and arrows.

```js
// Get a reference of the previously created div
const sketchmap = document.querySelector(".roadmap");

// Define the labels
const labels = [
  {
    id: "label1", // every label must have a unique id
    content: "Label 1",
    top: 100,
    left: 100,
    width: 100,
    height: 35,
  },
  {
    id: "label2",
    content: `Label 2`,
    top: 150,
    left: 100,
    width: 100,
    height: 35,
    style: "secondary",
  },
];

// Define the arrows that connect the labels
const arrows = [
  {
    from: "label1", // 'from' and 'to' reference the label ids
    fromDir: "bottom",
    to: "label2",
    toDir: "top",
    style: "dotted",
  },
];

// Instantiate a new sketchmap
new SketchMap(sketchmap, { labels, arrows, width: 512 });
```

## Contributing

We appreciate every contribution.

Make sure to read these:

- [Code of Conduct][code-of-conduct]
- [Contributing][contributing]

[mini-css-plugin-url]: https://webpack.js.org/plugins/mini-css-extract-plugin/
[css-loader-url]: https://webpack.js.org/loaders/css-loader/
[license-shield]: https://img.shields.io/badge/license-Apache%202-blue?style=for-the-badge
[license-url]: https://github.com/kaosdev/map.js/blob/main/LICENSE
[code-of-conduct]: https://github.com/kaosdev/map.js/blob/main/CODE_OF_CONDUCT.md
[contributing]: https://github.com/kaosdev/map.js/blob/main/CONTRIBUTING.md
[npm-shield]: https://img.shields.io/npm/v/@kaosdev/map-js?style=for-the-badge
[npm-url]: https://www.npmjs.com/package/@kaosdev/map-js
[size-shield]: https://img.shields.io/bundlephobia/minzip/@kaosdev/map-js?color=green&label=SIZE&style=for-the-badge
[coverage-shield]: https://img.shields.io/coveralls/github/kaosdev/map.js?style=for-the-badge
