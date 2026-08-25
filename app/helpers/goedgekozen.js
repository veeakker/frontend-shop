import { helper } from '@ember/component/helper';
import config from 'veeakker/config/environment';

export default helper(function goedgekozen() {
  return config.mainSite.enabled === 'false' && config.marketplaceBrand === 'goedgekozen';
});
