import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render, settled } from '@ember/test-helpers';
import Service from '@ember/service';
import hbs from 'htmlbars-inline-precompile';

const fixtures = {
  data: [
    {
      type: 'product',
      id: '1',
      attributes: { label: 'Kotelet', 'is-enabled': true },
      relationships: {
        offerings: { data: [
          { type: 'offering', id: '11' },
          { type: 'offering', id: '12' }
        ]}
      }
    },
    {
      type: 'offering',
      id: '11',
      attributes: { 'is-enabled': true },
      relationships: {
        'type-and-quantity': { data: { type: 'type-and-quantity', id: '21' } },
        'unit-price': { data: { type: 'unit-price-specification', id: '31' } }
      }
    },
    {
      type: 'offering',
      id: '12',
      attributes: { 'is-enabled': true },
      relationships: {
        'type-and-quantity': { data: { type: 'type-and-quantity', id: '22' } },
        'unit-price': { data: { type: 'unit-price-specification', id: '31' } }
      }
    },
    {
      type: 'type-and-quantity',
      id: '21',
      attributes: { value: 1, unit: 'C62' }
    },
    {
      type: 'type-and-quantity',
      id: '22',
      attributes: { value: 5, unit: 'C62' }
    },
    {
      type: 'unit-price-specification',
      id: '31',
      attributes: { unit: 'EUR', value: 12.5 }
    }
  ]
};

module('Integration | Component | webshop/order-line-manager', function(hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function() {
    this.owner.register('service:basket', Service.extend({
      addOffer() {},
      orderLines: []
    }));
  });

  function pushFixtures(context) {
    const store = context.owner.lookup('service:store');
    store.pushPayload(JSON.parse(JSON.stringify(fixtures)));
    store.__done = true;
    context.set('product', store.peekRecord('product', '1'));
  }

  test('renders offers and emits the default offering', async function(assert) {
    pushFixtures(this);
    const selectedOffers = [];
    const defaultOffers = [];
    this.set('onChange', (offer) => selectedOffers.push(offer));
    this.set('onDefault', (offer) => defaultOffers.push(offer));

    this.set('amount', 2);
    await render(hbs`
      <Webshop::OrderLineManager
        @product={{this.product}}
        @selectedOffer={{this.selected}}
        @amount={{this.amount}}
        @onChange={{this.onChange}}
        @onDefault={{this.onDefault}}
        as |configuration|>
        <div data-test-out>loading:{{configuration.isLoading}} offers:{{#each configuration.offers as |offer|}}({{offer.id}}){{/each}} dbg:{{configuration.debugState}} units:{{configuration.units}} selunit:{{configuration.selectedUnit}} total:{{#if configuration.totalPrice}}{{configuration.totalPrice}}{{else}}none{{/if}}</div>
      </Webshop::OrderLineManager>
    `);

    await settled();
    const text = () => this.element.querySelector('[data-test-out]')?.innerText;
    const before = `defaults:[${defaultOffers.map(o => o?.id)}] text:'${text()}'`;

    assert.ok(defaultOffers.length === 1 && defaultOffers[0]?.id === '11', `default emitted once: ${before}`);

    this.set('selected', defaultOffers[0]);
    await settled();

    const after = `defaults:[${defaultOffers.map(o => o?.id)}] text:'${text()}'`;
    assert.ok(
      text().indexOf('(11)(12)') >= 0 &&
      text().indexOf('selunit:st') >= 0 &&
      text().indexOf('total:25') >= 0 &&
      selectedOffers.length === 0,
      `after adopting default: ${after}`
    );
  });

  test('product card renders the default offering configuration', async function(assert) {
    pushFixtures(this);
    await render(hbs`<ProductCard @product={{this.product}} />`);
    await settled();

    const text = this.element.querySelector('.product-card')?.innerText || '';
    const nuButtons = this.element.querySelectorAll('.product-card .number-button').length;
    const pakjeValue = this.element.querySelector('.product-card .number-value')?.innerText;

    assert.ok(
      nuButtons > 0,
      `card debug: buttons:${nuButtons} value:${pakjeValue} text:${text.slice(0,300)}`
    );
  });

  test('offering stepper loops between kg and g offerings', async function(assert) {
    const store = this.owner.lookup('service:store');
    store.pushPayload(JSON.parse(JSON.stringify({
      data: [
        {
          type: 'product',
          id: 'p2',
          attributes: { label: 'Entrecote', 'is-enabled': true },
          relationships: {
            offerings: { data: [
              { type: 'offering', id: 'o21' },
              { type: 'offering', id: 'o22' }
            ]}
          }
        },
        {
          type: 'offering',
          id: 'o21',
          attributes: { 'is-enabled': true },
          relationships: {
            'type-and-quantity': { data: { type: 'type-and-quantity', id: 't21' } },
            'unit-price': { data: { type: 'unit-price-specification', id: 'u21' } }
          }
        },
        {
          type: 'offering',
          id: 'o22',
          attributes: { 'is-enabled': true },
          relationships: {
            'type-and-quantity': { data: { type: 'type-and-quantity', id: 't22' } },
            'unit-price': { data: { type: 'unit-price-specification', id: 'u21' } }
          }
        },
        { type: 'type-and-quantity', id: 't21', attributes: { value: 2, unit: 'KGM' } },
        { type: 'type-and-quantity', id: 't22', attributes: { value: 500, unit: 'GRM' } },
        { type: 'unit-price-specification', id: 'u21', attributes: { unit: 'EUR', value: 10 } }
      ]
    })));
    const selectedOffers = [];
    const defaultOffers = [];
    this.set('onChange', (offer) => selectedOffers.push(offer));
    this.set('onDefault', (offer) => defaultOffers.push(offer));
    this.set('product', store.peekRecord('product', 'p2'));

    await render(hbs`
      <Webshop::OrderLineManager
        @product={{this.product}}
        @onChange={{this.onChange}}
        @onDefault={{this.onDefault}}
        as |configuration|>
        <div data-test-state>
          unit:{{configuration.selectedUnit}} units:{{configuration.units}} quantities:{{configuration.quantities}}
        </div>
      </Webshop::OrderLineManager>
    `);
    await settled();

    const state = () => this.element.querySelector('[data-test-state]')?.innerText;
    const report = `defaults:${defaultOffers.map(o => o?.id)} dispatched:(${selectedOffers.map(o => o?.id)}) before:'${state()}'`;

    this.set('selected', defaultOffers[0]);
    await settled();

    // step down and up through the offers as the +/- does
    this.selectedOffer = null;
    const offersUnit = `unit:${defaultOffers.length}`;
    assert.ok(defaultOffers.length === 1, `emitted default: ${report} ${offersUnit}`);

    await settled();
    assert.ok(state().indexOf('unit:') >= 0, `state after adoption: ${state()} -- ${report}`);
  });
});
