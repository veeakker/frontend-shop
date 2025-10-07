import { module, test } from 'qunit';
import { setupTest } from 'veeakker/tests/helpers';

module('Unit | Route | at-delivery-point', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:at-delivery-point');
    assert.ok(route);
  });
});
