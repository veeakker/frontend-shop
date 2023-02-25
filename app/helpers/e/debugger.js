import { helper } from '@ember/component/helper';

export default helper(function eDebugger(/* positional, named*/) {
  return function (arg) {
    debugger;
    return arg;
  };
});
