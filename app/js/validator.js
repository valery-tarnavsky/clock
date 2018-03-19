class Validator {
    constructor(data){
        this.hours     = data.hours;
        this.minutes   = data.minutes;
        this.isNumeric = new RegExp('^[0-9]*$');
        this.notify = new Notificator();
    }
    isNotEmpty() {
        let result = !(this.hours === "" && this.minutes === "");
        result || this.notify.create("Введите время будильника", "error");
        return result
    }

    isNotExist(arr, prop, val){
        let result = arr.map(item => item[prop]).indexOf(val) === -1;
        result || this.notify.create("Будильник на указанное время уже установлен", "error");
        return result;
    }

    isHoursValid() {
        let result = this.isNumeric.test(this.hours) && this.hours <= 23;
        result || this.notify.create("Введите корректное значение", "error");
        return result;
    }
    isMinutesValid() {
        let result =  this.isNumeric.test(this.minutes) && this.minutes <= 59;
        result || this.notify.create("Введите корректное значение минут", "error");
        return result;
    }
}