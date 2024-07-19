---
title: "Js换肤特效"
date: 2018-11-14
draft: false
tags: ["JS", "小程序","应用"]
slug: "js-trans-skin"
---

## index.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>换肤特效</title>
    <style type="text/css">
        body {
            margin: 0;
            background-image: url("images/1.jpg");
            background-size: cover;
        }

        ul {
            margin: 0;
            padding: 0;
            list-style-type: none;
        }

        .bg-list {
            display: none;
            margin: 0;
            width: 100%;
            height: 200px;
            background: rgba(0, 0, 0, 0.5);
        }

        .img-wrap {
            height: 200px;
            display: flex;
            justify-content: space-around;
            align-items: center;
        }

        .tab-btn {
            background-image: url("images/upseek.png");
            height: 50px;
            width: 50px;
            position: fixed;
            top: 0;
            right: 0;
        }

        .tab-btn:hover {
            background-position-y: -63.6px;
        }
    </style>


</head>
<body>
<div class="bg-list">
    <ul class="img-wrap">
        <li class="img-item" data-src="images/1.jpg">
            <img src="images/1-1.jpg" width="160px"/>
        </li>
        <li class="img-item" data-src="images/2.jpg">
            <img src="images/2-2.jpg" width="160px"/>
        </li>
        <li class="img-item" data-src="images/3.jpg">
            <img src="images/3-3.jpg" width="160px"/>
        </li>
        <li class="img-item" data-src="images/4.jpg">
            <img src="images/4-4.jpg" width="160px"/>
        </li>
        <li class="img-item" data-src="images/5.jpg">
            <img src="images/5-5.jpg" width="160px"/>
        </li>
        <li class="img-item" data-src="images/6.jpg">
            <img src="images/6-6.jpg" width="160px"/>
        </li>
    </ul>
</div>
<div class="tab-btn"></div>
<script src="js\jquery.js" type="text/javascript"></script>
<script type="text/javascript">
    $(".tab-btn").click(function () {
        $(".bg-list").slideToggle();
    });
    $(".img-item").click(function () {
        var src = $(this).attr("data-src");
        $("body").css({
            "background-image": "url(" + src + ")"
        })
    });
</script>
</body>
</html>
```

## 运行效果
![Js-换肤特效-01](/iblog/posts/annex/images/readme/Js-换肤特效-01.png)

