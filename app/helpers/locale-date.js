import { helper } from '@ember/component/helper';

export default helper(function localeDate([date]/*, named*/) {
  if ( date && ( date.toLocaleTimeString || typeof date == "string" ) ) {
    let realDate = typeof date == "string" ? new Date(date) : date;
    return `${realDate.toLocaleDateString()} ${realDate.toLocaleTimeString()}`;
  } else {
    return "";
  }
});
