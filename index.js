'use strict';

const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const { map } = require('broccoli-stew');
const { dirname, join } = require('path')

module.exports = {
  name: require('./package').name,

  urlsForPrember() {
    return ['/'];
  },

  treeForVendor() {
    let revealLibFiles = funnel(join(dirname(require.resolve('reveal.js')), '..'), {
      files: [
        'js/reveal.js',
        'plugin/markdown/marked.js',
        'plugin/markdown/markdown.js',
        'plugin/highlight/highlight.js'
      ]
    });

    const revealCssFiles = funnel(join(dirname(require.resolve('reveal.js')), '..'), {include: ['css/**', 'lib/css/**']});

    revealLibFiles = map(revealLibFiles, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    return mergeTrees([revealLibFiles, revealCssFiles]);
  },

  included(app) {
    this._super.included.apply(this, arguments);

    if(!app.options.fingerprint) {
      app.options.fingerprint = {
        exclude: ['plugin/*/*.js']
      }
    } else {
      app.options.fingerprint.exclude = app.options.fingerprint.exclude || [];

      app.options.fingerprint.exclude.push('plugin/*/*.js');
    }

    let revealOptions = this.options.reveal || {};

    this.import('vendor/js/reveal.js');

    this.import('vendor/css/reset.css');
    this.import('vendor/css/reveal.css');
    this.import('vendor/simplabs.css');
    this.import(`vendor/lib/css/${revealOptions.highlightTheme || 'monokai'}.css`);
  },

  contentFor: function(type){
    if (type === 'head'){
      return `<link rel='stylesheet' types='text/css' href='https://fonts.googleapis.com/css?family=Nunito+Sans:300,700'>`;
    }
  },

  treeForPublic(tree) {
    return mergeTrees([
      tree,
      funnel(join(dirname(require.resolve('reveal.js')), '..', 'plugin'), {
        destDir: 'plugin'
      })
    ]);
  }
};
