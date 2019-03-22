import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | webshop/conditions', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:webshop/conditions');
    assert.ok(route);
  });
});
