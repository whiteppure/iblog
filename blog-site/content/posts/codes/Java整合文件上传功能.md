---
title: "Java整合文件上传功能"
date: 2023-08-11
draft: false
tags: ["应用","设计","Java","小程序"]
slug: "uploadfile-code"
---

## 结构
![整合文件上传功能](/iblog/posts/annex/images/essays/整合文件上传功能-01.jpg)

## pom.xml
fastdfs-client-java-1.27.jar：[点击下载](/iblog/posts/annex/jar/lib/fastdfs-client-java-1.27.jar)

```xml
    <dependencies>

        <!-- fastdfs -->
        <dependency>
            <groupId>org.csource</groupId>
            <artifactId>fastdfs-client-java</artifactId>
            <version>1.27</version>
            <systemPath>${project.basedir}/lib/fastdfs-client-java-1.27.jar</systemPath>
            <scope>system</scope>
        </dependency>

        <!--aliyun oss 依赖-->
        <dependency>
            <groupId>com.aliyun.oss</groupId>
            <artifactId>aliyun-sdk-oss</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>

        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>

        <dependency>
            <groupId>cn.hutool</groupId>
            <artifactId>hutool-all</artifactId>
            <version>5.8.11</version>
        </dependency>

        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.11.0</version>
        </dependency>

    </dependencies>
```

## application.yml
```yml
server:
  port: 80
```

## 公共部分

### FileManagement
```java
public interface FileManagement {


    /**
     * 设置下一个bean的对象
     *
     * @param nextFileManagement 下一个bean对象
     */
    void setNext(FileManagement nextFileManagement);

}
```

### FileBeanManagement
```java
@Component
public class FileBeanManagement {


    @Bean(name = "uploadChain")
    public AbstractUploadManagement uploadChain() {
        return buildChain(AbstractUploadManagement.class, true);
    }


    @Bean(name = "downloadChain")
    public AbstractDownloadManagement downloadChain() {
        return buildChain(AbstractDownloadManagement.class, true);
    }


    /**
     * 设置文件管理bean调用链(环状链)
     *
     * @param type   文件管理类型
     * @param isRing 是否形成环形链表
     * @param <T>    extends FileManagement 指定类型
     * @return bean
     */
    private <T extends FileManagement> T buildChain(Class<T> type, boolean isRing) {
        List<T> beans = new ArrayList<>(SpringUtil.getBeansOfType(type).values());

        // 设置调用链
        for (int index = 0; index < beans.size(); index++) {
            // 判断是否到最后一个bean 如果到了最后一个bean将第一个bean设置为尾部的下一个节点 形成环状结构
            beans.get(index).setNext(index + 1 >= beans.size() && isRing ? beans.get(0) : beans.get(index + 1));
        }
        return beans.get(0);
    }


}
```

