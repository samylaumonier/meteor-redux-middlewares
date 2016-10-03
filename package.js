Package.describe({
  name: 'samy:redux-middlewares',
  version: '1.0.0',
  summary: 'Redux middlewares that allow you to sync the store with Mongo and any reactive sources.',
  git: 'https://github.com/samybob1/meteor-redux-middlewares',
  documentation: 'README.md'
});

Package.onUse(function (api) {
  api.versionsFrom('1.4.1.1');

  api.use([
    'ecmascript',
    'tracker'
  ]);

  api.mainModule('index.js');
});
