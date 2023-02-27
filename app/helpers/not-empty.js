import { helper } from '@ember/component/helper';

function notEmpty(x) {
  return x !== undefined && x !== null && x !== "";
}

export default helper(function notEmpty(positional/*, named*/) {
  return positional.every(notEmpty);
});

export { notEmpty }
