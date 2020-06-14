//控件模块
const controls = document.getElementById('controls').children;
module.exports = class Controls{ 
    constructor() {
        this.like = controls[0];
        this.prevBtn = controls[1];
        this.playBtn = controls[2];
        this.nextBtn = controls[3];
        this.menu = controls[4];
    }
}