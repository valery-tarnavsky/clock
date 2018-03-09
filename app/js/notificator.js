class Notificator {
    constructor(){
        this.notificationWrap = document.querySelector('.notification');
    }
    insertToBaseTmp(msg, name){
        return `<div class="${name} fade-in notifyMsg alert alert-warning">${msg}</div>`;
    }

    render (target){
        this.notificationWrap.insertAdjacentHTML("afterbegin", target);
    }

    remove(name){
        let target = document.querySelector(`.${name}`);
        target && target.remove();
    }

    create(msg, name, type){
        this.render(this.insertToBaseTmp(msg, name));
        type || setTimeout(function(){this.remove(name)}.bind(this), 3000);
    }
}