---
title: "Js折纸导航栏"
date: 2018-10-25
draft: false
tags: ["JS", "玩具"]
slug: "js-paper-folding"
---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>折纸导航栏</title>
</head>
<style>
    *{
        margin: 0;
        padding: 0;
    }
    .content{
        position: relative;
        width: 400px;
        height: 30px;
        margin: 50px auto;
        /*-webkit-perspective: 1000px;
        -moz-perspective: 1000px;
        -ms-perspective: 1000px;*/
        perspective: 1000px;/*景深相当于眼睛距离元素的位置距离*/
    }
    .content .open{
        transform: rotateX(0);
        animation: open 1s linear;
    }
    @keyframes open {
        0%{
            transform: rotateX(-90deg);
        }
        20%{
            transform:rotateX(30deg);
        }
        40%{
            transform:rotateX(-60deg);
        }
        60%{
            transform:rotateX(60deg);
        }
        80%{
            transform:rotateX(-30deg);
        }
        100%{
            transform:rotateX(0);
        }
    }
    .content .close{
        transform: rotateX(-120deg);
        animation: close 1s ease;
    }
    @keyframes close {
        0%{
            transform: rotateX(0);
        }
        100%{
            transform: rotateX(-90deg);
        }
    }
    .content div{
        position: absolute;
        left: 0;
        top: 30px;
        width: 100%;
        transform-style: preserve-3d;
        transform-origin: top;
        transform: rotateX(-90deg);
    }
    .content div span{
        display: block;
        height: 28px;
        line-height: 30px;
        text-align: center;
        background: rgb(153,102,102);
    }
    input{
        position: absolute;
        left: 0;
        top: 0;
        z-index: 999;
        width: 400px;
        height: 30px;
        border: 0;
        background-color: #c74;
    }
</style>
<body>
<div class="content">
    <input type="button" value="打开" id="btn"/>
    <div>
        <span>导航1</span>
        <div>
            <span>导航2</span>
            <div>
                <span>导航3</span>
                <div>
                    <span>导航4</span>
                    <div>
                        <span>导航5</span>
                        <div>
                            <span>导航6</span>
                            <div>
                                <span>导航7</span>
                                <div>
                                    <span>导航8</span>
                                    <div>
                                        <span>导航9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script>
    var oBtn = document.getElementById('btn');
    var oCon = document.getElementsByClassName('content')[0];
    var oDiv = oCon.getElementsByTagName('div');
    var time = null;
    var i = 0;
    var mark = true;
    oBtn.onclick = function () {
        if (mark){
            i = 0;
            timer=setInterval( function () {
                if (i == oDiv.length -1)
                {
                    clearInterval(timer);
                }
                oDiv[i].className = 'open';
                i++;
            },200)
            oBtn.value = '关闭';
        }
        else
        {
            i = oDiv.length -1;
            timer=setInterval( function () {
                if (i == 0)
                {
                    clearInterval(timer);
                }
                oDiv[i].className = 'close';
                i--;
            },100)
            oBtn.value = '打开';
        }
        mark = !mark;
    }
</script>
</body>
</html>
```
## 运行效果
![Js折纸导航栏](/iblog/posts/annex/images/readme/Js折纸导航栏-01.png)

