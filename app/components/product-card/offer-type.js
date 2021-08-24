import Component from '@ember/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';


export default class ProductCardOfferTypeCompnonent extends Component {
    @tracked currentUnit = null;
    @tracked possibleUnits = this.units;

    @action selectValue(unit) {
        this.currentUnit = unit;
    }
}
