# [BLACK LIVES MATTER](https://blacklivesmatters.carrd.co)

### Be aware. Be angry. Do better. Demand change. Show your support any way you can. Click on the link above to find protests, petitions, and other ways to help. DO NOT LET IT GO SILENT.

# Gap Plugin for Tailwind CSS

## Introduction

Tailwind 1.2 comes with `gap`, `row-gap`, and `col-gap` utilities, but the underlying CSS properties only work in the context of CSS Grid at the moment (except in Firefox which also supports `gap` in Flexbox). This plugin uses a known workaround to achieve the same thing in Flexbox or even in good old block layout, which is to apply negative margin on the container element and positive margin or padding on the children. Since there is a naming conflict with Tailwind’s `gap-*` classes, this plugin uses `c-gap-*` by default, but you can customize the `c-` prefix with the `prefix` option. You can even use an empty prefix to generate `gap-*` classes and disable Tailwind’s native gap utilities [by setting `gap` to `false` in your config’s `corePlugins` object](https://tailwindcss.com/docs/configuration/#core-plugins) if you don’t plan on using CSS Grid.

## Requirements

This plugin requires Tailwind CSS 1.5 or later. If your project uses an older version of Tailwind, you should install the latest 3.x version of this plugin (`npm install tailwindcss-gap@3.x`).

## Installation

```bash
npm install tailwindcss-gap
```

## Usage

```js
// tailwind.config.js
module.exports = {
  target: 'ie11', // if you want IE11 support, set this and the plugin will generate IE-compatible CSS (which is much larger because it cannot use custom properties)
  theme: {
    gap: { // defaults to theme => theme('spacing') as per Tailwind 1.2
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
    },
  },
  variants: {
    gap: ['responsive'], // defaults to ['responsive'] as per Tailwind 1.2
  },
  plugins: [
    require('tailwindcss-gap')({
      prefix: 'c-',   // defaults to 'c-'
    }),
  ],
};
```

This plugin generates the following CSS (in the `@tailwind components` layer, so that padding and margin utilities can override gap utilities):

```css
.c-gap-wrapper {
  display: flow-root;
}
.c-gap-wrapper::before, .c-gap-wrapper::after {
  content: '';
  display: table;
}
.c-gap, .c-gap-padding {
  --gap-x: 0px;
  --gap-y: 0px;
  --gap-x-half: calc(var(--gap-x) / 2);
  --gap-x-half-negative: calc(var(--gap-x-half) * -1);
  --gap-y-half: calc(var(--gap-y) / 2);
  --gap-y-half-negative: calc(var(--gap-y-half) * -1);
  margin: var(--gap-y-half-negative) var(--gap-x-half-negative);
}
.c-gap > * {
  margin: var(--gap-y-half) var(--gap-x-half);
}
.c-gap-padding > * {
  padding: var(--gap-y-half) var(--gap-x-half);
}

.c-gap-0 {
  --gap-x: 0px;
  --gap-y: 0px;
}
.c-gap-1 {
  --gap-x: 0.25rem;
  --gap-y: 0.25rem;
}
.c-gap-2 {
  --gap-x: 0.5rem;
  --gap-y: 0.5rem;
}
/* etc. */

.c-gap-x-0 {
  --gap-x: 0px;
}
.c-gap-y-0 {
  --gap-y: 0px;
}
.c-gap-x-1 {
  --gap-x: 0.25rem;
}
.c-gap-y-1 {
  --gap-y: 0.25rem;
}
.c-gap-x-2 {
  --gap-x: 0.5rem;
}
.c-gap-y-2 {
  --gap-y: 0.5rem;
}
/* etc. */
```

Which you can then use in your HTML like this:

```html
<div class="c-gap-wrapper overflow-hidden">
  <div class="flex flex-wrap c-gap c-gap-8">
    <div class="w-4 h-4 rounded-full bg-blue"></div>
    <div class="w-4 h-4 rounded-full bg-blue"></div>
    <div class="w-4 h-4 rounded-full bg-blue"></div>
  </div>
</div>

<div class="c-gap-wrapper overflow-hidden">
  <div class="sm:flex c-gap-padding sm:c-gap-x-8">
    <div class="w-1/2">
      Column 1
    </div>
    <div class="w-1/2">
      Column 2
    </div>
  </div>
</div>
```

The `c-gap-wrapper` element is not required, but strongly recommended to avoid issues related to collapsing margins. You should also add `overflow-hidden` to that element if you can in order to prevent unwanted horizontal scrolling caused by the negative margins. Any margin, padding, border, or background utilities should be added to the `c-gap-wrapper` element rather than the `c-gap` or `c-gap-padding`. Note that you cannot nest `c-gap` elements directly, but you can nest them by using `c-gap-wrapper`:

```html
<div class="c-gap-wrapper overflow-hidden">
  <div class="flex flex-col c-gap c-gap-y-4">
    <div class="c-gap-wrapper">
      <div class="flex flex-wrap c-gap c-gap-2">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </div>
    </div>
    <div class="c-gap-wrapper">
      <div class="flex flex-wrap c-gap c-gap-2">
        <div>First</div>
        <div>Second</div>
        <div>Third</div>
      </div>
    </div>
  </div>
</div>
```

It is also strongly recommended to use `c-gap` on `flex` containers since margins don’t collapse between flex items. If you want to apply a gap between items inside a regular block container, you should use `c-gap-padding` instead of `c-gap` for the gaps to be the expected size:

```html
<div class="c-gap-wrapper">
  <ul class="c-gap-padding c-gap-y-4">
    <li class="block">
      First item
    </li>
    <li class="block">
      Second item
    </li>
    <li class="block">
      Third item
    </li>
  </ul>
</div>
```
