# Gap Plugin for Tailwind CSS

## Installation

```bash
npm install tailwindcss-gap
```

## Usage

```js
// tailwind.config.js
{
  theme: {
    gap: { // defaults to {}
      '0': '0',
      '1': '0.25rem',
      '2': '0.5rem',
      '3': '0.75rem',
      '4': '1rem',
      '5': '1.25rem',
      '6': '1.5rem',
      '7': '1.75rem',
      '8': '2rem',
    },
  },
  variants: {
    gap: ['responsive'], // defaults to ['responsive']
  },
  plugins: [
    require('tailwindcss-gap')(),
  ],
}
```

This plugin generates the following classes (in the `@tailwind components` slot, so that padding and margin utilities can override them):

```css
.gap, .gap-padding {
  --gap: 0px;
  --gap-x: var(--gap);
  --gap-y: var(--gap);
  --gap-x-half: calc(var(--gap-x) / 2);
  --gap-x-half-negative: calc(var(--gap-x-half) * -1);
  --gap-y-half: calc(var(--gap-y) / 2);
  --gap-y-half-negative: calc(var(--gap-y-half) * -1);
  margin: var(--gap-y-half-negative) var(--gap-x-half-negative);
}
.gap > * {
  margin: var(--gap-y-half) var(--gap-x-half);
}
.gap-padding > * {
  padding: var(--gap-y-half) var(--gap-x-half);
}

.gap-1 {
  --gap: .25rem;
}
.gap-x-1 {
  --gap-x: .25rem;
}
.gap-y-1 {
  --gap-y: .25rem;
}

.gap-2 {
  --gap: .5rem;
}
.gap-x-2 {
  --gap-x: .5rem;
}
.gap-y-2 {
  --gap-y: .5rem;
}

/* etc. */
```

And you can use them like this in your markup:

```html
<div class="flex flex-wrap gap gap-8">
  <div class="w-4 h-4 rounded-full bg-blue"></div>
  <div class="w-4 h-4 rounded-full bg-blue"></div>
  <div class="w-4 h-4 rounded-full bg-blue"></div>
</div>

<div class="sm:flex gap-padding sm:gap-x-8">
  <div class="w-1/2">
    Column 1
  </div>
  <div class="w-1/2">
    Column 2
  </div>
</div>
```
