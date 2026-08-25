import Component from '@glimmer/component';
import { service } from '@ember/service';

export default class ThemeToggleComponent extends Component {
  @service theme;
}
