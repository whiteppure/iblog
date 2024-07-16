---
title: "SpringBoot整合Kafka"
date: 2020-08-20
draft: false
tags: ["springboot", "MQ","spring"]
slug: "springboot-kafka"
---


## Docker安装和运行Kafka
1. 获取`Kafka Docker`镜像。使用`wurstmeister/kafka`镜像，它包含了`Kafka`和`Zookeeper`。
    ```shell
    docker pull wurstmeister/kafka
    ```
2. 创建`Docker`网络。为了让`Kafka`和`Zookeeper`容器能够互相通信，我们需要创建一个`Docker`网络。
    ```shell
    docker network create kafka-net
    ```
3. 启动`Zookeeper`。`Kafka`依赖于`Zookeeper`，所以需要先启动`Zookeeper`容器。
    ```shell
    docker run -d --name zookeeper --network kafka-net -e ALLOW_ANONYMOUS_LOGIN=yes zookeeper:3.4
    ```
4. 启动`Kafka`容器，并将其连接到`Zookeeper`。
    ```shell
    docker run -d --name kafka --network kafka-net -e KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092 -e KAFKA_BROKER_ID=1 wurstmeister/kafka
    ```

## Kafka消息测试
1. 首先创建一个新主题。
    ```shell
    docker exec -it kafka bash
    # 创建一个名为 test 的主题。
    kafka-topics.sh --create --topic test --bootstrap-server localhost:9092 --partitions 1 --replication-factor 1
    ```
2. 使用`kafka-console-producer`发送消息到`test`主题。
    ```shell
    kafka-console-producer.sh --broker-list localhost:9092 --topic test
    ```
3. 使用`kafka-console-consumer`从`test`主题消费消息。
    ```shell
    kafka-console-consumer.sh --bootstrap-server localhost:9092 --topic test --from-beginning
    ```

## 引入pom依赖
```xml
<dependency>
    <groupId>org.springframework.kafka</groupId>
    <artifactId>spring-kafka</artifactId>
</dependency>
```

## application.yml配置
```yaml
server:
  port: 8080
  servlet:
    context-path: /demo
spring:
  kafka:
    bootstrap-servers: localhost:9092
    producer:
      retries: 0
      batch-size: 16384
      buffer-memory: 33554432
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.apache.kafka.common.serialization.StringSerializer
    consumer:
      group-id: spring-boot-demo
      # 手动提交
      enable-auto-commit: false
      auto-offset-reset: latest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      properties:
        session.timeout.ms: 60000
    listener:
      log-container-config: false
      concurrency: 5
      # 手动提交
      ack-mode: manual_immediate
```

## KafkaConsts
```java
public interface KafkaConsts {
    /**
     * 默认分区大小
     */
    Integer DEFAULT_PARTITION_NUM = 3;

    /**
     * Topic 名称
     */
    String TOPIC_TEST = "test";
}
```

## KafkaConfig
```java
@Configuration
@EnableConfigurationProperties({KafkaProperties.class})
@EnableKafka
@AllArgsConstructor
public class KafkaConfig {
    private final KafkaProperties kafkaProperties;

    @Bean
    public KafkaTemplate<String, String> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    @Bean
    public ProducerFactory<String, String> producerFactory() {
        return new DefaultKafkaProducerFactory<>(kafkaProperties.buildProducerProperties());
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, String> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setConcurrency(KafkaConsts.DEFAULT_PARTITION_NUM);
        factory.setBatchListener(true);
        factory.getContainerProperties().setPollTimeout(3000);
        return factory;
    }

    @Bean
    public ConsumerFactory<String, String> consumerFactory() {
        return new DefaultKafkaConsumerFactory<>(kafkaProperties.buildConsumerProperties());
    }

    @Bean("ackContainerFactory")
    public ConcurrentKafkaListenerContainerFactory<String, String> ackContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, String> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.getContainerProperties().setAckMode(ContainerProperties.AckMode.MANUAL_IMMEDIATE);
        factory.setConcurrency(KafkaConsts.DEFAULT_PARTITION_NUM);
        return factory;
    }

}
```

## MessageHandler
```java
@Component
@Slf4j
public class MessageHandler {

    @KafkaListener(topics = KafkaConsts.TOPIC_TEST, containerFactory = "ackContainerFactory")
    public void handleMessage(ConsumerRecord record, Acknowledgment acknowledgment) {
        try {
            String message = (String) record.value();
            log.info("收到消息: {}", message);
        } catch (Exception e) {
            log.error(e.getMessage(), e);
        } finally {
            // 手动提交 offset
            acknowledgment.acknowledge();
        }
    }
}
```

## KafkaApplicationTest
测试之前请确保`Kafka`已启动。
```java
@RunWith(SpringRunner.class)
@SpringBootTest
public class KafkaApplicationTest {
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;

    /**
     * 测试发送消息
     */
    @Test
    public void testSend() {
        kafkaTemplate.send(KafkaConsts.TOPIC_TEST, "hello,kafka...");
    }

}
```