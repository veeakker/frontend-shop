import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | products/lamb', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:products/lamb');
    assert.ok(route);
  });
});
