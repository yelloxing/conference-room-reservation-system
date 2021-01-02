import Vue from 'vue';
import xhtml from '../services/xhtml';
import { getMonthDay, getBeginMonth, dateToArray } from '../services/dateUtil';

/**
 * 日历
 * -------------------------
 * yelloxing 2020/12/27
 */

Vue.directive('calendar2', {
    'bind': function (el, binding) {
        let monthLan = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
        let weekLan = ['一', '二', '三', '四', '五', '六', '日'];
        let hourLan = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

        let isClick = false;
        let uniqueFlag;
        let postionTarget;
        el.setAttribute('defType', 'calendar');

        let isFocus = false;
        let calendarEl;

        let close, open;

        // 今天和选择的日期
        let currentDay = dateToArray(new Date()), preSelectDay;

        /**
         * 视图集群开始
         * ====================================================
         */

        //选择年份
        function selectYearView(year) {
            let currenYear = year;
            while (!Number.isInteger(year / 10)) {
                year++;
            }
            let lastYear = year;
            //头部修改
            var templateView = '<div class="cursor">' +
                '<div class="pre">Pre</div>' +
                '<div class="title">' + (lastYear - 11) + '-' + lastYear + '年</div>' +
                '<div class="next">Next</div>' +
                '</div>';
            templateView += "<div class='selectYear'>";
            for (let i = 0; i < 12; i++) {
                templateView += "<div class='item year' val=" + (i - -1) + ">" + (lastYear - 11 + i) + "</div>";
            }
            templateView += "</div>";
            calendarEl.innerHTML = templateView;
            let divs = calendarEl.getElementsByTagName('div');
            for (let i = 0; i < divs.length; i++) {
                // 点击选择年份
                if (xhtml.hasClass(divs[i], 'year')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goYearView(divs[i].innerText);
                        adjustPosition();
                    })
                }
                // 点击了前一个
                else if (xhtml.hasClass(divs[i], 'pre')) {
                    xhtml.bind(divs[i], 'click', () => {
                        selectYearView(lastYear - 10);
                    });

                }
                // 点击了后一个
                else if (xhtml.hasClass(divs[i], 'next')) {
                    xhtml.bind(divs[i], 'click', () => {
                        selectYearView(lastYear - -10);
                    });
                }
            }
        }

        //选择月份
        function goYearView(year) {
            //头部修改
            var templateView = '<div class="cursor">' +
                '<div class="pre">Pre</div>' +
                '<div class="title">' + year + '年</div>' +
                '<div class="next">Next</div>' +
                '</div>';
            templateView += "<div class='selectMonth'>";
            for (let i = 0; i < monthLan.length; i++) {
                templateView += "<div class='item month' val=" + (i - -1) + ">" + monthLan[i] + "</div>";
            }
            templateView += "</div>";
            calendarEl.innerHTML = templateView;
            let divs = calendarEl.getElementsByTagName('div');
            for (let i = 0; i < divs.length; i++) {
                // 点击选择月
                if (xhtml.hasClass(divs[i], 'month')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goMonthView(year, divs[i].getAttribute('val'));
                        adjustPosition();
                    })
                }
                // 点击了标题
                else if (xhtml.hasClass(divs[i], 'title')) {

                    xhtml.bind(divs[i], 'click', () => {
                        selectYearView(year);
                        adjustPosition();
                    });

                }
                // 点击了前一个
                else if (xhtml.hasClass(divs[i], 'pre')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goYearView(year - 1);
                    });

                }
                // 点击了后一个
                else if (xhtml.hasClass(divs[i], 'next')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goYearView(year - -1);
                    });
                }
            }
        }

        //选择天
        function goMonthView(year, month) {

            //头部修改
            var templateView = '<div class="cursor">' +
                '<div class="pre">Pre</div>' +
                '<div class="title">' + monthLan[month - 1] + ' ' + year + '年</div>' +
                '<div class="next">Next</div>' +
                '</div>';
            //日期修改
            var dayNum = getMonthDay(year, month - 1);
            var beginMonth = getBeginMonth(year, month - 1);
            templateView += "<div class='selectDay'>";
            //头部
            templateView += "<div class='header'>" + weekLan[0] + "</div>";
            templateView += "<div class='header'>" + weekLan[1] + "</div>";
            templateView += "<div class='header'>" + weekLan[2] + "</div>";
            templateView += "<div class='header'>" + weekLan[3] + "</div>";
            templateView += "<div class='header'>" + weekLan[4] + "</div>";
            templateView += "<div class='header'>" + weekLan[5] + "</div>";
            templateView += "<div class='header'>" + weekLan[6] + "</div>";
            var preMonthDays;
            if (month == 1) {
                preMonthDays = getMonthDay(year - 1, 11);
            } else {
                preMonthDays = getMonthDay(year, month - 2);
            }
            //前置空白
            var preNum = 0;
            for (; beginMonth > 1; beginMonth--) {
                preNum = preNum + 1;
                templateView += "<div class='item nouse'>" + (preMonthDays - beginMonth - (-2)) + "</div>";
            }

            //选择条目
            var flag = 1;
            for (; flag <= dayNum; flag++) {
                templateView += "<div class='item day' val=" + flag + ">" + flag + "</div>";
            }

            //后置空白
            var needNum = 42 - dayNum - preNum;
            for (flag = 1; flag <= needNum; flag++) {
                templateView += "<div class='item nouse' val=" + flag + ">" + flag + "</div>";
            }

            templateView += "</div>";

            calendarEl.innerHTML = templateView;

            let divs = calendarEl.getElementsByTagName('div');
            for (let i = 0; i < divs.length; i++) {
                // 点击选择天
                if (xhtml.hasClass(divs[i], 'day')) {
                    xhtml.bind(divs[i], 'click', () => {
                        // el.value = year + "/" + month + "/" + divs[i].getAttribute('val');
                        // xhtml.trigger(el, 'input');
                        // close();
                        goHourView(year, month, divs[i].getAttribute('val'), 7, 7);
                    })
                }
                // 点击了前一个
                else if (xhtml.hasClass(divs[i], 'pre')) {
                    xhtml.bind(divs[i], 'click', () => {
                        if (month <= 1) {
                            year -= 1; month = 12;
                        } else {
                            month -= 1;
                        }
                        goMonthView(year, month);
                    });

                }
                // 点击了标题
                else if (xhtml.hasClass(divs[i], 'title')) {

                    xhtml.bind(divs[i], 'click', () => {
                        goYearView(year);
                        adjustPosition();
                    });

                }
                // 点击了后一个
                else if (xhtml.hasClass(divs[i], 'next')) {
                    xhtml.bind(divs[i], 'click', () => {
                        if (month >= 12) {
                            year -= -1; month = 1;
                        } else {
                            month -= -1;
                        }
                        goMonthView(year, month);
                    });
                }
            }

        }

        //选择时间段
        function goHourView(year, month, day, topHour, bottomHour) {
            //头部修改
            var templateView = '<div class="cursor">' +
                '<div class="pre">Pre</div>' +
                '<div class="title">' + year + '年' + month + '月' + day + '日</div>' +
                '<div class="next">Next</div>' +
                '</div>';
            templateView += "<div class='selectHour top-out'>";
            for (let i = 0; i < hourLan.length; i++) {
                let clazz = "item top-hour";
                if (i + 7 == topHour) clazz += " selected";
                templateView += "<div class='" + clazz + "' val=" + (i - -7) + ">" + hourLan[i] + "</div>";
            }

            templateView += "</div><div class='selectHour'>";
            for (let i = 0; i < hourLan.length; i++) {
                let clazz = "item bottom-hour";
                if (i + 7 == bottomHour) clazz += " selected";
                templateView += "<div class='" + clazz + "' val=" + (i - -7) + ">" + hourLan[i] + "</div>";
            }
            templateView += "</div>";
            templateView += "<div class='selectbtn'>确定</div>";
            calendarEl.innerHTML = templateView;
            let divs = calendarEl.getElementsByTagName('div');
            for (let i = 0; i < divs.length; i++) {
                if (xhtml.hasClass(divs[i], 'selectbtn')) {
                    xhtml.bind(divs[i], 'click', () => {
                        el.value = year + "-" + month + "-" + day + " " + topHour + ":00-" + bottomHour + ":00";
                        xhtml.trigger(el, 'input');
                        close();
                    })
                }
                if (xhtml.hasClass(divs[i], 'top-hour')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goHourView(year, month, day, divs[i].getAttribute('val'), bottomHour)
                        adjustPosition();
                    })
                }
                if (xhtml.hasClass(divs[i], 'bottom-hour')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goHourView(year, month, day, topHour, divs[i].getAttribute('val'))
                        adjustPosition();
                    })
                }
                // 点击了标题
                else if (xhtml.hasClass(divs[i], 'title')) {

                    xhtml.bind(divs[i], 'click', () => {
                        goMonthView(year, month);
                        adjustPosition();
                    });

                }
                // 点击了前一个
                else if (xhtml.hasClass(divs[i], 'pre')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goHourView(year, month, day - 1, topHour, bottomHour);
                    });

                }
                // 点击了后一个
                else if (xhtml.hasClass(divs[i], 'next')) {
                    xhtml.bind(divs[i], 'click', () => {
                        goHourView(year, month, day - -1, topHour, bottomHour);
                    });
                }
            }
        }
        /**
         * 视图集群结束
         * ====================================================
         */

        // 调整位置方法
        let adjustPosition = function () {

            // 计算日历尺寸和位置
            let element_index = xhtml.offsetPosition(el);
            let top = element_index.top + el.offsetHeight;
            let left = element_index.left;

            let calendarEl = document.getElementById("calendar-" + uniqueFlag);

            /**
             * 默认日历在输入框下面
             * 可是考虑到有时候下面的空间不足
             * 如果空间不足，就把日历放到输入框上边
             * 这里是判断是否需要放到上边去和是否可以放到上边去
             */
            if (
                // 如果余下的空间不足了
                postionTarget.$el.offsetHeight - top - calendarEl.offsetHeight < 0
                &&
                // 这里加判断是因为，虽然空间不足，可能滚动后足了，如果不判断，可能导致上不足
                top - (calendarEl.offsetHeight + el.offsetHeight) - postionTarget.top - postionTarget.$el.scrollTop > 0) {
                top -= (calendarEl.offsetHeight + el.offsetHeight);
            }
            xhtml.setStyles(calendarEl, {
                "top": top - postionTarget.top + "px",
                "left": left - postionTarget.left + "px"
            });

        };

        // 关闭日历
        close = function () {
            isClick = false;
            xhtml.unbind(window, "resize", adjustPosition);
            let input_node = document.getElementById("calendar-" + uniqueFlag);
            if (xhtml.isNode(input_node)) xhtml.remove(input_node);
        };

        // 打开日历方法
        open = function () {
            isClick = true;
            uniqueFlag = new Date().valueOf() + "-" + (Math.floor(Math.random() * 100 - (-1)));

            // 寻找挂载结点
            let targetElem = el;
            while (targetElem && !xhtml.hasClass(targetElem, 'table-view') && !xhtml.hasClass(targetElem, 'page') && !xhtml.hasClass(targetElem, 'select-frame') && !xhtml.hasClass(targetElem, 'note')) targetElem = targetElem.parentNode;
            postionTarget = xhtml.offsetPosition(targetElem);
            postionTarget.$el = targetElem;

            // 挂载到页面
            targetElem.insertBefore(
                xhtml.toNode("<div id='calendar-" + uniqueFlag + "' class='ui-calendar-view'>=</div>"),
                targetElem.childNodes[0]
            );
            calendarEl = document.getElementById("calendar-" + uniqueFlag);


            preSelectDay = dateToArray(new Date((el.value + "").split(' ')[0]));



            if (preSelectDay.length > 0) {

                let hours = el.value.split(' ')[1].split('-');

                goHourView(...preSelectDay, +hours[0].replace(':00', ''), +hours[1].replace(':00', ''));
            } else {
                // if (binding.expression == "M") {
                //     goYearView(...currentDay);
                // } else {
                goHourView(...currentDay, 9, 9);
                // }
            }


            xhtml.bind(calendarEl, 'click', function () {
                el.focus();
            });

            // 调整位置
            adjustPosition();

            xhtml.bind(window, "resize", adjustPosition);
        };

        // 判断是不是悬浮在点击区域
        xhtml.bind(el, 'mousemove', function (event) {
            if (el.getAttribute('readonly') == 'readonly') {
                el.style.cursor = 'auto';
                return;
            }
            let right_width = el.offsetWidth - xhtml.MousePosition(el, event || window.event).x;
            if (right_width > 40) el.style.cursor = 'auto';
            else el.style.cursor = 'pointer';
        });

        // 点击打开下拉
        xhtml.bind(el, 'click', function (event) {
            if (el.getAttribute('readonly') == 'readonly') return;

            // 如果下拉已经打开，那么就关闭
            if (isClick) {
                isClick = false;
                xhtml.unbind(window, "resize", adjustPosition);
                xhtml.remove(document.getElementById("calendar-" + uniqueFlag));
                return;
            }

            // 判断是点击日历还是输入
            let right_width = el.offsetWidth - xhtml.MousePosition(el, event || window.event).x;
            if (right_width < 40) open();

        });

        // 输入框失去焦点关闭
        xhtml.bind(el, 'focus', function () {
            isFocus = true;
        });
        xhtml.bind(el, 'blur', function () {
            isFocus = false;
            window.setTimeout(function () {
                if (isFocus) return;

                close();

            }, 200);

        });
    }
});