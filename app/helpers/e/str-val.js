import { helper } from '@ember/component/helper';

export default helper(function eStrVal(/* positional, named*/) {
  return (event) => event.target.value;
});
