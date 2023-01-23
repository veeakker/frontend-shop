import { helper } from '@ember/component/helper';

export default helper(function euros([ amount ]/*, hash*/) {
  if( amount && amount !== NaN ) {
    return `€ ${amount.toFixed(2)}`;
  } else {
    return "---";
  }
});
