---
title: "Js雪花飘落"
date: 2018-12-25
draft: false
tags: ["JS", "小程序","应用"]
slug: "js-snow"
---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>snow</title>
</head>
<style>
    html {
        width: 100%;
    }

    body {
        margin: 0;
        padding: 0;
        overflow-y: hidden;
        width: 100%;
    }

    .header {
        width: 100%;
        height: 315px;
        background: url("images/header-bg.png") repeat;

    }

    .snow {
        position: relative;
        height: inherit;
        width: 960px;
        background: url("images/con-bg.png") no-repeat 0 204px,
        url("images/snow-bg.png") no-repeat 0 0;;
        margin: 0 auto;
        animation: auto 10s linear infinite;
    }

    /* 下雪动画

    插入两个背景图片*/
    @keyframes auto {
        from {
            background: url("images/con-bg.png") no-repeat 0 204px,
            url("images/snow-bg.png") repeat 0 0;
        }
        to {
            background: url("images/con-bg.png") no-repeat 0 204px,
            url("images/snow-bg.png") repeat 0 1000px;
        }
    }

    tree, snow {
        position: absolute;
    }

    tree {
        width: 112px;
        height: 137px;
        background: url("images/tree.png");
    }

    snow {
        left: 410px;
        top: 210px;
        width: 115px;
        height: 103px;
        background: url("images/ice.png");
        animation: play 3s;
    }

    @keyframes play {
        from {
            transform: translate(0, -500px);
        }
        to {
            transform: translate(0, 0);
        }
    }

    tree:nth-child(1) {
        left: 35px;
        top: 169px;
        animation: play 1s;
    }

    tree:nth-child(2) {
        left: 200px;
        top: 180px;
        animation: play 1.9s;
    }

    tree:nth-child(3) {
        left: 350px;
        top: 125px;
        animation: play 2.2s;
    }

    tree:nth-child(4) {
        left: 515px;
        top: 150px;
        animation: play 1s;
    }

    tree:nth-child(5) {
        left: 680px;
        top: 170px;
        animation: play 2s;
    }

    tree:nth-child(6) {
        left: 805px;
        top: 125px;
        animation: play 1.7s;
    }

    /* 文字部分  start*/
    .content {
        position: relative;
        width: inherit;
        opacity: 0.7;
        background-attachment:fixed;
        background: url("images/snow.jpg") no-repeat center/cover;
        height: 650px;
        background-color: #ffffff;
        padding-top: 60px;
    }

    .content .text {
        padding-left: 250px;
    }

    .content .text p {
        margin: 0;
        font-size: 20px;
        font-family: "微软雅黑 Light"; /* 这里可以改文字的字体*/
        font-weight: bold;
        color: #000000;
    }

    .content .box {
        position: absolute;
        top: 0;
        width: inherit;
        height: 500px;
        float: left;
        background-color: #ffffff;
    }


</style>
<body>
<div class="header">
    <div class="snow">
        <!-- 自定义标签 <tree> -->
        <tree></tree>
        <tree></tree>
        <tree></tree>
        <tree></tree>
        <tree></tree>
        <tree></tree>
        <snow></snow>
    </div>
</div>
<div class="content">
    <div class="box"></div>
    <div class="text">
        <h1 style="color: red ">这里写主题哦!</h1>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>
        <p>文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!文字实例!</p>

    </div>

</div>

<script>
    /**
     * 如何使文字实现渐变出现效果
     *
     */
    var oContent = document.getElementsByClassName("content")[0],
            oText = document.getElementsByClassName("text")[0],
            oMove = document.getElementsByClassName("box")[0],
            oP = document.getElementsByTagName("p")
    ;

    (function startMove() {
        var timer = null;
        clearInterval(timer);
        timer = setInterval(function () {
            var speed = 5;
            if (oMove.offsetTop >= oContent.offsetHeight) {
                clearInterval(timer);
            }
            else {
                oMove.style.top = oMove.offsetTop + speed + 'px';

            }
        }, 30);

    })()


</script>

</body>
</html>
```

## 图片素材
{{<img src="/posts/annex/images/readme/Js雪花飘落-con-bg.png">}}
{{<img src="/posts/annex/images/readme/Js雪花飘落-header-bg.png">}}
{{<img src="/posts/annex/images/readme/Js雪花飘落-ice.png">}}
{{<img src="/posts/annex/images/readme/Js雪花飘落-snow.png">}}
{{<img src="/posts/annex/images/readme/Js雪花飘落-tree.png">}}

## 运行效果
{{<img src="/posts/annex/images/readme/Js-雪花飘落-01.png">}}

