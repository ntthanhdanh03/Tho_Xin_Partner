import { combineReducers } from 'redux'
import authReducer from './authReducer'
import orderReducer from './orderReducer'
import chatReducer from './chatReducer'
import appointmentReducer from './appointmentReducer'
import settingReducer from './settingReducer'
import locationReducer from './locationReducer'
import transactionReducer from './transactionReducer'

export const combinedReducers = combineReducers({
    auth: authReducer,
    order: orderReducer,
    chat: chatReducer,
    appointment: appointmentReducer,
    setting: settingReducer,
    location: locationReducer,
    transaction: transactionReducer,
})
