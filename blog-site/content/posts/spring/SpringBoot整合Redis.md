---
title: "SpringBoot整合Redis"
date: 2020-03-01
draft: false
tags: ["SpringBoot", "Redis","Spring"]
slug: "springboot-redis"
---

## Docker安装和运行Redis
1. 首先从`Docker Hub`拉取`Redis`的官方镜像。
   ```shell
   docker pull redis:latest
   ```
2. 使用`docker run`命令启动`Redis`容器。
   ```shell
   docker run -d --name redis -p 6379:6379 redis:latest
   ```
3. 验证`Redis`运行状态。通过以下命令查看`Redis`容器的日志，确保其成功启动。
   ```shell
   docker logs redis
   ```
   也可以使用`redis-cli`客户端连接`Redis`，进行简单测试：
   ```shell
   docker exec -it redis redis-cli
   ```
4. 持久化`Redis`数据。为了在容器重启后保留数据，可以将`Redis`数据目录挂载到宿主机。
   ```shell
   docker run -d --name redis -p 6379:6379 -v /path/to/your/data:/data redis:latest redis-server --appendonly yes
   ```


## 导入pom依赖
```xml
<dependency>
   <groupId>org.springframework.boot</groupId>
   <artifactId>spring-boot-starter-cache</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-redis</artifactId>
</dependency>
```

## RedisConfig
```java
@Configuration
public class RedisConfig {

    //用于解决注解操作redis 序列话的问题
    @Bean(name = "myCacheManager")
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {

        RedisCacheWriter redisCacheWriter = RedisCacheWriter.nonLockingRedisCacheWriter(redisConnectionFactory);
        RedisSerializer<Object> jsonSerializer = new GenericJackson2JsonRedisSerializer();
        RedisSerializationContext.SerializationPair<Object> pair = RedisSerializationContext.SerializationPair
                .fromSerializer(jsonSerializer);
        RedisCacheConfiguration defaultCacheConfig = RedisCacheConfiguration.defaultCacheConfig()
                .serializeValuesWith(pair);
        defaultCacheConfig.entryTtl(Duration.ofMinutes(30));
        return new RedisCacheManager(redisCacheWriter, defaultCacheConfig);
    }
    
    
   /**
    * 解决用redisTemplate操作的序列化的问题
    *
    * @param factory RedisConnectionFactory
    * @return redisTemplate
    */
    @Bean
    @ConditionalOnMissingBean(name = "redisTemplate")
    public RedisTemplate<String,Object> redisTemplate(RedisConnectionFactory factory){
        // 配置redisTemplate
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(factory);
        // key序列化
        redisTemplate.setKeySerializer(STRING_SERIALIZER);
        // value序列化
        redisTemplate.setValueSerializer(JACKSON__SERIALIZER);
        // Hash key序列化
        redisTemplate.setHashKeySerializer(STRING_SERIALIZER);
        // Hash value序列化
        redisTemplate.setHashValueSerializer(JACKSON__SERIALIZER);
        redisTemplate.afterPropertiesSet();
        return redisTemplate;
    }

}
```

## 启动类配置
```java
@EnableCaching  //允许注解操作缓存
@SpringBootApplication
public class RedisExampleApplication {
   public static void main(String[] args) {
      SpringApplication.run(RedisExampleApplication.class, args);
   }
}
```

## application.yml配置
```yaml
#redis 缓存配置
redis:
  database: 0
  host: @ip
  port: 6379
  timeout: 8000
  #如果没有可不写
  password:
  jedis:
    pool:
      #连接池最大连接数量
      max-active: 10
      #连接池最大堵塞时间
      max-wait: -1
      #连接池最小空闲连接
      min-idle: 0
      #连接池最大空闲连接
      max-idle: 8
```

## RedisApplicationTest
```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class RedisApplicationTest {

    @Autowired
    private RedisTemplate redisTemplate;

    @Test
    public void demo() {
        //常见redis类型数据操作 set zset 未列出

        //string 类型数据
        redisTemplate.opsForValue().set("test", "123");
        redisTemplate.opsForValue().get("test"); // 输出结果为123

        //list 数据类型
        redisTemplate.opsForList().rightPushAll("list", new String[]{"1", "2", "3"});//从右边插入元素
        redisTemplate.opsForList().range("list", 0, -1);//获取所有元素
        redisTemplate.opsForList().index("listRight", 1);//获取下标为2的元素
        redisTemplate.opsForList().rightPush("listRiht", "1");//从右边插入 也可从左边插
        redisTemplate.opsForList().leftPop("list");//从左边弹出元素 元素弹出将不存在

        //hash
        redisTemplate.opsForHash().hasKey("redisHash", "111");//判断该hash key 是否存在
        redisTemplate.opsForHash().put("redisHash", "name", "111");//存放 hash 数据
        redisTemplate.opsForHash().keys("redisHash");//获取该key对应的hash值
        redisTemplate.opsForHash().get("redisHash", "age");//给定key 获取 hash 值
    }
}
```

