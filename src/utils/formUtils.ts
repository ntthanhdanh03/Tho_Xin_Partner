import { IForm } from '../interfaces'

export const defaultField = {
    value: '',
    error: false,
    message: '',
}

export const getFormValues = (form: IForm) => {
    const formValues: any = {}
    Object.keys(form).forEach(function (key, index) {
        formValues[key] = form[key].value
    })
    return formValues
}
