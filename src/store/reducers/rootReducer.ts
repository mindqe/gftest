import { combineReducers, UnknownAction } from '@reduxjs/toolkit';
import podcastSlice from '../reducers/podcastSlice/podcastSlice';

import { reduxHydrationAction } from '../../constants/constants';

export const rootReducer = {
  podcastSlice: podcastSlice,
};

export const appReducer = combineReducers(rootReducer);

export const mainReducer: any = (
  state: ReturnType<typeof appReducer>,
  action: UnknownAction
) => {
  /*
    Global action for whole state hydration.
  */
  if (action?.type === reduxHydrationAction) {
    const nextState = {
      ...state,
      ...(action['payload'] as object),
    };
    return nextState;
  }

  return appReducer(state, action);
};
