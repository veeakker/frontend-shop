import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Service | checkout-requirements', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let service = this.owner.lookup('service:checkout-requirements');
    assert.ok(service);
  });

  test('it exposes four step singletons in canonical order', function(assert) {
    const service = this.owner.lookup('service:checkout-requirements');
    const steps = service.steps;
    assert.strictEqual(steps.length, 4, 'four steps');
    assert.strictEqual(steps[0].name, 'basket',   'step 1 is basket');
    assert.strictEqual(steps[1].name, 'identity', 'step 2 is identity');
    assert.strictEqual(steps[2].name, 'delivery',  'step 3 is delivery');
    assert.strictEqual(steps[3].name, 'finish',    'step 4 is finish');
  });

  test('stepIndexByAlias maps route fragments to step positions', function(assert) {
    const service = this.owner.lookup('service:checkout-requirements');
    assert.strictEqual(service.stepIndexByAlias['basket'],       0);
    assert.strictEqual(service.stepIndexByAlias['contact-info'], 1);
    assert.strictEqual(service.stepIndexByAlias['delivery'],     2);
    assert.strictEqual(service.stepIndexByAlias['payment'],      3);
    assert.strictEqual(service.stepIndexByAlias['finish'],       3);
  });
});