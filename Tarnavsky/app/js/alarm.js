function Alarm(elems){
    elems = elems;
    var counter = 0;
    var alarmsList = [];
    var that = this;

    this.parseTime = function () {
        var time = new Date();
        return {
            hours  : time.getHours(),
            minutes: time.getMinutes(),
            seconds: time.getSeconds()
        };
    };

    this.formatTime = function (time){
        for (var k in time) {
            time[k] = time[k] < 10  ? ('0'+ time[k]) : time[k];
        }
        watchForAlarm(time);
        return time;
    };

    function watchForAlarm(time) {
        return time.seconds == "00" && compare(time.hours, time.minutes);
    }

    function printIn (elem, target){
        elem.innerText = target;
    }

    this.printMore = function (elem, target){
        elem.insertAdjacentHTML("beforeend", target);
    };

    function createTimeStr() {
        let {hours, minutes, seconds} = that.formatTime(that.parseTime());
        return hours +':'+ minutes +':'+ seconds
    }

    this.runClock = function(){
        setInterval(function(){
            printIn(elems.timeWrapp, createTimeStr());
        }, 1000);
    };

   function addToTmp(data){
       var rowNum = elems.row.length;
       return `<tr>
                    <td class="rowNum">${rowNum}</td>
                    <td>${data.time}</td>
                    <td><i class="far fa-trash-alt" data-target="${data.id}"></i></td>
               </tr>`;
    }

    function addToAlarmList(str) {
        alarmsList.push({id: counter++, time: str});
        toggleMsg([elems.alarmNone], "hide")
    }

    function compare(hours, minutes){
        alarmsList.forEach(function(item){
            if(hours +":"+ minutes == item.time){
                console.log(1111);
                toggleMsg([elems.alarmFire], "show");
                setTimeout(function(){
                     toggleMsg([elems.alarmFire], "hide");
                }, 5000);
            }
        });
    }

    function toggleMsg (elem, status) {
        elem.forEach(function (item) {
            status == "show" ? item.classList.remove("hidden") : item.classList.add("hidden");
        });
    }

    function recalcRowNum(){
        var recalculate = 1;
        for (var i = 0; i < elems.rowNum.length; i++){
            elems.rowNum[i].innerHTML = recalculate++;
        }
    }

    function findIndex(arr, prop, val){
        return arr.map(function(find) { return find[prop]; }).indexOf(val);
    }

    function deleteAlarm(e){
        var target = e.target;
       /* if (target.tagName != 'A') {return}*/
        var trElem = target.closest("TR");
        var elemId = target.getAttribute("data-target");
        var index = findIndex(alarmsList, 'id', +elemId);
        alarmsList.splice(index, 1);
        trElem.remove();
        recalcRowNum();
        alarmsList.length == 0 && toggleMsg([elems.alarmNone], "show");
    }

    function init() {
        var alarmTime = elems.alarmHours.value + ":" + elems.alarmMinutes.value;
        addToAlarmList(alarmTime);
        that.printMore(elems.alarmListTable, addToTmp(alarmsList[alarmsList.length-1]));
    }

    this.initListeners = function() {
        elems.addAlarmButton.addEventListener('click', init);
        elems.alarmListTable.addEventListener('click', deleteAlarm);
    };

   }

var alarm = new Alarm({
    timeWrapp : document.querySelector('.local'),
    addAlarmButton : document.querySelector('.addAlarm'),
    alarmHours     : document.querySelector('.alarmHours'),
    alarmMinutes   : document.querySelector('.alarmMinutes'),
    alarmListTable : document.querySelector('.alarmListTable tbody'),
    row            : document.getElementsByTagName("tr"),
    alarmFire      : document.querySelector('.alarmFire'),
    rowNum         : document.getElementsByClassName("rowNum"),
    alarmNone      : document.querySelector('.alarmNone')
});

alarm.initListeners();
alarm.runClock();


