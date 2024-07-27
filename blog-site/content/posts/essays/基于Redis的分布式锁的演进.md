---
title: "基于Redis的分布式锁的演进"
date: 2024-07-27
draft: false
tags: ["分布式","Redis"]
slug: "redis-distributed-lock-evolve"
---


## 基于Redis的分布式锁
基于`Redis`的分布式锁，是利用`Redis`提供的原子操作和过期机制来管理分布式环境中的锁。

使用`Redis`的`SETNX`命令来设置锁。`SETNX`命令会尝试在 `Redis`中设置一个键值对，仅当该键不存在时才成功设置。成功设置的同时，锁被认为已经获取。
锁的键通常会设置一个值，例如节点`ID`，来标识持锁的节点。可以结合`EX`参数设置锁的过期时间，防止锁被长时间占用。

节点请求获取锁时，使用`SET`命令的`NX`选项和`EX`选项。
例如，`SET lock_key node_id NX PX 30000`将设置键`lock_key`的值为`node_id`，如果键不存在，并将键的过期时间设置为30000毫秒。

当释放锁时，节点会检查锁的持有者是否匹配，只有匹配的情况下才会删除锁。
例如，使用`DEL`命令删除锁键。在实际实现中，可能会结合`Lua`脚本来保证删除操作的原子性，防止其他节点同时删除锁。

### 方式一
使用`Redis` `SETNX`命令来设置锁。
> SETNX 是SET IF NOT EXISTS的简写.日常命令格式是SETNX key value，如果 key不存在，则SETNX成功返回1，如果这个key已经存在了，则返回0。
```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    // 保证value值唯一,这里是伪代码
    final String value = "";
    final String REDIS_LOCK = "redis_lock_demo";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value);
            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);
    
            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }
    
            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            redisTemplate.delete(REDIS_LOCK);
        }
    }
}
```
需要注意的是`redisTemplate.delete()`方法要加在`finally`中是为了程序出现异常不释放锁。
但是这种写法会有一个问题，如果`Redis`服务器宕机了，或`Redis`服务被其他人`kill`掉了，此时恰好没有执行`finally`中的代码，就会造成`Redis`中永远都会存在这把锁，不会释放。

### 方式二
针对上面`Redis`宕机的问题，我们可以对这个`key`加一个过期时间，来解决。
```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    // 保证value值唯一,这里是伪代码
    final String value = "";
    final String REDIS_LOCK = "redis_lock_demo";
    public void context(){
        try {   
            // 加锁
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value);
            // 设置过期时间，假设为10s
            redisTemplate.expire(REDIS_LOCK,10, TimeUnit.SECONDS);
    
            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);
    
            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }
    
            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            redisTemplate.delete(REDIS_LOCK);
        }
    }
}
```
上面的代码虽然解决了`Redis`宕机的问题，但是也带来了一个新的问题，设置过期时间和加锁并不再一行，即是非原子操作。
举个例子，如果执行完`SETNX`加锁，正要执行`expire`设置过期时间时，进程要重启维护了，那么这个锁就“长生不老”了，别的线程永远获取不到锁了。

### 方式三
针对上面加锁和设置过期时间的问题，我们可以使用`Redis`提供的一个方法，使其具备原子性。
```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    // 保证value值唯一,这里是伪代码
    final String value = "";
    final String REDIS_LOCK = "redis_lock_demo";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value, 10, TimeUnit.SECONDS);

            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            redisTemplate.delete(REDIS_LOCK);
        }
    }
}
```
加过期时间释放锁的这种方式会带来另一个问题，某个线程加锁，然后执行业务代码，业务代码执行的时间超过了限定时间，此时Redis会释放锁，然后第二个请求就进来了，此时第一个线程业务代码执行完毕，执行释放锁步骤。这就造成误删除其他线程的锁。
简单说就是，张冠李戴，当前线程删除了其他线程的锁。

