import { helper } from '@ember/component/helper';

export default helper(function eCall([object, method] /*, named*/) {
  return function () {
    return object[method].call(object);
  };
});
