const _ = require('lodash');
const valueParser = require('postcss-value-parser');

module.exports = ({
  gaps = {},
  variants = [],
} = {}) => ({ e, addUtilities }) => {
  addUtilities(
    _.map(gaps, (value, name) => {
      let parsedValue = valueParser.unit(value);
      let halfValue = `${parsedValue.number / 2}${parsedValue.unit}`;
      let negativeHalfValue = `-${halfValue}`;
      return {
        [`.${e(`gap-${name}`)}`]: { margin: negativeHalfValue },
        [`.${e(`gap-${name}`)} > *`]: { margin: halfValue },
        [`.${e(`gap-x-${name}`)}`]: { marginLeft: negativeHalfValue, marginRight: negativeHalfValue },
        [`.${e(`gap-x-${name}`)} > *`]: { marginLeft: halfValue, marginRight: halfValue },
        [`.${e(`gap-y-${name}`)}`]: { marginTop: negativeHalfValue, marginBottom: negativeHalfValue },
        [`.${e(`gap-y-${name}`)} > *`]: { marginTop: halfValue, marginBottom: halfValue },
      };
    }),
    variants,
  );
};
