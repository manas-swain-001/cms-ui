import moment from 'moment';

export function formatDateToDDMMYYYY(dateString) {
    if (!dateString) return ''; // handle missing date

    const formatted = moment(dateString).format('DD/MM/YYYY');

    // Handle invalid dates (moment returns "Invalid date" as a string)
    return formatted === 'Invalid date' ? '' : formatted;
}

export function convertToIndianDateParts(dateString) {
    if (!dateString) return { date: '', day: '' };
    
    const formattedDate = moment(dateString).format("DD MMM YYYY");
    const formattedDay = moment(dateString).format("ddd");

    return { date: formattedDate, day: formattedDay };
}