
// 夜间模式使用
(function (){
    function darkModelOptions(){
        return  {
            right: '32px', // default: '32px'
            bottom: 'unset', // default: '32px'
            // left: '32px', // default: 'unset'
            time: '0.3s', // default: '0.3s'
            mixColor: '#f7f7f7', // default: '#fff'
            backgroundColor: '#f7f7f7', // default: '#fff'
            buttonColorDark: '#212121', // default: '#100f2c'
            buttonColorLight: '#f7f7f7', // default: '#fff'
            saveInCookies: false, // default: true,
            autoMatchOsTheme: true // default: true
        }
    }

    // 晚上7点到早上6点 自动调用夜间模式
    const hours = new Date().getHours();
    if (hours >= 19 && hours <= 6 || hours === 19){
        new Darkmode(darkModelOptions()).toggle();
    }
})()
