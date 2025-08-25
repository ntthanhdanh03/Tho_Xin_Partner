import { groupBy } from 'lodash'
import moment from 'moment'

export const createSectionListByDate = (dataList: any, dateField: string) => {
    const groupByDate = groupBy(
        dataList?.map((dataItem: any) => ({
            ...dataItem,
            time: moment(dataItem[dateField]).format('HH:mm'),
            date: moment(dataItem[dateField]).format('DD/MM/YYYY'),
        })),
        'date',
    )
    const sectionListData = Object.keys(groupByDate).reduce((result: any, date: any) => {
        const dataByDate = groupByDate[date]
        return [...result, { date, data: dataByDate }]
    }, [])

    return sectionListData
}

export const createSectionListByTime = (dataList: any, dateField: string) => {
    const morningData =
        dataList?.filter((item: any) => moment(item[dateField]).format('HH:mm') < '13:00') || []
    const afternoonData =
        dataList?.filter((item: any) => moment(item[dateField]).format('HH:mm') >= '13:00') || []

    return [
        { timeLabel: 'morning', data: morningData },
        { timeLabel: 'afternoon', data: afternoonData },
    ]
}

export const numberWithCommas = (x: any, allowEmpty?: boolean) => {
    if (!x) {
        return allowEmpty ? '' : '0'
    }
    const text = x.toString().replace(/[.]/g, '')
    return text.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export const numberWithoutCommas = (text: any) => {
    try {
        if (typeof text === 'number') text = text.toString()
        const textString = text?.replace(/[.]/g, '')
        return Number(textString) || 0
    } catch (e) {
        console.log('numberWithoutCommas', e)
    }
}

export const groupAppointment = (bookings: any, quotations: any) => {
    const appointmentList =
        bookings?.map((item: any) => {
            return {
                ...item,
                type: 'appointment',
            }
        }) || []
    const quotationList =
        quotations?.map((item: any) => {
            return {
                ...item,
                startTime: item?.validUntil,
                totalAmount: item?.totalEstimate,
                type: 'quotation',
            }
        }) || []
    return quotationList.concat(appointmentList)
}

export const getDirtyData = (newData: any, oldData: any) => {
    try {
        let result: any = {}
        const newDataKeys = Object.keys(newData)
        for (let i = 0; i < newDataKeys?.length; i++) {
            const key = newDataKeys[i]
            if (newData[key] !== oldData[key]) {
                result[key] = newData[key]
            }
        }
        if (Object.keys(result)?.length > 0) {
            return result
        }
        return null
    } catch (e) {
        console.log('getDirtyData', e)
        return null
    }
}

export const random = (length: number) => {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i += 1) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}

export const removeAccent = (str: any) => {
    if (!str) return ''
    str = str.toLowerCase()
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    str = str.replace(/đ/g, 'd')
    return str
}

export const isValidEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return regex.test(email)
}

export const getYouTubeVideoId = (url: string) => {
    const regex =
        /(?:https?:\/\/(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/))([^"&?\/\s]{11})/
    const match = url.match(regex)
    return match ? match[1] : null
}
