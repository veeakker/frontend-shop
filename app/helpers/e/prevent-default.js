import { helper } from '@ember/component/helper';

export default helper(function ePreventDefault(/*positional, named*/) {
  return function (event) {
    event.preventDefault();
    return event;
  };
});
