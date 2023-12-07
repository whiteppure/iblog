---
title: "Js下雨特效"
date: 2018-12-10
draft: false
tags: ["Js", "玩具"]
slug: "js-rain"
---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>
        rain
    </title>

    <style>
        html {
            width: 100%;
        }

        body {
            width: 100%;
            margin: 0;
            padding: 0;
            background-color: #000;
        }

        .rain {
            display: block;
        }

        embed {
            display: block;
        }
    </style>
</head>
<body>
<!--
  2、使用hidden="true"表示隐藏音乐播放按钮，相反使用hidden="false"表示开启音乐播放按钮。
  3、使用autostart="true" 表示是打开网页加载完后自动播放。
  4、使用loop="true"表示 循环播放 如仅想播放一次则为：loop="false"
  -->
<embed src="music/恋如雨止.mp3" hidden="true" autostart="true" loop="false">

<canvas class="rain"></canvas>
<!--
canvas雨滴逻辑思路:
1  画什么 -- 雨滴
   雨滴 是由许多个小矩形拼接成的 加上 遮盖层 让每个矩形透明度依次递减 就能看到此效果
   首先画一个 然后再去复制这个雨滴
2  怎么画让雨滴动起来
    定义随机数让雨滴的 起始位置 长 宽 下落速度 绽放速度 不同
    然后开启定时器让雨滴动起来
3 需要什么东西
    需要画笔: 实心画笔 空心画笔
    创建雨滴的模板
    盛放雨滴的容器
-->
<script>
    var oCanvas = document.querySelector(".rain");//获取元素rain
    var w, h;//定义变量w ,h
    var aRain = [];//用来存放新生成的雨滴

    ~~function () {//自执行函数:不用调用自己执行 把canvas和整个屏幕无缝贴合
        window.onresize = arguments.callee;//随着浏览器的变化宽和高都变化
        w = window.innerWidth;//获取浏览器的宽
        h = window.innerHeight;//获取浏览器的高
        oCanvas.width = w;//把值赋给canvas
        oCanvas.height = h;//把值赋给canvas
    }();

    function random(min, max) {//定义随机函数
        return Math.random() * (max - min) + min;//返回想要的任意的值
    }

    var canCon = oCanvas.getContext("2d");//创建一个2d画笔

    Rain.prototype = {//this 指代当前函数
        init: function () {//雨滴的基本参数
            this.x = random(0, w);//雨滴横坐标
            this.y = 0;//纵坐标
            this.w = random(1.6, 3);//雨滴的 宽度 1.6px 到 2.5px
            this.h = random(8, 15);//雨滴的 长度8px 到 15px
            this.color = "#3ff";//颜色
            this.vy = random(1.2, 2.3);//下降速度
            this.vr = random(0.5, 1.5);//绽放速度
            this.ground = random(0.8 * h, 0.9 * h);//雨滴绽放的位置
            this.r = this.w / 2;//圆的半径
        },
        draw: function () {//把基本参数变化成雨滴效果
            if (this.y < this.ground)//如果雨滴y坐标小于绽放位置,就一直下落
            {
                canCon.beginPath();//抬笔
                canCon.fillStyle = this.color;//用画笔蘸颜色画雨滴
                canCon.fillRect(this.x, this.y, this.w, this.h);//画矩形区域左上角的坐标 矩形的宽 高
            } else//绽放的圆形区域
            {
                canCon.beginPath();//抬笔 雨滴停止下落
                canCon.strokeStyle = "rgba(50,250,250,0.96)";//空心画笔 rgba() rgb是颜色  a是透明度
                canCon.arc(this.x, this.y, this.r, 0, Math.PI * 2);//画圆形 圆心坐标 半径 画多少(弧度制)
                canCon.stroke();//下笔作画
            }

        },
        move: function () {//移动函数:设置怎么移动

            if (this.y < this.ground)//如果雨滴的y坐标小于定义的地面高度  则雨滴往下移动
            {
                this.y += this.vy;//让每个雨滴下降速度不同
            } else//如果大于  就绽放
            {
                if (this.r < 100)//绽放半径
                {
                    this.r += this.vr;//让每个雨滴绽放速度不同
                } else {
                    this.init();//循环雨滴:重新设置雨滴,重头再来 循环
                }

            }

            this.draw();//调用draw函数
        }
    };


    function Rain() {
    }//雨滴的模板
    //创建num个雨滴
    function createRain(num) {//参数为创建多少雨滴
        for (let i = 0; i < num; i++)//let 为立执行
        {
            setTimeout(function () {//创建num个雨滴的定时器
                var rain = new Rain();//创建雨滴对象 创建什么样的雨滴 : 调用init函数 draw函数
                rain.init();
                rain.draw();
                aRain.push(rain);//把雨滴放在aRain里边, 目的是 循环他
            }, 200 * i);//时间200*i目的是为了让每个雨滴下落时间不同  单位为毫秒

        }
    }


    setInterval(function () {//下落运动的定时器
        canCon.fillStyle = "rgba(0,0,0,0.04)";//遮盖层,透明度递减,让画的矩形看起来更像雨滴
        canCon.fillRect(0, 0, w, h);//画矩形
        for (var item of aRain)//遍历num个雨滴
        {
            item.move();//把遍历后的雨滴都执行move函数 运动起来
        }
    }, 1000 / 90);//单位为毫秒


    createRain(70);//方法入口  下多少雨滴

</script>
</body>
</html>
```
## 运行效果
![Js下雨特效-01.png](/iblog/posts/annex/images/readme/Js下雨特效-01.png)

