# Gap Plugin for Tailwind CSS

## Installation

```bash
npm install tailwindcss-gap
```

## Usage

```js
// In your Tailwind CSS config
{
  plugins: [
    require('tailwindcss-gap')({
      gaps: {
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
      variants: ['responsive'],
    }),
  ],
}
```

This plugin generates the following utilities:

```css
.gap-1 {
  margin: -0.25rem;
}
.gap-1 > * {
  margin: 0.25rem;
}

.gap-x-1 {
  margin-left: -0.25rem;
  margin-right: -0.25rem;
}
.gap-x-1 > * {
  margin-left: 0.25rem;
  margin-right: 0.25rem;
}

.gap-y-1 {
  margin-top: -0.25rem;
  margin-bottom: -0.25rem;
}
.gap-y-1 > * {
  margin-top: 0.25rem;
  margin-bottom: 0.25rem;
}

/* etc. */
```
