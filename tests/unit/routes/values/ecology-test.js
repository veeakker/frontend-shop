import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | values/ecology', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:values/ecology');
    assert.ok(route);
  });
});
