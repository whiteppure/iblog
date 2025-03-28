---
title: "Js五子棋"
date: 2018-09-10
draft: false
tags: ["JS", "小程序","应用"]
slug: "js-gomoku"
---

## index.html
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>五子棋</title>
<meta name="viewport" content="device-width; initial-scale=1.0;" />
<style>
#c1 {
	display: block;
	margin: 60px auto;
	box-shadow: 1px 1px 5px #000000;
}
</style>
<script src="js/index.js"></script>

</head>

<body>
<canvas id="c1" width="450px" height="450px"></canvas>
</body>
</html>

```

## index.js
```javascript
window.onload = function(){
    var oC = document.getElementById('c1');
    var oGc = oC.getContext('2d');

    var over = false;

    oGc.strokeStyle = "#bfbfbf";

    //绘制棋盘
    for(var i=0;i<15;i++){
        oGc.moveTo(15+i*30,15);
        oGc.lineTo(15+i*30,435);
        oGc.stroke();
        oGc.moveTo(15,15+i*30);
        oGc.lineTo(435,15+i*30);
        oGc.stroke();
    }


    /*	AI难点解析
        赢法数组：记录了五子棋说有的赢法，三维数组
        每一种赢法的统计数组，一维数组
        如何判断胜负
        计算机落子规则*/

    //赢法数组
    var wins = [];

    for(var i=0;i<15;i++){
        wins[i] = [];
        for(var j=0;j<15;j++){
            wins[i][j] = [];
        }
    }

    var count = 0;
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            //i=0 j=0
            //wins[0][0][0] = true;
            //wins[0][1][0] = true;
            //wins[0][2][0] = true;
            //wins[0][3][0] = true;
            //wins[0][4][0] = true;

            //wins[0][1][1] = true;
            //wins[0][2][1] = true;
            //wins[0][3][1] = true;
            //wins[0][4][1] = true;
            //wins[0][5][1] = true;
            for(var k=0;k<5;k++){
                wins[i][j+k][count] = true;
            }
            count++;
        }
    }
    for(var i=0;i<15;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[j+k][i][count] = true;
            }
            count++;
        }
    }
    for(var i=0;i<11;i++){
        for(var j=0;j<11;j++){
            for(var k=0;k<5;k++){
                wins[i+k][j+k][count] = true;
            }
            count++;
        }
    }
    for(var i=0;i<11;i++){
        for(var j=14;j>3;j--){
            for(var k=0;k<5;k++){
                wins[i+k][j-k][count] = true;
            }
            count++;
        }
    }

    var myWin = [];
    var computerWin = [];

    for(var i=0;i<count;i++){
        myWin[i] = 0;
        computerWin[i] = 0;
    }

    function oneStep(i,j,me){
        oGc.beginPath();
        oGc.arc(15+i*30,15+j*30,13,0,2*Math.PI);
        oGc.closePath();
        var gradient = oGc.createRadialGradient(15+i*30+2,15+j*30+2,13,15+i*30+2,15+j*30+2,0);
        if(me){
            gradient.addColorStop(0,"#0A0A0A");
            gradient.addColorStop(1,"#636766");
        }else{
            gradient.addColorStop(0,"#D1D1D1");
            gradient.addColorStop(1,"#F9F9F9");
        }

        oGc.fillStyle = gradient;
        oGc.fill();

    };

    var me = true;
    var chessBoard = [];
    for(var i=0;i<15;i++){
        chessBoard[i] = [];
        for(var j=0;j<15;j++){
            chessBoard[i][j] = 0;
        }
    };

    oC.onclick = function(ev){
        if(!me){return;}
        if(over){return;}

        var x = ev.offsetX;
        var y = ev.offsetY;
        var i = Math.floor(x/30);
        var j = Math.floor(y/30);

        if(chessBoard[i][j] == 0){
            oneStep(i,j,me);
            chessBoard[i][j] = 1;

        }

        for(var k=0;k<count;k++){
            if(wins[i][j][k]){
                myWin[k]++;
                computerWin[k] = 6;
                if(myWin[k] == 5){
                    window.alert("恭喜你，获得了胜利！");
                    over = true;
                }
            }
        }

        if(!over){
            computerAI();
            me = !me;
        }

    }

    function computerAI(){
        var myScore = [];
        var computerScore = [];
        var iMax = 0;
        var u =0;
        var v= 0;

        for(var i=0;i<15;i++){
            myScore[i] = [];
            computerScore[i] = [];
            for(var j=0;j<15;j++){
                myScore[i][j] = 0;
                computerScore[i][j] = 0;
            }
        }

        for(var i=0;i<15;i++){
            for(var j=0;j<15;j++){
                if(chessBoard[i][j] == 0){
                    for(var k=0;k<count;k++){
                        if(wins[i][j][k]){
                            if(myWin[k] == 1){
                                myScore[i][j]+=200;
                            }else if(myWin[k] == 2){
                                myScore[i][j]+=400;
                            }else if(myWin[k] == 3){
                                myScore[i][j]+=2000;
                            }else if(myWin[k] == 4){
                                myScore[i][j]+=10000;
                            }

                            if(computerWin[k] == 1){
                                computerScore[i][j]+=400;
                            }else if(computerWin[k] == 2){
                                computerScore[i][j]+=800;
                            }else if(computerWin[k] == 3){
                                computerScore[i][j]+=2200;
                            }else if(computerWin[k] == 4){
                                computerScore[i][j]+=20000;
                            }
                        }
                    }

                    if(myScore[i][j]>iMax){
                        iMax = myScore[i][j];
                        u = i;
                        v = j;
                    }else if(myScore[i][j]==iMax){
                        if(computerScore[i][j]>computerScore[u][v]){
                            u = i;
                            v = j;
                        }
                    }

                    if(computerScore[i][j]>iMax){
                        iMax = computerScore[i][j];
                        u = i;
                        v = j;
                    }else if(computerScore[i][j]==iMax){
                        if(myScore[i][j]>myScore[u][v]){
                            u = i;
                            v = j;
                        }
                    }
                }
            }
        }

        oneStep(u,v,false);
        chessBoard[u][v] = 2;

        for(var k=0;k<count;k++){
            if(wins[u][v][k]){
                computerWin[k]++;
                myWin[k] = 6;
                if(computerWin[k] == 5){
                    window.alert('YOU LOST!');
                    over = true;
                }
            }
        }

        console.log(iMax);
        if(!over){
            me = !me;
        }

    };


};
```

## 运行效果
![Js五子棋-01](/posts/annex/images/readme/Js五子棋-01.png)







