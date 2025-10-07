import { setupTest } from 'veeakker/tests/helpers';
import { module, test } from 'qunit';

module('Unit | Model | business entity', function (hooks) {
  setupTest(hooks);

  // Replace this with your real tests.
  test('it exists', function (assert) {
    const store = this.owner.lookup('service:store');
    const model = store.createRecord('business-entity', {});
    assert.ok(model, 'model exists');
  });
});
