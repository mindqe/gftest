import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { loadableReady } from '@loadable/component';

import App from './App';

import { initStore } from './store/store';
import { Provider } from 'react-redux';

import cache from './cache';
import { CacheProvider } from '@emotion/react';
import { clearCache, isCacheValid, loadStateFromLocalStorage } from './store/middlewares/persistOnLocalStorage';
import { hydrate } from './store/reducers/podcastSlice/podcastSlice';

const store = initStore((window as any).__PRELOADED_STATE__);
delete (window as any).__PRELOADED_STATE__;

if (module.hot != null) {
  module.hot.accept(['./store/store', './store/reducers/rootReducer'], () => {
    (async () => {
      const { rootReducer } = await import('./store/reducers/rootReducer')
      store.replaceReducer(rootReducer as any);
    })()
      .then(() => {})
      .catch((er) => console.log(er));
  });
}

const indexJSX = (
  <StrictMode>
    <Provider store={store}>
      <HelmetProvider>
        <BrowserRouter>
          <CacheProvider value={cache}>
            <App />
          </CacheProvider>
        </BrowserRouter>
      </HelmetProvider>
    </Provider>
  </StrictMode>
);

let persistedState;
if (isCacheValid()) {
  persistedState = loadStateFromLocalStorage() || (window as any).__PRELOADED_STATE__;
} else {
  // Clear the cache if the cache is not valid
  clearCache();
  persistedState = (window as any).__PRELOADED_STATE__; 
}

// On initial load, hydrate the store with persisted state
store.dispatch(hydrate(persistedState));

const container = document.getElementById('root');
if (container == null) throw new Error('Failed to find the root element');

loadableReady(() => {
  hydrateRoot(container, indexJSX);
});
