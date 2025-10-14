import moment from 'moment';

export function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return ''; // handle missing date

    const formatted = moment(dateString).format('DD/MM/YYYY');

    // Handle invalid dates (moment returns "Invalid date" as a string)
    return formatted === 'Invalid date' ? '' : formatted;
}