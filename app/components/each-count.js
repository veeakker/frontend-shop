import Component from '@glimmer/component';

export default class EachCountComponent extends Component {
  get eachArray() {
    const arr = [];
    for( let idx = 0; idx < ( this.args.count || 0 ); idx ++ )
      arr.push( idx );
    return arr;
  }
}
