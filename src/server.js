import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { matchPath, StaticRouter } from 'react-router-dom';
import express from 'express';
import { createStore } from '@reduxjs/toolkit';
import routes from './routes.js';
import React from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.tsx';
import { initStore } from './store/store.js';
import { Provider } from 'react-redux';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfigModule from '../webpack.client.js';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import cache from './cache.js';
import createCache from '@emotion/cache';
import axios from 'axios';
import { fetchPodcastList } from './store/reducers/podcastSlice/podcastSlice.js';
import { match } from 'assert';
import api from './api/index.js';

const isProduction = process.env.NODE_ENV === 'production';
console.log('Dirname: ', __dirname);

const PUBLIC_PATH = path.join(__dirname, 'public');

const app = express();
const port = 3005;

let compiler;

app.use('/api', api);

async function loadStyles() {
  try {
    const stylesDir = path.resolve(__dirname, 'public', 'css');
    const files = await fs.readdir(stylesDir);
    const cssFiles = files.filter((file) => file.endsWith('.css'));
    const cssContents = [];
    for await (const style of cssFiles) {
      const stylePath = path.join(stylesDir, style);
      const content = await fs.readFile(stylePath, 'utf-8');
      cssContents.push(content);
    }
    return cssContents;
  } catch (error) {
    console.error('Error reading styles directory:', error);
  }
}

function createStyleTags(styles) {
  if (!styles) return '';
  return styles.map((style) => `<style>${style}</style>`).join('\n');
}

async function handleRender(req, res, next) {
  if (/\.(js|css|json|png|jpg|jpeg)$/.test(req.url)) {
    return next();
  }
  console.log('handleRender called.');
  if (!isProduction && !compiler) {
    return res.status(200).send('Loading...');
  }
  try {
    let episodesList;

    const filename = path.resolve(__dirname, 'public', 'index.html');

    console.log(`Reading HTML from ${filename}...`);
    const html = await fs.readFile(filename, 'utf8');

    const activeRoute =
      routes.find((route) => matchPath(req.path, route)) || [];
    const matchRoute = matchPath(req.path, activeRoute);
    const store = initStore();
    await (activeRoute.getInitialData
      ? activeRoute.getInitialData(store, matchRoute.params)
      : Promise.resolve());

    const finalState = store.getState();
    const cache = createCache({ key: 'css' });
    const app = renderToString(
      <Provider store={store}>
        <StaticRouter location={req.url} context={{}}>
          <CacheProvider value={cache}>
            <App />
          </CacheProvider>
        </StaticRouter>
      </Provider>
    );

    const { extractCriticalToChunks, constructStyleTagsFromChunks } =
      createEmotionServer(cache);
    const chunks = extractCriticalToChunks(app);
    const styles = constructStyleTagsFromChunks(chunks);

    const plainStyles = await loadStyles();
    const styleTags = createStyleTags(plainStyles);

    const ssrHTML = html
      .replace(/<div id="root">\s*<\/div>/, `<div id="root">${app}</div>`)
      .replace('{}', JSON.stringify(finalState).replace(/</g, '\\u003c'))
      .replace('<style></style>', styleTags);

    res.status(200).send(ssrHTML);
  } catch (err) {
    console.error('Error during SSR:', err);
    return res.status(500).send('Internal Server Error');
  }
}

async function startServer() {
  const wrapper = (cb, funcName) => {
    return (req, res, next) => {
      console.log(`Static called ${funcName} [${req.method}]: ${req.url}`);
      return cb(req, res, next);
    };
  };

  if (process.env.NODE_ENV === 'development') {
    const webpackConfig = webpackConfigModule.default || webpackConfigModule;
    compiler = webpack(webpackConfig(null, { mode: process.env.NODE_ENV }));

    app.use(
      webpackDevMiddleware(compiler, {
        publicPath: '/public',
        serverSideRender: true,
        stats: 'minimal',
        writeToDisk: true,
      })
    );

    app.use(webpackHotMiddleware(compiler));
  }

  app.get('/', handleRender);

  app.use(
    wrapper(
      express.static(PUBLIC_PATH, { index: false, extensions: ['html'] }),
      'public'
    )
  );
  app.use('*', handleRender);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

startServer();
