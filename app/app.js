import Application from '@ember/application';
import Resolver from './resolver';
import loadInitializers from 'ember-load-initializers';
import config from 'veeakker/config/environment';
import setupGlitchtip from 'veeakker/utils/glitchtip';

export default class App extends Application {
  modulePrefix = config.modulePrefix;
  podModulePrefix = config.podModulePrefix;
  Resolver = Resolver;
}

setupGlitchtip();

loadInitializers(App, config.modulePrefix);
