import { set } from '@ember/object';
import { helper } from '@ember/component/helper';

export default helper(function eSetProp([object, key] /*, named*/) {
  return function (value) {
    set(object, key, value);
    return value;
  };
});
