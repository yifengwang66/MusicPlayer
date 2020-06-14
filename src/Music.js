//音乐类

module.exports = class Music {
    constructor(src){
        this.music = new Audio();
        this.music.src = src;
        this.isPlay = false;
        this.isLike = false;
    }
    play() {
        this.music.play();
        this.isPlay = true;
    }
    pause() {
        this.music.pause();
        this.isPlay = false;
    }
}