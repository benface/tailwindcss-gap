const _ = require('lodash');

module.exports = ({
  gaps = {},
  variants = [],
} = {}) => ({ e, addComponents }) => {
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
  let gapValues = _.map(gaps, (value, name) => {
    return {
      [`.${e(`gap-${name}`)}`]: { '--gap': value },
      [`.${e(`gap-x-${name}`)}`]: { '--gap-x': value },
      [`.${e(`gap-y-${name}`)}`]: { '--gap-y': value },
    };
  });
  if (variants.length > 0) {
    gapValues = {
      [`@variants ${variants.join(', ')}`]: gapValues,
    };
  }
  addComponents(gapValues);
};
