const _ = require('lodash');
const cssMatcher = require('jest-matcher-css');
const postcss = require('postcss');
const tailwindcss = require('tailwindcss');
const defaultConfig = require('tailwindcss/defaultConfig')();
const gapPlugin = require('./index.js');

const disabledModules = {};
Object.keys(defaultConfig.modules).forEach(module => {
  disabledModules[module] = false;
});

const generatePluginCss = (options = {}) => {
  return postcss(tailwindcss({
    screens: {
      'sm': '600px',
    },
    modules: disabledModules,
    plugins: [gapPlugin(options)],
  })).process('@tailwind components;', {
    from: undefined,
  }).then(result => {
    return result.css;
  });
};

const baseCss = `
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
`;

expect.extend({
  toMatchCss: cssMatcher,
});

test('options are not required', () => {
  return generatePluginCss().then(css => {
    expect(css).toMatchCss(baseCss);
  });
});

test('gap components are generated as they should', () => {
  return generatePluginCss({
    gaps: {
      '1': '0.25rem',
      '2': '0.5rem',
    },
  }).then(css => {
    expect(css).toMatchCss(`
      ${baseCss}
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
    `);
  });
});

test('variants are supported', () => {
  return generatePluginCss({
    gaps: {
      '1': '0.25rem',
    },
    variants: ['responsive'],
  }).then(css => {
    expect(css).toMatchCss(`
      ${baseCss}
      .gap-1 {
        --gap: .25rem;
      }
      .gap-x-1 {
        --gap-x: .25rem;
      }
      .gap-y-1 {
        --gap-y: .25rem;
      }
      @media (min-width: 600px) {
        .sm\\:gap-1 {
          --gap: .25rem;
        }
        .sm\\:gap-x-1 {
          --gap-x: .25rem;
        }
        .sm\\:gap-y-1 {
          --gap-y: .25rem;
        }
      }
    `);
  });
});