### AbstractUploadManagement
```java
@Slf4j
public abstract class AbstractUploadManagement implements FileManagement {

    protected AbstractUploadManagement self;

    @Override
    public void setNext(FileManagement fileManagement) {
        this.self = (AbstractUploadManagement)fileManagement;
    }

    protected List<String> allowUploadFiles(ArchetypeFileConfig fileConfig) {
        List<String> allowFiles = fileConfig.getAllowFiles();
        return allowFiles.isEmpty() ? Arrays.asList(FileConstant.DEFAULT_ALLOWED_EXTENSION) : allowFiles;
    }

    /**
     * 判断是否是当前平台处理
     *
     * @param platformType 指定平台类型 {@linkplain ArchetypeFilePlatformType}
     * @return true 为当前平台处理
     */
    protected abstract boolean isCurrentPlatform(ArchetypeFilePlatformType platformType);

    /**
     * 校验允许上传的文件格式; 默认{@code  FileTypeUtils.DEFAULT_ALLOWED_EXTENSION}
     *
     * @param fileName 文件名称
     * @return true 允许上传
     */
    private boolean checkAllowUploadFiles(String fileName,ArchetypeFileConfig fileConfig) {
        if (fileName == null) {
            return false;
        }
        List<String> allowUploadFiles = allowUploadFiles(fileConfig);
        for (String allowUploadFile : allowUploadFiles) {
            if (fileName.toLowerCase().endsWith(allowUploadFile)) {
                return true;
            }
        }
        log.info("当前上传文件仅支持 [{}] 格式", Arrays.toString(allowUploadFiles.toArray()));
        return false;
    }

    /**
     * 校验允许上传的文件大小
     *
     * @param bytes 字节数量
     * @return true 允许上传
     */
    protected  boolean checkSingleAllowUploadSize(byte[] bytes,ArchetypeFileConfig fileConfig){
        return bytes.length <= fileConfig.getAllowFileSize();
    }

    /**
     * 前置处理 预留方法
     *
     * @param multipartFile 上传文件对象
     * @return true 允许上传
     */
    protected abstract boolean preProcessing(MultipartFile multipartFile,ArchetypeFileConfig fileConfig);

    /**
     * 上传文件
     *
     * @param multipartFile 上传文件对象
     * @return 上传成功后的路径
     */
    protected abstract String upload(MultipartFile multipartFile,ArchetypeFileConfig fileConfig);

    /**
     * 后置处理 预留方法
     *
     * @param fileUri 上传成功后的路径
     * @return 文件上传路径
     */
    protected abstract String postProcessing(String fileUri);


    /**
     * 多上传文件模板方法
     *
     * @param fileConfig    文件上传配置
     * @param multipartFile 上传文件对象
     * @return 上传成功后的文件uri集合
     */
    @SneakyThrows
    public final List<String> uploadTemplate(MultipartFile[] multipartFile, ArchetypeFileConfig fileConfig) {
        if (multipartFile == null || multipartFile.length == 0) {
            return Collections.emptyList();
        }
        ArchetypeFilePlatformType filePlatformType = fileConfig.getFilePlatformType();

        // 检索上传文件平台类型
        if (!self.isCurrentPlatform(filePlatformType)) {
            return self.uploadTemplate(multipartFile,fileConfig);
        }

        // 多文件上传需要加循环
        List<String> fileUriList = new ArrayList<>(multipartFile.length);
        for (MultipartFile file : multipartFile) {
            if (!self.beforeCheck(file,fileConfig)) {
                break;
            }
            fileUriList.add(self.postProcessing(self.upload(file,fileConfig)));
        }
        log.info("上传文件=> 平台类型:[{}]\t 上传路径:[{}]", filePlatformType, Arrays.toString(fileUriList.toArray()));
        return fileUriList;
    }


    /**
     * 上传文件前置校验
     *
     * @param multipartFile 上传的文件
     * @return true校验成功允许上传
     */
    @SneakyThrows
    private boolean beforeCheck(MultipartFile multipartFile,ArchetypeFileConfig fileConfig) {
        return !multipartFile.isEmpty()
                && (multipartFile.getSize() != 0)
                && self.checkAllowUploadFiles(multipartFile.getOriginalFilename(),fileConfig)
                && self.checkSingleAllowUploadSize(multipartFile.getBytes(),fileConfig)
                && self.preProcessing(multipartFile,fileConfig)
                ;
    }

}
```

