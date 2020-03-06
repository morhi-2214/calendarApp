'use strict'
{

    // -------------------------ここからカレンダーの部分--------------------------------------- 

    const weeks = ['日','月','火','水','木','金','土'];
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    // 今日の年月日を取得しておく
    const toDay = date.getDate();
    const toMonth = date.getMonth() + 1;
    const toYear = date.getFullYear();

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
                    if (year == toYear && month == toMonth && dayCount == toDay) {
                        calendarHtml += `<td class="clicked-day today" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
                    } else {
                        calendarHtml += `<td class="clicked-day" data-date="${year}/${month}/${dayCount}">${dayCount}</td>`;
                    }
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
            document.getElementById('modal').classList.remove('inactive');
        }
    })


    nav.innerHTML = '<h1>' + year + '年' + month + '月</h1>';
    showCalendar(year, month); 

    // -------------------------ここまでカレンダーの部分---------------------------------------


    // -------------------------ここからモーダル＆ToDoリストの部分---------------------------------------

    const search = document.querySelector('.search input')
    const addTask = document.querySelector('.add-task');
    const todos = document.querySelector('.todos');

    (function() {
        // ローカルストレージからリストを再生成
        for (let key in localStorage) {
            let html = localStorage.getItem(key);
            if (html) {
                todos.innerHTML += localStorage.getItem(key);
            }
        }
    })();

    const saveTaskToLocalStorage = (task, html) => {
        if (html){
            localStorage.setItem(task, html);
            return;
        }
        return;
    }

    const deleteTaskFromLocalStorage = (task) => {
        localStorage.removeItem(task);
        return;
    }

    // タスクに入力した値でToDoリストを作成
    const createTodoList = (task) => {
        const html = `
        <li class=list-group-item align-items-center">
            <span>${task}</span>
            <span class="delete">✖</span>
        </li>
        `;
    
        todos.innerHTML += html;
        saveTaskToLocalStorage(task, html);
    }

    addTask.addEventListener('submit', (e) => {
        e.preventDefault();
    
        // タスクに入力した値の前後の空白を除いて格納する
        const task = addTask.add.value.trim();
        // タスクに入力した文字数が0でない場合
        if (task.length) {
            createTodoList(task);
            addTask.reset();
        }   
    });

    // ✖をクリックすることで対象のToDoリストを削除
    todos.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete')){
            e.target.parentElement.remove();
            const task = e.target.parentElement.textContent.trim();
            deleteTaskFromLocalStorage(task);
        }
    });


    // Todoリストをキーワード検索する
    const filterTasks = (term) => {
        Array.from(todos.children) 
            .filter((todo) => !todo.textContent.toLowerCase().includes(term))
            .forEach((todo) => todo.classList.add('filtered'));
        Array.from(todos.children)
            .filter((todo) => todo.textContent.toLowerCase().includes(term))
            .forEach((todo) => todo.classList.remove('filtered'));
    };

    search.addEventListener('keyup', () => {
        const term = search.value.trim().toLowerCase();
        filterTasks(term);
    });

    // -------------------------ここまでモーダル＆ToDoリストの部分---------------------------------------

}

