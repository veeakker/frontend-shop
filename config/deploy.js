/* eslint-env node */
'use strict';

// TODO: we removed "ember-cli-deploy-ssh-index": "^1.0.0",

module.exports = function(deployTarget) {
  let ENV = {
    build: {}
    // include other plugin configuration that applies to all deploy targets here
    // note: we override this for now
  };

  if (deployTarget === 'development') {
    //see https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data/issues/52
    process.env.GIT_DISCOVERY_ACROSS_FILESYSTEM=1;
    ENV = {
      build: {
        environment: 'production'
      },
      'ssh-index': { // copy and deploy index.html
        username: 'root',
        host: 'semte.ch',
        port: 2275,
        remoteDir: '/data/veeakker-webshop-backend/app/frontendwebshop/',
        allowOverwrite: true,
        agent: process.env.SSH_AUTH_SOCK
      },
      'rsync': { // copy assets
        host: 'root@semte.ch',
        port: 2275,
        dest: '/data/veeakker-webshop-backend/app/frontendwebshop/',
        delete: false,
        arg:['--verbose']
      }
    };
    // configure other plugins for development deploy target here
  }

  if (deployTarget === 'staging') {
    ENV.build.environment = 'production';
    // configure other plugins for staging deploy target here
  }

  if (deployTarget === 'production') {
    ENV.build.environment = 'production';
    // configure other plugins for production deploy target here
  }

  // Note: if you need to build some configuration asynchronously, you can return
  // a promise that resolves with the ENV object instead of returning the
  // ENV object synchronously.
  return ENV;
};
