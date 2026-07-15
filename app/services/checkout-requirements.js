import { inject as service } from '@ember/service';
import Service from '@ember/service';
import { notEmpty } from 'veeakker/helpers/not-empty';

const POSTAL = 'http://veeakker.be/delivery-methods/postal';
const TOUR   = 'http://veeakker.be/delivery-methods/tour';
const SHOP   = 'http://veeakker.be/delivery-methods/shop';

const KIND_TOEREN        = 'http://veeakker.be/delivery-kinds/toeren';
const KIND_NATUURWINKELS = 'http://veeakker.be/delivery-kinds/natuurwinkels';

class CheckoutStep {
  requirements;              // back-reference to the service, set after instantiation
  name;                       // machine identifier, e.g. 'basket'
  label;                      // human label, e.g. 'Winkelmandje'
  route;                      // LinkTo route, e.g. 'webshop.basket'; null on terminal step
  aliases = [];               // currentStep strings that map to this step's index

  get satisfied() {
    return false;
  }

  get isTerminal() {
    return this.route === null;
  }
}

class BasketStep extends CheckoutStep {
  name    = 'basket';
  label   = 'Winkelmandje';
  route   = 'webshop.basket';
  aliases = ['basket'];

  get satisfied() {
    const lines = this.requirements.basket.orderLinesR;
    return !!lines && lines.length > 0 && !this.requirements.basket.hasUnavailableOrderLines;
  }
}

class IdentityStep extends CheckoutStep {
  name    = 'identity';
  label   = 'Gegevens';
  route   = 'webshop.checkout.contact-info';
  aliases = ['contact-info'];

  get satisfied() {
    if (this.requirements.session.isAuthenticated) {
      return true;
    } else {
      const b = this.requirements.basket;
      if (!b || !b.get('basket.invoice')) {
        return false;
      } else {
        return (
          notEmpty(b.get('basket.invoice.firstName')) &&
          notEmpty(b.get('basket.invoice.lastName')) &&
          notEmpty(b.get('basket.invoice.address.streetAddress')) &&
          notEmpty(b.get('basket.invoice.address.postalCode')) &&
          notEmpty(b.get('basket.invoice.address.locality')) &&
          notEmpty(b.get('basket.invoice.telephone')) &&
          notEmpty(b.get('basket.invoice.email'))
        );
      }
    }
  }
}

class DeliveryStep extends CheckoutStep {
  name    = 'delivery';
  label   = 'Levering';
  route   = 'webshop.checkout.delivery';
  aliases = ['delivery'];

  get satisfied() {
    try {
      const basket = this.requirements.basket.basket;
      if (!basket) {
        return false;
      } else {
        switch (basket.deliveryType) {
          case POSTAL:
            return true;
          case TOUR:
            return basket.deliveryPlace.get('deliveryKind.uri') === KIND_TOEREN;
          case SHOP:
            return basket.deliveryPlace.get('deliveryKind.uri') === KIND_NATUURWINKELS;
          default:
            return false;
        }
      }
    } catch (e) {
      return false;
    }
  }
}

class FinishStep extends CheckoutStep {
  name    = 'finish';
  label   = 'Klaar';
  route   = null;
  aliases = ['finish', 'payment'];
}

export default class CheckoutRequirementsService extends Service {
  @service basket;
  @service session;

  basketStep   = new BasketStep();
  identityStep = new IdentityStep();
  deliveryStep = new DeliveryStep();
  finishStep   = new FinishStep();

  stepIndexByAlias;

  constructor(...args) {
    super(...args);
    const steps = [this.basketStep, this.identityStep, this.deliveryStep, this.finishStep];
    steps.forEach((step) => step.requirements = this);
    const indexByAlias = {};
    steps.forEach((step, i) => step.aliases.forEach((alias) => indexByAlias[alias] = i));
    this.stepIndexByAlias = indexByAlias;
  }

  get steps() {
    return [this.basketStep, this.identityStep, this.deliveryStep, this.finishStep];
  }

  get basketReady()    { return this.basketStep.satisfied; }
  get identityKnown()  { return this.identityStep.satisfied; }
  get deliveryChosen() { return this.deliveryStep.satisfied; }

  get allSatisfied() {
    return this.basketStep.satisfied && this.identityStep.satisfied && this.deliveryStep.satisfied;
  }

  get firstUnsatisfiedStep() {
    return this.steps.find((step) => !step.isTerminal && !step.satisfied) ?? null;
  }
}