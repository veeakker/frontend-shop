import ENV from 'veeakker/config/environment';

export function initialize(application) {
  const plausible = application.lookup('service:plausible');
  const { domain, apiHost } = ENV.plausible;
  if (
    domain !== '{{ANALYTICS_APP_DOMAIN}}' &&
    apiHost !== '{{ANALYTICS_API_HOST}}'
  ) {
    plausible.enable({
      domain,
      apiHost,
      enableAutoOutboundTracking: true,
      // enable when testing new features and update plausible in dev config/environment.js if needed
      trackLocalhost: false,
    });
  }
}

export default {
  initialize,
};
