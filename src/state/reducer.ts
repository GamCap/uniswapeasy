import { combineReducers } from '@reduxjs/toolkit'
import localForage from 'localforage'
import { PersistConfig, persistReducer } from 'redux-persist'

import mintV4 from './v4/reducer'

const persistedReducers = {
}

const appReducer = combineReducers({
  mintV4,
 
})

export type AppState = ReturnType<typeof appReducer>

const persistConfig: PersistConfig<AppState> = {
  key: 'uniswapeasy',
  version: 0, // see migrations.ts for more details about this version
  storage: localForage.createInstance({
    name: 'redux',
  }),
  whitelist: Object.keys(persistedReducers),
  throttle: 1000, // ms
  serialize: false,
  // The typescript definitions are wrong - we need this to be false for unserialized storage to work.
  // We need unserialized storage for inspectable db entries for debugging.
  // @ts-ignore
  deserialize: false,
  debug: true,
}

const persistedReducer = persistReducer(persistConfig, appReducer)

export default persistedReducer