'use strict';

// back-to-top
$(document).ready((function (_this) {
  return function () {
    let bt = $('#back_to_top')
    if ($(document).width() > 480) {
      $(window).scroll(function () {
        return outDisplay(bt,$(window).scrollTop() >= 100)
      })
      return bt.click(function () {
        $('body,html').animate({
          scrollTop: 0,
        }, 800)
        return false
      })
    }
  }
})(this))


// top_to_back
$(document).ready((function (_this) {
  return function () {
    let tb = $('#top_to_back')
    const docHeight = $(document).height()
    if ($(document).width() > 480) {
      $(window).scroll(function () {
        return outDisplay(tb,$(window).scrollTop() <= docHeight -1000)
      })

      return tb.click(function () {
        $('body,html').animate({
          scrollTop: docHeight,
        }, 800)
        return false
      })
    }
  }
})(this))


// 隐藏内容
$(document).ready((function (_this) {
  return function () {
    let ch = $('#content_hidden')
    let cd = $('#content_display')

    if ($(document).width() > 480) {
      ch.css('display', 'block')
      return ch.click(function () {
        hiddenNotContent()
        ch.css('display', 'none')
        cd.css('display', 'block')
        return false
      })
    }
  }
})(this))


// 显示内容
$(document).ready((function (_this) {
  return function () {
    let ch = $('#content_hidden')
    let cd = $('#content_display')

    if ($(document).width() > 480) {
      ch.css('display', 'block')
      return cd.click(function () {
        $('body,html').animate({
          scrollTop: 0,
        }, 800)

        displayNotContent()
        ch.css('display', 'block')
        cd.css('display', 'none')
        return false
      })
    }

  }
})(this))


// 超出显示
function outDisplay(selector,displayCondition){
  if (displayCondition) {
    return selector.css('display', 'block')
  } else {
    return selector.css('display', 'none')
  }
}

// nav-toggle
$(document).ready((function (_this) {
  return function () {
    let nav,icon
    icon = $('#menu_icon')
    nav = $('#site_nav')
    icon.click(function () {
      nav.slideToggle(250)
    })
  }
})(this))

// FancyBox
$('[data-fancybox="gallery"]').fancybox({
  arrows: false,
  infobar: false,
  buttons: [],
  clickContent: "close",
  autoFocus: false,
  backFocus: false,
  wheel: false,
  mobile: {
    clickContent: "close",
    clickSlide: "close",
    dblclickContent: false,
    dblclickSlide: false
  },
});

// 判断如果是非电脑端则隐藏按钮
$(document).ready((function (_this) {
  // 判断是否为电脑端
  if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // 如果是电脑端，则显示按钮
    $('#icon_more').show();
    $('#darkmode-toggle').show();
  } else {
    // 如果不是电脑端，则隐藏按钮
    $('#icon_more').hide();
    $('#darkmode-toggle').hide();
  }
}))

// 点击更多图标
$(document).ready((function (_this) {
  return function () {
    if ($(document).width() > 480) {
      $('#icon_more').click(function () {
        $(this).addClass('display_none')
        $('#sys_function').removeClass('display_none')
        $('#icon_less').removeClass('display_none')
      })
    }
  }
})(this))

// 点击更少图标
$(document).ready((function (_this) {
  return function () {
    $('#icon_less').click(function () {
      $(this).addClass('display_none')
      $('#sys_function').addClass('display_none')
      $('#icon_more').removeClass('display_none')
    })
  }
})(this))


