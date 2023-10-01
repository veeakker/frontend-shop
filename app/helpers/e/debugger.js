import { helper } from '@ember/component/helper';

export default helper(function eDebugger(/* positional, named*/) {
  return function (arg) {
    // eslint-disable-next-line no-debugger
    debugger;
    return arg;
  };
});
