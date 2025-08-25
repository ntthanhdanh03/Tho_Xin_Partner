import { MutableRefObject } from 'react'

interface IModal {
    type?: 'yesNo' | undefined
    title?: string
    description?: string
    icon?: 'success' | 'fail' | 'warning' | 'fixCar' | undefined
}

export type GlobalModalRef = {
    show: ({ type, title, description, icon }: IModal) => void
    hide: () => void
}

export default class GlobalModalController {
    static modalRef: MutableRefObject<GlobalModalRef>
    static callbackFunc: any

    static setModalRef = (ref: any) => {
        this.modalRef = ref
    }

    static showModal = ({ type, title, description, icon }: IModal) => {
        this.modalRef.current?.show({
            type,
            title,
            description,
            icon,
        })
    }

    static hideModal = () => {
        this.modalRef.current?.hide()
    }

    static onActionChange = (callback: any) => {
        this.callbackFunc = callback
    }

    static setActionChange = (value: any) => {
        this.callbackFunc && this.callbackFunc(value)
    }
}
