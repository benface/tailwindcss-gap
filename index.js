const plugin = require('tailwindcss/plugin');
const _ = require('lodash');
const valueParser = require('postcss-value-parser');

const defaultOptions = {
  prefix: 'c-',
  legacy: false,
};

const getHalfValue = function(value) {
  const parsedValue = valueParser.unit(value);
  return `${parsedValue.number / 2}${parsedValue.unit}`;
};

module.exports = plugin.withOptions(function(options = {}) {
  return function({ theme, variants, addComponents, e }) {
    options = _.defaults({}, options, defaultOptions);

    const gapTheme = theme('gap');
    const gapVariants = variants('gap');

    if (!options.legacy) {
      addComponents({
        [`.${e(`${options.prefix}gap-wrapper`)}`]: {
          display: 'flow-root',
        },
        [`.${e(`${options.prefix}gap-wrapper`)}::before, .${e(`${options.prefix}gap-wrapper`)}::after`]: {
          content: "''",
          display: 'table',
        },
        [`.${e(`${options.prefix}gap`)}, .${e(`${options.prefix}gap-padding`)}`]: {
          '--gap-x': '0px',
          '--gap-y': '0px',
          '--gap-x-half': 'calc(var(--gap-x) / 2)',
          '--gap-x-half-negative': 'calc(var(--gap-x-half) * -1)',
          '--gap-y-half': 'calc(var(--gap-y) / 2)',
          '--gap-y-half-negative': 'calc(var(--gap-y-half) * -1)',
          margin: 'var(--gap-y-half-negative) var(--gap-x-half-negative)',
        },
        [`.${e(`${options.prefix}gap`)} > *`]: {
          margin: 'var(--gap-y-half) var(--gap-x-half)',
        },
        [`.${e(`${options.prefix}gap-padding`)} > *`]: {
          padding: 'var(--gap-y-half) var(--gap-x-half)',
        },
      });
    }

    const combinedGapUtilities = _.fromPairs(
      _.concat(
        ..._.map(gapTheme, (value, modifier) => {
          if (options.legacy) {
            const halfValue = getHalfValue(value);
            const negativeHalfValue = `-${halfValue}`;
            return [
              [
                `.${e(`${options.prefix}gap-${modifier}`)}`,
                {
                  margin: negativeHalfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-${modifier}`)}:not([class*="gap-padding"]) > *`,
                {
                  margin: halfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-${modifier}`)}[class*="gap-padding"] > *`,
                {
                  padding: halfValue,
                },
              ],
            ];
          }
          return [
            [
              `.${e(`${options.prefix}gap-${modifier}`)}`,
              {
                '--gap-x': String(value) === '0' ? '0px' : value,
                '--gap-y': String(value) === '0' ? '0px' : value,
              },
            ],
          ];
        })
      )
    );

    const splitGapUtilities = _.fromPairs(
      _.concat(
        ..._.map(gapTheme, (value, modifier) => {
          if (options.legacy) {
            const halfValue = getHalfValue(value);
            const negativeHalfValue = `-${halfValue}`;
            return [
              [
                `.${e(`${options.prefix}gap-x-${modifier}`)}`,
                {
                  marginLeft: negativeHalfValue,
                  marginRight: negativeHalfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-x-${modifier}`)}:not([class*="gap-padding"]) > *`,
                {
                  marginLeft: halfValue,
                  marginRight: halfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-x-${modifier}`)}[class*="gap-padding"] > *`,
                {
                  paddingLeft: halfValue,
                  paddingRight: halfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-y-${modifier}`)}`,
                {
                  marginTop: negativeHalfValue,
                  marginBottom: negativeHalfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-y-${modifier}`)}:not([class*="gap-padding"]) > *`,
                {
                  marginTop: halfValue,
                  marginBottom: halfValue,
                },
              ],
              [
                `.${e(`${options.prefix}gap-y-${modifier}`)}[class*="gap-padding"] > *`,
                {
                  paddingTop: halfValue,
                  paddingBottom: halfValue,
                },
              ],
            ];
          }
          return [
            [
              `.${e(`${options.prefix}gap-x-${modifier}`)}`,
              {
                '--gap-x': String(value) === '0' ? '0px' : value,
              },
            ],
            [
              `.${e(`${options.prefix}gap-y-${modifier}`)}`,
              {
                '--gap-y': String(value) === '0' ? '0px' : value,
              },
            ],
          ];
        })
      )
    );

    const gapUtilities = {
      ...combinedGapUtilities,
      ...splitGapUtilities,
    };

    if (gapVariants.length > 0) {
      addComponents({
        [`@variants ${gapVariants.join(', ')}`]: gapUtilities,
      });
    }
    else {
      addComponents(gapUtilities);
    }
  };
});
