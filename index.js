const _ = require('lodash');

module.exports = function() {
  return ({ config, e, addComponents }) => {
    const defaultGapTheme = {};
    const defaultGapVariants = ['responsive'];

    addComponents({
      '.gap, .gap-padding': {
        '--gap': '0px',
        '--gap-x': 'var(--gap)',
        '--gap-y': 'var(--gap)',
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

    const gapUtilities = _.fromPairs(
      _.concat(
        ..._.map(config('theme.gap', defaultGapTheme), (value, modifier) => {
          return [
            [
              `.${e(`gap-${modifier}`)}`,
              {
                '--gap': value,
              },
            ],
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

    const variants = config('variants.gap', defaultGapVariants);

    if (variants.length > 0) {
      addComponents({
        [`@variants ${variants.join(', ')}`]: gapUtilities,
      });
    }
    else {
      addComponents(gapUtilities);
    }
  };
};
