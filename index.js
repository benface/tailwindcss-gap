const _ = require('lodash');

module.exports = function() {
  return ({ theme, variants, addComponents, e }) => {
    const defaultGapTheme = {};
    const defaultGapVariants = ['responsive'];

    const gapTheme = theme('gap', defaultGapTheme);
    const gapVariants = variants('gap', defaultGapVariants);

    addComponents({
      '.gap, .gap-padding': {
        '--gap-x': '0px',
        '--gap-y': '0px',
        '--gap-x-half': 'calc(var(--gap-x) / 2)',
        '--gap-x-half-negative': 'calc(var(--gap-x-half) * -1)',
        '--gap-y-half': 'calc(var(--gap-y) / 2)',
        '--gap-y-half-negative': 'calc(var(--gap-y-half) * -1)',
        'margin': 'var(--gap-y-half-negative) var(--gap-x-half-negative)',
      },
      '.gap > *': {
        'margin': 'var(--gap-y-half) var(--gap-x-half)',
      },
      '.gap-padding > *': {
        'padding': 'var(--gap-y-half) var(--gap-x-half)',
      },
    });

    const combinedGapUtilities = _.fromPairs(
      _.map(gapTheme, (value, modifier) => {
        return [
          `.${e(`gap-${modifier}`)}`,
          {
            '--gap-x': value,
            '--gap-y': value,
          },
        ];
      })
    );

    const splitGapUtilities = _.fromPairs(
      _.concat(
        ..._.map(gapTheme, (value, modifier) => {
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

    const gapUtilities = _.merge({}, combinedGapUtilities, splitGapUtilities);

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
