'use strict';

export function formatDate(dateTimestamp) {
    const date = new Date(dateTimestamp);
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `[${day}-${month}-${year} ${hours}:${minutes}] `;
}

