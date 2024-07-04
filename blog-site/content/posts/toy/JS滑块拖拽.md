---
title: "Js滑块拖拽"
date: 2018-09-08
draft: false
tags: ["JS", "玩具"]
slug: "js-box-drag"
---


## index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>滑块拖拽</title>
</head>
<style>
    body {
        margin: 0;
        padding: 0;
        user-select: none;
    }

    .content {
        position: relative;
        width: 300px;
        height: 40px;
        margin: 50px auto;
        background-color: #E8E8EB;
        text-align: center;
        line-height: 40px;
    }

    .rect {
        position: absolute;
        width: 100%;
        height: 100%;

    }

    .rect .bg {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        width: 0;
        height: 100%;
        background: rgba(122,194,60,.4);
    }

    .rect .move {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
        width: 45px;
        height: 40px;
        position: absolute;
        top: 0;
        left: 0;
        background-color: #fff;
        border: 1px solid #cccccc;
    }
    .rect span{

    }
</style>
<body>
<div class="content">
    <div class="rect">
        <div class="bg"></div>
        <span>滑块拖动验证</span>
        <div class="move">
            <img src="images/right.png" alt="图片拖动">
        </div>
    </div>
</div>
<script>
    var oMove = document.querySelector(".move"),
        oBg = document.querySelector(".bg"),
        oRect = document.querySelector(".rect"),
        oImage = document.querySelector("img"),
        oSpan = document.querySelector("span"),
        _X = 0;
    oMove.onmousedown = function (e) {

        var startX = e.clientX;
        document.onmousemove = function (e) {
            var endX = e.clientX;
            _X = endX - startX;
            if (_X < 0) {
                _X = 0;
            }
            if (_X > 255) {
                _X = 255;
            }
            oBg.style.width = oMove.style.left = _X + "px";

            if (_X >= 255) {
                oRect.style.color = "black";
                oImage.src = "images/left.png";
                oSpan.innerHTML = "验证成功";
                oBg.style.width = oMove.style.left = 255 + "px";
            }
        }
    };
    document.onmouseup = function () {
        document.onmousemove = null;
        if (_X < 255) {
            oBg.style.width = oMove.style.left = 0;
        }

    }
</script>

</body>
</html>
```

## 运行效果
![Js滑块拖拽-01.png](/iblog/posts/annex/images/readme/Js滑块拖拽-01.png)

