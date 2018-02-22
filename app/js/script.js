function Clock(elems) {
    var that = this,
        elems = elems,
        switchMode = document.querySelector('.switchMode'),
        digital = document.querySelector('.digital'),
        analog = document.querySelector('.analog');

    this._monthNames = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
    this._weekDaysNames = ["воскресенье", "понедельник", "вторник", "среда", "четверг", "пятница", "суббота"];
    this._mode = "digital";

    switchMode.addEventListener('click', setMode);

    function setMode(e) {
        that._mode = e.target.getAttribute('data-target');
        handleModeSwiching(that._mode);
    }
    function handleModeSwiching(target) {
        var mode = target == "digital"
        digital.classList.toggle("hidden", !mode);
        analog.classList.toggle("hidden", mode);
    }

    this.parseTime = function (date) {
        var time = new Date(date);
        return {
            hours  : time.getHours(),
            minutes: time.getMinutes(),
            seconds: time.getSeconds()
        };
    };

    this.getDate = function (arr){
        var tmpDate = arguments.length ? new Date(...arr) : new Date();
        return {
            day      : tmpDate.getDate(),
            weekDay  : tmpDate.getDay(),
            month    : tmpDate.getMonth(),
            year     : tmpDate.getFullYear(),
            tzOffset : tmpDate.getTimezoneOffset(),
            millisec : tmpDate.getTime()
        };
    };

    this.formatTime = function (time){
        for (var k in time) {
            time[k] = time[k] < 10  ? ('0'+ time[k]) : time[k];
        }
        return time;
    };

    this.formatDate = function (date) {
        return {
            weekDay : that._weekDaysNames[date.weekDay],
            month   : that._monthNames[date.month]
        };
    };

    this.printIn = function (elem, target){
        elem.innerText = target;
    };
    this.printMore = function (elem, target){
        elem.insertAdjacentHTML("beforeend", target);
    };

    function createDigitalTmp(obj) {
        return `<div class=${obj.className}-wrapper><h3><i class="fas fa-globe"></i> ${obj.title}</h3><span class=${obj.className}></span></div>`;
    }
    function createAnalogTmp(obj) {
        return `<div class=${obj.className}-wrapper>\n
                    <h3><i class="fas fa-globe"></i> ${obj.title}</h3>
                    <div id=${obj.className} class="outer_face ">\n
                        <div class="marker oneseven"></div>\n
                        <div class="marker twoeight"></div>\n
                        <div class="marker fourten"></div>\n
                        <div class="marker fiveeleven"></div>\n
                    <div class="inner_face">\n
                        <div class="hand hour"></div>\n
                        <div class="hand minute"></div>\n
                        <div class="hand second"></div>\n
                    </div>\n 
                </div>`
    }

    function getDomElementForDigital(obj) {
        var selector = '.'+obj.className;
        var target = document.querySelector(selector);
        return target ? target : that.printMore(digital, createDigitalTmp(obj));
    }
    function getDomElementForAnalog(obj) {
        var target = document.getElementById(obj.className);
        return target ? target : that.printMore(analog, createAnalogTmp(obj));
    }

    function toDigitalClock(obj) {
        let {hours, minutes, seconds} = that.formatTime(that.parseTime(obj.time)),
            timeStr = hours +':'+ minutes +':'+ seconds,
            elementToShowTimeIn = getDomElementForDigital(obj);
        elementToShowTimeIn && that.printIn(elementToShowTimeIn, timeStr)
    }

    function toAnalogClock(obj) {
        var elementToShowTimeIn = getDomElementForAnalog(obj);
        elementToShowTimeIn && runAnalogClock(that.parseTime(obj.time), elementToShowTimeIn);
    }

    this.refreshTime = function(obj){
        that._mode === "digital" ? toDigitalClock(obj) : toAnalogClock(obj);
    };

    /*window.requestAnimationFrame = window.requestAnimationFrame || function(f){return setTimeout(f, 1000/60)};*/
    function runAnalogClock(time, el){
        var hour = el.querySelector('.hour');
        var minute = el.querySelector('.minute');
        var second = el.querySelector('.second');
        var hour_as_degree = ( time.hours + time.minutes/60 ) / 12 * 360;
        var minute_as_degree = time.minutes / 60 * 360;
        var second_as_degree = ( time.seconds) /60 * 360;
        hour.style.transform = "rotate(" + hour_as_degree + "deg)";
        minute.style.transform = "rotate(" + minute_as_degree + "deg)";
        second.style.transform = "rotate(" + second_as_degree + "deg)";
    }
}

