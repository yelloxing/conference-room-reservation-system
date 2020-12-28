// 日期是否合法
export let isValid = function (dateStr) {
    return (new Date(dateStr) + "") != 'Invalid Date';
}

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
}

// 日期变成【年，月，日】
export let dateToArray = function (date) {
    if (!isValid(date)) return [];
    return [
        date.getFullYear(),
        date.getMonth() - (-1),
        date.getDate()
    ];
};

export let getFutureWeekDay = function(d){
    let date = new Date(d)
    let dateArr = []
    let filter
    for(let i = 0; i < 7;i++){
        let today = new Date()
        let every =  date.setDate(date.getDate() + i)
        let day = new Date(every)
        if(dateToStrYM(day) == dateToStrYM(today)){
           filter = '今天'
        }else if(dateToStrYM(day) == getDay(today,1)){
            filter = '明天'
        }else if(dateToStrYM(day) == getDay(today,1)){
            filter = '后天'
        }else{
            filter = getDay(day)
        }
        dateArr.push({
            'date':dateToStrYM(day),
            'filter':filter
        })
        date = new Date(d)
    }
    return dateArr
};

//日期转为‘年/月/日’
export let dateToStr = function(date,parse = '/'){
    let y = date.getFullYear();  
    let m = date.getMonth() + 1;  
    m = m < 10 ? '0' + m : m;  
    let d = date.getDate();  
    d = d < 10 ? ('0' + d) : d;  
    return y + parse + m + parse + d;  
};

// 日期转为 ‘月-日’
export let dateToStrYM = function(date){
    let m = date.getMonth() + 1;  
    m = m < 10 ? '0' + m : m;  
    let d = date.getDate();  
    d = d < 10 ? ('0' + d) : d; 
    return `${m}-${d}`;  
};

//根据指定日期获取指定天数后的日期，转为‘月-日’格式
export let getDay = function(date,num=0){
    let d = date.getDate()
    let d1 = new Date( date.setDate(d + num) )
    let m = d1.getMonth() + 1
    m = m < 10 ? '0' + m : m;  
    let day = d1.getDate()
    d = d < 10 ? ('0' + d) : d; 
    return `${m}-${day}`
};
