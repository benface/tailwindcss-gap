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
  })).process('@tailwind utilities;', {
    from: undefined,
  }).then(result => {
    return result.css;
  });
};

expect.extend({
  toMatchCss: cssMatcher,
});

test('there is no output by default', () => {
  return generatePluginCss().then(css => {
    expect(css).toMatchCss(``);
  });
});

test('gap utilities are generated as they should', () => {
  return generatePluginCss({
    gaps: {
      '1': '0.25rem',
      '2': '0.5rem',
    },
  }).then(css => {
    expect(css).toMatchCss(`
      .gap-1 {
        margin: -0.25rem;
      }
      .gap-1 > * {
        margin: .25rem;
      }
      .gap-x-1 {
        margin-left: -0.25rem;
        margin-right: -0.25rem;
      }
      .gap-x-1 > * {
        margin-left: .25rem;
        margin-right: .25rem;
      }
      .gap-y-1 {
        margin-top: -0.25rem;
        margin-bottom: -0.25rem;
      }
      .gap-y-1 > * {
        margin-top: .25rem;
        margin-bottom: .25rem;
      }
      .gap-2 {
        margin: -0.5rem;
      }
      .gap-2 > * {
        margin: .5rem;
      }
      .gap-x-2 {
        margin-left: -0.5rem;
        margin-right: -0.5rem;
      }
      .gap-x-2 > * {
        margin-left: .5rem;
        margin-right: .5rem;
      }
      .gap-y-2 {
        margin-top: -0.5rem;
        margin-bottom: -0.5rem;
      }
      .gap-y-2 > * {
        margin-top: .5rem;
        margin-bottom: .5rem;
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
      .gap-1 {
        margin: -0.25rem;
      }
      .gap-1 > * {
        margin: .25rem;
      }
      .gap-x-1 {
        margin-left: -0.25rem;
        margin-right: -0.25rem;
      }
      .gap-x-1 > * {
        margin-left: .25rem;
        margin-right: .25rem;
      }
      .gap-y-1 {
        margin-top: -0.25rem;
        margin-bottom: -0.25rem;
      }
      .gap-y-1 > * {
        margin-top: .25rem;
        margin-bottom: .25rem;
      }
      @media (min-width: 600px) {
        .sm\\:gap-1 {
          margin: -0.25rem;
        }
        .sm\\:gap-1 > * {
          margin: .25rem;
        }
        .sm\\:gap-x-1 {
          margin-left: -0.25rem;
          margin-right: -0.25rem;
        }
        .sm\\:gap-x-1 > * {
          margin-left: .25rem;
          margin-right: .25rem;
        }
        .sm\\:gap-y-1 {
          margin-top: -0.25rem;
          margin-bottom: -0.25rem;
        }
        .sm\\:gap-y-1 > * {
          margin-top: .25rem;
          margin-bottom: .25rem;
        }
      }
    `);
  });
});
