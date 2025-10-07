import { all } from 'redux-saga/effects'
import authSaga from './authSaga'
import orderSaga from './orderSaga'
import chatSaga from './chatSaga'
import appointmentSaga from './appointmentSaga'
import locationSaga from './locationSaga'

function* rootSaga() {
    yield all([authSaga(), orderSaga(), chatSaga(), appointmentSaga(), locationSaga()])
}

export default rootSaga
