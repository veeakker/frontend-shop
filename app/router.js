import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('news');
  this.route('locations', function() {
    this.route('kind', { path: ":normalized_label" });
  });
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
    this.route('beef');
    this.route('checkout', function() {
      this.route('contact-info');
      this.route('finish');
      this.route('payment');
      this.route('delivery');
    });
    this.route('collection-points');
    this.route('conditions');
    this.route('contactinfo');
    this.route('favorites');
    this.route('help');
    this.route('login');
    this.route('orders');
    this.route('product');
    this.route('product-groups', function() {
      this.route('show', { path: ":id" }, function() {
        this.route('subgroups', function() {
          this.route('show', { path: ":subgroup_id" });
        });
      });
    });
    this.route('promoted');
  });
});

export default Router;
