import { combineReducers } from 'redux'
import authReducer from './authReducer'

export const combinedReducers = combineReducers({
    auth: authReducer,
})
