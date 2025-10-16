import { AppState, DeviceEventEmitter } from 'react-native'

class AppStateUtil {
    currentState: string = AppState.currentState

    constructor() {
        AppState.addEventListener('change', this._handleChange)
    }

    _handleChange = (nextState: string) => {
        console.log('📱 AppState:', this.currentState, '→', nextState)

        if (this.currentState === 'background' && nextState === 'active') {
            DeviceEventEmitter.emit('APP_FOREGROUND')
        } else if (this.currentState === 'active' && nextState === 'background') {
            DeviceEventEmitter.emit('APP_BACKGROUND')
        }

        this.currentState = nextState
    }

    isForeground() {
        return this.currentState === 'active'
    }

    isBackground() {
        return this.currentState === 'background'
    }
}

export default new AppStateUtil()
