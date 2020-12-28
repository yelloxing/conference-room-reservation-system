// 日期是否合法
export let isValid = function (dateStr) {
    return (new Date(dateStr) + "") != 'Invalid Date';
};

// 计算二月多少天
export let getFebruaryDay = function (yearNum) {
    if ((yearNum % 4 == 0) && (yearNum % 100 != 0 || yearNum % 400 == 0)) {
        return 29;
    } else {
        return 28;
    }
};

// 计算某个月多少天
export let getMonthDay = function (yearNum, month) {
    let dayNum = [31, -1, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
    if (dayNum == -1) {
        dayNum = getFebruaryDay(yearNum);
    }
    return dayNum;
};

// 计算本月第一天是星期几
export let getBeginMonth = function (yearNum, month) {
    let beginMonth = new Date(yearNum + "/" + (month - (-1)) + "/1").getDay();
    if (beginMonth == 0) {
        return 7;
    }
    return beginMonth;
};

// 日期变成【年，月，日】
export let dateToArray = function (date) {
    if (!isValid(date)) return [];
    return [
        date.getFullYear(),
        date.getMonth() - (-1),
        date.getDate()
    ];
};
