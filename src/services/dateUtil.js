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

export let getFutureWeekDay = function(d,filter=true){
    let date = new Date(d) 
    let dateArr = []
    let desc,today = new Date()
    for(let i = 0; i < 7;i++){
        let day = new Date(date.getTime() + 24 * 60 * 60 * 1000 * i)    
        if(filter){
            let between = dateBetween(dateToStr(today),day)
            switch(between){
                case 0:
                    desc = '今天';
                    break;
                case 1:
                    desc = '明天';
                    break;
                case 2:
                    desc = '后天';
                    break;
                default:
                    desc = dateToStrYM(day)
            }
        }
        let param = {
            'fullDate':dateToStr(day,'-'),
            'date':dateToStrYM(day),
        }
        desc && (param.desc = desc) 
        // options.timeList.length > 0 && (param.timeList = options.timeList)
        dateArr.push(param)
    }
    return dateArr
};

//日期转为‘年/月/日’
export let dateToStr = function(date,parse = '/'){
    if(!(date instanceof Date)){
        return date
    }else{
        let y = date.getFullYear();  
        let m = date.getMonth() + 1;  
        m = m < 10 ? '0' + m : m;  
        let d = date.getDate();  
        d = d < 10 ? ('0' + d) : d;  
        return y + parse + m + parse + d; 
    }
};

// 日期转为 ‘月-日’
export let dateToStrYM = function(date){
    let m = date.getMonth() + 1;  
    m = m < 10 ? '0' + m : m;  
    let d = date.getDate();  
    d = d < 10 ? ('0' + d) : d; 
    return `${m}-${d}`;  
};

// //根据指定日期获取指定天数后的日期，转为‘月-日’格式
// export let getDay = function(date,num=0){
//     let d = date.getDate()
//     let d1 = new Date( date.setDate(d + num) )
//     let m = d1.getMonth() + 1
//     m = m < 10 ? '0' + m : m;  
//     let day = d1.getDate()
//     day = day < 10 ? '0' + day : day; 
//     return `${m}-${day}`
// };

//将数字转为时：分  ===>   7 = > 07:00
export let numToTime = function(time){
    let t = time < 10 ? '0' + time : time
    return `${t}:00`
}

//计算日期差值
export let dateBetween= function(sDate1,sDate2,time){
    if( typeof sDate1 == 'string' ){
        sDate1 = new Date(sDate1)
    }
    if(typeof sDate2 == 'string' ){
        sDate2 = new Date(sDate2)
    }
    let m1,m2,iDays
    m1 = sDate1.getTime()
    m2 = sDate2.getTime()
   
    if(time){
        iDays = (m2  -  m1)  /  1000  /  60  /  60
    }else{
        iDays  =  (m2  -  m1)  /  1000  /  60  /  60  /24
    }
    return  iDays
}


//毫秒数转为日期 'yyyy-MM-dd HH:mm'
export let millisecondToStr = function(milliseconds){
    let millisecond = new Date(milliseconds)
    let y = millisecond.getFullYear()
    let M = millisecond.getMonth() + 1
    M = M < 10 ? '0' + M : M
    let D = millisecond.getDate()
    D = D < 10 ? '0' + D : D
    let H = millisecond.getHours()
    H = H < 10 ? '0' + H : H
    let m = millisecond.getMinutes()
    m = m < 10 ? '0' + m : m

    return `${y}-${M}-${D} ${H}:${m}`
}

//毫秒数转为时间   'HH:mm'
export let millisecondToHm = function(milliseconds){
    let millisecond = new Date(milliseconds)
    let H = millisecond.getHours()
    H = H < 10 ? '0' + H : H
    let m = millisecond.getMinutes()
    m = m < 10 ? '0' + m : m
    return `${H}:${m}`
}

//毫秒数转为时间   'HH:mm'
export let millisecondToDateStr = function(milliseconds){
    let date = new Date(milliseconds)
    let y = date.getFullYear()
    let M = date.getMonth() + 1
    let d = date.getDate()
    let H = date.getHours()
    let m = date.getMinutes()
    return `${y}-${getZero(M)}-${getZero(d)} ${getZero(H)}:${getZero(m)}`
}

let getZero = function(d){
    return d < 10 ? '0' + d : d
}