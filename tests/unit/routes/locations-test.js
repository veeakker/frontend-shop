import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | locations', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:locations');
    assert.ok(route);
  });
});
