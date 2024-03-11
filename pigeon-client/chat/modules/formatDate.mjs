'use strict';

export function formatDate(dateTimestamp) {
    const date = new Date(Number(dateTimestamp));
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours();
    const minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();

    return `[${day}-${month}-${year} ${hours}:${minutes}] `;
}

