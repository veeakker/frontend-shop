import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';
export default class WebshopLoginRoute extends Route {
  @service() session;

  beforeModel() {
     this.session.prohibitAuthentication('index');
  }

  // Capture where the user came from so the login controller can send
  // them back. URL-supplied query params win so shared links survive a
  // full-page load.
  setupController(controller, _context, transition) {
    super.setupController(...arguments);
    const from = transition?.from;

    if (from) {
      controller.afterLoginRoute ??= from.name;

      const segments = [];
      let info = from;
      while (info) {
        if (info.params) {
          for (const key of Object.keys(info.params)) {
            if (info.params[key] != null) segments.unshift(info.params[key]);
          }
        }
        info = info.parent;
      }
      controller.afterLoginModel ??= segments.length ? segments.join(',') : null;
    }
  }
}