### AbstractDownloadManagement
```java
@Slf4j
public abstract class AbstractDownloadManagement implements FileManagement {

    private AbstractDownloadManagement self;

    @Override
    public void setNext(FileManagement fileManagement) {
        this.self = (AbstractDownloadManagement)fileManagement;
    }

    /**
     * 前置处理
     *
     * @param uri          下载文件的地址
     * @return true-允许执行后置操作
     */
    protected abstract boolean preProcessing(String uri);

    /**
     * 下载文件
     *
     * @param uri          下载文件地址
     * @return 下载到的文件
     */
    protected abstract File download(String uri);

    /**
     * 后置处理
     *
     * @param downloadFile 下载的文件
     * @return 经过后置处理下载后的文件
     */
    protected abstract File postProcessing(File downloadFile);

    /**
     * 判断是否是当前平台处理
     *
     * @param platformType 指定平台类型 {@linkplain ArchetypeFilePlatformType}
     * @return true 为当前平台处理
     */
    protected abstract boolean isCurrentPlatform(ArchetypeFilePlatformType platformType);


    /**
     * 文件下载模板方法
     *
     * @param platformType 平台类型
     * @param uri          文件地址,支持本地和http地址
     * @return file对象
     */
    public final File downloadTemplate(ArchetypeFilePlatformType platformType, String uri) {
        // 检索上传文件平台类型
        if (!self.isCurrentPlatform(platformType)) {
            return self.downloadTemplate(platformType, uri);
        }

        // 前置下载校验
        if (!self.preProcessing(uri)) {
            return new File(CharSequenceUtil.EMPTY);
        }
        // 下载文件到指定路径
        return self.postProcessing(self.download(uri));
    }


    @SneakyThrows
    protected File download(ArchetypeFilePlatformType platformType, String uri, String downloadPath, InputStream inputStream, long fileLength) {
        log.info("下载文件平台类型: {} 文件大小为:{} MB", platformType, new DecimalFormat("0.00").format(fileLength / (float) (1024 * 1024)));
        // 获取文件名称
        String[] split = uri.split(platformType.getFileSeparator());
        String fullFileName = split[split.length - 1];
        String[] fileNameWithSuffix = fullFileName.split("\\.");

        // 指定存放位置(有需求可以自定义)
        String path = String.format("%s%s%s_%s.%s", downloadPath, File.separatorChar, fileNameWithSuffix[0], DateUtil.format(new Date(), "yyyyMMddHHmmss"), fileNameWithSuffix[1]);
        File file = new File(path);
        // 校验文件夹目录是否存在，不存在就创建一个目录
        if (!file.getParentFile().exists()) {
            file.getParentFile().mkdirs();
        }

        // 写入文件
        @Cleanup OutputStream out = Files.newOutputStream(file.toPath());
        @Cleanup BufferedInputStream bin = new BufferedInputStream(inputStream);
        int size = 0;
        int len = 0;
        byte[] buf = new byte[2048];
        while ((size = bin.read(buf)) != -1) {
            len += size;
            out.write(buf, 0, size);
            if (log.isDebugEnabled()) {
                log.debug("下载文件 {} 进度 =>{}%", fullFileName, len * 100L / fileLength);
            }
        }
        log.info("{} 文件下载成功！", path);
        return file;
    }




    @SneakyThrows
    protected File defaultHttpDownload(ArchetypeFilePlatformType platformType, String uri, String downloadPath) {
        // 建立 http 下载连接 建立链接从请求中获取数据
        HttpURLConnection httpUrlConnection = (HttpURLConnection) new URL(uri).openConnection();
        httpUrlConnection.setConnectTimeout(10 * 1000);
        httpUrlConnection.setRequestMethod("GET");
        httpUrlConnection.setRequestProperty("Charset", "UTF-8");
        httpUrlConnection.connect();
        return download(platformType, uri, downloadPath, httpUrlConnection.getInputStream(), httpUrlConnection.getContentLength());
    }


}
```

### ArchetypeFileConfig
```java
public interface ArchetypeFileConfig {


    /**
     * 文件平台类型
     */
    ArchetypeFilePlatformType getFilePlatformType();

    /**
     * 允许上传的文件类型
     */
    List<String> getAllowFiles();

    /**
     * 允许上传的文件大小; 单位字节
     */
    Long getAllowFileSize();


}
```

### ArchetypeFilePlatformType
```java
@AllArgsConstructor
public enum ArchetypeFilePlatformType {

    // 上传下载文件平台类型
    LOCAL("\\\\"),
    ALIYUN("/"),
    TENCEN_CLOUD("/"),
    FAST_DFS("/")

    ;

    /**
     * 下载文件分隔符
     */
    @Getter
    private String fileSeparator;



}
```

