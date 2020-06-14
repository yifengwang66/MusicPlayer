/*构建播放器模块*/

const gaussBlur = require('./gaussBlur');
const Music = require('./Music');
const Controls = require('./Controls');
const Menu = require('./Menu');
const rotate = require('./rotate');
const Bar = require('./processBar');

const menuDom = document.getElementById('menu');
module.exports = class Player {
    constructor(data) {
        this.data = data;
        this.index = 0;
        this.controls = new Controls();
        this.menu = new Menu(data);
    }
    blurImg(src, ele) {
        var canvas = document.createElement('canvas');
        ele = ele || document.body;
        var width = document.documentElement.clientWidth;
        var height = document.documentElement.clientHeight;
        //2、这两个值越小，图片就会越模糊
        canvas.width = width;
        canvas.height = height;

        var context = canvas.getContext('2d');

        //3、把img对象放到了这里
        var img = new Image();
        img.src = src;
        img.onload = function () {
            context.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
            var imgData = context.getImageData(0, 0, canvas.width, canvas.height);
            var gaussData = gaussBlur(imgData);
            context.putImageData(gaussData, 0, 0);
            var imgSrc = canvas.toDataURL();

            ele.style.backgroundImage = 'url(' + imgSrc + ')';
        }
    }

    /**
     * 渲染唱片，喜欢，背景
     * @param {*} index 需要加载音乐的索引值
     */
    renderDom(index) {
        const album = document.getElementById('songImg');
        const body = document.body
        const like = document.getElementById('controls').children[0];
        let temp = `<div class="album">
        <img src=${this.data[index].image}>
    </div>
    <p class="singer">${this.data[index].singer}</p>
    <p class="songName">${this.data[index].name}</p>
    <p class="albName">${this.data[index].album}</p>`;
        album.innerHTML = temp;
        if (this.audio.isLike) {
            like.className = 'liking';
        }else{
            like.className = '';
        }
        this.blurImg(this.data[index].image, body);
        this.menu.renderMenu();
    }
    /**
     * 加载音乐和时间, 通过记录的播放状态来判定切歌后是播放还是暂停
     * @param {*} index 需要加载音乐的索引值
     * @param {*} state 播放状态  
     */
    loadMusic(index, state) {
        this.audio = new Music(this.data[index].song);
        this.audio.isLike = this.data[index].isLike;
        this.audio.isPlay = state;
        const totalTimeDom = document.getElementsByClassName('totalTime')[0];
        let allTime;
        let minute;
        let second;
        // 改变music的src路径之后不能直接获取到歌曲的总时长，所以在canplay事件触发后获取不能再构造audio对象的时候获取
        this.audio.music.oncanplay = () => {
            allTime = this.audio.music.duration;
            this.audio.totalTime = allTime; //给audio对象加上totalTime属性便于在进度条的时候获取
            this.bar = new Bar(this.audio) // 当audio对象完全构建完成之后才能构建bar对象，要不然在bar对象构造的时候获取不到总时间属性
            minute = Math.floor(allTime / 60);
            second = allTime % 60;
            totalTimeDom.innerText = `${minute >= 10 ? minute : '0' + minute}:${second >= 10 ? Math.floor(second) : '0' + Math.floor(second)}`;
            if (state) {
                this.audio.play();
                rotate.startRotate();
                this.bar.startMove();
            }
            this.bar.bindClick();
        }
        this.audio.music.onended = () => {
            this.next();
        }
    }

    /**
     * 为控件绑定事件
     */
    prev() {
        let playState = this.audio.isPlay;
        this.audio.pause();
        this.audio = null;
        this.index = (this.index - 1 + this.data.length) % this.data.length;
        this.bar.stopMove(); // 切歌之前需要先清除当前歌的计时器
        this.bar.removeBind();
        this.loadMusic(this.index, playState);
        this.renderDom(this.index);
        this.menu.renderMenu(this.index);
        this.bindMenu();
    }
    next() {
        let playState = this.audio.isPlay;
        this.audio.pause();
        this.audio = null;
        this.index = (this.index + 1 + this.data.length) % this.data.length;
        this.bar.stopMove(); // 切歌之前需要先清除当前歌的计时器
        this.bar.removeBind();
        this.loadMusic(this.index, playState);
        this.renderDom(this.index);
        this.menu.renderMenu(this.index);
        this.bindMenu();
    }
    // 绑定所有事件
    bindControls() {
        // 绑定喜欢事件
        this.controls.like.addEventListener('touchend', () => {
            if (this.audio.isLike) {
                this.controls.like.className = '';
                this.audio.isLike = false;
                this.data[this.index].isLike = false;
            } else {
                this.controls.like.className = 'liking';
                this.audio.isLike = true;
                this.data[this.index].isLike = true;
            }
        }, false);

        // 前一首
        this.controls.prevBtn.addEventListener('touchend', this.prev.bind(this), false);

        // 暂停播放
        this.controls.playBtn.addEventListener('touchend', () => {
            if (this.audio.isPlay) {
                this.audio.pause();
                this.controls.playBtn.className = '';
                rotate.stopRotate();
                this.bar.stopMove()
                this.bar.bindClick();
            } else {
                this.audio.play();
                this.controls.playBtn.className = 'playing';
                rotate.startRotate();
                this.bar.startMove();
                this.bar.bindClick();
            }
        }, false);

        // 下一首
        this.controls.nextBtn.addEventListener('touchend', this.next.bind(this), false);

        // 菜单
        this.controls.menu.addEventListener('touchend', () => {
            menuDom.style.transform = 'translateY(0)';
            this.menu.renderMenu(this.index);
            this.bindMenu();
            this.menu.shown = true;
        });
        this.bindMenu();
    }
    // 菜单中每个选项的点击事件绑定
    bindMenu() {
        const dd = document.querySelectorAll('dd:not(.close)');
        dd.forEach((ele, index) => {
            ele.addEventListener('touchend', () => {
                this.index = index;
                let playState = this.audio.isPlay;
                this.audio.pause();
                this.audio = null;
                this.loadMusic(index, playState);
                this.renderDom(index);
                this.menu.renderMenu(index);
                this.bindMenu();
            }, false)
        });
    }
}
