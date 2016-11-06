Package.describe({
  name: 'samy:redux-middlewares',
  version: '3.0.0',
  summary: 'Middlewares to sync meteor reactive sources with redux store',
  git: 'https://github.com/samybob1/meteor-redux-middlewares',
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('1.4.1.1');

  api.use([
    'ecmascript',
  ]);

  api.mainModule('src/index.js');
});
