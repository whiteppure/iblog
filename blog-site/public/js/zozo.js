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

// 处理网站超链接
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前网站域名
    const currentHost = window.location.hostname;

    // 选择所有需要处理的链接
    const links = document.querySelectorAll('.content a');

    links.forEach(function(link) {
        // 跳过空链接或无效链接
        if (!link.href) return;
        try {
            // 获取链接的域名
            const linkHost = new URL(link.href, window.location.href).hostname;

            // 比较域名，设置不同的打开方式
            if (linkHost === currentHost) {
                // 站内链接 - 移除target="_blank"
                link.removeAttribute('target');
                link.classList.add('internal-link');
            } else {
                // 站外链接 - 添加target="_blank"
                link.setAttribute('target', '_blank');
                link.classList.add('external-link');
            }
        } catch (e) {
            // 如果URL解析失败，保守处理，不设置target="_blank"
            console.warn('无法解析链接:', link.href);
        }
    });
});

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

    // 创建缩放控制按钮容器
    var zoomControls = document.createElement('div');
    zoomControls.setAttribute('class', 'zoom-controls');
    modal.appendChild(zoomControls);

    // 创建放大按钮
    var zoomIn = document.createElement('button');
    zoomIn.setAttribute('class', 'zoom-btn zoom-in');
    zoomIn.innerHTML = '+';
    zoomIn.title = '放大';
    zoomControls.appendChild(zoomIn);

    // 创建缩小按钮
    var zoomOut = document.createElement('button');
    zoomOut.setAttribute('class', 'zoom-btn zoom-out');
    zoomOut.innerHTML = '-';
    zoomOut.title = '缩小';
    zoomControls.appendChild(zoomOut);

    // 创建重置按钮
    var zoomReset = document.createElement('button');
    zoomReset.setAttribute('class', 'zoom-btn zoom-reset');
    zoomReset.innerHTML = '↺';
    zoomReset.title = '重置缩放';
    zoomControls.appendChild(zoomReset);

    // 创建缩放提示
    var zoomHint = document.createElement('div');
    zoomHint.setAttribute('class', 'zoom-hint');
    modal.appendChild(zoomHint);

    // 只选择页面中的原始图片，排除模态框内的图片
    var images = Array.from(document.querySelectorAll('img')).filter(img => {
        return !img.classList.contains('modal-content') && !img.classList.contains('clickable-image');
    });

    var currentIndex = -1;
    var isAnimating = false;
    var scrollPosition = 0;

    // 缩放相关变量
    var currentScale = 1;
    var minScale = 0.5;
    var maxScale = 5;
    var scaleStep = 0.4;
    var isDragging = false;
    var startX, startY, translateX = 0, translateY = 0;
    var lastTouchDistance = null;

    // 触摸事件变量
    let touchStartX = 0;
    let touchStartY = 0;
    let touchCurrentX = 0;
    let touchCurrentY = 0;
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
        modalImg.style.transform = 'translateX(0) translateY(0) scale(1)';
        modalImg.style.opacity = '1';
        currentScale = 1;
        translateX = 0;
        translateY = 0;
        modalImg.classList.remove('zoomed');
        updateZoomControls();
    }

    // 确保图片居中
    function centerImage() {
        modalImg.style.transform = `translateX(0) translateY(0) scale(${currentScale})`;
        translateX = 0;
        translateY = 0;
    }

    // 更新缩放控制按钮状态
    function updateZoomControls() {
        zoomReset.disabled = currentScale === 1;
        zoomOut.disabled = currentScale <= minScale;
        zoomIn.disabled = currentScale >= maxScale;

        // 添加/移除激活状态
        zoomReset.classList.toggle('active', currentScale !== 1);
        zoomOut.classList.toggle('active', currentScale > minScale);
        zoomIn.classList.toggle('active', currentScale < maxScale);
    }

    // 显示缩放提示
    function showZoomHint(message, duration = 2000) {
        zoomHint.textContent = message;
        zoomHint.classList.add('show');

        setTimeout(() => {
            zoomHint.classList.remove('show');
        }, duration);
    }

    // 缩放图片
    function zoomImage(scaleFactor) {
        if (isAnimating) return;

        const newScale = Math.min(maxScale, Math.max(minScale, currentScale + scaleFactor));

        if (newScale !== currentScale) {
            currentScale = newScale;

            // 应用缩放变换
            modalImg.style.transition = 'transform 0.2s ease';
            modalImg.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${currentScale})`;

            // 更新光标样式
            if (currentScale > 1) {
                modalImg.classList.add('zoomed');
            } else {
                modalImg.classList.remove('zoomed');
            }

            updateZoomControls();

            // 如果缩放回到1，重置位置
            if (currentScale === 1) {
                setTimeout(() => {
                    centerImage();
                }, 200);
            }

            // 显示提示
            if (!isMobileDevice()) {
                showZoomHint(`缩放: ${Math.round(currentScale * 100)}%`);
            }
        }
    }

    // 重置缩放
    function resetZoom() {
        if (isAnimating || currentScale === 1) return;

        currentScale = 1;
        modalImg.style.transition = 'transform 0.3s ease';
        modalImg.style.transform = 'translateX(0) translateY(0) scale(1)';
        translateX = 0;
        translateY = 0;
        modalImg.classList.remove('zoomed');

        updateZoomControls();

        if (!isMobileDevice()) {
            showZoomHint('缩放已重置');
        }
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

    // 更新导航按钮显示状态
    function updateNavigationButtons() {
        const isSingleImage = images.length <= 1;
        const isMobile = isMobileDevice();

        if (isMobile) {
            // 移动端：隐藏翻页按钮，使用手势
            prev.style.display = 'none';
            next.style.display = 'none';

            // 更新关闭提示文字，添加滑动提示
            closeHint.textContent = '下滑关闭 · 左右滑动切换 · 双指缩放';
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
            closeHint.textContent = '双击缩放 · 滚轮缩放';
            closeHint.style.display = 'block';
        }

        // 计数器显示逻辑
        if (isSingleImage) {
            counter.style.display = 'none';
        } else {
            counter.style.display = 'block';
        }

        // 缩放控制按钮显示逻辑
        zoomControls.style.display = isMobile ? 'none' : 'flex';
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

    // 缩放按钮事件
    zoomIn.onclick = function() {
        zoomImage(scaleStep);
    };

    zoomOut.onclick = function() {
        zoomImage(-scaleStep);
    };

    zoomReset.onclick = function() {
        resetZoom();
    };

    // 优化的导航函数
    function navigate(direction) {
        if (isAnimating || images.length <= 1) return;
        isAnimating = true;

        // 重置缩放状态
        resetZoom();

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
            // 缩放快捷键
            if (event.key === '+' || event.key === '=') {
                event.preventDefault();
                zoomImage(scaleStep);
            }
            if (event.key === '-' || event.key === '_') {
                event.preventDefault();
                zoomImage(-scaleStep);
            }
            if (event.key === '0') {
                event.preventDefault();
                resetZoom();
            }
        }
    });

    // 鼠标滚轮缩放
    modal.addEventListener('wheel', function(e) {
        if (modal.classList.contains('show') && !isMobileDevice()) {
            e.preventDefault();
            if (e.deltaY < 0) {
                // 向上滚动 - 放大
                zoomImage(scaleStep);
            } else {
                // 向下滚动 - 缩小
                zoomImage(-scaleStep);
            }
        }
    }, { passive: false });

    // 双击缩放
    modalImg.addEventListener('dblclick', function(e) {
        if (!isMobileDevice()) {
            e.preventDefault();
            if (currentScale === 1) {
                zoomImage(1); // 双击放大到2倍
            } else {
                resetZoom(); // 再次双击重置
            }
        }
    });

    // 图片拖拽功能
    function startDrag(e) {
        if (currentScale <= 1) return;

        isDragging = true;
        startX = e.clientX - translateX;
        startY = e.clientY - translateY;
        modalImg.style.transition = 'none';
        modal.style.cursor = 'grabbing';
    }

    function dragImage(e) {
        if (!isDragging || currentScale <= 1) return;

        e.preventDefault();
        translateX = e.clientX - startX;
        translateY = e.clientY - startY;

        // 限制拖拽范围
        const maxTranslate = 100 * currentScale;
        translateX = Math.min(maxTranslate, Math.max(-maxTranslate, translateX));
        translateY = Math.min(maxTranslate, Math.max(-maxTranslate, translateY));

        modalImg.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${currentScale})`;
    }

    function stopDrag() {
        isDragging = false;
        modal.style.cursor = currentScale > 1 ? 'grab' : 'default';
    }

    // 鼠标拖拽事件
    modalImg.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', dragImage);
    document.addEventListener('mouseup', stopDrag);

    // 计算两点距离函数（用于双指缩放）
    function getDistance(touch1, touch2) {
        const dx = touch1.clientX - touch2.clientX;
        const dy = touch1.clientY - touch2.clientY;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 触摸事件处理
    modal.addEventListener('touchstart', function(e) {
        if (isAnimating) return;

        // 检测双指手势
        if (e.touches.length === 2) {
            e.preventDefault();
            // 双指缩放开始
            lastTouchDistance = getDistance(e.touches[0], e.touches[1]);
            modalImg.style.transition = 'none';
            return;
        }

        // 单指触摸
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchCurrentX = touchStartX;
        touchCurrentY = touchStartY;
        isSwiping = false;
        swipeDirection = null;

        // 重置图片位置和过渡
        modalImg.style.transition = 'none';
    }, { passive: false });

    modal.addEventListener('touchmove', function(e) {
        if (isAnimating) return;

        // 双指缩放处理
        if (e.touches.length === 2 && lastTouchDistance !== null) {
            e.preventDefault();
            const currentDistance = getDistance(e.touches[0], e.touches[1]);
            const scaleChange = currentDistance / lastTouchDistance;

            currentScale = Math.min(maxScale, Math.max(minScale, currentScale * scaleChange));

            modalImg.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${currentScale})`;

            lastTouchDistance = currentDistance;
            updateZoomControls();
            return;
        }

        // 单指移动处理
        touchCurrentX = e.touches[0].clientX;
        touchCurrentY = e.touches[0].clientY;

        const diffX = touchCurrentX - touchStartX;
        const diffY = touchCurrentY - touchStartY;

        if (!swipeDirection && (Math.abs(diffX) > minSwipeDistance || Math.abs(diffY) > minSwipeDistance)) {
            swipeDirection = Math.abs(diffX) > Math.abs(diffY) ? 'horizontal' : 'vertical';
        }

        // 如果图片已缩放，允许单指拖拽
        if (currentScale > 1 && swipeDirection === 'horizontal' && Math.abs(diffX) > minSwipeDistance) {
            e.preventDefault();
            translateX += diffX;
            translateY += diffY;

            // 限制拖拽范围
            const maxTranslate = 100 * currentScale;
            translateX = Math.min(maxTranslate, Math.max(-maxTranslate, translateX));
            translateY = Math.min(maxTranslate, Math.max(-maxTranslate, translateY));

            modalImg.style.transform = `translateX(${translateX}px) translateY(${translateY}px) scale(${currentScale})`;

            // 更新起始位置
            touchStartX = touchCurrentX;
            touchStartY = touchCurrentY;
            return;
        }

        if (swipeDirection === 'vertical' && Math.abs(diffY) > minSwipeDistance && currentScale === 1) {
            isSwiping = true;
            const scale = Math.max(0.8, 1 - Math.abs(diffY) / 400);
            const opacity = Math.max(0.6, 1 - Math.abs(diffY) / 200);

            modalImg.style.transform = `translateY(${diffY}px) scale(${scale})`;
            modalImg.style.opacity = opacity;
        }
        else if (swipeDirection === 'horizontal' && Math.abs(diffX) > minSwipeDistance && currentScale === 1) {
            isSwiping = true;
            modalImg.style.transform = `translateX(${diffX}px) scale(0.98)`;
            modalImg.style.opacity = Math.max(0.8, 1 - Math.abs(diffX) / 500);
        }
    }, { passive: false });

    modal.addEventListener('touchend', function(e) {
        if (isAnimating) return;

        // 双指缩放结束
        if (e.touches.length < 2) {
            lastTouchDistance = null;
        }

        const diffX = touchCurrentX - touchStartX;
        const diffY = touchCurrentY - touchStartY;

        // 恢复过渡效果
        modalImg.style.transition = 'all 0.3s ease';

        // 下滑关闭
        if (swipeDirection === 'vertical' && Math.abs(diffY) > swipeThreshold && diffY > 0 && isSwiping && currentScale === 1) {
            closeModal();
            return;
        }
        // 左滑下一张
        else if (swipeDirection === 'horizontal' && Math.abs(diffX) > horizontalSwipeThreshold && diffX < 0 && isSwiping && images.length > 1 && currentScale === 1) {
            navigate(1);
        }
        // 右滑上一张
        else if (swipeDirection === 'horizontal' && Math.abs(diffX) > horizontalSwipeThreshold && diffX > 0 && isSwiping && images.length > 1 && currentScale === 1) {
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
        updateZoomControls();
    });

    // 窗口大小改变时更新导航按钮状态
    window.addEventListener('resize', function() {
        if (modal.classList.contains('show')) {
            updateNavigationButtons();
        }
    });

    // 初始化：确保按钮在PC端默认显示
    updateZoomControls();
    updateNavigationButtons();
});

// 卜算子计数处理
document.addEventListener("DOMContentLoaded", function () {
    const uvE = document.getElementById('busuanzi_site_pv');
    const pvE = document.getElementById('busuanzi_site_uv');
    const uvObs = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                uvObs.disconnect();
                mutation.target.innerHTML = parseInt(mutation.target.innerHTML) + 57030;
                break;
            }
        }
    });
    const pvObs = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList') {
                pvObs.disconnect();
                mutation.target.innerHTML = parseInt(mutation.target.innerHTML) + 203040;
                break;
            }
        }
    });
    const config = {
        childList: true
    };
    uvObs.observe(uvE, config);
    pvObs.observe(pvE, config);
});