import { helper } from '@ember/component/helper';

export default helper(function euros([ amount ]/*, hash*/) {
  if( Number.isFinite(amount) ) {
    return `€ ${amount.toFixed(2)}`;
  } else {
    return "---";
  }
});
