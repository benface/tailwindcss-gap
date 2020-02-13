# Gap Plugin for Tailwind CSS

## Introduction

Tailwind 1.2 comes with `gap`, `row-gap`, and `col-gap` utilities, but the underlying CSS properties only work in the context of CSS Grid at the moment (except in Firefox which also supports `gap` in Flexbox). This plugin uses a known workaround to achieve the same thing in Flexbox, which is to apply negative margin on the container element and positive margin or padding on the children. Since there is a naming conflict with Tailwind’s `gap-*` classes, this plugin uses `c-gap-*` by default, but you can customize it with the `prefix` option. You can even use an empty prefix to generate `gap-*` classes and disable Tailwind’s native gap utilities [by setting `gap` to `false` in your config’s `corePlugins` object](https://tailwindcss.com/docs/configuration/#core-plugins) if you don’t plan on using CSS Grid.

## Requirements

This plugin requires Tailwind CSS 1.2 or later. If your project uses an older version of Tailwind, you should install the latest 3.x version of this plugin (`npm install tailwindcss-gap@3.x`).

## Installation

```bash
npm install tailwindcss-gap
```

## Usage

```js
// tailwind.config.js
module.exports = {
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
      legacy: false,  // defaults to false, set to true to output IE-compatible CSS (no custom properties, but much larger CSS for the same functionality)
    }),
  ],
};
```

This plugin generates the following CSS (in the `@tailwind components` slot, so that padding and margin utilities can override gap utilities):

```css
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

.c-gap-1 {
  --gap-x: 0.25rem;
  --gap-y: 0.25rem;
}
.c-gap-2 {
  --gap-x: 0.5rem;
  --gap-y: 0.5rem;
}
/* etc. */

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
<div class="flex flex-wrap c-gap c-gap-8">
  <div class="w-4 h-4 rounded-full bg-blue"></div>
  <div class="w-4 h-4 rounded-full bg-blue"></div>
  <div class="w-4 h-4 rounded-full bg-blue"></div>
</div>

<div class="sm:flex c-gap-padding sm:gap-x-8">
  <div class="w-1/2">
    Column 1
  </div>
  <div class="w-1/2">
    Column 2
  </div>
</div>
```

## Nesting (known issue)

Due to how gaps are implemented, you can’t nest them directly:

```html
<div class="flex flex-column c-gap c-gap-y-2">
  <div class="flex c-gap c-gap-x-2">
    <div> This doesn’t work </div>
    <div> unfortunately </div>
    <div> because </div>
  </div>
  <div class="flex c-gap c-gap-x-2">
    <div> a "gap" element </div>
    <div> cannot have a direct child </div>
    <div> that is also a "gap" element </div>
  </div>
</div>
```

Instead, you need to wrap every child `c-gap` element with another element, like a simple `<div>` (although it can be any element):

```html
<div class="flex flex-column c-gap c-gap-y-2">
  <div>
    <div class="flex c-gap c-gap-x-2">
      <div> This is fine </div>
      <div> because </div>
      <div> the child "gap" elements </div>
    </div>
  </div>
  <div>
    <div class="flex c-gap c-gap-x-2">
      <div> are no longer </div>
      <div> direct children </div>
      <div> of another "gap" </div>
    </div>
  </div>
</div>
```
