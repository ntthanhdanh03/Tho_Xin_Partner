// import moment from 'moment'
// import RNCalendarEvents from 'react-native-calendar-events'
// import { getStorageCalendarEvent, saveStorageCalendarEvent } from './asyncStorage'
// import i18n from 'i18next' // Import i18n để tránh lỗi với `useTranslation()`

// export const saveToCalendar = async (
//     appointmentId: string,
//     appointmentDate: any,
//     type: 'ADD' | 'UPDATE' | 'DELETE'
// ) => {
//     try {
//         const calendarPermission = await RNCalendarEvents.requestPermissions(false)

//         if (calendarPermission !== 'authorized') {
//             console.log('Calendar permission denied:', calendarPermission)
//             return
//         }

//         let events = (await getStorageCalendarEvent()) || []
//         const existedIndex = events.findIndex((item: any) => item.appointmentId === appointmentId)
//         const existEvent = existedIndex > -1 ? events[existedIndex] : null

//         const time = moment(appointmentDate).format('HH:mm')
//         const startDate = moment(appointmentDate).toISOString()
//         const endDate = moment(appointmentDate).add(1, 'hours').toISOString()
//         const alarmDate = moment(appointmentDate).subtract(5, 'minutes').toISOString()

//         if (type === 'UPDATE') {
//             if (!existEvent) return
//             try {
//                 const savedId = await RNCalendarEvents.saveEvent(i18n.t("nameAppAppointment"), {
//                     id: existEvent.eventId,
//                     startDate,
//                     endDate,
//                     notes: `${i18n.t("haveAppointment")} ${time}`,
//                     alarms: [{ date: alarmDate }],
//                 })
//                 events[existedIndex] = { appointmentId, eventId: savedId }
//             } catch (error) {
//                 console.error('Error updating calendar event:', error)
//             }
//         } else if (type === 'DELETE') {
//             if (!existEvent) return
//             try {
//                 await RNCalendarEvents.removeEvent(existEvent.eventId)
//                 events.splice(existedIndex, 1)
//             } catch (error) {
//                 console.error('Error deleting calendar event:', error)
//             }
//         } else {
//             try {
//                 const savedId = await RNCalendarEvents.saveEvent(i18n.t("nameAppAppointment"), {
//                     startDate,
//                     endDate,
//                     notes: `${i18n.t("haveAppointment")} ${time}`,
//                     alarms: [{ date: alarmDate }],
//                 })
//                 events.push({ appointmentId, eventId: savedId })
//                 console.log('Calendar event added successfully!')
//             } catch (error) {
//                 console.error('Error adding calendar event:', error)
//             }
//         }

//         await saveStorageCalendarEvent(events)
//     } catch (e) {
//         console.error('saveToCalendar error:', e)
//     }
// }
