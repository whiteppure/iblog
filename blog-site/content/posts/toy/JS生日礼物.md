---
title: "Js生日礼物"
date: 2018-08-24
draft: false
tags: ["JS", "玩具"]
slug: "js-birthday-gift"
---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>card</title>
    <style>
        body,html{
            width: 100%;
            height: 100%;
        }
        body{
            display: flex;/*弹性盒模型*/
            justify-content: center;/*水平对齐  盒子位于中心*/
            align-items: center;/*竖直对齐  居中对齐*/
            background-color:  yellow;
            perspective: 1000px;/*景深:眼到屏幕的距离*/
        }
        body,h1,p{
            margin: 0;
        }
        .card{
            width: 520px;
            height: 350px;
            border-radius: 15px;
            background: linear-gradient(#020333 70%,#fff 75%);/*渐变色*/
            transform:rotateX(0deg);
            transform-style: preserve-3d;
            animation: move 1.5s;
        }
        .box{
            width: 520px;
            height: 350px;
            font-family: Rockwell;
            transform-style: preserve-3d;
            transform: translateZ(88px);
            box-shadow: 0 0 30px #000 inset;
        }
        @keyframes move {
            0%{
                transform:  scale(0);
            }
            30%{
                transform:  scale(1.2);
            }
            40%{
                transform:  scale(0.85);
            }
            50%{
                transform:  scale(1.15);
            }
            60%{
                transform:  scale(0.9);
            }
            70%{
                transform: scale(1.1);
            }
            80%{
                transform:  scale(0.95);
            }
            90%{
                transform:  scale(1.05);
            }
            100%{
                transform:  scale(1);
            }
        }
        h1{

            color: #fff;
            height: 60%;
            font-size: 46px;
            text-align: center;
            line-height: 210px;
        }
        p{

            color: #a9467d;
            height: 40%;
            font-size: 24px;
            text-align: center;
            line-height: 140px;

        }

    </style>
    <script src="jquery-3.3.1.js"></script>

</head>
<body>
<div class="card">
    <div class="box">
        <h1>Happy Birthday
            <span style="color: #FF0000;font-size: 50px">XXX</span>
        </h1>
        <p>To my friend,
            爱你的XXX爸爸!
        </p>
    </div>
</div>
<script>
    var card = $(".card");
    $(document).on("mousemove",function (e) {
        var ax = ($(window).innerWidth() / 2 - e.pageX)/20;
        var ay = ($(window).innerHeight() / 2 - e.pageY)/10;
        card.attr("style","transform: rotateY("+ ax +"deg)rotateX("+ay +"deg) translateZ(7em)");
    });
</script>
</body>
</html>
```
## 运行效果
![Js-生日礼物-01.png](/iblog/posts/annex/images/readme/Js-生日礼物-01.png)

