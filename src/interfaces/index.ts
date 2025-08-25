export interface IField {
    value: any
    error: boolean
    message: string
}

export interface IForm {
    [x: string]: IField
}

export interface IResponse {
    status: number
    data: any
}
