import { action } from '@ember/object';
import Component from '@glimmer/component';

function nextItemInArray( array, item ) {
  const currentIndex = array.indexOf( item );
  return array[Math.min( currentIndex + 1, array.length - 1 )];
}

function previousItemInArray( array, item ) {
  const currentIndex = array.indexOf( item );
  return array[Math.max( 0, currentIndex - 1 )];
}

/**
 * Accepts onChange.  When onChange is supplied, you are responsible
 * this.onChanfor handling the changes and setting the new value.
 */

export default class NumberButtonComponent extends Component {
  defaultOptions = [1,2,3,4,5,6,7,8,9]

  get optionsArray() {
    return this.args.options?.length ? this.args.options : this.defaultOptions;
  }

  constructor(){
    super(...arguments);
  }

  executeChange( newValue ) {
    if( this.args.onChange )
      this.args.onChange( newValue );
    else
      console.warn("You must consume the value of a number button through onChange");
  }

  @action
  increaseValue(){
    const next = nextItemInArray( this.optionsArray, this.args.value );
    this.executeChange( next );
  }

  @action
  decreaseValue(){
    const previous = previousItemInArray( this.optionsArray, this.args.value );
    this.executeChange( previous );
  }
}
