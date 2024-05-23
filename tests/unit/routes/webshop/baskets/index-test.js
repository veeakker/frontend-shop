import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | webshop/baskets/index', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:webshop/baskets/index');
    assert.ok(route);
  });
});