### FileConstant
```java
public interface FileConstant {

    String[] IMAGE_EXTENSION = {"bmp", "gif", "jpg", "jpeg", "png"};

    String[] FLASH_EXTENSION = {"swf", "flv"};

    String[] MEDIA_EXTENSION = {"swf", "flv", "mp3", "wav", "wma", "wmv", "mid", "avi", "mpg",
            "asf", "rm", "rmvb"};

    String[] VIDEO_EXTENSION = {"mp4", "avi", "rmvb"};

    String[] DEFAULT_ALLOWED_EXTENSION = {
            // 图片
            "bmp", "gif", "jpg", "jpeg", "png",
            // word excel powerpoint
            "doc", "docx", "xls", "xlsx", "ppt", "pptx", "html", "htm", "txt",
            // 压缩文件
            "rar", "zip", "gz", "bz2",
            // 视频格式
            "mp4", "avi", "rmvb",
            // pdf
            "pdf"};

}
```

### FileFacade
```java
public interface FileFacade {


    /**
     * 上传文件
     *
     * @param fileConfig    文件上传配置
     * @param multipartFile 上传的文件
     * @return 上传后的文件地址
     */
    default List<String> upload(MultipartFile[] multipartFile, ArchetypeFileConfig fileConfig) {
        return upload(multipartFile, fileConfig, new UploadFileExtensions() {
            @Override
            public boolean preProcessing(MultipartFile[] multipartFile) {
                return true;
            }

            @Override
            public List<String> postProcessing(MultipartFile[] multipartFile, List<String> uploadUriList) {
                return uploadUriList;
            }
        });
    }


    /**
     * 上传文件
     *
     * @param fileConfig    文件上传配置
     * @param multipartFile 上传的文件
     * @return 上传后的文件地址
     */
    default List<String> upload(ArchetypeFileConfig fileConfig, MultipartFile[] multipartFile) {
        return upload(multipartFile, fileConfig);
    }


    /**
     * 上传文件
     *
     * @param fileConfig     文件上传配置
     * @param multipartFile  上传的文件
     * @param fileExtensions 文件扩展接口; 可在文件上传之前,上传之后进行操作
     * @return 上传后的文件地址
     */
    List<String> upload(MultipartFile[] multipartFile, ArchetypeFileConfig fileConfig, UploadFileExtensions fileExtensions);


    /**
     * 下载文件
     *
     * @param platformType 指定平台类型{@linkplain ArchetypeFilePlatformType}
     * @param uri          文件地址; 支持本地,http
     * @return 下载的文件对象
     */
    default File download(@NotNull ArchetypeFilePlatformType platformType, @NotNull String uri) {
        return download(platformType, uri, new DownloadFileExtensions() {
            @Override
            public boolean preProcessing(String uri) {
                return true;
            }

            @Override
            public File postProcessing(String uri, File downloadFile) {
                return downloadFile;
            }
        });
    }


    /**
     * 下载文件
     *
     * @param platformType   指定平台类型{@linkplain ArchetypeFilePlatformType}
     * @param uri            文件地址; 支持本地,http
     * @param fileExtensions 下载文件扩展接口;可在下载上传之前,下载之后进行操作
     * @return 下载的文件对象
     */
    File download(ArchetypeFilePlatformType platformType, String uri, DownloadFileExtensions fileExtensions);

}
```

### FileManagementBridge
```java
@Component
public class FileManagementBridge implements FileFacade {


    @Resource(name = "uploadChain")
    private AbstractUploadManagement uploadChain;


    @Resource(name = "downloadChain")
    private AbstractDownloadManagement downloadChain;


    @Override
    public List<String> upload(MultipartFile[] multipartFile, ArchetypeFileConfig fileConfig, UploadFileExtensions fileExtensions) {
        if (ObjectUtil.isAllEmpty(fileConfig.getFilePlatformType(), multipartFile)) {
            throw new IllegalArgumentException(String.format("upload file need param (platformType:[%s] multipartFile:[%s] maybe is empty.", fileConfig.getFilePlatformType(), Arrays.toString(multipartFile)));
        }
        if (!fileExtensions.preProcessing(multipartFile)) {
            return Collections.emptyList();
        }
        return fileExtensions.postProcessing(multipartFile, uploadChain.uploadTemplate(multipartFile, fileConfig));
    }


    @Override
    public File download(ArchetypeFilePlatformType platformType, String uri, DownloadFileExtensions fileExtensions) {
        if (ObjectUtil.isAllEmpty(platformType, uri)) {
            throw new IllegalArgumentException(String.format("download file need param ( platformType:[%s] uri:[%s] ) maybe is empty.", platformType, uri));
        }
        if (!fileExtensions.preProcessing(uri)) {
            return new File(CharSequenceUtil.EMPTY);
        }
        return fileExtensions.postProcessing(uri, downloadChain.downloadTemplate(platformType, uri));
    }


}

```

