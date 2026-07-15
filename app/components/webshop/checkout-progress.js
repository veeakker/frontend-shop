import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

class CheckoutProgressView {
  constructor(step, number, active, onFinishRoute) {
    this.step = step;
    this.number = number;
    this.active = active;
    this.onFinishRoute = onFinishRoute;
  }

  get label()   { return this.step.label; }
  get route()   { return this.step.route; }
  get satisfied() { return this.onFinishRoute || this.step.satisfied; }

  get classNames() {
    return [
      'checkout-progress__step',
      `checkout-progress__step--${this.satisfied ? 'completed' : 'pending'}`,
      this.active ? 'checkout-progress__step--active' : '',
    ].filter(Boolean).join(' ');
  }
}

export default class CheckoutProgressComponent extends Component {
  @service checkoutRequirements;
  @service router;

  get steps() {
    const index = this.checkoutRequirements.stepIndexByAlias[this.args.currentStep] ?? 1;
    const onFinishRoute = this.router.currentRouteName === 'webshop.checkout.finish';
    return this.checkoutRequirements.steps.map((step, i) =>
      new CheckoutProgressView(step, i + 1, i === index, onFinishRoute));
  }
}