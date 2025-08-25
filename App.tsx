import React from 'react'
import { Provider } from 'react-redux'
import { store } from './src/store/index'
import RootNavigator from './src/navigation/RootNavigator'
import GlobalModal from './src/views/components/GlobalModal/GlobalModal'
import { RootSiblingParent } from 'react-native-root-siblings'

function App(): React.JSX.Element {
    return (
        <Provider store={store}>
            <RootSiblingParent>
                <RootNavigator />
            </RootSiblingParent>
            <GlobalModal />
        </Provider>
    )
}

export default App
