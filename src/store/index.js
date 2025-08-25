const createSagaMiddleware = require('@redux-saga/core').default
import { createStore, applyMiddleware } from 'redux'
import { combinedReducers } from './reducers'
import rootSaga from './sagas'
import logger from 'redux-logger'

const sagaMiddleware = createSagaMiddleware()
const middlewares = [sagaMiddleware]
if (__DEV__) {
    middlewares.push(logger)
}

export const store = createStore(combinedReducers, applyMiddleware(...middlewares))

sagaMiddleware.run(rootSaga)
