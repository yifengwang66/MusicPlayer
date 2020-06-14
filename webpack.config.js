const devConfig = require('./webpack.dev');
const prodConfig = require('./webpack.prod');
const baseConfig = require('./webpack.base');
module.exports = env => {
    if(env && env == 1){

        return {
            ...baseConfig,
            ...prodConfig
        }

    }else{
        return{
            ...baseConfig,
            ...devConfig
        }
    }
}