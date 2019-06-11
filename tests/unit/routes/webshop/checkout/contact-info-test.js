import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | dummy-parent/dummy-child', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:webshop/checkout/checkout-test');
    assert.ok(route);
  });
});
