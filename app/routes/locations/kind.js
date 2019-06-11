import Route from '@ember/routing/route';
import { uriForNormalizedLabel } from 'veeakker/models/delivery-kind';
import { inject as service } from '@ember/service';

export default class LocationsKindRoute extends Route {
  @service store;

  model({normalized_label}){
    const uri = uriForNormalizedLabel( normalized_label );
    const knownRecords = this.store.peekAll('delivery-kind');
    const foundDeliveryKind = knownRecords.findBy( 'uri', uri );

    if ( foundDeliveryKind ) {
      return foundDeliveryKind;
    } else {
      return this.store.query( 'delivery-kind', { "filter[:uri:]": uri } ).then( (kinds) => {
        return kinds.firstObject;
      } );
    }
  }

  serialize( model, params ){
    return { normalized_label: model.get('normalizedLabel') };
  }
}
