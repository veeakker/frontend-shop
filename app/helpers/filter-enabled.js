import { helper } from '@ember/component/helper';

export default helper(function filterEnabled([entities]/*, named*/) {
  return entities?.filter( (e) => e.isEnabled );
});
