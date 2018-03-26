import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import('/Users/snow/self/flow/global.less');


let Router = DefaultRouter;


const routes = [
  {
    "component": require('/Users/snow/.nvm/versions/node/v8.9.2/lib/node_modules/umi/node_modules/_umi-build-dev@0.13.1@umi-build-dev/lib/DefaultLayout.js').default,
    "routes": [
      {
        "path": "/flow",
        "exact": true,
        "component": () => React.createElement(require('/Users/snow/.nvm/versions/node/v8.9.2/lib/node_modules/umi/node_modules/_umi-build-dev@0.13.1@umi-build-dev/lib/Compiling.js').default, { route: '/flow' })
      },
      {
        "path": "/",
        "exact": true,
        "component": require('../index.js').default
      },
      {
        "path": "/index.html",
        "exact": true,
        "component": () => React.createElement(require('/Users/snow/.nvm/versions/node/v8.9.2/lib/node_modules/umi/node_modules/_umi-build-dev@0.13.1@umi-build-dev/lib/Compiling.js').default, { route: '/index.html' })
      }
    ]
  }
];

export default function() {
  return (
<Router history={window.g_history}>
  { renderRoutes(routes) }
</Router>
  );
}
