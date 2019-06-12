import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | general-conditions', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:general-conditions');
    assert.ok(route);
  });
});
