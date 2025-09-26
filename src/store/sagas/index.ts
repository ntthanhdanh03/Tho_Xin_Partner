import { all } from 'redux-saga/effects'
import authSaga from './authSaga'
import orderSaga from './orderSaga'

function* rootSaga() {
    yield all([authSaga(), orderSaga()])
}

export default rootSaga
