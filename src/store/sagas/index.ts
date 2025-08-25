import { all } from 'redux-saga/effects'
import authSaga from './authSaga'

function* rootSaga() {
    yield all([authSaga()])
}

export default rootSaga
