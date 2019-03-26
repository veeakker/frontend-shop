import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | webshop/product', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:webshop/product');
    assert.ok(route);
  });
});