// 监听点击图像
document.addEventListener('DOMContentLoaded', (event) => {
    // 创建模态框
    var modal = document.createElement('div');
    modal.setAttribute('id', 'imgModal');
    modal.setAttribute('class', 'modal');
    document.body.appendChild(modal);

    // 创建图片容器
    var modalContentContainer = document.createElement('div');
    modalContentContainer.setAttribute('class', 'modal-content-container');
    modal.appendChild(modalContentContainer);

    // 创建图片元素
    var modalImg = document.createElement('img');
    modalImg.setAttribute('class', 'modal-content active');
    modalImg.setAttribute('id', 'img01');
    modalContentContainer.appendChild(modalImg);

    // 创建关闭按钮
    var span = document.createElement('span');
    span.setAttribute('class', 'close');
    span.innerHTML = '&times;';
    modal.appendChild(span);

    // 创建上一张按钮
    var prev = document.createElement('span');
    prev.setAttribute('class', 'prev');
    prev.innerHTML = '&#10094;';
    modal.appendChild(prev);

    // 创建下一张按钮
    var next = document.createElement('span');
    next.setAttribute('class', 'next');
    next.innerHTML = '&#10095;';
    modal.appendChild(next);

    // 添加图片计数器
    var counter = document.createElement('div');
    counter.setAttribute('class', 'image-counter');
    modal.appendChild(counter);

    // 只选择页面中的原始图片，排除模态框内的图片
    var images = Array.from(document.querySelectorAll('img')).filter(img => {
        return !img.classList.contains('modal-content') && !img.classList.contains('clickable-image');
    });

    var currentIndex = -1;

    // 触摸事件变量
    let startX = 0;
    let endX = 0;
    const swipeThreshold = 50; // 滑动阈值

    // 添加点击事件
    images.forEach((img, index) => {
        img.classList.add('clickable-image');
        img.onclick = function() {
            modal.classList.add('show');
            modalImg.src = this.src;
            currentIndex = index;
            updateCounter();
        }
    });

    // 关闭模态框
    span.onclick = function() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }

    // 上一张图片
    prev.onclick = function() {
        navigate(-1);
    }

    // 下一张图片
    next.onclick = function() {
        navigate(1);
    }

    // 导航函数 - 移除了动画延迟
    function navigate(direction) {
        // 更新索引和图片
        currentIndex = (currentIndex + direction + images.length) % images.length;
        modalImg.src = images[currentIndex].src;
        updateCounter();
    }

    // 更新计数器 - 修复计数逻辑
    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${images.length}`;

        // 根据图片数量显示/隐藏导航按钮和计数器
        if (images.length <= 1) {
            prev.style.display = 'none';
            next.style.display = 'none';
            counter.style.display = 'none';
        } else {
            prev.style.display = 'block';
            next.style.display = 'block';
            counter.style.display = 'block';
        }
    }

    // 点击模态框背景关闭
    modal.onclick = function(event) {
        if (event.target === modal) {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';
            }, 300);
        }
    }

    // 键盘导航
    document.addEventListener('keydown', function(event) {
        if (modal.classList.contains('show')) {
            if (event.key === 'Escape') {
                modal.classList.remove('show');
                setTimeout(() => {
                    modal.style.display = 'none';
                }, 300);
            }
            if (event.key === 'ArrowLeft') {
                navigate(-1);
            }
            if (event.key === 'ArrowRight') {
                navigate(1);
            }
        }
    });

    // 触摸事件处理 - 移动端滑动支持
    modal.addEventListener('touchstart', function(e) {
        startX = e.touches[0].clientX;
    }, false);

    modal.addEventListener('touchmove', function(e) {
        endX = e.touches[0].clientX;
    }, false);

    modal.addEventListener('touchend', function() {
        const diffX = startX - endX;

        // 如果滑动距离超过阈值，则切换图片
        if (Math.abs(diffX) > swipeThreshold) {
            if (diffX > 0) {
                // 向左滑动，下一张
                navigate(1);
            } else {
                // 向右滑动，上一张
                navigate(-1);
            }
        }
    }, false);
});


function hiddenNotContent(){
  const notContentObjs = getNotContent();
  for (const element of notContentObjs) {
    if (!isEmpty(element)) {
      element.classList.add('display_none')
    }
  }
}

function removeNotContent(){
  const notContentObjs = getNotContent();
  for (const element of notContentObjs) {
    if (!isEmpty(element)) {
      element.remove()
    }
  }
}

function displayNotContent(){
  const notContentObjs = getNotContent();
  for (const element of notContentObjs) {
    if (!isEmpty(element)) {
      element.classList.remove('display_none')
      // 隐藏搜索内容
      $('#fastSearch').hidden
    }
  }
}


function getNotContent(){
  return [
    // 评论展示内容
    document.getElementById('doc_comments'),
    // 顶部标签导航
    document.getElementById('site_nav'),
    // 顶部内容
    document.getElementById('post_single_title'),
    document.getElementById('post_header'),
    // 底部信息
    document.getElementById('busuanzi_container_page_pv'),
    document.getElementById('post_footer_info'),
    document.getElementById('footer_powered_by'),
    document.getElementById('footer_slogan'),
    // 标题日期
    document.getElementById('post_page_title_date'),
    // 目录
    document.getElementById('post_content_toc'),
    // 数学公式
    document.getElementById('MathJax_Message'),
    // 夜间模式切换
    document.getElementById('darkmode-background'),
    document.getElementById('darkmode-layer'),
    document.getElementById('darkmode-toggle'),
    // 侧边栏
    document.getElementById('back_to_top'),
    document.getElementById('top_to_back'),
    // 搜索框
    document.getElementById('search-btn'),
    document.getElementById('fastSearch')
  ]
}

