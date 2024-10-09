import {
  configureStore,
  Action,
  StateFromReducersMapObject,
  Dispatch,
  UnknownAction,
  EnhancedStore,
  ThunkDispatch,
} from '@reduxjs/toolkit';

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { ThunkAction } from 'redux-thunk';
import { rootReducer } from './reducers/rootReducer';
import { persistStateToLocalStorage } from './middlewares';
import { useSSR } from 'use-ssr';

const { isServer } = useSSR();

// const middlewares = [
//   podcastApi.middleware
// ]

const initStore = (preloadedState?: Partial<RootState>): EnhancedStore =>
  configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(
        ...(!isServer ? [persistStateToLocalStorage([])] : [])
      ),
    preloadedState,
    // devTools: String(process.env.NODE_ENV).trim() !== 'production'
  });

export type Store = ReturnType<typeof initStore>;
export type RootState = StateFromReducersMapObject<typeof rootReducer>;
export type AppDispatch = Store['dispatch'];
export type AppThunk = ThunkAction<void, RootState, unknown, Action>;

export const useAppDispatch = (): Dispatch<UnknownAction> &
  ThunkDispatch<RootState, undefined, UnknownAction> =>
  useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export { initStore };
