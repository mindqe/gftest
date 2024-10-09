import { combineReducers } from '@reduxjs/toolkit';
import podcastSlice from '../reducers/podcastSlice/podcastSlice';

export const rootReducer = {
  podcastSlice: podcastSlice,
};

export const appReducer = combineReducers(rootReducer);
