import { helper } from '@ember/component/helper';

export default helper(function eNumberVal(/*positional, named*/) {
  return (event) => parseFloat(event.target.value);
});
