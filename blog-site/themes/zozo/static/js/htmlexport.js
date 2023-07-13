
<!-- 导出功能 -->
(function (){
    if (!isMobileReq()) {
        let titleObj = document.getElementById('post_single_title')
        const title = isEmpty(titleObj) ? 'white‘blog' : titleObj.innerHTML

        // html导出pdf
        document.getElementById('export_pdf').onclick = () => {
            removeNotContent()
            window.print();
            window.location.reload()
        }

        // html导出图片
        document.getElementById('export_pic').onclick = () => {
            hiddenNotContent()
            const content = document.getElementById('main_content')
            html2canvas(content).then(function (canvas) {
                downloadBase64(title+'.png',canvas.toDataURL("image/png"))
            });
            displayNotContent()
        }

        // html导出markdown
        document.getElementById('export_markdown').onclick = () => {
            removeNotContent()
            const content = document.getElementById('main_content')
            const contentMd = html2md(content.innerHTML)
            downloadFile(title+'.md','text/markdown',contentMd)
            window.location.reload()
        }
    }
})()
