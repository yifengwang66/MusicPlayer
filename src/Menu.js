


const menu = document.getElementById('menu');
const dl = menu.getElementsByTagName('dl')[0];
module.exports = class Menu {
    constructor(data){
        this.data = data;
        this.shown = false;
        this.close = null;
    }

    renderMenu(activeIndex) {
        let temp = `<dt>歌曲列表</dt>`;
        this.data.forEach((ele, index) => {
            temp += `<dd class=${index == activeIndex ? 'active' : ''}>${ele.name}</dd>`;
        });
        temp += `<dd class='close'></dd>`;
        dl.innerHTML = temp;
        this.bindClose();
    }
    bindClose() {
        this.close = document.getElementsByClassName('close')[0];
        this.close.addEventListener('touchend', () => {
            menu.style.transform = 'translateY(100%)';
        }, false)
    }
}