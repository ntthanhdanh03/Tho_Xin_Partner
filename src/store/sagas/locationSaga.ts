import * as actions from '../actions/locationAction'
import { put, takeLatest, delay, all, call } from 'redux-saga/effects'
import * as types from '../types'
import { IResponse } from '../../interfaces'
import { api } from '../../services/api'

function* updateLocationPartnerSaga({
    payload,
    callback,
}: ReturnType<typeof actions.updateLocationPartnerAction>) {
    try {
        const response: IResponse = yield call(() => api.patch(`/users/location`, payload.postData))
        if (response && response?.status === 200 && response?.data) {
            const dataUpdate = {
                data: response?.data,
                typeUpdate: payload.typeUpdate,
            }
            yield put(actions.updateLocationPartnerSuccessAction(dataUpdate))

            callback && callback(response?.data, null)
        } else {
            callback && callback(null, 'failure')
        }
    } catch (e: any) {
        console.log('updateLocationPartnerSaga', e, e?.response)
        callback && callback(null, 'failure')
    }
}

export default function* locationSaga() {
    yield all([takeLatest(types.UPDATE_LOCATION_PARTNER, updateLocationPartnerSaga)])
}
