import { init as initGlitchtip } from '@sentry/ember';
import config from 'veeakker/config/environment';

export default function setupGlitchtip() {
  try {
    if (config.sentry.dsn !== '{{SENTRY_DSN}}') {
      let sentryEnvironment =
        config.sentry.environment !== '{{SENTRY_ENVIRONMENT}}'
          ? config.sentry.environment
          : 'production';

      initGlitchtip({
        dsn: config.sentry.dsn,
        release: config.APP.version, // ember-cli-app-version sets this value
        environment: sentryEnvironment,
        autoSessionTracking: false, // Not implemented by GlitchTip so it triggers a lot of 501 "Not implemented" responses
      });
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Could not init glitchtip ${e}`);
  }
}
