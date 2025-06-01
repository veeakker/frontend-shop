import JSONAPIAdapter from '@ember-data/adapter/json-api';
import { captureMessage } from '@sentry/ember';

export default class ApplicationAdapter extends JSONAPIAdapter {
  async findHasMany(_store, _snapshot, url, /* _relationship */) {
    const response = await super.findHasMany(...arguments);
    try {
      if ( response.meta.count > response.data.length ) {
        captureMessage(`Not all resources for findHasMany returned from backend`, {
          extra: {
            available: response.meta.count,
            returned: response.data.length,
            url: url
          }
        });
        // eslint-disable-next-line no-console
        console.warn("Not all resources for findHasMany returned from backend");
      }
    } catch (_e) {
      // eslint-disable-next-line no-console
      console.warn("Failed to calculate or submit error information.");
    }
    return response;
  }
}
