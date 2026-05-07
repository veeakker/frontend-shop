import Component from '@glimmer/component';

const CURRENT_STEP_INDEX = {
  'basket':       0,
  'contact-info': 1,
  'delivery':     2,
  'payment':      3,
  'finish':       3,
};

export default class CheckoutProgressComponent extends Component {
  get currentIndex() {
    return CURRENT_STEP_INDEX[this.args.currentStep] ?? 1;
  }

  get steps() {
    const ci = this.currentIndex;
    const hasOnAdvance = !!this.args.onAdvance;

    const state     = (idx) => idx < ci ? 'completed' : idx === ci ? 'active' : 'upcoming';
    const isAdvance = (idx) => idx === ci + 1 && hasOnAdvance;
    const clickable = (idx) => idx < ci || isAdvance(idx);

    return [
      { number: 1, label: 'Winkelmandje', state: state(0), clickable: clickable(0), isAdvance: isAdvance(0), route: 'webshop.basket',                showConnector: false, connectorDone: false  },
      { number: 2, label: 'Gegevens',     state: state(1), clickable: clickable(1), isAdvance: isAdvance(1), route: 'webshop.checkout.contact-info', showConnector: true,  connectorDone: ci > 0 },
      { number: 3, label: 'Levering',     state: state(2), clickable: clickable(2), isAdvance: isAdvance(2), route: 'webshop.checkout.delivery',     showConnector: true,  connectorDone: ci > 1 },
      { number: 4, label: 'Klaar',        state: state(3), clickable: clickable(3), isAdvance: isAdvance(3), route: null,                            showConnector: true,  connectorDone: ci > 2 },
    ];
  }
}
