'use strict'
{
    const weeks = ['日','月','火','水','木','金','土'];
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    // 月最後の日の数字を取得（e.g. 31）
    const endDayCount = endDate.getDate();
    const lastMonthEndDate = new Date(year, month -1, 0);
    // 先月の最後の日の数字を取得
    const lastMonthEndDayCount = lastMonthEndDate.getDate();
    // 月初めの曜日を取得
    const startDay = startDate.getDay();

    let dayCount = 1;
    let calendarHtml ='';

    calendarHtml += '<h1>' + year + '/' + month + '</h1>';
    calendarHtml += '<table>';

    for (let i = 0; i < weeks.length; i++) {
        // 曜日を表示する行を作成
        calendarHtml += '<td id="week">' + weeks[i] + '</td>';
    }

    // 一週ごとに日付を表示する行を作成（4週＋余裕分の2週）
    for (let w = 0; w < 6; w++) {
        calendarHtml += '<tr>';
        
        // 一週ごとに日付を表示
        for (let d = 0; d < 7; d++) {
            if (w == 0 && d < startDay) {
                let num = lastMonthEndDayCount - startDay + d + 1;
                calenderHtml += '<td class="surplus">' + num + '</td>'
            } else if (dayCount > endDayCount) {
                let num = dayCount - endDayCount;
                calendarHtml += '<td class="surplus">' + num + '</td>';
                dayCount++;
            } else {
                calendarHtml += '<td>' + dayCount + '</td>';
                dayCount++;
            }
        }

        calendarHtml += '</tr>';
    }
    calendarHtml += '</table>';

    document.getElementById('calendar-main').innerHTML = calendarHtml 
}

