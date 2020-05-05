import { action } from '@ember/object';
import { or } from '@ember/object/computed';
import Component from '@ember/component';

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

  @or( "options", "defaultOptions" ) optionsArray;

  classNames = ['number-input'];

  constructor(){
    super(...arguments);
  }

  executeChange( newValue ) {
    if( this.onChange )
      this.onChange( newValue );
    else
      this.set( 'value', newValue );
  }

  @action
  increaseValue(){
    const next = nextItemInArray( this.optionsArray, this.value );
    this.executeChange( next );
  }

  @action
  decreaseValue(){
    const previous = previousItemInArray( this.optionsArray, this.value );
    this.executeChange( previous );
  }
}
