function _formatNormalize(formatter) {
    if (typeof formatter === 'function') {
        return formatter;
    }
    if(typeof formatter !== 'string') {
        throw new Error('formatter must be a function or string');
    }

    if(formatter === 'date') {
        formatter = 'yyyy-MM-dd';
    }
    else if (formatter === 'datetime') {
        formatter = 'yyyy-MM-dd HH:mm:ss';
    }
    return (dateInfo) => {
        const {yyyy, MM, dd, HH, mm, ss} = dateInfo;
        return formatter
        .replace(/yyyy/g, yyyy)
        .replace(/MM/g, MM)
        .replace(/dd/g, dd)
        .replace(/HH/g, HH)
        .replace(/mm/g, mm)
        .replace(/ss/g, ss)
    };
}

function formate(date, formatter, isPad = false) {
    formatter = _formatNormalize(formatter);
    function _pad(value, length) {
        if(isPad) {
            return (value + '').padStart(length, '0');
        } else {
            return value.toString();
        }
    }
    const dateInfo = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds()
    };
    dateInfo.yyyy = _pad(dateInfo.year, 4);
    dateInfo.MM = _pad(dateInfo.month, 2);
    dateInfo.dd = _pad(dateInfo.day, 2);
    dateInfo.HH = _pad(dateInfo.hour, 2);
    dateInfo.mm = _pad(dateInfo.minute, 2);
    dateInfo.ss = _pad(dateInfo.second, 2);
    return formatter(dateInfo);
}

//2024-1-1
formate(new Date(), 'date');

//2024-1-1 12:4:12
formate(new Date(), 'datetime');

//2024-01-01
formate(new Date(), 'date', true);

//2024-01-01 12:04:12
formate(new Date(), 'datetime', true);

//2024年01月01日 12:04:12
formate(new Date(), 'yyyy年MM月dd日 HH:mm:ss', true);

var date = formate(new Date('2022-8-4 12:7:41'), 'date', true);