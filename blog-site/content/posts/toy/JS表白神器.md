---
title: "Js表白神器"
date: 2018-10-14
draft: false
tags: ["JS", "玩具"]
slug: "js-love-heart"
---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>love</title>
    <style>
        *{
            margin: 0;
            padding: 0;
        }
        body{
            background-color: #000;
            background-size: cover;
            overflow-y: hidden;
        }
        .love{
            width: 400px;
            height: 400px;
            /*background-color: #7c7c7c;*/
            margin: 130px auto;
            animation: move 1s infinite alternate;
        }
        @keyframes move {
            100%{
                transform: scale(1.5);
            }
        }
        .left{
            float: left;
            width: 150px;
            height: 250px;
            background-color: #FF0000;
            border-radius: 75px 75px 0 5px;
            -webkit-transform: rotate(-45deg);
            -moz-transform: rotate(-45deg);
            -ms-transform: rotate(-45deg);
            -o-transform: rotate(-45deg);
            transform: rotate(-45deg);
            margin-left: 85px;
            box-shadow: 0 0 20px #FF0000;
            animation: shadow 1s infinite alternate;
        }
        @keyframes shadow {
            100%{
                box-shadow: 0 0 100px #FF0000;
            }
        }
        .right{
            float: left;
            width: 150px;
            height: 250px;
            background-color: #FF0000;
            border-radius: 75px 75px 5px 0;
            -webkit-transform: rotate(45deg);
            -moz-transform: rotate(45deg);
            -ms-transform: rotate(45deg);
            -o-transform: rotate(45deg);
            transform: rotate(45deg);
            margin-left: -78px;
            box-shadow: 0 0 10px #FF0000;
            animation: shadow 1s infinite alternate;
        }
        p{
            color: #FF0000;
            box-shadow: 0 0 100px #FF0000;
            text-align: center;
            font-size: 80px;
            margin-top: -110px;
        }
        .snowfall-flakes:before,.snowfall-flakes:after{
            content:'';
            position:absolute;/*绝对定位  参考物   一般是父元素*/
            width:10px;
            height:16px;
            background-color:red;
            border-radius:50px 50px 0 0;/*圆角   左上 右上 右下  左下*/
            transform:rotate(-45deg);/*css3新增 transform变换 rotate旋转 */
        }


        /*在元素之后添加内容*/
        .snowfall-flakes:after{
            left:5px;
            transform:rotate(45deg);/*css3新增 transform变换 rotate旋转 */
        }
    </style>
</head>
<body>

<div class="love">
    <div class="left"></div>
    <div class="right"></div>
