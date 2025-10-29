export const baseUrl = import.meta.env.VITE_API_BASE_URL || ''

export const constants = {
    officeLocation: {
        latitude: 20.331132,
        longitude: 85.809318,
    },
    attendanceStatus: {
        not_punched_in: 'checked_out',
        checked_in: 'checked_in',
        punched_in: 'checked_in',
        working: 'checked_in',
        checked_out: 'checked_out',
        punched_out: 'checked_out',
    }
}

export default constants;