### 方式四
针对方式三带来的问题，需要加一个判断，来避免误删除其他线程的锁。
```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value, 10, TimeUnit.SECONDS);

            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            // 判断是否是当前线程，如果是当前线程则允许释放锁
            if (redisTemplate.opsForvalue().get(REDIS_LOCK).equalsIgnoreCase(value)){
                redisTemplate.delete(REDIS_LOCK);
            }
        }
    }
}
```
实际上这种方式判断和删除的操作不是原子的，不是原子性的就会出现问题。即该锁没有保存持有者的唯一标识，可能被别的客户端解锁。

### 方式五
针对方式四的问题，Redis官网有推荐的解决方法，即，使用[Lua脚本](http://www.redis.cn/commands/set)。
```lua
if redis.call('setnx',KEYS[1],ARGV[1]) == 1 then
   redis.call('expire',KEYS[1],ARGV[2])
else
   return 0
end;
```

```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
        try {
            Boolean flag =  redisTemplate.opsForValue().setIfAbsent(REDIS_LOCK,value, 10, TimeUnit.SECONDS);

            if (!flag) {
                System.out.println("抢锁失败！");
            }
            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            // 伪代码
            JRedis = jedis = JRedisUtils.getJRedis();

            String lua_scripts =
                    "if redis.call('setnx',KEYS[1],ARGV[1]) == 1 then\n" +
                    "   redis.call('expire',KEYS[1],ARGV[2])\n" +
                    "else\n" +
                    "   return 0\n" +
                    "end;";
            Object result = jedis.eval(lua_scripts, Collections.singletonList(REDIS_LOCK), Collections.singletonList(value))
            if (result.equals("1")) {
                System.out.println("删除key成功");
            }
                    
            if (jedis != null) {
                jedis.close();
            }

            if (redisTemplate.opsForvalue().get(REDIS_LOCK).equalsIgnoreCase(value)){
                redisTemplate.delete(REDIS_LOCK);
            }
        }
    }
}
```
除了用这中方式，也可以用Redis事务来处理方式四带来的问题。
对于上面的解决方法，其实并没有真正的解决缓存续期的问题，还是会带来能存在锁过期释放，业务没执行完的问题。

### 方式六
针对缓存续期的问题，我们可以开一个守护线程，每隔一段时间检查锁是否还存在，存在则对锁的过期时间延长，防止锁过期提前释放。
`Redisson`框架解决了这个问题。
```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redisson;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
        RLock lock = redisson.getLock(REDIS_LOCK);
        try {
            lock.lock(REDIS_LOCK);

            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            lock.unlock();
        }
    }
}
```
`Redisson`大致工作原理，只要线程加锁成功，就会启动一个`watch dog`看门狗，它是一个后台线程，会每隔10秒检查一下，如果线程还持有锁，那么就会不断的延长锁key的生存时间。
因此，`Redisson`解决了锁过期释放，业务没执行完问题。

![Redis详解-011](/iblog/posts/annex/images/essays/Redis详解-011.png)

看似完美的解决方案，但是在高并发下可能也会出现下面的异常：
```text
Caused by: java.lang.IllegalMonitorStateException: attempt to unlock lock, not locked by current thread by node id: 32caba49-5799-491b-aa7b-47d789dbca93 thread-id: 1
```
异常出现的原因，加锁和解锁的线程不是同一个。

### 方式七
针对上面的异常，需要判断当前线程是否持有锁，如果还持有则释放，如果未持有则说明已被释放。
```java
public class RedisDistributedLock {
    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private RedissonClient redisson;

    final String REDIS_LOCK = "redis_lock_demo";
    // 保证value值唯一,这里是伪代码
    final String value = "";
    public void context(){
         RLock lock = redisson.getLock(REDIS_LOCK);
        try {
            lock.lock(REDIS_LOCK);

            String redisKey =  redisTemplate.opsForvalue().get("redis_key");
            int num0 = redisKey == null ? 0 : Integer.parseInt(redisKey);

            if (num0 <= 0){
                System.out.println("商品已售完！");
                return;
            }

            // 卖出商品，存入Redis中
            int num1  = num0 - 1;
            redisTemplate.opsForvalue().set("redis_key",num1);
        }finally {
            // 查询当前线程是否持有此锁
            if (lock.isLocked() && lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
    }
}
```
这样写，程序的健壮性会更好，代码会更加严谨。