### DownloadFileExtensions
```java
public interface DownloadFileExtensions {


    /**
     * 下载文件-前置处理
     *
     * @param uri 下载的uri
     * @return true-允许下载;false-不允许下载
     */
    boolean preProcessing(String uri);


    /**
     * 下载文件-后置处理
     *
     * @param uri          下载的uri
     * @param downloadFile 下载的文件
     * @return 经过后置处理的下载的文件
     */
    File postProcessing(String uri, File downloadFile);

}
```

### UploadFileExtensions
```java
public interface UploadFileExtensions {


    /**
     * 上传文件-前置处理
     *
     * @param multipartFile 上传的文件对象
     * @return true-能继续处理
     */
    boolean preProcessing(MultipartFile[] multipartFile);


    /**
     * 上传文件-后置处理
     *
     * @param uploadUriList 上传文件返回的uri地址集合
     * @return 经过后置处理返回的uri地址集合
     */
    List<String> postProcessing(MultipartFile[] multipartFile,List<String> uploadUriList);

}
```

## 阿里云
### AliyunFileConfig
```java
@Slf4j
@Data
@Configuration(value = "aliyunFileConfig")
@Accessors(chain = true)
public class AliyunFileConfig implements ArchetypeFileConfig {


    /**
     * 填写Bucket所在地域对应的Endpoint，可在创建好的Bucket概况页查看
     */
    private String endpoint;

    /**
     * 阿里云账号AccessKey里所对应的AccessKey ID
     */
    private String accessKeyId;

    /**
     * 阿里云账号AccessKey里所对应的AccessKey Secret
     */
    private String accessKeySecret;

    /**
     * OSS对象存储空间名
     */
    private String bucketName;
    /**
     * 允许上传的文件类型
     */
    private List<String> allowFiles;

    /**
     * 允许上传的文件大小; 单位字节
     */
    private Long allowFileSize;


    @Override
    public ArchetypeFilePlatformType getFilePlatformType() {
        return ArchetypeFilePlatformType.ALIYUN;
    }
}
```

### ArchetypeAliyunDownload
```java
@Component("archetypeAliyunDownload")
@RequiredArgsConstructor
public class ArchetypeAliyunDownload extends AbstractDownloadManagement {


    @Override
    protected boolean preProcessing(String uri) {
        return false;
    }

    @Override
    protected File download(String uri) {
        return null;
    }

    @Override
    protected File postProcessing(File downloadFile) {
        return null;
    }

    @Override
    protected boolean isCurrentPlatform(ArchetypeFilePlatformType platformType) {
        return false;
    }
}
```

