import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';

export default class WebshopBasketsIndexController extends Controller {
  @tracked
  page = 0;

  queryParams = ['page'];

}
