'use strict';

const funnel = require('broccoli-funnel');
const mergeTrees = require('broccoli-merge-trees');
const { map } = require('broccoli-stew');
const { join, dirname, relative } = require('path')

module.exports = {
  name: require('./package').name,

  urlsForPrember() {
    return ['/'];
  },

  treeForVendor() {
    let revealLibFiles = funnel('node_modules/reveal.js/', {
      files: [
        'js/reveal.js',
        'plugin/markdown/marked.js',
        'plugin/markdown/markdown.js',
        'plugin/highlight/highlight.js'
      ]
    });

    revealLibFiles = map(revealLibFiles, (content) => `if (typeof FastBoot === 'undefined') { ${content} }`);

    return revealLibFiles;
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

    app.import(relative(process.cwd(), join(dirname(require.resolve('reveal.js')), '../css/reset.css')));
    app.import(relative(process.cwd(), join(dirname(require.resolve('reveal.js')), '../css/reveal.css')));

    app.import('vendor/simplabs.css')
    app.import(relative(process.cwd(), join(dirname(require.resolve('reveal.js')), `../css/${revealOptions.highlightTheme || 'monokai'}.css`)));
  },

  contentFor: function(type){
    if (type === 'head'){
      return `<link rel='stylesheet' types='text/css' href='https://fonts.googleapis.com/css?family=Nunito+Sans:300,700'>`;
    }
  },

  treeForPublic(tree) {
    return mergeTrees([
      tree,
      funnel('node_modules/reveal.js/plugin/', {
        destDir: 'plugin'
      })
    ]);
  }
};
