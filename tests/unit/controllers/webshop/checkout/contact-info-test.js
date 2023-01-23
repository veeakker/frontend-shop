import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Controller | webshop/checkout/contact-info', function(hooks) {
  setupTest(hooks);

  // TODO: Replace this with your real tests.
  test('it exists', function(assert) {
    let controller = this.owner.lookup('controller:webshop/checkout/contact-info');
    assert.ok(controller);
  });
});
