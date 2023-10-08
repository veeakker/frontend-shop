import { inject as service } from '@ember/service';
import Base from 'ember-simple-auth/authenticators/base';
import fetch, { Headers } from 'fetch';

export default class MuSemtechAuthenticator extends Base {
  @service store;

  async authenticate(options) {
    const result = await fetch('/sessions', {
      method: 'POST',
      headers: new Headers({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      }),
      body: JSON.stringify({
        data: {
          type: 'sessions',
          attributes: {
            email: options['email'],
            password: options['password']
          }
        }
      })
    });

    if (result.ok) {
      const payload = await result.json();
      this.store.pushPayload( { data: payload.included } );
      return payload.data;
    } else {
      const response = await result.json();
      throw response;
    }
  }

  async restore(/*data*/) {
    const result = await fetch('/sessions/current', {
      method: 'GET',
      headers: new Headers({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      })
    });

    if (result.ok) {
      const payload = await result.json();
      this.store.pushPayload( { data: payload.included } );
      return payload.data;
    } else {
      throw result;
    }
  }

  async invalidate() {
    const result = await fetch('/sessions/current', {
      method: 'DELETE',
      headers: new Headers({
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json'
      })
    });
    if (result.ok)
      return result;
    else
      throw result;
  }
}
