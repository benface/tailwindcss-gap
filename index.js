const _ = require('lodash');
const valueParser = require('postcss-value-parser');

module.exports = function(options = {}) {
  return ({ theme, variants, addComponents, e }) => {
    const defaultOptions = {
      legacy: false,
    };
    options = _.defaults({}, options, defaultOptions);

    const defaultGapTheme = {};
    const defaultGapVariants = ['responsive'];

    const gapTheme = theme('gap', defaultGapTheme);
    const gapVariants = variants('gap', defaultGapVariants);

    if (!options.legacy) {
      addComponents({
        '.gap, .gap-padding': {
          '--gap-x': '0px',
          '--gap-y': '0px',
          '--gap-x-half': 'calc(var(--gap-x) / 2)',
          '--gap-x-half-negative': 'calc(var(--gap-x-half) * -1)',
          '--gap-y-half': 'calc(var(--gap-y) / 2)',
          '--gap-y-half-negative': 'calc(var(--gap-y-half) * -1)',
          margin: 'var(--gap-y-half-negative) var(--gap-x-half-negative)',
        },
        '.gap > *': {
          margin: 'var(--gap-y-half) var(--gap-x-half)',
        },
        '.gap-padding > *': {
          padding: 'var(--gap-y-half) var(--gap-x-half)',
        },
      });
    }

    const getHalfValue = function(value) {
      const parsedValue = valueParser.unit(value);
      return `${parsedValue.number / 2}${parsedValue.unit}`;
    };

    const combinedGapUtilities = _.fromPairs(
      _.concat(
        ..._.map(gapTheme, (value, modifier) => {
          if (options.legacy) {
            const halfValue = getHalfValue(value);
            const negativeHalfValue = `-${halfValue}`;
            return [
              [
                `.${e(`gap-${modifier}`)}`,
                {
                  margin: negativeHalfValue,
                },
              ],
              [
                `.${e(`gap-${modifier}`)}:not([class*="gap-padding"]) > *`,
                {
                  margin: halfValue,
                },
              ],
              [
                `.${e(`gap-${modifier}`)}[class*="gap-padding"] > *`,
                {
                  padding: halfValue,
                },
              ],
            ];
          }
          return [
            [
              `.${e(`gap-${modifier}`)}`,
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
                `.${e(`gap-x-${modifier}`)}`,
                {
                  marginLeft: negativeHalfValue,
                  marginRight: negativeHalfValue,
                },
              ],
              [
                `.${e(`gap-x-${modifier}`)}:not([class*="gap-padding"]) > *`,
                {
                  marginLeft: halfValue,
                  marginRight: halfValue,
                },
              ],
              [
                `.${e(`gap-x-${modifier}`)}[class*="gap-padding"] > *`,
                {
                  paddingLeft: halfValue,
                  paddingRight: halfValue,
                },
              ],
              [
                `.${e(`gap-y-${modifier}`)}`,
                {
                  marginTop: negativeHalfValue,
                  marginBottom: negativeHalfValue,
                },
              ],
              [
                `.${e(`gap-y-${modifier}`)}:not([class*="gap-padding"]) > *`,
                {
                  marginTop: halfValue,
                  marginBottom: halfValue,
                },
              ],
              [
                `.${e(`gap-y-${modifier}`)}[class*="gap-padding"] > *`,
                {
                  paddingTop: halfValue,
                  paddingBottom: halfValue,
                },
              ],
            ];
          }
          return [
            [
              `.${e(`gap-x-${modifier}`)}`,
              {
                '--gap-x': value,
              },
            ],
            [
              `.${e(`gap-y-${modifier}`)}`,
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
};
