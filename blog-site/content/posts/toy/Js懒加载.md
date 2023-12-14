---
title: "Js懒加载"
date: 2018-09-21
draft: false
tags: ["Js", "玩具"]
slug: "js-loadding-lazy"
---

## index.html

```html
<!doctype html>
<html lang="en">
 <head>
  <meta charset="UTF-8">
  <meta name="Generator" content="EditPlus®">
  <meta name="Author" content="">
  <meta name="Keywords" content="">
  <meta name="Description" content="">
  <title>懒加载技术</title>
  <style>
  	*{
		margin: 0;
		padding:0;
	}
	body{
		background: rgb(0,0,0);
	}
	.box{
		overflow: hidden;
		width: 948px;
		background-color: #7c7c7c;
		margin: 50px auto;
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		border-radius: 10px;

	}
	.box img{
		float: left;
		display: block;
		width: 300px;
		height: 150px;
		margin: 6px;
		border: 2px solid grey;
		-webkit-border-radius: 10px;
		-moz-border-radius: 10px;
		border-radius: 10px;
	}
  </style>
	 <script src="js/lazyload.js"></script>

 </head>
 <body>
 	<div class="box">
		<img src="images/1.jpg"/>
		<img src="images/2.jpg"/>
		<img src="images/3.jpg"/>
		<img src="images/4.jpg"/>
		<img src="images/5.jpg"/>
		<img src="images/6.jpg"/>
		<img src="images/7.jpg"/>
		<img src="images/8.jpg"/>
		<img src="images/9.jpg"/>
		<img src="images/10.jpg"/>
		<img src="images/11.jpg"/>
		<img src="images/12.jpg"/>
		<img src="images/13.jpg"/>
		<img src="images/14.jpg"/>
		<img src="images/15.jpg"/>
		<img src="images/16.jpg"/>
		<img src="images/17.jpg"/>
		<img src="images/18.jpg"/>
		<img src="images/19.jpg"/>
		<img src="images/20.jpg"/>
		<img src="images/1.jpg"/>
		<img src="images/2.jpg"/>
		<img src="images/3.jpg"/>
		<img src="images/4.jpg"/>
		<img src="images/5.jpg"/>
		<img src="images/6.jpg"/>
		<img src="images/7.jpg"/>
		<img src="images/8.jpg"/>
		<img src="images/9.jpg"/>
		<img src="images/10.jpg"/>
		<img src="images/11.jpg"/>
		<img src="images/12.jpg"/>
		<img src="images/13.jpg"/>
		<img src="images/14.jpg"/>
		<img src="images/15.jpg"/>
		<img src="images/16.jpg"/>
		<img src="images/17.jpg"/>
		<img src="images/18.jpg"/>
		<img src="images/19.jpg"/>
		<img src="images/20.jpg"/>
		<img src="images/1.jpg"/>
		<img src="images/2.jpg"/>
		<img src="images/3.jpg"/>
		<img src="images/4.jpg"/>
		<img src="images/5.jpg"/>
		<img src="images/6.jpg"/>
		<img src="images/7.jpg"/>
		<img src="images/8.jpg"/>
		<img src="images/9.jpg"/>
		<img src="images/10.jpg"/>
		<img src="images/11.jpg"/>
		<img src="images/12.jpg"/>
		<img src="images/13.jpg"/>
		<img src="images/14.jpg"/>
		<img src="images/15.jpg"/>
		<img src="images/16.jpg"/>
		<img src="images/17.jpg"/>
		<img src="images/18.jpg"/>
		<img src="images/19.jpg"/>
		<img src="images/20.jpg"/>
	</div>
  <script src="js/jquery-1.11.1.min.js"></script>
  <script src="js/lazyload.js"></script>
  <script>
	$("img").lazyload({
  placeholder : "images/loading.gif", //用图片提前占位
    // placeholder,值为某一图片路径.此图片用来占据将要加载的图片的位置,待图片加载时,占位图则会隐藏
  effect: "fadeIn", // 载入使用何种效果
    // effect(特效),值有show(直接显示),fadeIn(淡入),slideDown(下拉)等,常用fadeIn
  threshold: -150, // 提前开始加载
    // threshold,值为数字,代表页面高度.如设置为200,表示滚动条在离目标位置还有200的高度时就开始加载图片,可以做到不让用户察觉
  //event: 'click',  // 事件触发时才加载
    // event,值有click(点击),mouseover(鼠标划过),sporty(运动的),foobar(…).可以实现鼠标莫过或点击图片才开始加载,后两个值未测试…
  //container: $("#container"),  // 对某容器中的图片实现效果
    // container,值为某容器.lazyload默认在拉动浏览器滚动条时生效,这个参数可以让你在拉动某DIV的滚动条时依次加载其中的图片
  //failurelimit : 10 // 图片排序混乱时
     // failurelimit,值为数字.lazyload默认在找到第一张不在可见区域里的图片时则不再继续加载,但当HTML容器混乱的时候可能出现可见区域内图片并没加载出来的情况,failurelimit意在加载N张可见区域外的图片,以避免出现这个问题.
});
  </script>
 </body>
</html>
```
## lazyload.js
```javascript
(function($){
    $.fn.lazyload = function(options){
        var settings = {
            threshold: 0,
            failurelimit: 0,
            event: "scroll",
            effect: "show",
            container: window
        };
        if(options){
            $.extend(settings, options);
        }
        var elements = this;
        if("scroll" == settings.event){
            $(settings.container).bind("scroll", function(event){
                var counter = 0;
                elements.each(function(){
                    if($.abovethetop(this, settings) || $.leftofbegin(this, settings)){
                    } else if(!$.belowthefold(this, settings) && !$.rightoffold(this, settings)){
                        $(this).trigger("appear");
                    } else {
                        if(counter++ > settings.failurelimit){
                            return false;
                        }
                    }
                });
                var temp = $.grep(elements, function(element){
                    return !element.loaded;
                });
                elements = $(temp);
            });
        }
        this.each(function(){
            var self = this;
            if(undefined == $(self).attr("original")){
                $(self).attr("original", $(self).attr("src"));
            }
            if("scroll" != settings.event || undefined == $(self).attr("src") || settings.placeholder == $(self).attr("src") || ($.abovethetop(self, settings) || $.leftofbegin(self, settings) || $.belowthefold(self, settings) || $.rightoffold(self, settings))){
                if(settings.placeholder){
                    $(self).attr("src", settings.placeholder);
                } else {
                    $(self).removeAttr("src");
                }
                self.loaded = false;
            } else {
                self.loaded = true;
            }
            $(self).one("appear", function(){
                if(!this.loaded){
                    $("<img />").bind("load", function(){
                        $(self).hide().attr("src", $(self).attr("original"))[settings.effect](settings.effectspeed);
                        self.loaded = true;
                    }).attr("src", $(self).attr("original"));
                }
            });
            if("scroll" != settings.event){
                $(self).bind(settings.event, function(event){
                    if(!self.loaded){
                        $(self).trigger("appear");
                    }
                });
            }
        });
        $(settings.container).trigger(settings.event);
        return this;
    };
    $.belowthefold = function(element, settings){
        if(settings.container === undefined || settings.container === window){
            var fold = $(window).height() + $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top + $(settings.container).height();
        }
        return fold <= $(element).offset().top - settings.threshold;
    };
    $.rightoffold = function(element, settings){
        if(settings.container === undefined || settings.container === window){
            var fold = $(window).width() + $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left + $(settings.container).width();
        }
        return fold <= $(element).offset().left - settings.threshold;
    };
    $.abovethetop = function(element, settings){
        if(settings.container === undefined || settings.container === window){
            var fold = $(window).scrollTop();
        } else {
            var fold = $(settings.container).offset().top;
        }
        return fold >= $(element).offset().top + settings.threshold + $(element).height();
    };
    $.leftofbegin = function(element, settings){
        if(settings.container === undefined || settings.container === window){
            var fold = $(window).scrollLeft();
        } else {
            var fold = $(settings.container).offset().left;
        }
        return fold >= $(element).offset().left + settings.threshold + $(element).width();
    };
    $.extend($.expr[':'], {
        "below-the-fold": "$.belowthefold(a, {threshold : 0, container: window})",
        "above-the-fold": "!$.belowthefold(a, {threshold : 0, container: window})",
        "right-of-fold": "$.rightoffold(a, {threshold : 0, container: window})",
        "left-of-fold": "!$.rightoffold(a, {threshold : 0, container: window})"
    });
})(jQuery);
```

## 运行效果
![Js-懒加载-01](/iblog/posts/annex/images/readme/Js-懒加载-01.png)

