/*
  Simple but yet powerful persist middleware.
  Runs after every event in Redux, so be sure to filter unnecessary slices.
    (For example, in SSR version first async RTK Query actions are run before
      you can execute state rehydration. Without filtering API slice, these actions
      pull server state to local storage rewriting persist data)
  For a more precise data persisting use listener middlewares.
    (You can find a typed empty template in listener.ts file)
*/
import { Middleware, Action } from 'redux';

import { RootState } from '../store';
import { localStorageAppKey } from '../../constants/constants';

// Set the cache expiration time (in milliseconds)
const CACHE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour
// const CACHE_EXPIRATION_TIME = 1000;  // 1 second

const isAction = (action: unknown): action is Action => {
  return (action as Action).type !== undefined;
};

const persistStateToLocalStorage =
  (
    ignoreSlices?: Array<keyof RootState>,
    ignoreSliceActions: boolean = true
  ): Middleware<{}, RootState> =>
  (store) =>
  (next) =>
  (action) => {
    const result = next(action);
    const currentState = store.getState();
    console.log('Current Redux State:', currentState);

    if (ignoreSlices !== undefined) {
  if (
    isAction(action) &&
    ignoreSliceActions &&
    !ignoreSlices.some((el) => action.type.includes(el))
  ) {
        localStorage.setItem(
          localStorageAppKey,
          JSON.stringify(store.getState(), (key, value) => {
            if (ignoreSlices.includes(key as keyof RootState)) {
              return undefined;
            } else {
              return value;
            }
          })
        );
        localStorage.setItem('reinvalidate', Date.now().toString());
      }
    }

    return result;
  };

export { persistStateToLocalStorage };

// Utility function to check cache validity
export const isCacheValid = (): boolean => {
  const cacheTimestamp = localStorage.getItem('reinvalidate');
  if (!cacheTimestamp) return false;

  const now = Date.now();
  return now - parseInt(cacheTimestamp, 10) <= CACHE_EXPIRATION_TIME;
};

// Utility function to clear cache
export const clearCache = () => {
  console.log("Clearing cache...");
  localStorage.removeItem(localStorageAppKey);
  localStorage.removeItem('reinvalidate');
};

// Utility function to load the persisted state from localStorage
export const loadStateFromLocalStorage = (): Partial<RootState> | undefined => {
  try {
    const serializedState = localStorage.getItem(localStorageAppKey);
    
    if (serializedState === null) {
      return undefined; // Return undefined if there's no saved state
    }

    const state = JSON.parse(serializedState);
    console.log("%s [HYDRATE]: %s", localStorageAppKey, serializedState);

    // Optional: Validate the structure of the loaded state
    // You can add custom validation logic here based on your state structure
    
    return state; // Return the parsed state
  } catch (err) {
    console.error('Failed to load state from localStorage:', err);
    return undefined; // Return undefined in case of error
  }
};
