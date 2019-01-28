import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | products/beef', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:products/beef');
    assert.ok(route);
  });
});
