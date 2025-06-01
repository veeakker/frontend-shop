'use strict';

module.exports = function (environment) {
  let ENV = {
    modulePrefix: 'veeakker',
    environment,
    rootURL: '/',
    locationType: 'history',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. EMBER_NATIVE_DECORATOR_SUPPORT: true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false,
      },
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
    },

    plausible: {
      domain: '{{ANALYTICS_APP_DOMAIN}}',
      apiHost: '{{ANALYTICS_API_HOST}}',
    },
    sentry: {
      dsn: '{{SENTRY_DSN}}',
      environment: '{{SENTRY_ENVIRONMENT}}'
    },
    '@sentry/ember': {
      // You can disable performance to limit amount of data sent over
      // the wire.  Probably doesn't hurt to get started but is ideally
      // turned off after a while

      // disablePerformance: true
    }
  };

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
    ENV.plausible = {
      domain: 'shop.veeakker.be',
      apiHost: 'https://analytics.veeakker.be',
    };
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.locationType = 'none';

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false;
    ENV.APP.LOG_VIEW_LOOKUPS = false;

    ENV.APP.rootElement = '#ember-testing';
    ENV.APP.autoboot = false;
  }

  if (environment === 'production') {
    // here you can enable a production-specific feature
  }

  return ENV;
};
