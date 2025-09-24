import { combineReducers } from 'redux'
import authReducer from './authReducer'
import orderReducer from './orderReducer'

export const combinedReducers = combineReducers({
    auth: authReducer,
    order: orderReducer,
})
