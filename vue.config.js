module.exports = {
    devServer:{
        proxy:{
            "/api":{
                //target:"http://localhost:3000"
                target:"https://port-0-backend-nodejs-20zynm2mlk2nnlwj.sel4.cloudtype.app/"
            }
        }
    },
    publicPath: './', //해당 설정을 추가 해줍니다. 상대경로인 ./ 로 설정 합니다.
    assetsDir: './' //만약 css, js, img 등 어셋 경로가 다를 경우 해당 경로도 수정 해야 합니다.
}
