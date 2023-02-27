import { helper } from '@ember/component/helper';

export default helper(function humanUnit([unit]/*, named*/) {
  if( unit == "KGM" )
    return "kg";
  else if( unit == "GRM" )
    return "g";
  else if( unit == "C62" )
    return "st";
  else
    return undefined;
});
