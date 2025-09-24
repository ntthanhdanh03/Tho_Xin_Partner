import * as types from '../types'

interface IState {
    loading: boolean
    data: any
}

interface IAction {
    type: string
    payload: any
    callback: string
}

const initialState: IState = {
    loading: false,
    data: null,
}

const authReducer = (state = initialState, action: IAction) => {
    switch (action.type) {
        case types.LOG_IN: {
            return { ...state, loading: true }
        }
        case types.LOG_IN + types.SUCCESS: {
            return { ...state, data: action.payload, loading: false }
        }
        case types.LOG_IN + types.FAILURE: {
            return { ...state, data: null, loading: false }
        }
        case types.REFRESH_TOKEN: {
            return { ...state, loading: true }
        }
        case types.REFRESH_TOKEN + types.SUCCESS: {
            return { ...state, data: action.payload, loading: false }
        }
        case types.REFRESH_TOKEN + types.FAILURE: {
            return { ...state, data: null, loading: false }
        }
        case types.UPDATE_USER + types.SUCCESS: {
            return {
                ...state,
                data: {
                    ...state?.data,
                    user: { ...state?.data?.user, ...action.payload },
                },
                loading: false,
            }
        }
        case types.UPDATE_USER_KYC + types.SUCCESS: {
            return {
                ...state,
                data: {
                    ...state?.data,
                    user: {
                        ...state?.data?.user,
                        partner: {
                            ...state?.data?.user?.partner,
                            kyc: {
                                ...state?.data?.user?.partner?.kyc,
                                ...action.payload,
                            },
                        },
                    },
                },
                loading: false,
            }
        }

        case types.CREATE_INSTALLATION + types.SUCCESS: {
            return {
                ...state,
                data: {
                    ...state?.data,
                    user: {
                        ...state?.data?.user,
                        deviceToken: action.payload,
                    },
                },
                loading: false,
            }
        }
        case types.LOG_OUT: {
            return { ...state, data: null, loading: false }
        }
        default: {
            return state
        }
    }
}

export default authReducer
