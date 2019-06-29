import { alias } from '@ember/object/computed';
import Component from '@ember/component';

export default class extends Component {
  tagName = ""

  @alias( "product.thumbnail.downloadUrl" ) downloadUrl
}
