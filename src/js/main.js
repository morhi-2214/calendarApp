'use strict'
{
    const weeks = ['日','月','火','水','木','金','土'];
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    // 一度に表示する月の数（デフォルト：１）
    const config = {
        show: 1,
    }; 
    const nav = document.getElementById('nav');
    const main = document.getElementById('calendar-main');
    const prev = document.getElementById('prev');
    const next = document.getElementById('next');
    
    function showCalendar(year, month) {
        for ( let i = 0; i < config.show; i++) {
            const calendarHtml = createCalendar(year, month);
            const sec = document.createElement('section');

            sec.innerHTML = calendarHtml;
            main.appendChild(sec);

            month++;
            if (month > 12) {
                year++;
                month = 1;
            }
        }
    }

    // カレンダーの原型を作成
    function createCalendar(year, month) {
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
                    calendarHtml += '<td class="surplus">' + num + '</td>'
                } else if (dayCount > endDayCount) {
                    let num = dayCount - endDayCount;
                    calendarHtml += '<td class="surplus">' + num + '</td>';
                    dayCount++;
                } else {
                    calendarHtml += `<td class="clicked-day" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
                    dayCount++;
                }
            }

            calendarHtml += '</tr>';
        }
        calendarHtml += '</table>';

        return calendarHtml;
    }

    function moveMonth(e) {
        main.innerHTML = '';

        // 先月へ移動する
        if (e.target.id === 'prev') {
            month--;

            if (month < 1) {
                year--;
                month = 12;
            }
        }

        // 来月へ移動する
        if (e.target.id === 'next') {
            month++;

            if (month > 12) {
                year++;
                month = 1;
            }
        }
        nav.innerHTML = '<h1>' + year + '年' + month + '月</h1>';
        showCalendar(year, month);
    }

    prev.addEventListener('click', moveMonth);
    next.addEventListener('click', moveMonth);

    document.addEventListener('click', function(e) {
        if(e.target.classList.contains('clicked-day')) {
            // あとでここにTodoを書き込める枠を表示させる機能を入れる
            alert('クリックしたのは' + e.target.dataset.date + 'です')
        }
    })


    nav.innerHTML = '<h1>' + year + '年' + month + '月</h1>';
    showCalendar(year, month); 
}

