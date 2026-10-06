import Application from 'veeakker/app';
import config from 'veeakker/config/environment';
import * as QUnit from 'qunit';
import { setApplication } from '@ember/test-helpers';
import { setup } from 'qunit-dom';
import { start } from 'ember-qunit';

setApplication(Application.create(config.APP));

setup(QUnit.assert);

// The test loader must require each test module explicitly: modules are
// defined via AMD but their factories only run once required, and QUnit
// cannot start before that has happened.
function loadTests() {
  const filterMatch = (window.location.search.match(/[?&]filter=([^&]*)/) || [])[1];
  const filter = filterMatch ? new RegExp(decodeURIComponent(filterMatch)) : null;

  const testModules = Object.keys(window.requirejs.entries).filter((name) =>
    name.indexOf('veeakker/tests/') === 0 &&
    !name.endsWith('veeakker/tests/test-helper') &&
    !name.endsWith('/index') &&
    (!filter || filter.test(name))
  );

  for (const name of testModules) {
    window.requireModule(name);
  }
}

loadTests();
start();
