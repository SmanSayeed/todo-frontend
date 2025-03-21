// src/store/index.js
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import config from '../config/apiConfig';

// Configure Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE', 'persist/REGISTER'],
      },
    }).concat(thunk),
  devTools: config.ENV !== 'production',
});

// Create the persisted store
export const persistor = persistStore(store);