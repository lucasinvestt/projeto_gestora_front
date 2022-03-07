export function getFormatedDate(date) {
    return date.toISOString().split('T')[0];
}

export function subtractDaysFromDate(date, days) {
    let newDate = new Date ( (new Date(date)).setUTCHours(0,0,0,0) );
    newDate.setDate(date.getDate() - days);
    return newDate;
}