### ArchetypeAliyunUpload
```java
@Component("archetypeAliyunUpload")
@RequiredArgsConstructor
public class ArchetypeAliyunUpload extends AbstractUploadManagement {


    @Override
    protected boolean isCurrentPlatform(ArchetypeFilePlatformType platformType) {
        return ArchetypeFilePlatformType.ALIYUN.equals(platformType);
    }


    @Override
    protected boolean preProcessing(MultipartFile multipartFile, ArchetypeFileConfig fileConfig) {
        return true;
    }


    @SneakyThrows
    @Override
    protected String upload(MultipartFile multipartFile,ArchetypeFileConfig fileConfig) {
        AliyunFileConfig aliyunFileConfig = ((AliyunFileConfig) fileConfig);
        OSS ossClient = new OSSClientBuilder().build(
                aliyunFileConfig.getEndpoint(),
                aliyunFileConfig.getAccessKeyId(),
                aliyunFileConfig.getAccessKeySecret()
        );
        // 上传文件流
        try (InputStream inputStream = multipartFile.getInputStream()) {
            String fileName = multipartFile.getOriginalFilename();
            fileName = UUID.randomUUID().toString().replaceAll("-", "") + fileName;

            // 按照当前日期，创建文件夹，上传到创建文件夹里面 20220315/xx.jpg
            fileName = DateUtil.format(DateUtil.date(), "yyyyMMdd") + ArchetypeFilePlatformType.ALIYUN.getFileSeparator() + fileName;
            ossClient.putObject(aliyunFileConfig.getBucketName(), fileName, inputStream);
            ossClient.shutdown();

            return String.format("https://%s.%s/%s", aliyunFileConfig.getBucketName(), aliyunFileConfig.getEndpoint(), fileName);
        }
    }


    @Override
    protected String postProcessing(String fileUri) {
        return fileUri;
    }
}
```

## fastdfs
### FastDfsConfig
```java
@Data
@Accessors(chain = true)
@Configuration(value = "fastDfsConfig")
public class FastDfsConfig implements ArchetypeFileConfig {


    /**
     * 编码
     */
    private String charset;
    /**
     * 连接超时事件
     */
    private String connectTimeoutInSecond;
    /**
     * 网络超时时间
     */
    private String networkTimeoutInSeconds;
    /**
     * track端口
     */
    private String httpTrackerHttpPort;
    /**
     * http令牌
     */
    private String httpAntiStealToken;
    /**
     * 服务器地址
     */
    private String trackerServers;

    private String storageServiceIp;
    private Integer storageServicePort;
    private Integer storageServicePathIndex;
    /**
     * 允许上传的文件类型
     */
    private List<String> allowFiles;

    /**
     * 允许上传的文件大小; 单位字节
     */
    private Long allowFileSize;

    @Override
    public ArchetypeFilePlatformType getFilePlatformType() {
        return ArchetypeFilePlatformType.FAST_DFS;
    }

}
```

### ArchetypeFastDfsDownload
```java
@Component("archetypeFastDfsDownload")
@DependsOn({"fastDfsConfig"})
@RequiredArgsConstructor
public class ArchetypeFastDfsDownload extends AbstractDownloadManagement {
    @Override
    protected boolean preProcessing(String uri) {
        return false;
    }

    @Override
    protected File download(String uri) {
        return null;
    }

    @Override
    protected File postProcessing(File downloadFile) {
        return null;
    }

    @Override
    protected boolean isCurrentPlatform(ArchetypeFilePlatformType platformType) {
        return false;
    }
}
```

