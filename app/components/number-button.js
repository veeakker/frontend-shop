import { action } from '@ember-decorators/object';
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
  options = [1,2,3,4,5,6,7,8,9]
  value = 0;

  classNames = ['number-input'];

  constructor(){
    super(...arguments);
    this.set('value', this.value || this.options[0]);
  }

  @action
  increaseValue(){
    this.set('value', nextItemInArray( this.options, this.value ));
  }

  @action
  decreaseValue(){
    this.set('value', previousItemInArray( this.options, this.value ));
  }
}
