import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('about');
  this.route('products', function() {
    this.route('beef');
    this.route('pork');
    this.route('chicken');
    this.route('lamb');
    this.route('fish');
    this.route('assorted');
  });
  this.route('news');
  this.route('locations', function() {
    this.route('kind', { path: ":normalized_label" });
  });
  this.route('webshop', function() {
    this.route('product-groups', function() {
      this.route('show', { path: ":id" }, function() {
        this.route('subgroups', function() {
          this.route('show', { path: ":subgroup_id" });
        });
      });
    });
    this.route('promoted');
    this.route('account');
    this.route('collection-points');
    this.route('conditions');
    this.route('help');
    this.route('basket');
    this.route('contactinfo');
    this.route('delivery');
    this.route('payment');
    this.route('checkout', function() {
      this.route('finish');
      this.route('contact-info');
    });
    this.route('favorites');
    this.route('orders');
    this.route('login');
    this.route('beef');
    this.route('product');
  });
});

export default Router;