function LocalClock(){
    Clock.apply(this, arguments);
    var that = this;
    var todayDate = document.querySelector('.date');
    var daysCounter = document.querySelector('.daysCounter');

    function countDays() {
        var today = that.getDate();
        var newYear = that.getDate([today.year + 1, 0, 1]);
        var oneDay = 1000*60*60*24;
        return Math.floor((newYear.millisec - today.millisec)/(oneDay));
    }

    function getCorrectStrCase(str) {
        var lastChar = str.slice(-1);
        return lastChar === 'ь' && str.replace("ь", "я") || lastChar === 'й' && str + "я" || str + "a";
    }

    function getCorrectNumCase(number) {
        var titles = ['день', 'дня', 'дней'],
            cases = [2, 0, 1, 1, 1, 2];
        return titles[ (number%100>4 && number%100<20)? 2 : cases[(number%10<5)?number%10:5] ];
    }

    this.printDaysUntilNewYear = function () {
        var days = countDays(),
            msg = 'До Нового года осталось '+ days +' '+ getCorrectNumCase(days);
        that.printMore(daysCounter, msg);
    };

    this.printDate = function(){
        var date = that.getDate(),
            day = date.day,
            {weekDay, month} = that.formatDate(date),
            msg = "Сегодня "+ weekDay +', '+ day +" "+ getCorrectStrCase(month);
        that.printMore(todayDate, msg);
    };

    function getLocalTime(){
        return that.getDate().millisec;
    }

    this.runClock = function(){
        setInterval(function(){
            that.refreshTime({time:getLocalTime(), className:"local", title: "Местное время"})
        }, 1000);
    }
}
var localClock = new LocalClock();
localClock.runClock();
localClock.printDate();
localClock.printDaysUntilNewYear();


function AdditionalClock(elems){
    Clock.apply(this, arguments);
    var that = this,
        elems = elems,
        data =  {
                tokio: {
                    title: 'Токио',
                    coordinates: '35.731252, 139.730291',
                    offset: null
                },
                paris: {
                    title: 'Париж',
                    coordinates: '48.856805, 2.348242',
                    offset: null
                }
                },
        displayedData = [];


    function init(e){
        var apikey = 'AIzaSyC6Tmrk6uAq_l2TLb_DymH8rVPG_FbAPlc',
            localTime = that.getDate(),
            timestamp = localTime.millisec/1000 + localTime.tzOffset * 60,
            target = e.target.getAttribute('data-target'),
            coordinates = data[target].coordinates,
            title = data[target].title,
            url = 'https://maps.googleapis.com/maps/api/timezone/json?location='+coordinates+'&timestamp='+timestamp+'&key=' + apikey;
        getData(url, target, title);
    }

     function getData (url, target, title) {
        return fetch(url).then(function(res) {
            return res.json();
        }).then(function(res){
            var timeOffset = that.getDate().tzOffset * 60 * 1000 + res.dstOffset*1000 + res.rawOffset*1000;
            displayedData.push({id : target, offset: timeOffset, title: title});
            that.runClock(displayedData);
        })
    }

    this.initListeners = function() {
        elems.addButton.addEventListener('click', init)
    };

    function getLocalTime(){
        return that.getDate().millisec;
    }

    this.runClock = function(data){
        data.forEach(function (item) {
            setInterval(function(){
                that.refreshTime({
                    time: getLocalTime() + item.offset,
                    className: item.id,
                    title: item.title
                })
            }, 1000);
        })

    }
}

var additionalClock = new AdditionalClock({
    addButton : document.querySelector('.add')
});
additionalClock.initListeners();
