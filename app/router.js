import EmberRouter from '@ember/routing/router';
import config from './config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function() {
  this.route('about');
  this.route('contact-us');
  this.route('faq');
  this.route('general-conditions');
  this.route('locations', function() {
    this.route('kind', { path: ":normalized_label" });
  });
  this.route('news');
  this.route('products', function() {
    this.route('assorted');
    this.route('beef');
    this.route('chicken');
    this.route('fish');
    this.route('lamb');
    this.route('pork');
  });
  this.route('webshop', function() {
    this.route('account');
    this.route('basket');
    this.route('checkout', function() {
      this.route('contact-info');
      this.route('delivery');
      this.route('payment');
      this.route('finish', { path: "finish/:basket_id" } );
    });
    this.route('collection-points');
    this.route('conditions');
    this.route('favourites');
    this.route('help');
    this.route('login');
    this.route('orders');
    this.route('product', { path: "product/:product_id/" }, function() {
      this.route('information');
      this.route('ingredients');
      this.route('nutricional-values');
      this.route('allergenics');
    });
    this.route('product-groups', function() {
      this.route('show', { path: ":id" }, function() {
        this.route('subgroups', function() {
          this.route('show', { path: ":subgroup_id" });
        });
      });
    });
    this.route('promoted');
    this.route('register');
  });
});