### ArchetypeFastDfsUpload
```java
@Slf4j
@Component("archetypeFastDfsUpload")
@RequiredArgsConstructor
public class ArchetypeFastDfsUpload extends AbstractUploadManagement {


    @Override
    protected boolean isCurrentPlatform(ArchetypeFilePlatformType platformType) {
        return ArchetypeFilePlatformType.FAST_DFS.equals(platformType);
    }


    @Override
    protected boolean preProcessing(MultipartFile multipartFile, ArchetypeFileConfig fileConfig) {
        return true;
    }


    @SneakyThrows
    @Override
    protected String upload(MultipartFile multipartFile,ArchetypeFileConfig fileConfig) {
        FastDfsConfig fastDfsConfig = (FastDfsConfig) fileConfig;
        init(fastDfsConfig);

        String originalFilename = multipartFile.getOriginalFilename();
        String suffix = originalFilename.substring(originalFilename.lastIndexOf(".")+1);

        StorageClient storageClient = new StorageClient(null, new StorageServer(fastDfsConfig.getStorageServiceIp(), fastDfsConfig.getStorageServicePort(), fastDfsConfig.getStorageServicePathIndex()));
        String[] strings = storageClient.upload_file(multipartFile.getBytes(), suffix, null);
        return String.format("http://%s:%s/%s",fastDfsConfig.getStorageServiceIp(),fastDfsConfig.getHttpTrackerHttpPort(),StrUtil.join("/",strings));
    }

    @SneakyThrows
    private void init(FastDfsConfig fastDfsConfig){
        // 先从容器获取如果没有在加载 fixme

        // 文件服务器客户端初始化
        Properties properties = new Properties();
        properties.setProperty("fastdfs.connect_timeout_in_seconds", fastDfsConfig.getConnectTimeoutInSecond());
        properties.setProperty("fastdfs.network_timeout_in_seconds", fastDfsConfig.getNetworkTimeoutInSeconds());
        properties.setProperty("fastdfs.charset", fastDfsConfig.getCharset());
        properties.setProperty("fastdfs.http_tracker_http_port", fastDfsConfig.getHttpTrackerHttpPort());
        properties.setProperty("fastdfs.http_anti_steal_token", fastDfsConfig.getHttpAntiStealToken());
        properties.setProperty("fastdfs.tracker_servers", fastDfsConfig.getTrackerServers());
        ClientGlobal.initByProperties(properties);
        log.info("fastdfs客户端初始化成功");
    }



    @Override
    protected String postProcessing(String fileUri) {
        return fileUri;
    }

}
```

## 本地
### LocalFileConfig
```java
@Data
@Configuration(value = "localFileConfig")
@Accessors(chain = true)
public class LocalFileConfig implements ArchetypeFileConfig {

    /**
     * 允许上传的文件类型
     */
    private List<String> allowFiles;

    /**
     * 允许上传的文件大小; 单位字节
     */
    private Long allowFileSize;

    /**
     * 上传的路径
     */
    private String uploadPath;

    /**
     * 下载文件到指定路径
     */
    private String downloadPath;

    @Override
    public ArchetypeFilePlatformType getFilePlatformType() {
        return ArchetypeFilePlatformType.LOCAL;
    }


}
```

### ArchetypeLocalDownload
```java
@DependsOn({"localFileConfig"})
@Component("archetypeLocalDownload")
@RequiredArgsConstructor
public class ArchetypeLocalDownload extends AbstractDownloadManagement {

    private final LocalFileConfig localFileConfig;

    @Override
    protected boolean preProcessing(String uri) {
        return true;
    }

    @SneakyThrows
    @Override
    protected File download(String uri) {
        return download(ArchetypeFilePlatformType.LOCAL, uri, localFileConfig.getDownloadPath(), Files.newInputStream(Paths.get(uri)), new File(uri).length());
    }

    @Override
    protected File postProcessing(File downloadFile) {
        return downloadFile;
    }

    @Override
    protected boolean isCurrentPlatform(ArchetypeFilePlatformType platformType) {
        return ArchetypeFilePlatformType.LOCAL.equals(platformType);
    }

}
```

### ArchetypeLocalUpload
```java
@Component("archetypeLocalUpload")
@RequiredArgsConstructor
public class ArchetypeLocalUpload extends AbstractUploadManagement {


    @Override
    protected boolean isCurrentPlatform(ArchetypeFilePlatformType platformType) {
        return ArchetypeFilePlatformType.LOCAL.equals(platformType);
    }


    @Override
    protected boolean preProcessing(MultipartFile multipartFile,ArchetypeFileConfig fileConfig) {
        return true;
    }


    @SneakyThrows
    @Override
    protected String upload(MultipartFile file, ArchetypeFileConfig fileConfig) {
        LocalFileConfig localFileConfig = (LocalFileConfig) fileConfig;
        String fileName = extractFilename(file);
        String absPath = getAbsoluteFile(localFileConfig.getUploadPath(), fileName).getAbsolutePath();
        file.transferTo(Paths.get(absPath));
        return String.format("%s/%s", localFileConfig.getUploadPath(), fileName);
    }


    /**
     * 编码文件名
     */
    private String extractFilename(MultipartFile file) {
        return CharSequenceUtil.format("{}/{}_{}.{}", DateUtil.format(new Date(), "yyyyMMdd"),
                FilenameUtils.getBaseName(file.getOriginalFilename()), IdUtil.getSnowflakeNextIdStr(), FilenameUtils.getExtension(file.getOriginalFilename()));
    }


    private File getAbsoluteFile(String uploadDir, String fileName) {
        File desc = new File(uploadDir + File.separator + fileName);
        if (!desc.exists() && !desc.getParentFile().exists()) {
            desc.getParentFile().mkdirs();
        }
        return desc;
    }


    @Override
    protected String postProcessing(String fileUri) {
        return fileUri;
    }

}
```

