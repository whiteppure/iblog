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

// 预览图像
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
    modalImg.setAttribute('class', 'modal-content');
    modalImg.setAttribute('id', 'img01');
    modalContentContainer.appendChild(modalImg);

    // 创建关闭按钮
    var span = document.createElement('span');
    span.setAttribute('class', 'img-close');
    span.innerHTML = '&times;';
    modal.appendChild(span);

    // 创建上一张按钮
    var prev = document.createElement('span');
    prev.setAttribute('class', 'img-prev');
    prev.innerHTML = '&#10094;';
    modal.appendChild(prev);

    // 创建下一张按钮
    var next = document.createElement('span');
    next.setAttribute('class', 'img-next');
    next.innerHTML = '&#10095;';
    modal.appendChild(next);

    // 添加图片计数器
    var counter = document.createElement('div');
    counter.setAttribute('class', 'image-counter');
    modal.appendChild(counter);

    // 添加关闭提示（移动端）
    var closeHint = document.createElement('div');
    closeHint.setAttribute('class', 'close-hint');
    closeHint.textContent = '';
    modal.appendChild(closeHint);

    // 只选择页面中的原始图片，排除模态框内的图片
    var images = Array.from(document.querySelectorAll('img')).filter(img => {
        return !img.classList.contains('modal-content') && !img.classList.contains('clickable-image');
    });

    var currentIndex = -1;
    var isAnimating = false;
    var scrollPosition = 0;

    // 触摸事件变量
    let startX = 0;
    let startY = 0;
    let currentX = 0;
    let currentY = 0;
    let isSwiping = false;
    let swipeDirection = null;
    const swipeThreshold = 50;
    const horizontalSwipeThreshold = 30;
    const minSwipeDistance = 10;

    // 设备检测函数
    function isMobileDevice() {
        return window.innerWidth <= 750 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // 防止背景滚动函数
    function preventBackgroundScroll(e) {
        if (modal.classList.contains('show')) {
            e.preventDefault();
        }
    }

    // 重置图片样式
    function resetImageStyles() {
        modalImg.style.transition = 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        modalImg.style.transform = 'translateX(0) scale(1)';
        modalImg.style.opacity = '1';
    }

    // 确保图片居中
    function centerImage() {
        modalImg.style.transform = 'translateX(0) scale(1)';
    }

    // 防止背景滚动但不丢失位置
    function disableBodyScroll() {
        scrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        document.body.style.overflow = 'hidden';
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollPosition}px`;
        document.body.style.width = '100%';
        document.body.style.height = '100%';
    }

    // 恢复背景滚动
    function enableBodyScroll() {
        document.body.style.overflow = '';
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.height = '';
        window.scrollTo(0, scrollPosition);
    }

    // 更新导航按钮显示状态 - 修复版本
    function updateNavigationButtons() {
        const isSingleImage = images.length <= 1;
        const isMobile = isMobileDevice();

        console.log('更新导航按钮:', { isMobile, isSingleImage, imagesCount: images.length });

        if (isMobile) {
            // 移动端：隐藏翻页按钮，使用手势
            prev.style.display = 'none';
            next.style.display = 'none';

            // 更新关闭提示文字，添加滑动提示
            closeHint.textContent = '下滑关闭 · 左右滑动切换';
            closeHint.style.display = 'block';
        } else {
            // PC端：显示翻页按钮（除非只有一张图片）
            if (isSingleImage) {
                prev.style.display = 'none';
                next.style.display = 'none';
            } else {
                prev.style.display = 'flex';
                next.style.display = 'flex';
            }
            closeHint.textContent = '';
            closeHint.style.display = 'block';
        }

        // 计数器显示逻辑
        if (isSingleImage) {
            counter.style.display = 'none';
        } else {
            counter.style.display = 'block';
        }
    }

    // 添加点击事件
    images.forEach((img, index) => {
        if (!img.classList.contains('clickable-image')) {
            img.classList.add('clickable-image');
        }
        img.onclick = function() {
            openModal(index);
        }
    });

    // 打开模态框
    function openModal(index) {
        resetImageStyles();
        centerImage();
        modal.style.display = 'flex';

        setTimeout(() => {
            modal.classList.add('show');
            modalImg.src = images[index].src;
            currentIndex = index;
            updateCounter();

            // 重要：在打开模态框时更新按钮状态
            updateNavigationButtons();

            // 添加初始显示动画
            modalImg.style.opacity = '0';
            modalImg.style.transform = 'scale(0.9)';

            setTimeout(() => {
                modalImg.style.opacity = '1';
                modalImg.style.transform = 'scale(1)';
            }, 50);

            // 防止背景滚动
            disableBodyScroll();
            document.addEventListener('touchmove', preventBackgroundScroll, { passive: false });

            // 3秒后隐藏关闭提示
            setTimeout(() => {
                closeHint.classList.add('hidden');
            }, 3000);
        }, 10);
    }

    // 关闭模态框
    function closeModal() {
        if (isAnimating) return;
        isAnimating = true;

        modalImg.style.transform = 'translateY(80px) scale(0.9)';
        modalImg.style.opacity = '0';
        modal.style.opacity = '0';

        setTimeout(() => {
            modal.classList.remove('show');
            setTimeout(() => {
                modal.style.display = 'none';

                // 恢复背景滚动
                enableBodyScroll();
                document.removeEventListener('touchmove', preventBackgroundScroll);

                closeHint.classList.remove('hidden');
                resetImageStyles();
                centerImage();
                isAnimating = false;
                modal.style.opacity = '1';
            }, 50);
        }, 300);
    }

    // 关闭模态框
    span.onclick = function() {
        closeModal();
    }

    // 上一张图片
    prev.onclick = function() {
        navigate(-1);
    }

    // 下一张图片
    next.onclick = function() {
        navigate(1);
    }

    // 优化的导航函数
    function navigate(direction) {
        if (isAnimating || images.length <= 1) return;
        isAnimating = true;

        // 设置离开动画方向
        const exitTranslateX = direction === 1 ? -100 : 100;
        modalImg.style.transition = 'all 0.3s ease';
        modalImg.style.transform = `translateX(${exitTranslateX}px) scale(0.95)`;
        modalImg.style.opacity = '0';

        setTimeout(() => {
            // 更新索引和图片
            currentIndex = (currentIndex + direction + images.length) % images.length;
            modalImg.src = images[currentIndex].src;
            updateCounter();

            // 设置进入动画 - 从相反方向进入
            const enterTranslateX = direction === 1 ? 100 : -100;
            modalImg.style.transform = `translateX(${enterTranslateX}px) scale(0.95)`;
            modalImg.style.opacity = '0';

            // 强制重绘
            modalImg.offsetHeight;

            // 执行进入动画
            setTimeout(() => {
                modalImg.style.transition = 'all 0.3s ease';
                modalImg.style.transform = 'translateX(0) scale(1)';
                modalImg.style.opacity = '1';

                setTimeout(() => {
                    isAnimating = false;
                }, 300);
            }, 50);
        }, 300);
    }

    // 更新计数器
    function updateCounter() {
        counter.textContent = `${currentIndex + 1} / ${images.length}`;
    }

    // 点击模态框背景关闭
    modal.onclick = function(event) {
        if (event.target === modal) {
            closeModal();
        }
    }

    // 键盘导航
    document.addEventListener('keydown', function(event) {
        if (modal.classList.contains('show')) {
            if (event.key === 'Escape') {
                closeModal();
            }
            if (event.key === 'ArrowLeft') {
                navigate(-1);
            }
            if (event.key === 'ArrowRight') {
                navigate(1);
            }
        }
    });

    // 触摸事件处理
    modal.addEventListener('touchstart', function(e) {
        if (isAnimating) return;

        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        currentX = startX;
        currentY = startY;
        isSwiping = false;
        swipeDirection = null;

        // 重置图片位置和过渡
        modalImg.style.transition = 'none';
    }, { passive: true });

    modal.addEventListener('touchmove', function(e) {
        if (isAnimating) return;

        currentX = e.touches[0].clientX;
        currentY = e.touches[0].clientY;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        if (!swipeDirection && (Math.abs(diffX) > minSwipeDistance || Math.abs(diffY) > minSwipeDistance)) {
            swipeDirection = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
        }

        if (swipeDirection === 'vertical' && Math.abs(diffY) > minSwipeDistance) {
            isSwiping = true;
            const scale = Math.max(0.8, 1 - Math.abs(diffY) / 400);
            const opacity = Math.max(0.6, 1 - Math.abs(diffY) / 200);

            modalImg.style.transform = `translateY(${diffY}px) scale(${scale})`;
            modalImg.style.opacity = opacity;
        }
        else if (swipeDirection === 'horizontal' && Math.abs(diffX) > minSwipeDistance) {
            isSwiping = true;
            modalImg.style.transform = `translateX(${diffX}px) scale(0.98)`;
            modalImg.style.opacity = Math.max(0.8, 1 - Math.abs(diffX) / 500);
        }
    }, { passive: true });

    modal.addEventListener('touchend', function() {
        if (isAnimating) return;

        const diffX = currentX - startX;
        const diffY = currentY - startY;

        // 恢复过渡效果
        modalImg.style.transition = 'all 0.3s ease';

        // 下滑关闭
        if (swipeDirection === 'vertical' && Math.abs(diffY) > swipeThreshold && diffY > 0 && isSwiping) {
            closeModal();
            return;
        }
        // 左滑下一张
        else if (swipeDirection === 'horizontal' && Math.abs(diffX) > horizontalSwipeThreshold && diffX < 0 && isSwiping && images.length > 1) {
            navigate(1);
        }
        // 右滑上一张
        else if (swipeDirection === 'horizontal' && Math.abs(diffX) > horizontalSwipeThreshold && diffX > 0 && isSwiping && images.length > 1) {
            navigate(-1);
        }
        // 恢复原位置
        else {
            resetImageStyles();
            centerImage();
        }

        isSwiping = false;
        swipeDirection = null;
    }, { passive: true });

    // 图片加载完成后确保居中
    modalImg.addEventListener('load', function() {
        centerImage();
    });

    // 窗口大小改变时更新导航按钮状态
    window.addEventListener('resize', function() {
        if (modal.classList.contains('show')) {
            updateNavigationButtons();
        }
    });

    // 初始化：确保按钮在PC端默认显示
    updateNavigationButtons();
});
