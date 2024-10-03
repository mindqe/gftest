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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nodepath = path.join(__dirname, '..', 'node_modules');
const publicpath = path.join(__dirname, '..', 'public');
const distpath = path.join(__dirname, '..', 'dist');

const app = express();
const port = 3005;

let compiler;

app.use((req, _res, next) => {
  next();
});

app.use('/api', api);

async function loadStyles() {
  try {
    const stylesDir = path.join(__dirname, '..', 'dist/css');
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
  // if (!compiler) {
  //   return res.status(200).send('Loading...');
  // }
  try {
    let episodesList;
    const filename = path.resolve(__dirname, '..', 'dist', 'client.html');
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

    // Emotion styling
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
        publicPath: '/',
        serverSideRender: true,
        stats: 'minimal',
        writeToDisk: true,
      })
    );

    app.use(webpackHotMiddleware(compiler));
  }

  // Handle index files in handleRender!
  app.get('*', handleRender);
  // app.get("/getPodcastEpisodes", handleGetPodcastEpisodes);

  app.use(
    wrapper(
      express.static(publicpath, { index: false, extensions: ['html'] }),
      'public'
    )
  );

  // This is fired every time the server-side receives a request.
  app.use(handleRender);

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

  app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}

startServer();
