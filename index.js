const _ = require('lodash');

module.exports = ({
  gaps = {},
  variants = [],
} = {}) => ({ e, addUtilities }) => {
  addUtilities(
    _.map(gaps, (value, name) => ({
      [`.${e(`gap-${name}`)}`]: { margin: '-' + value },
      [`.${e(`gap-${name}`)} > *`]: { margin: value },
      [`.${e(`gap-x-${name}`)}`]: { marginLeft: '-' + value, marginRight: '-' + value },
      [`.${e(`gap-x-${name}`)} > *`]: { marginLeft: value, marginRight: value },
      [`.${e(`gap-y-${name}`)}`]: { marginTop: '-' + value, marginBottom: '-' + value },
      [`.${e(`gap-y-${name}`)} > *`]: { marginTop: value, marginBottom: value },
    })),
    variants,
  );
};