## 缓存注解
除了使用`RedisTemplate`的方式，还可以使用注解的方式操作缓存，注解的方式操作缓存，可以减少代码量，提高开发效率。
需要在SpringBoot主类或配置类上启用缓存支持。
```java
@SpringBootApplication
@EnableCaching
public class RedisCacheApplication {
    public static void main(String[] args) {
        SpringApplication.run(RedisCacheApplication.class, args);
    }
}
```
```java
public class User {
    private Long id;
    private String name;

    // 构造函数、getter 和 setter 方法
    public User(Long id, String name) {
        this.id = id;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
```

`@Cacheable`注解用于缓存方法的返回结果。
```java
@Service
public class UserService {

    @Cacheable(value = "users", key = "#id")
    public User getUserById(Long id) {
        // 模拟从数据库获取用户信息
        return findUserById(id);
    }

    private User findUserById(Long id) {
        // 模拟数据库查询
        System.out.println("Fetching user from database...");
        return new User(id, "User" + id);
    }
}
```
还可以条件缓存，通过`condition`属性，只有满足条件的结果才会被缓存。
```java
@Service
public class UserService {

 @Cacheable(value = "users", key = "#id", condition = "#id > 10")
 public User getUserById(Long id) {
  System.out.println("Fetching user from database...");
  return findUserById(id);
 }

 private User findUserById(Long id) {
  // 模拟数据库查询
  return new User(id, "User" + id);
 }
}
```
`@CachePut`注解用于更新缓存，确保方法执行，并将结果缓存。
```java
@Service
public class UserService {

    @CachePut(value = "users", key = "#user.id")
    public User updateUser(User user) {
        System.out.println("Updating user in database...");
        return saveUser(user);
    }

    private User saveUser(User user) {
        // 模拟数据库保存
        return user;
    }
}
```
`@CacheEvict`注解用于删除缓存。
```java
@Service
public class UserService {

    @CacheEvict(value = "users", key = "#id")
    public void deleteUserById(Long id) {
        System.out.println("Deleting user from database...");
        removeUser(id);
    }

    private void removeUser(Long id) {
        // 模拟数据库删除
    }
}
```
`@CacheConfig`注解用于类级别的缓存配置。
```java
@Service
@CacheConfig(cacheNames = "users")
public class UserService {

}
```
完整的示例代码，包括基本用法、更新缓存、删除缓存、条件缓存和缓存配置。
```java
@Service
@CacheConfig(cacheNames = "users")
public class UserService {

    @Cacheable(key = "#id", condition = "#id > 10")
    public User getUserById(Long id) {
        System.out.println("Fetching user from database...");
        return findUserById(id);
    }

    @CachePut(key = "#user.id")
    public User updateUser(User user) {
        System.out.println("Updating user in database...");
        return saveUser(user);
    }

    @CacheEvict(key = "#id")
    public void deleteUserById(Long id) {
        System.out.println("Deleting user from database...");
        removeUser(id);
    }

    private User findUserById(Long id) {
        // 模拟数据库查询
        return new User(id, "User" + id);
    }

    private User saveUser(User user) {
        // 模拟数据库保存
        return user;
    }

    private void removeUser(Long id) {
        // 模拟数据库删除
    }
}
```
编写一个简单的测试类来验证缓存是否生效。
```java
@Component
public class CacheTestRunner implements CommandLineRunner {

    @Autowired
    private UserService userService;
   
    @Override
    public void run(String... args) throws Exception {
     System.out.println("First call...");
     User user1 = userService.getUserById(15L);
     System.out.println(user1);
   
     System.out.println("Second call...");
     User user2 = userService.getUserById(15L);
     System.out.println(user2);
   
     System.out.println("Updating user...");
     User updatedUser = userService.updateUser(new User(15L, "Updated User"));
     System.out.println(updatedUser);
   
     System.out.println("Third call...");
     User user3 = userService.getUserById(15L);
     System.out.println(user3);
   
     System.out.println("Deleting user...");
     userService.deleteUserById(15L);
   
     System.out.println("Fourth call...");
     User user4 = userService.getUserById(15L);
     System.out.println(user4);
    }
}
```
