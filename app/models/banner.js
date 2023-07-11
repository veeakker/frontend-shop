import Model, { attr } from '@ember-data/model';

export default class BannerModel extends Model {
  @attr('string') title;
  @attr('sort-index') number;
  @attr('boolean') isEnabled;
}
