# iblog
个人博客

[//]: # (刷新cdn)
curl -s "https://purge.jsdelivr.net/gh/whiteppure/iblog@main/docs/css/toc.css"
curl -s "https://purge.jsdelivr.net/gh/whiteppure/iblog@main/docs/css/img.css"
curl -s "https://purge.jsdelivr.net/gh/whiteppure/iblog@main/docs/js/zozo.js"
curl -s "https://purge.jsdelivr.net/gh/whiteppure/iblog@main/docs/css/zozo.css"

https://purge.jsdelivr.net/gh/whiteppure/iblog/main/docs/js/zozo.js

## Hugo 常用命令 win
1. 手动删除缓存文件
    ```bash
    Remove-Item -Recurse -Force .\public, .\resources, .hugo_build.lock
    ```
2. 构建
    ```bash
    # 基本构建
    hugo -d ./../docs
    # 优化构建
    hugo --gc --minify -d ./../docs
    ```
4. 启动服务
    ```bash
    # 启动开发服务器
    hugo server -D
    
    # 开发服务器（绑定到所有IP）
    hugo server -D --bind 0.0.0.0 --baseURL http://localhost:1313
    
    # 开发服务器（禁用实时重载）
    hugo server --disableLiveReload
    ```
5. 内容列表
    ```bash
    # 列出所有内容
    hugo list all
    
    # 列出草稿
    hugo list drafts
    
    # 列出过期内容
    hugo list expired
    
    # 列出未来内容
    hugo list future
    ```