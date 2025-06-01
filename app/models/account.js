import { tracked } from '@glimmer/tracking';
import Model, { attr, belongsTo } from '@ember-data/model';
export default class AccountModel extends Model {
  @attr('string') email;
  @tracked password;
  @belongsTo('person', {inverse: 'accounts', async: true}) person;
}
