var alarm = (function (){
    var elements = null;
    var counter = 0;
    var alarmsList = [];
    var notify = new Notificator();

    function watch() {
        if (alarmsList.length == 0){
            showTable(false);
            notify.create('Нет будильников', "noAlarmsMsg", "static");
        }else{
            showTable(true);
            notify.remove("noAlarmsMsg");
        }
    }

    function showTable(status) {
        elements.alarmsTable.classList.toggle("hidden", !status);
    }

    /*Alarm*/
    function findIndex(arr, prop, val){
        return arr.map(item => item[prop]).indexOf(val);
    }

    function disableInput(elements, status){
        let elementsArr = [...elements];
            elementsArr.forEach(function (element) {
               if(status) {
                   element.setAttribute('disabled', 'disabled');
                   element.classList.remove('bordered');
               }else{
                   element.removeAttribute('disabled');
                   element.classList.add('bordered');
               }
            })
    }

    function updateAlarm(e) {
        let target = e.target;
        if (!target.classList.contains("save")) {return}
        let trElem = target.closest("TR");
        let hours = trElem.querySelector('.editHours');
        let minutes = trElem.querySelector('.editMinutes');
        let elemId = trElem.getAttribute("data-target");
        let index = findIndex(alarmsList, "id", +elemId);
        let alarm = {hours: hours.value, minutes: minutes.value};
        if(isValid(alarm)) {
            alarmsList[index].stop(alarmsList[index].timeout);
            alarmsList[index].time = `${alarm.hours}:${alarm.minutes}`;
            triggerAlarm(alarmsList[index], getDelay(alarm));
            disableInput([hours, minutes], true);
            notify.create("Будильник успешно сохранен", "savedMsg");
        }
    }

    function editAlarm(e) {
        let target = e.target;
        if (!target.classList.contains("edit")) {return}
        let trElem = target.closest("TR");
        let hours = trElem.querySelector('.editHours');
        let minutes = trElem.querySelector('.editMinutes');
        disableInput([hours, minutes], false);
    }

    function deleteAlarm(e) {
        let target = e.target;
        if (!target.classList.contains("delete")) {return}
        let trElem = target.closest("TR");
        let elemId = trElem.getAttribute("data-target");
        let index = findIndex(alarmsList, 'id', +elemId);
        alarmsList[index].stop(alarmsList[index].timeout);
        alarmsList.splice(index, 1);
        trElem.remove();
        watch();
    }

    function getDelay (alarm, nextDate) {
        let {hours, minutes} = alarm;
        let date = new Date();
        let currentDay = date.getDate();
        let currentTime = date.getTime();
        let alarmTime = nextDate ? new Date(nextDate).setHours(hours, minutes, 0) : date.setHours(hours, minutes, 0);
        if(alarmTime < currentTime){
            return getDelay (alarm, new Date().setDate(currentDay + 1));
        }
        return alarmTime - currentTime;
    }

    function triggerAlarm(alarm, delay) {
        let msg = ` ${alarm.time}!`;
        alarm.timeout = setTimeout(function(){
            notify.create(msg, "alarmTrigger");
        }, delay);
    }

    /*Render*/
     function insertToTmp(alarm){
        var time = alarm.time.split(":");
         return `<tr data-target="${alarm.id}">
                    <td>
                        <input class="editInput editHours" value="${time[0]}" disabled maxlength="2">
                        <span class="timeSeparator">:</span>
                        <input class="editInput editMinutes" value="${time[1]}" disabled maxlength="2">
                        <i class="fas fa-pencil-alt edit"></i>
                        <i class="fas fa-save save"></i>
                    </td>
                    <td><i class="far fa-trash-alt delete"></i></td>
                 </tr>`;
     }

     function render(element, data){
         element.insertAdjacentHTML("beforeend", insertToTmp(data));
     }

    function saveAlarm (alarm) {
        alarmsList.push({
            id: counter++,
            time: alarm,
            stop: function (target) {
                clearTimeout(target);
            }
        });
        watch();
        return alarmsList[alarmsList.length-1]
    }

    function isValid(alarm) {
         let validator = new Validator(alarm);
         let alarmStr = `${alarm.hours}:${alarm.minutes}`;
         return validator.isNotEmpty() && validator.isNotExist(alarmsList, "time", alarmStr) && validator.isHoursValid() && validator.isMinutesValid();
    }

    function init() {
        let userAlarm = {hours: elements.alarmHours.value, minutes: elements.alarmMinutes.value};
        elements.alarmHours.value = "";
        elements.alarmMinutes.value = "";
        if(isValid(userAlarm)){
            var alarm = saveAlarm(`${userAlarm.hours}:${userAlarm.minutes}`);
            render(elements.alarmList, alarm);
            triggerAlarm(alarm, getDelay(userAlarm));
            notify.create("Будильник успешно добавлен", "savedMsg");
        }
    }

    function initListeners() {
        elements.addAlarmButton.addEventListener('click', init);
        elements.alarmList.addEventListener('click', function(e){
            deleteAlarm(e);
            editAlarm(e);
            updateAlarm(e);
        });
    }

     return {
         setAlarmData : function(DOMelements){
             elements = DOMelements;
         },
         initListeners : initListeners,
         getAlarmData : function(){
             return alarmsList;
         }
     }
})();

alarm.setAlarmData ({
    timeWrap        : document.querySelector('.local'),
    addAlarmButton  : document.querySelector('.addAlarm'),
    alarmHours      : document.querySelector('.alarmHours'),
    alarmMinutes    : document.querySelector('.alarmMinutes'),
    alarmsTable     : document.querySelector('.alarmListTable'),
    alarmList       : document.querySelector('.alarmListTable tbody'),
    row             : document.getElementsByTagName("tr"),
    rowNum          : document.getElementsByClassName("rowNum"),
    alarmNone       : document.querySelector('.alarmNone')
});

alarm.initListeners();
