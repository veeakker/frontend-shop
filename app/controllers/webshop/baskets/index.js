import { tracked } from '@glimmer/tracking';
import Controller from '@ember/controller';
import { CONFIRMED, DRAFT } from 'veeakker/models/basket';

export default class WebshopBasketsIndexController extends Controller {
  @tracked
  page = 0;

  queryParams = ['page'];

  CONFIRMED = CONFIRMED;
  DRAFT = DRAFT;
}
