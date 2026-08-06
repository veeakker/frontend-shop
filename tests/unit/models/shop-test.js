import { setupTest } from 'veeakker/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | shop', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('shop', {});
    assert.ok(model, 'model exists');
  });
});