## 调用测试
### FileTest
```java
@Slf4j
@RunWith(SpringRunner.class)
@SpringBootTest(classes = FileApplication.class)
public class FileTest {


    @Autowired
    private FileFacade fileFacade;


    /**
     *     aliyun:
     *       allowFiles: [ ".png",".txt" ]
     *       allowFileSize: 10240
     *       endpoint: oss-cn-shanghai.aliyuncs.com
     *       accessKeyId: 
     *       accessKeySecret: 
     *       bucketName: shanghai-bucketnametest
     */
    ArchetypeFileConfig aliyunFileConfig = new AliyunFileConfig()
            .setAllowFiles(Arrays.asList(".png", ".txt"))
            .setAllowFileSize(10240L)
            .setEndpoint("oss-cn-shanghai.aliyuncs.com")
            .setAccessKeyId("")
            .setAccessKeySecret("")
            .setBucketName("shanghai-bucketnametest");

    /**
     *     local:
     *       allowFiles: [".png",".txt"]
     *       allowFileSize: 10240
     *       uploadPath: "C:/Users/Administrator/Downloads"
     *       downloadPath: "C:/Users/Administrator/Downloads"
     */
    ArchetypeFileConfig localFileConfig = new LocalFileConfig()
            .setAllowFiles(Arrays.asList(".png", ".txt"))
            .setAllowFileSize(10240L)
            .setUploadPath("C:\\Users\\Administrator\\Downloads")
            .setDownloadPath("C:\\Users\\Administrator\\Downloads");


    /**
     *     fastdfs:
     *       allowFiles: [ ".png",".txt" ]
     *       allowFileSize: 10240
     *       charset: UTF-8
     *       connectTimeoutInSecond: 10
     *       networkTimeoutInSeconds: 30
     *       httpTrackerHttpPort: 8888
     *       httpAntiStealToken: no
     *       trackerServers: 172.16.1.199:22122
     *       fastdfsUrl: http://172.16.1.199:8888
     *       storageServiceIp: 172.16.1.199
     *       storageServicePort: 23000
     *       storageServicePathIndex: 0
     */
    ArchetypeFileConfig fastDfsConfig = new FastDfsConfig()
            .setAllowFiles(Arrays.asList(".png", ".txt"))
            .setAllowFileSize(10240L)
            .setCharset("UTF-8")
            .setConnectTimeoutInSecond("10")
            .setNetworkTimeoutInSeconds("30")
            .setHttpTrackerHttpPort("8888")
            .setHttpAntiStealToken("no")
            .setTrackerServers("172.16.1.199:22122")
            .setStorageServiceIp("172.16.1.199")
            .setStorageServicePort(23000)
            .setStorageServicePathIndex(0)
            ;

    @Test
    public void uploadTest() {
        MultipartFile file = new MockMultipartFile(
                "file",
                "hello11.txt",
                MediaType.TEXT_PLAIN_VALUE,
                "Hello, World!111111111111111111111111111".getBytes()
        );
        List<String> uriLs = fileFacade.upload(new MultipartFile[]{file}, aliyunFileConfig);
        System.out.println("=>" + uriLs);
    }


    @Test
    public void downloadTest() {
        fileFacade.download(ArchetypeFilePlatformType.LOCAL, "C:\\Users\\Administrator\\Downloads\\20230114\\hello_1614199174685622272.txt");
    }

}
```


