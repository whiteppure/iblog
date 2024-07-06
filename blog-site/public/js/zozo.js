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
  var modal = document.createElement('div');
  modal.setAttribute('id', 'myModal');
  modal.setAttribute('class', 'modal');
  document.body.appendChild(modal);

  var modalImg = document.createElement('img');
  modalImg.setAttribute('class', 'modal-content');
  modalImg.setAttribute('id', 'img01');
  modal.appendChild(modalImg);

  var span = document.createElement('span');
  span.setAttribute('class', 'close');
  span.innerHTML = '&times;';
  modal.appendChild(span);

  var prev = document.createElement('span');
  prev.setAttribute('class', 'prev');
  prev.innerHTML = '&#10094;';
  modal.appendChild(prev);

  var next = document.createElement('span');
  next.setAttribute('class', 'next');
  next.innerHTML = '&#10095;';
  modal.appendChild(next);

  var images = document.querySelectorAll('img');
  var currentIndex = -1;

  images.forEach((img, index) => {
    img.style.cursor = 'pointer';
    img.onclick = function() {
      modal.style.display = 'flex';
      modalImg.src = this.src;
      currentIndex = index;
    }
  });

  span.onclick = function() {
    modal.style.display = 'none';
  }

  prev.onclick = function() {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
    modalImg.src = images[currentIndex].src;
  }

  next.onclick = function() {
    currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
    modalImg.src = images[currentIndex].src;
  }

  modal.onclick = function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  }

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
      modal.style.display = 'none';
    }
    if (event.key === 'ArrowLeft') {
      prev.click();
    }
    if (event.key === 'ArrowRight') {
      next.click();
    }
  });
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

