import { helper } from '@ember/component/helper';

export default helper(function eBooleanVal(/*positional , named*/) {
  return function (event) {
    return event.target.checked;
  };
});
