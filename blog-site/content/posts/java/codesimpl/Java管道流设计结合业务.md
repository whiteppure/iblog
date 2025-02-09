---
title: "Java管道流设计模式结合业务"
date: 2023-06-15
draft: false
tags: ["应用","设计","Java","小程序"]
slug: "pipeline-business"
---



## 流程图
![管道流设计结合业务-01](/posts/annex/images/essays/管道流设计结合业务-01.jpg)

## 代码实现
![管道流设计结合业务-02](/posts/annex/images/essays/管道流设计结合业务-02.jpg)

完整代码：[https://gitee.com/gitee_pikaqiu/easy-pipeline](https://gitee.com/gitee_pikaqiu/easy-pipeline)
### pom
```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    
    <dependency>
        <groupId>org.springframework.plugin</groupId>
        <artifactId>spring-plugin-core</artifactId>
        <version>${spring.plugin.core.version}</version>
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
        <version>${hutool.version}</version>
    </dependency>
</dependencies>
```

### context
#### EventContext
```java
public interface EventContext {


    /**
     * 是否继续调用链
     */
    boolean continueChain();


    /**
     * 获取当前过滤器选择器
     */
    FilterSelector getFilterSelector();

}
```

#### BizType
```java
public interface BizType {


    /**
     * 获取业务类型码值
     */
    Integer getCode();

    /**
     * 业务类型名称
     *
     */
    String getName();

}
```

#### AbstractEventContext
```java
public abstract class AbstractEventContext implements EventContext{


    private final BizType businessType;
    private final FilterSelector filterSelector;


    protected AbstractEventContext(BizType businessType, FilterSelector filterSelector) {
        this.businessType = businessType;
        this.filterSelector = filterSelector;
    }


    @Override
    public boolean continueChain() {
        return true;
    }

    @Override
    public FilterSelector getFilterSelector() {
        return filterSelector;
    }

}
```

### filter
#### EventFilter
```java
public interface EventFilter<T extends EventContext> {

    /**
     * 过滤逻辑封装点
     *
     * @param context 上下文对象
     * @param chain   调用链
     */
    void doFilter(T context, EventFilterChain<T> chain);

}
```
#### AbstractEventFilter
```java
public abstract class AbstractEventFilter<T extends EventContext> implements EventFilter<T> {

    @Override
    public void doFilter(T context, EventFilterChain<T> chain) {
        // 执行
        if (context.getFilterSelector().matchFilter(this.getClass().getSimpleName())) {
            handler(context);
        }

        // 是否继续执行调用链
        if (context.continueChain()) {
            chain.nextHandler(context);
        }
    }


    /**
     * 执行器
     *
     * @param context 上下文对象
     */
    protected abstract void handler(T context);

}
```
#### EventFilterChain
```java
public interface EventFilterChain<T extends EventContext> {


    /**
     * 执行当前过滤器
     *
     * @param context 上下文对象
     */
    void handler(T context);


    /**
     * 跳过当前过滤器 执行下一个执行过滤器
     *
     * @param context 上下文对象
     */
    void nextHandler(T context);

}
```
#### FilterChainPipeline
```java
@Slf4j
@Component
public class FilterChainPipeline<F extends EventFilter>{


    private DefaultEventFilterChain<EventContext> last;


    public FilterChainPipeline<F> append(F filter){
        last = new DefaultEventFilterChain<>(last, filter);
        return this;
    }


    public FilterChainPipeline<F> append(String description, F filter){
        log.debug("过滤器调用链管道开始设置 {} 过滤器",description);
        last = new DefaultEventFilterChain<>(last, filter);
        return this;
    }


    public DefaultEventFilterChain<EventContext> getFilterChain() {
        return this.last;
    }

}
```
#### DefaultEventFilterChain
```java
public class DefaultEventFilterChain<T extends EventContext> implements EventFilterChain<T> {

    private final EventFilterChain<T> next;
    private final EventFilter<T> filter;


    public DefaultEventFilterChain(EventFilterChain<T> next, EventFilter<T> filter) {
        this.next = next;
        this.filter = filter;
    }


    @Override
    public void handler(T context) {
        filter.doFilter(context,this);
    }

    @Override
    public void nextHandler(T context) {
        if (next != null) {
            next.handler(context);
        }
    }

}
```

### selector
#### FilterSelector
```java
public interface FilterSelector {


    /**
     * 匹配过滤器
     *
     * @param currentFilterName 过滤器名称
     * @return true 匹配成功
     */
    boolean matchFilter(String currentFilterName);

    /**
     * 获取当前所有过滤器名称
     *
     * @return 过滤器名称
     */
    List<String> getAllFilterNames();
}
```
#### DefaultFilterSelector
```java
public class DefaultFilterSelector implements FilterSelector{

    @Setter
    private  List<String> filterNames = CollUtil.newArrayList();

    @Override
    public boolean matchFilter(String currentFilterName) {
        return filterNames.stream().anyMatch(s -> Objects.equals(s,currentFilterName));
    }


    @Override
    public List<String> getAllFilterNames() {
        return filterNames;
    }

}
```

## 调用代码
![管道流设计结合业务-03](/posts/annex/images/essays/管道流设计结合业务-03.jpg)

### PipelineApplication
```java
@SpringBootApplication
@EnablePluginRegistries(value = {Business1PostPlugin.class, Business2PostPlugin.class})
public class PipelineApplication {
    public static void main(String[] args) {
        SpringApplication.run(PipelineApplication.class, args);
    }
}
```

### controller
```java
@RestController
@RequestMapping("/pipelineTest")
public class PipelineController {

    @Autowired
    private Business1Service business1PipelineTestService;

    @Autowired
    private Business2Service business2PipelineTestService;


    @GetMapping("/business1")
    public void business1(){
        PipelineRequestVo pipelineTestRequest = new PipelineRequestVo();
        pipelineTestRequest.setUuid("business1-1110-1111231afsas-123adss");
        pipelineTestRequest.setBusinessCode("business1");
        pipelineTestRequest.setModel2(new Business1Model2());
        pipelineTestRequest.setModel1(new Business1Model1());
        business1PipelineTestService.doService(pipelineTestRequest);
    }


    @GetMapping("/business2")
    public void business2(){
        PipelineRequestVo pipelineTestRequest = new PipelineRequestVo();
        pipelineTestRequest.setUuid("business2-1110-1111231afsas-123adss");
        pipelineTestRequest.setBusinessCode("business2");
        pipelineTestRequest.setModel3(new Business2Model1());
        pipelineTestRequest.setModel4(new Business2Model2());
        business2PipelineTestService.doService(pipelineTestRequest);
    }

}
```

### entity
```java
@Data
public class PipelineRequestVo {


    private String uuid;

    private String businessCode;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business1Model1 model1;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business1Model2 model2;


    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business2Model1 model3;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business2Model2 model4;

}
```

### service
```java
@Getter
@AllArgsConstructor
public enum BusinessTypeEnum implements BizType {

    BUSINESS_1(1,"业务1"),
    BUSINESS_2(2,"业务2"),
    BUSINESS_3(3,"业务3"),
    ;



   private Integer code;
   private String name;

}
```

### service.business1
```java
public interface Business1Service {

    void doService(PipelineRequestVo pipelineTestRequest);
}
```
```java
@Slf4j
@Service
public class Business1ServiceImpl implements Business1Service {

    @Qualifier("business1PipelineSelectorFactory")
    @Autowired
    private  PipelineSelectorFactory business1PipelineSelectorFactory;

    @Autowired
    private  FilterChainPipeline<Business1PipelineFilter> filterChainPipeline;

    @Autowired
    private  PluginRegistry<Business1PostPlugin, Business1Model1> business1PostPlugin;



    @Override
    public void doService(PipelineRequestVo pipelineTestRequest) {
        log.info("===============business1开始===============");
        // 处理器参数
        log.info("===============开始获取FilterSelector===============");
        FilterSelector filterSelector = business1PipelineSelectorFactory.getFilterSelector(pipelineTestRequest);
        Business1Context pipelineEventContext = new Business1Context(BusinessTypeEnum.BUSINESS_1, filterSelector);
        log.info("获取FilterSelector完成: {}",filterSelector.getAllFilterNames());
        log.info("===============获取FilterSelector完成===============");

        // 处理
        log.info("===============开始执行过滤器===============");
        pipelineEventContext.setPipelineTestRequest(pipelineTestRequest);
        pipelineEventContext.setModel2(pipelineTestRequest.getModel2());
        pipelineEventContext.setModel1(pipelineTestRequest.getModel1());
        filterChainPipeline.getFilterChain().handler(pipelineEventContext);
        log.info("===============执行过滤器完成===============");

        // 处理后获取值
        log.info("===============开始执行后置处理器===============");
        Business1Model2 model2 = pipelineEventContext.getModel2();
        Business1Model1 model1 = pipelineEventContext.getModel1();
        PipelineRequestVo pipelineTestRequest1 = pipelineEventContext.getPipelineTestRequest();
        business1PostPlugin.getPluginsFor(model1)
                .forEach(handler -> handler.postProcessing(model1));
        log.info("===============执行后置处理器完成===============");

        log.info("===============business1结束===============");

    }

}
```

### service.business1.context
```java
public class Business1Context extends AbstractEventContext {

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business1Model1 model1;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business1Model2 model2;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private PipelineRequestVo pipelineTestRequest;


    public Business1Context(BizType businessType, FilterSelector filterSelector) {
        super(businessType, filterSelector);
    }

    @Override
    public boolean continueChain() {
        return true;
    }

}
```
```java
@Data
public class Business1Model1 {

    private Integer id;

    private String name1;

    private String name2;

    private String name3;

}
```
```java
@Data
public class Business1Model2 {

    private Integer id;

    private String name;

    private String desc;

    private String age;

}
```

### service.business1.filters
```java
public interface Business1PipelineFilter extends EventFilter<Business1Context> {

    int order();
}
```
```java
@Slf4j
@Component
public class Business1Filter1 extends AbstractEventFilter<Business1Context> implements Business1PipelineFilter {

    @Override
    public void handler(Business1Context context) {
        // 模拟操作数据库 等业务操作 可以利用门面模式进行解耦
        Business1Model1 model1 = context.getModel1();
        model1.setName1("张三");
        model1.setName2("李四");
        model1.setName3("王五");
        model1.setId(1);

        Business1Model2 model2 = context.getModel2();
        model2.setId(2);
        model2.setDesc("");
        model2.setAge("18");
        model2.setName("小白");

        log.info("Filter1执行完毕...");

        // 存入新的值到上下文对象中 下个处理器继续处理
        context.setModel1(model1);
        context.setModel2(model2);
    }

    @Override
    public int order() {
        return 1;
    }
}
```
```java
@Slf4j
@Component
public class Business1Filter2 extends AbstractEventFilter<Business1Context>  implements Business1PipelineFilter {

    @Override
    public void handler(Business1Context context) {
        // 模拟操作数据库 等业务操作 可以利用门面模式进行解耦
        Business1Model1 model1 = context.getModel1();
        model1.setName1(model1.getName1() + "-------------");
        model1.setName2(model1.getName2() + "-------------");
        model1.setName3(model1.getName3() + "-------------");
        model1.setId(100);

        log.info("Filter2执行完毕...");
        // 存入新的值到上下文对象中 下个处理器继续处理
        context.setModel1(model1);
        context.setModel2(context.getModel2());
    }

    @Override
    public int order() {
        return 2;
    }
}
```

### service.business1.plugins
```java
public interface Business1PostPlugin extends Plugin<Business1Model1> {


    /**
     * 后置处理
     *
     * @param model 处理参数
     */
    void postProcessing(Business1Model1 model);

}
```

```java
@Slf4j
@Component
public class Business1ServicePluginImpl implements Business1PostPlugin {


    @Override
    public boolean supports(Business1Model1 pipelineEventContext) {
        return true;
    }


    @Override
    public void postProcessing(Business1Model1 model) {
        log.info("===>{}",model.getId());
    }

}
```

```java
@Slf4j
@Component
public class Business1ServicePluginImpl2 implements Business1PostPlugin {

    @Override
    public boolean supports(Business1Model1 model) {
        return true;
    }


    @Override
    public void postProcessing(Business1Model1 model) {
        log.info("===>{}",model.getId());
    }

}
```

### service.business2
```java
public interface Business2Service {

    void doService(PipelineRequestVo pipelineTestRequest);
}
```
```java
@Slf4j
@Service
public class Business2ServiceImpl implements Business2Service {

    @Qualifier("business2PipelineSelectorFactory")
    @Autowired
    private PipelineSelectorFactory business2PipelineSelectorFactory;

    @Autowired
    private FilterChainPipeline<Business2PipelineFilter> filterChainPipeline;

    @Autowired
    private PluginRegistry<Business2PostPlugin, Business2Model1> business2PostPlugin;



    @Override
    public void doService(PipelineRequestVo pipelineTestRequest) {
        log.info("===============business2开始===============");
        // 处理器参数
        log.info("===============开始获取FilterSelector===============");
        FilterSelector filterSelector = business2PipelineSelectorFactory.getFilterSelector(pipelineTestRequest);
        Business2Context pipelineEventContext = new Business2Context(BusinessTypeEnum.BUSINESS_2, filterSelector);
        log.info("获取FilterSelector完成: {}",filterSelector.getAllFilterNames());
        log.info("===============获取FilterSelector完成===============");

        // 处理
        log.info("===============开始执行过滤器===============");
        pipelineEventContext.setPipelineTestRequest(pipelineTestRequest);
        pipelineEventContext.setModel2(pipelineTestRequest.getModel4());
        pipelineEventContext.setModel1(pipelineTestRequest.getModel3());
        filterChainPipeline.getFilterChain().handler(pipelineEventContext);
        log.info("===============执行过滤器完成===============");

        // 处理后获取值
        log.info("===============开始执行后置处理器===============");
        Business2Model2 model2 = pipelineEventContext.getModel2();
        Business2Model1 model1 = pipelineEventContext.getModel1();
        PipelineRequestVo pipelineTestRequest1 = pipelineEventContext.getPipelineTestRequest();
        business2PostPlugin.getPluginsFor(model1)
                .forEach(handler -> handler.postProcessing(model1));
        log.info("===============执行后置处理器完成===============");
        log.info("===============business2结束===============");
    }

}
```

### service.business2.context
```java
public class Business2Context extends AbstractEventContext {

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business2Model1 model1;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private Business2Model2 model2;

    /**
     * 在自定义的filter中处理
     */
    @Setter
    @Getter
    private PipelineRequestVo pipelineTestRequest;


    public Business2Context(BizType businessType, FilterSelector filterSelector) {
        super(businessType, filterSelector);
    }

    @Override
    public boolean continueChain() {
        return true;
    }

}
```
```java
@Data
public class Business2Model1 {

    private Integer id;

    private String name1;

    private String name2;

    private String name3;

}
```
```java
@Data
public class Business2Model2 {

    private Integer id;

    private String name;

    private String desc;

    private String age;

}
```

### service.business2.filters
```java
public interface Business2PipelineFilter extends EventFilter<Business2Context> {

     int order();
}
```

```java
@Slf4j
@Component
public class Business2Filter1 extends AbstractEventFilter<Business2Context> implements Business2PipelineFilter {

    @Override
    public void handler(Business2Context context) {
        // 模拟操作数据库 等业务操作 可以利用门面模式进行解耦
        Business2Model1 model1 = context.getModel1();
        model1.setName1("张三");
        model1.setName2("李四");
        model1.setName3("王五");
        model1.setId(1);

        Business2Model2 model2 = context.getModel2();
        model2.setId(2);
        model2.setDesc("");
        model2.setAge("18");
        model2.setName("小白");

        log.info("Filter1执行完毕...");

        // 存入新的值到上下文对象中 下个处理器继续处理
        context.setModel1(model1);
        context.setModel2(model2);
    }

    @Override
    public int order() {
        return 1;
    }
}
```

```java
@Slf4j
@Component
public class Business2Filter2 extends AbstractEventFilter<Business2Context>  implements Business2PipelineFilter {

    @Override
    public void handler(Business2Context context) {
        // 模拟操作数据库 等业务操作 可以利用门面模式进行解耦
        Business2Model1 model1 = context.getModel1();
        model1.setName1(model1.getName1() + "-------------");
        model1.setName2(model1.getName2() + "-------------");
        model1.setName3(model1.getName3() + "-------------");
        model1.setId(100);

        log.info("Filter2执行完毕...");
        // 存入新的值到上下文对象中 下个处理器继续处理
        context.setModel1(model1);
        context.setModel2(context.getModel2());
    }

    @Override
    public int order() {
        return 2;
    }
}
```

### service.business2.plugins
```java
public interface Business2PostPlugin extends Plugin<Business2Model1> {


    /**
     * 后置处理
     *
     * @param model 处理参数
     */
    void postProcessing(Business2Model1 model);

}
```
```java
@Slf4j
@Component
public class Business2ServicePluginImpl implements Business2PostPlugin {


    @Override
    public boolean supports(Business2Model1 pipelineEventContext) {
        return true;
    }


    @Override
    public void postProcessing(Business2Model1 model) {
        log.info("===>{}",model.getId());
    }

}
```

```java
@Slf4j
@Component
public class Business2ServicePluginImpl2 implements Business2PostPlugin {


    @Override
    public boolean supports(Business2Model1 model) {
        return true;
    }


    @Override
    public void postProcessing(Business2Model1 model) {
        log.info("===>{}",model.getId());
    }

}
```

### service.config
```java
@ConfigurationProperties(prefix = "test")
@Component
@Data
public class FilterConfigProperties {

    private Map<String, List<String>> configs;


    public Map<String, List<String>> getConfigs() {
        if (configs == null) {
            configs = MapUtil.newHashMap(16);
        }
        return configs;
    }

}
```
```java
@Component
@RequiredArgsConstructor
public class PipelineFilterConfig {

    private final List<Business1PipelineFilter> business1PipelineFilter;
    private final FilterChainPipeline<Business1PipelineFilter> business1FilterChainPipeline;

    private final List<Business2PipelineFilter> business2PipelineFilter;
    private final FilterChainPipeline<Business2PipelineFilter> business2FilterChainPipeline;

    private final FilterConfigProperties filterConfigProperties;


    @Bean
    public FilterChainPipeline<Business1PipelineFilter> business1ChargePipeline() {
        Map<String, List<String>> configs = filterConfigProperties.getConfigs();
        if (business1PipelineFilter.isEmpty() || configs.isEmpty()){
            return business1FilterChainPipeline;
        }

        Set<Map.Entry<String, List<String>>> filtersName = configs.entrySet();
        long distinctCount = filtersName.stream().distinct().count();
        if (distinctCount > business1PipelineFilter.size()) {
            throw new IllegalArgumentException("设置的过滤器数量大于实际过滤器数量");
        }

        business1PipelineFilter
                .stream()
                .sorted(Comparator.comparing(Business1PipelineFilter::order))
                .forEach(business1FilterChainPipeline::append)
        ;
        return business1FilterChainPipeline;
    }


    @Bean
    public FilterChainPipeline<Business2PipelineFilter> business2ChargePipeline() {
        Map<String, List<String>> configs = filterConfigProperties.getConfigs();
        if (business2PipelineFilter.isEmpty() || configs.isEmpty()){
            return business2FilterChainPipeline;
        }

        Set<Map.Entry<String, List<String>>> filtersName = configs.entrySet();
        long distinctCount = filtersName.stream().distinct().count();
        if (distinctCount > business2PipelineFilter.size()) {
            throw new IllegalArgumentException("设置的过滤器数量大于实际过滤器数量");
        }

        business2PipelineFilter
                .stream()
                .sorted(Comparator.comparing(Business2PipelineFilter::order))
                .forEach(business2FilterChainPipeline::append)
        ;
        return business2FilterChainPipeline;
    }

}
```

### service.selector
```java
public interface PipelineSelectorFactory {
    FilterSelector  getFilterSelector(PipelineRequestVo request);
}
```

```java
@Component("business1PipelineSelectorFactory")
public class Business1PipelineSelectorFactory implements PipelineSelectorFactory {

    @Autowired
    private FilterConfigProperties filterConfigProperties;

    @Override
    public FilterSelector getFilterSelector(PipelineRequestVo request) {
        String businessCode = request.getBusinessCode();
        DefaultFilterSelector defaultFilterSelector = new DefaultFilterSelector();
        if (businessCode.equals("business1")){
            defaultFilterSelector.setFilterNames(filterConfigProperties.getConfigs().getOrDefault(businessCode, Collections.unmodifiableList(new ArrayList<>())));
        }
        return defaultFilterSelector;
    }
}
```

```java
@Component("business2PipelineSelectorFactory")
public class Business2PipelineSelectorFactory implements PipelineSelectorFactory {

    @Autowired
    private FilterConfigProperties filterConfigProperties;

    @Override
    public FilterSelector getFilterSelector(PipelineRequestVo request) {
        String businessCode = request.getBusinessCode();
        DefaultFilterSelector defaultFilterSelector = new DefaultFilterSelector();
        if (businessCode.equals("business2")){
            defaultFilterSelector.setFilterNames(filterConfigProperties.getConfigs().getOrDefault(businessCode, Collections.unmodifiableList(new ArrayList<>())));
        }
        return defaultFilterSelector;
    }

}
```

### application.yml
```yaml
server:
  port: 8080

test:
  configs:
    business1:
      - Business1Filter1
      - Business1Filter2
    business2:
      - Business2Filter1
      - Business2Filter2
```
