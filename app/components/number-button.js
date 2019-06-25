import { computed } from '@ember/object';
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

export default class NumberButtonComponent extends Component {
  defaultOptions = [1,2,3,4,5,6,7,8,9]

  @or( "options", "defaultOptions" ) optionsArray;

  classNames = ['number-input'];

  constructor(){
    super(...arguments);
    // this.set('value', this.value || this.get('optionsArray')[0]);
  }

  changeCallback(){
    if( this.onChange ) {
      this.onChange( this.value );
    }
  }

  @action
  increaseValue(){
    this.set('value', nextItemInArray( this.get('optionsArray'), this.value ));
    this.changeCallback();
  }

  @action
  decreaseValue(){
    this.set('value', previousItemInArray( this.optionsArray, this.value ));
    this.changeCallback();
  }
}
