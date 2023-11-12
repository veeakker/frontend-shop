import Controller from '@ember/controller';

export default class LocationsController extends Controller {
  butcheryLocation = [50.874007,4.689850];

  get enabledLocations() {
    return this.model?.filter( (e) => e.isEnabled );
  }
}
