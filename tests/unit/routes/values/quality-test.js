import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | values/quality', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:values/quality');
    assert.ok(route);
  });
});
