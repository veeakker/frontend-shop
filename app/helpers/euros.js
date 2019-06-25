import { helper } from '@ember/component/helper';

export default helper(function euros([ amount ]/*, hash*/) {
  if( amount ) {
    return `€ ${amount.toFixed(2)}`;
  } else {
    return "---";
  }
});
