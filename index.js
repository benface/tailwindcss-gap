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
        [`.${e(`${options.prefix}gap`)}, .${e(`${options.prefix}gap-padding`)}`]: {
          '--gap-x-half': 'calc(var(--gap-x) / 2)',
          '--gap-x-half-negative': 'calc(var(--gap-x-half) * -1)',
          '--gap-y-half': 'calc(var(--gap-y) / 2)',
          '--gap-y-half-negative': 'calc(var(--gap-y-half) * -1)',
          marginLeft: 'var(--gap-x-half-negative)',
          marginRight: 'var(--gap-x-half-negative)',
          marginTop: 'var(--gap-y-half-negative)',
          marginBottom: 'var(--gap-y-half-negative)',
        },
        [`.${e(`${options.prefix}gap`)} > *`]: {
          marginLeft: 'var(--gap-x-half)',
          marginRight: 'var(--gap-x-half)',
          marginTop: 'var(--gap-y-half)',
          marginBottom: 'var(--gap-y-half)',
        },
        [`.${e(`${options.prefix}gap-padding`)} > *`]: {
          paddingLeft: 'var(--gap-x-half)',
          paddingRight: 'var(--gap-x-half)',
          paddingTop: 'var(--gap-y-half)',
          paddingBottom: 'var(--gap-y-half)',
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
                '--gap-x': value,
                '--gap-y': value,
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
                '--gap-x': value,
              },
            ],
            [
              `.${e(`${options.prefix}gap-y-${modifier}`)}`,
              {
                '--gap-y': value,
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
