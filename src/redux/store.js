import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web

import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';

// Configuration for Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only auth will be persisted
  blacklist: ['tasks'] // tasks won't be persisted to avoid stale data
};

// Combine reducers
const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer
});

// Create persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Create store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types (related to Redux Persist)
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['auth.token'],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);