</div>
<script src="http://libs.baidu.com/jquery/2.1.4/jquery.min.js"></script>
<script>
    (function () {
        var lastTime = 0;
        var vendors = ['webkit', 'moz'];
        for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
            window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
        }
        if (!window.requestAnimationFrame)
            window.requestAnimationFrame = function (callback, element) {
                var currTime = new Date().getTime();
                var timeToCall = Math.max(0, 16 - (currTime - lastTime));
                var id = window.setTimeout(function () {
                    callback(currTime + timeToCall);
                }, timeToCall);
                lastTime = currTime + timeToCall;
                return id;
            };
        if (!window.cancelAnimationFrame)
            window.cancelAnimationFrame = function (id) {
                clearTimeout(id);
            };
    }());
    (function ($) {
        $.snowfall = function (element, options) {
            var defaults = {
                flakeCount: 35,
                flakeColor: 'transparent',
                flakePosition: 'absolute',
                flakeIndex: 999999,
                minSize: 1,
                maxSize: 2,
                minSpeed: 1,
                maxSpeed: 5,
                round: false,
                shadow: false,
                collection: false,
                collectionHeight: 40,
                deviceorientation: false
            }, options = $.extend(defaults, options), random = function random(min, max) {
                return Math.round(min + Math.random() * (max - min));
            };
            $(element).data("snowfall", this);

            function Flake(_x, _y, _size, _speed, _id) {
                this.id = _id;
                this.x = _x;
                this.y = _y;
                this.size = _size;
                this.speed = _speed;
                this.step = 0;
                this.stepSize = random(1, 10) / 100;
                if (options.collection) {
                    this.target = canvasCollection[random(0, canvasCollection.length - 1)];
                }
                var flakeMarkup = null;
                if (options.image) {
                    flakeMarkup = $(document.createElement("div"));
                    /*flakeMarkup[0].src=options.图片;*/
                } else {
                    flakeMarkup = $(document.createElement("div"));
                    flakeMarkup.css({'background': options.flakeColor});
                }
                flakeMarkup.attr({'class': 'snowfall-flakes', 'id': 'flake-' + this.id}).css({
                    'width': this.size,
                    'height': this.size,
                    'position': options.flakePosition,
                    'top': this.y,
                    'left': this.x,
                    'fontSize': 0,
                    'zIndex': options.flakeIndex
                });
                if ($(element).get(0).tagName === $(document).get(0).tagName) {
                    $('body').append(flakeMarkup);
                    element = $('body');
                } else {
                    $(element).append(flakeMarkup);
                }
                this.element = document.getElementById('flake-' + this.id);
                this.update = function () {
                    this.y += this.speed;
                    if (this.y > (elHeight) - (this.size + 6)) {
                        this.reset();
                    }
                    this.element.style.top = this.y + 'px';
                    this.element.style.left = this.x + 'px';
                    this.step += this.stepSize;
                    if (doRatio === false) {
                        this.x += Math.cos(this.step);
                    } else {
                        this.x += (doRatio + Math.cos(this.step));
                    }
                    if (options.collection) {
                        if (this.x > this.target.x && this.x < this.target.width + this.target.x && this.y > this.target.y && this.y < this.target.height + this.target.y) {
                            var ctx = this.target.element.getContext("2d"), curX = this.x - this.target.x,
                                    curY = this.y - this.target.y, colData = this.target.colData;
                            if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] !== undefined || curY + this.speed + this.size > this.target.height) {
                                if (curY + this.speed + this.size > this.target.height) {
                                    while (curY + this.speed + this.size > this.target.height && this.speed > 0) {
                                        this.speed *= .5;
                                    }
                                    ctx.fillStyle = "#fff";
                                    if (colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] == undefined) {
                                        colData[parseInt(curX)][parseInt(curY + this.speed + this.size)] = 1;
                                        ctx.fillRect(curX, (curY) + this.speed + this.size, this.size, this.size);
                                    } else {
                                        colData[parseInt(curX)][parseInt(curY + this.speed)] = 1;
                                        ctx.fillRect(curX, curY + this.speed, this.size, this.size);
                                    }
                                    this.reset();
                                } else {
                                    this.speed = 1;
                                    this.stepSize = 0;
                                    if (parseInt(curX) + 1 < this.target.width && colData[parseInt(curX) + 1][parseInt(curY) + 1] == undefined) {
                                        this.x++;
                                    } else if (parseInt(curX) - 1 > 0 && colData[parseInt(curX) - 1][parseInt(curY) + 1] == undefined) {
                                        this.x--;
                                    } else {
                                        ctx.fillStyle = "#fff";
                                        ctx.fillRect(curX, curY, this.size, this.size);
                                        colData[parseInt(curX)][parseInt(curY)] = 1;
                                        this.reset();
                                    }
                                }
                            }
                        }
                    }
                    if (this.x > (elWidth) - widthOffset || this.x < widthOffset) {
                        this.reset();
                    }
                }
                this.reset = function () {
                    this.y = 0;
                    this.x = random(widthOffset, elWidth - widthOffset);
                    this.stepSize = random(1, 10) / 100;
                    this.size = random((options.minSize * 100), (options.maxSize * 100)) / 100;
                    this.speed = random(options.minSpeed, options.maxSpeed);
                }
            }//素材家园 - www.sucaijiayuan.com
            var flakes = [], flakeId = 0, i = 0, elHeight = $(element).height(), elWidth = $(element).width(),
                    widthOffset = 0, snowTimeout = 0;
            if (options.collection !== false) {
                var testElem = document.createElement('canvas');
                if (!!(testElem.getContext && testElem.getContext('2d'))) {
                    var canvasCollection = [], elements = $(options.collection),
                            collectionHeight = options.collectionHeight;
                    for (var i = 0; i < elements.length; i++) {
                        var bounds = elements[i].getBoundingClientRect(), canvas = document.createElement('canvas'),
                                collisionData = [];
                        if (bounds.top - collectionHeight > 0) {
                            document.body.appendChild(canvas);
                            canvas.style.position = options.flakePosition;
                            canvas.height = collectionHeight;
                            canvas.width = bounds.width;
                            canvas.style.left = bounds.left + 'px';
                            canvas.style.top = bounds.top - collectionHeight + 'px';
                            for (var w = 0; w < bounds.width; w++) {
                                collisionData[w] = [];
                            }
                            canvasCollection.push({
                                element: canvas,
                                x: bounds.left,
                                y: bounds.top - collectionHeight,
                                width: bounds.width,
                                height: collectionHeight,
                                colData: collisionData
                            });
                        }
                    }
                } else {
                    options.collection = false;
                }
            }
            if ($(element).get(0).tagName === $(document).get(0).tagName) {
                widthOffset = 25;
            }
            $(window).bind("resize", function () {
                elHeight = $(element)[0].clientHeight;
                elWidth = $(element)[0].offsetWidth;
            });
            for (i = 0; i < options.flakeCount; i += 1) {
                flakeId = flakes.length;
                flakes.push(new Flake(random(widthOffset, elWidth - widthOffset), random(0, elHeight), random((options.minSize * 100), (options.maxSize * 100)) / 100, random(options.minSpeed, options.maxSpeed), flakeId));
            }
            if (options.round) {
                $('.snowfall-flakes').css({
                    '-moz-border-radius': options.maxSize,
                    '-webkit-border-radius': options.maxSize,
                    'border-radius': options.maxSize
                });
            }
            if (options.shadow) {
                $('.snowfall-flakes').css({
                    '-moz-box-shadow': '1px 1px 1px #555',
                    '-webkit-box-shadow': '1px 1px 1px #555',
                    'box-shadow': '1px 1px 1px #555'
                });
            }
            var doRatio = false;
            if (options.deviceorientation) {
                $(window).bind('deviceorientation', function (event) {
                    doRatio = event.originalEvent.gamma * 0.1;
                });
            }

            function snow() {
                for (i = 0; i < flakes.length; i += 1) {
                    flakes[i].update();
                }
                snowTimeout = requestAnimationFrame(function () {
                    snow()
                });
            }

            snow();
            this.clear = function () {
                $(element).children('.snowfall-flakes').remove();
                flakes = [];
                cancelAnimationFrame(snowTimeout);
            }
        };
        $.fn.snowfall = function (options) {
            if (typeof(options) == "object" || options == undefined) {
                return this.each(function (i) {
                    (new $.snowfall(this, options));
                });
            } else if (typeof(options) == "string") {
                return this.each(function (i) {
                    var snow = $(this).data('snowfall');
                    if (snow) {
                        snow.clear();
                    }
                });
            }
        };
    })(jQuery);
</script>
<script>
    $(document).snowfall({
        flakeCount:200//规定爱心的数量
    })
</script>
</body>
</html>
```
## 运行效果
![Js表白神器-01](/iblog/posts/annex/images/readme/Js-表白神器-01.png)

