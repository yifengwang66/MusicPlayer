

let timer = null;
function startRotate(){
    const album = document.getElementsByClassName('album')[0];
    album.dataset.deg || (album.dataset.deg = 0);
    clearInterval(timer);
    let step = 18 * (1 / 60);
    timer = setInterval(() => {
        album.style.transform = `rotate(${+ album.dataset.deg + step}deg)`;
        album.dataset.deg = +album.dataset.deg + step;
    }, 1000 / 60);
}

function stopRotate(){
    clearInterval(timer);
}

module.exports = {
    startRotate,
    stopRotate
}