import { helper } from '@ember/component/helper';

export default helper(function eStrVal(_positional /*, named*/) {
  return (event) => event.target.value;
});
