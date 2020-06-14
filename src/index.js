
require('./index.less')
const Player = require('./Player');

async function run(){
    const data = await fetch('../public/mock/data.json', {
        method: "GET"
    }).then(resp => {return resp.json()})
    const player = new Player(data);
    player.loadMusic(player.index, false);
    player.renderDom(player.index)
    player.bindControls();
}

run()

// 热更新
if(module.hot){
    module.hot.accept();
}