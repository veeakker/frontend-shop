import { module, test } from 'qunit';
import { setupTest } from 'veeakker/tests/helpers';

module(
  'Unit | Route | webshop/product-groups/show/subgroups/index',
  function (hooks) {
    setupTest(hooks);

    test('it exists', function (assert) {
      let route = this.owner.lookup(
        'route:webshop/product-groups/show/subgroups/index'
      );
      assert.ok(route);
    });
  }
);
