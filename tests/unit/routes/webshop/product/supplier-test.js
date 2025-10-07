import { module, test } from 'qunit';
import { setupTest } from 'veeakker/tests/helpers';

module('Unit | Route | webshop/product/supplier', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:webshop/product/supplier');
    assert.ok(route);
  });
});
