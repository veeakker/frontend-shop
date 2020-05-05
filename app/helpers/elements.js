import { A } from '@ember/array';
import { helper } from '@ember/component/helper';

export default helper(function elements([one, two]/*, hash*/) {
  return A([one, two]);
});
