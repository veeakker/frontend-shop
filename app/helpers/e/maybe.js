import { helper } from '@ember/component/helper';

export default helper(function eMaybe([child], options) {
  return function () {
    if (child)
      child.apply(arguments);
    else
      return Object.assign({ default: true }, options).default;
  };
});
