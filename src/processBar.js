module.exports = class Bar {
    /**
     * 构造processBar对象
     * @param {*} music player中的audio对象
     */
    constructor(music) {
        this.music = music;
        this.bar = document.getElementsByClassName('bar')[0];
        this.totalLen = document.getElementsByClassName('back')[0].offsetWidth;
        this.front = document.getElementsByClassName('front')[0];
        this.proc = document.getElementsByClassName('proc')[0];
        this.curTimeDom = document.getElementsByClassName('curTime')[0];
        this.curTimeDomWidth = this.curTimeDom.offsetWidth;
        this.timer = null;
        this.front.style.width = 0;
        this.bar.style.left = 0;
    }

    startMove() {
        clearInterval(this.timer);
        this.timer = setInterval(() => {
            // player中的audio对象中的music属性才是真正的音乐
            this.front.style.width = this.music.music.currentTime * this.totalLen / this.music.totalTime + 'px';
            this.bar.style.left = this.front.style.width;
            this.renderTime();
        }, 1000);
    }

    stopMove() {
        clearInterval(this.timer)
    }

    renderTime() {
        let minute = Math.floor(this.music.music.currentTime / 60);
        let second = Math.floor(this.music.music.currentTime % 60);
        this.curTimeDom.innerText = `${minute >= 10 ? minute : '0' + minute}:${second >= 10 ? second : '0' + second}`;
    }

    bindClick() {
        this.music.music.oncanplay = null;
        this.proc.ontouchstart = (e) => {
            this.stopMove();
            let left = e.touches[0].clientX - this.curTimeDomWidth;
            this.music.music.currentTime = left * this.music.totalTime / this.totalLen;
            // debugger
            this.front.style.width = left + 'px';
            this.bar.style.left = this.front.style.width;
            this.bar.style.left = this.front.style.width;
            this.proc.ontouchmove = (e) => {
                let left = e.touches[0].clientX;
                this.music.music.currentTime = (left - this.curTimeDomWidth) * this.music.totalTime / this.totalLen;
                this.front.style.width = left + 'px';
                this.bar.style.left = left + 'px';
            }
        }
        this.proc.ontouchend = (e) => {
            this.startMove();
            this.proc.ontouchmove = null;
        }
    }

    removeBind() {
        this.proc.ontouchstart = null;
        this.proc.ontouchmove = null;
        this.proc.ontouchend = null;
    }
}