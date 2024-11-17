import { inject as service } from '@ember/service';
import Base from 'ember-simple-auth/authenticators/base';
import fetch, { Headers } from 'fetch';
import { setUser, /* captureMessage */ } from '@sentry/ember';

// we assume the response of authenticate and restore both contain the session
function setGlitchtipUserFromResponse(resp) {
  const session = resp?.data?.id;
  const email = resp?.included?.find((r) => r.type=="accounts")?.attributes?.email;
  try {
    if ( session || email ) {
      setUser({session, email});
    } else {
      setUser({ id: `unknown-${Math.floor(Math.random()*1000000)}` });
    }
    // captureMessage( { message: "User initialized" });
  } catch (e) {
    console.warn(`Could not set up glitchtip ${e}`);
  }
}

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
      setGlitchtipUserFromResponse(payload);
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
      setGlitchtipUserFromResponse(payload);
      this.store.pushPayload( { data: payload.included } );
      return payload.data;
    } else {
      setGlitchtipUserFromResponse(null);
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
    if (result.ok) {
      setGlitchtipUserFromResponse(null);
      return result;
    } else {
      throw result;
    }
  }
}
