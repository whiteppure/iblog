---
title: "SpringBoot整合Validator"
date: 2023-07-01
draft: false
tags: ["springboot","spring"]
slug: "springboot-validator"
---


## 常见参数校验
在日常的接口开发中，为了防止非法参数对业务造成影响，经常需要对接口的参数做校验。最简单就是用`if`条件语句来判断，但是随着参数越来越多，业务越来越复杂，判断参数代码语句显得尤为冗长。
或者有些程序会将`if`封装起来，例如Spring中的`Assert`类。但归根结底还是靠代码对接口参数一个一个校验，这样太繁琐了，而且如果参数太多代码可读性比较差。
```java
@Slf4j
@RequestMapping("/Chapter1")
@RestController
public class ValidatedCaseController1 {


    @PostMapping("/case1")
    public R<Boolean> case1(UserEntity1 userEntity){
        String username = userEntity.getUsername();
        if (CharSequenceUtil.isBlank(username)){
            return R.failed("用户名不能为空");
        }
        return R.ok(true);
    }


    @PostMapping("/case2")
    public R<Boolean> case2(UserEntity1 userEntity){
        String username = userEntity.getUsername();
        Assert.notNull(username,"用户名不能为空");
        return R.ok(true);
    }

}
```

## Validator框架入门
Validator就是为了解决参数校验的一种框架。Validator框架是Java中用于验证对象的框架，通常用于确保数据的合法性和完整性。
Validator框架通常与注解一起使用，例如`@NotNull`、`@Min`、`@Max`等，用于标记字段或方法参数，并定义验证规则。
完整代码示例参见[gitee](https://gitee.com/gitee_pikaqiu/easy-archetype/tree/master/easy-demo/src/main/java/com/whitepure/demo/validated)。

Validator框架入门，包括引入依赖、创建controller、创建校验实体、错误异常处理。

### pom依赖
从SpringBoot2.3开始，校验包被独立成了一个starter组件，所以需要引入`validation`和`web`，而`springboot-2.3`之前的版本只需要引入`web`依赖就可以了.
```xml
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-validation</artifactId>
</dependency>
```

### UserEntity1
```java
/**
 * 常用校验注解
 * JSR提供的校验注解：
 * @Null 被注释的元素必须为 null
 * @NotNull 被注释的元素必须不为 null
 * @AssertTrue 被注释的元素必须为 true
 * @AssertFalse 被注释的元素必须为 false
 * @Min(value) 被注释的元素必须是一个数字，其值必须大于等于指定的最小值
 * @Max(value) 被注释的元素必须是一个数字，其值必须小于等于指定的最大值
 * @DecimalMin(value) 被注释的元素必须是一个数字，其值必须大于等于指定的最小值
 * @DecimalMax(value) 被注释的元素必须是一个数字，其值必须小于等于指定的最大值
 * @Size(max=, min=)   被注释的元素的大小必须在指定的范围内
 * @Digits (integer, fraction)     被注释的元素必须是一个数字，其值必须在可接受的范围内
 * @Past 被注释的元素必须是一个过去的日期
 * @Future 被注释的元素必须是一个将来的日期
 * @Pattern(regex=,flag=) 被注释的元素必须符合指定的正则表达式
 *
 */
@Data
public class UserEntity1 {

    @NotNull(message = "id不能为空")
    private Integer id;

    @NotBlank(message = "用户名不能为空")
    private String username;

    @Size(max = 10,min = 7,message = "密码位数必须在7-10位")
    @NotBlank(message = "密码不能为空")
    private String password;

    @NotBlank(message = "企业名称不能为空")
    private String enterpriseName;

    @Null
    private Integer contactId;

    @Null
    private BigDecimal money;

    @Email(message = "电子邮箱不能为空")
    private String email;

    @NotBlank(message = "手机号不能为空")
    private String mobile;

}
```

### ValidatedCaseController1
```java
@Slf4j
@RequestMapping("/Chapter1")
@RestController
public class ValidatedCaseController1 {


    @PostMapping("/case3")
    public R<Boolean> case3(@RequestBody @Validated UserEntity1 userEntity) {
        log.info("userEntity=>{}", userEntity);
        return R.ok(true);
    }

}
```

发起请求测试接口
```.http request
POST http://localhost:8080/Chapter1/case3
Content-Type: application/json

{
  "id": "1",
  "username": "111",
  "password": "123",
  "enterpriseName": "1112",
  "contactId": "",
  "money": "",
  "email": "",
  "mobile": "123123"
}
```

### ValidatedExceptionAdvice
```java
@Slf4j
@RestControllerAdvice(basePackages = {"com.whitepure.demo.validated"})
public class ValidatedExceptionAdvice {


    /**
     * json格式参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error(e.getMessage(), e);
        return R.failed(Objects.requireNonNull(e.getBindingResult().getFieldError()).getDefaultMessage());
    }


    @ExceptionHandler(Exception.class)
    public R<String> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        log.error("请求地址'{}',发生未知异常.", requestUri, e);
        return R.failed(e.getMessage().length() > 1000 ? "系统错误" : e.getMessage());
    }

}
```

## Validator框架进阶
Validator框架进阶，包括自定义校验注解、Validator分组校验，对象嵌套校验，表单格式校验。

### UserEntity2
```java
@Data
public class UserEntity2 {

    @NotNull(message = "id不能为空",groups = ValidGroup.Crud.Update.class)
    @Null(groups = ValidGroup.Crud.Create.class,message = "id添加时必须为null")
    private Integer id;

    @NotBlank(message = "用户名不能为空",groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    private String username;

    @Password(groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    private String password;

    @NotBlank(message = "企业名称不能为空")
    @Chinese(message = "企业名称只能为中文")
    private String enterpriseName;

    @Null(groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    private Integer contactId;

    @NotNull(message = "日期不能为null")
    @Past(message = "当前日期必须是过期的一个日期",groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    private Date yesterday;

    @NotNull(message = "展示不能为null")
    @AssertTrue(message = "展示字段必须为true",groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    private Boolean isShow;

    @Email(message = "电子邮箱不合法",groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    @NotBlank(message = "电子邮箱不能为空")
    private String email;

    @Mobile(groups = {ValidGroup.Crud.Update.class, ValidGroup.Crud.Create.class})
    private String mobile;

    @Size(max = 3, min = 1, message = "图片为1-3张")
    @NotNull(message = "图片不能为空")
    private List<String> imgs;

    @Valid
    @NotNull(groups = {ValidGroup.Crud.Create.class, ValidGroup.Crud.Update.class}, message = "工作对象不能为空")
    private Job job;

    @Data
    public static class Job {

        @NotNull(groups = {ValidGroup.Crud.Update.class}, message = "工作id不能为空")
        @Min(value = 1, groups = ValidGroup.Crud.Update.class)
        private Long jobId;

        @NotNull(groups = {ValidGroup.Crud.Create.class, ValidGroup.Crud.Update.class}, message = "工作名称不能为空")
        @Length(min = 2, max = 10, groups = {ValidGroup.Crud.Create.class, ValidGroup.Crud.Update.class},message = "工作名称.2-10位之间")
        private String jobName;

        @NotNull(groups = {ValidGroup.Crud.Create.class, ValidGroup.Crud.Update.class}, message = "工作职务不能为空")
        @Length(min = 2, max = 10, groups = {ValidGroup.Crud.Create.class, ValidGroup.Crud.Update.class},message = "工作职务.2-10位之间")
        private String position;
    }

}
```

### 自定义校验注解
```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD,ElementType.PARAMETER})
@Constraint(validatedBy = ChineseValidator.class)
public @interface Chinese {

    String[] value() default {};

    String message() default "请输入中文";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String regexp() default ".*";

}


public class ChineseValidator implements ConstraintValidator<Chinese, String> {

    @SneakyThrows
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || StringPool.EMPTY.equals(value)){
            return false;
        }
        return Pattern.compile(PatternPool.CHINESE_PATTERN, Pattern.CASE_INSENSITIVE).matcher(value).matches();
    }
    
}
```

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD,ElementType.PARAMETER})
@Constraint(validatedBy = MobileValidator.class)
public @interface Mobile {

    String[] value() default {};

    String message() default "手机号不合法";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String regexp() default ".*";

}


public class MobileValidator implements ConstraintValidator<Mobile, String> {

    @SneakyThrows
    @Override
    public boolean isValid(String value, ConstraintValidatorContext context) {
        if (value == null || StringPool.EMPTY.equals(value)){
            return false;
        }
        return Pattern.compile(PatternPool.MOBILE_PATTERN, Pattern.CASE_INSENSITIVE).matcher(value).matches();
    }

}
```

```java
@Documented
@Retention(RetentionPolicy.RUNTIME)
@Target({ElementType.FIELD,ElementType.PARAMETER})
@Constraint(validatedBy = PasswordValidated.class)
public @interface Password {

    String[] value() default {};

    String message() default "密码不合法.以字母开头，长度在6~18之间，只能包含字符、数字和下划线。";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};

    String regexp() default ".*";

}

public class PasswordValidated implements ConstraintValidator<Password, String> {

    @Override
    public boolean isValid(String value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null || StringPool.EMPTY.equals(value)){
            return false;
        }
        return Pattern.compile(PatternPool.PASSWORD_PATTERN, Pattern.CASE_INSENSITIVE).matcher(value).matches();
    }

}
```

```java
public interface PatternPool {

    String MOBILE_PATTERN = "^((13[0-9])|(14[5,7,9])|(15([0-3]|[5-9]))|(16[5,6])|(17[0-8])|(18[0-9])|(19[1、5、8、9]))\\d{8}$";

    String CHINESE_PATTERN = "^[\\u4e00-\\u9fa5]{0,}$";

    String PASSWORD_PATTERN = "^[a-zA-Z]\\w{5,17}$";
}
```

### ValidGroup
```java
public interface ValidGroup extends Default {

    interface Crud extends ValidGroup{
        interface Create extends Crud{

        }

        interface Update extends Crud{

        }

        interface Query extends Crud{

        }

        interface Delete extends Crud{

        }
    }
}
```

### ValidatedCaseController2
```java
@Slf4j
@RequestMapping("/Chapter2")
@RestController
public class ValidatedCaseController2 {

    @PostMapping("/case1")
    public R<Boolean> case1(@RequestBody @Validated(ValidGroup.Crud.Create.class) UserEntity2 userEntity) {
        log.info("userEntity=>{}", userEntity);
        return R.ok(true);
    }


    @PostMapping("/case2")
    public R<Boolean> case2(@RequestBody @Validated(ValidGroup.Crud.Update.class) UserEntity2 userEntity) {
        log.info("userEntity=>{}", userEntity);
        return R.ok(true);
    }

}
```

发起请求测试接口
```.http request
POST http://localhost:8080/Chapter2/case1
Content-Type: application/json

{
  "id": "",
  "username": "111",
  "password": "a1231123121",
  "enterpriseName": "企业名称",
  "contactId": "",
  "email": "11123@qq.com",
  "yesterday": "2023-06-30",
  "isShow": "true",
  "mobile": "18830281211"
}
```

### ValidatedCaseController3
表单格式参数校验

```java
@Slf4j
@RequestMapping("/Chapter3")
@RestController
@Validated
public class ValidatedCaseController3 {


    @PostMapping("/case1")
    public R<Boolean> case1(
            @NotBlank(message = "用户名称不能为空") String username,
            @NotBlank(message = "密码不能为空") String password,
            @NotNull(message = "联系人id不能为空") Integer cid
    ) {
        log.info("username=>{}", username);
        return R.ok(true);
    }

}
```

发起请求测试接口
```.http request
POST http://localhost:8080/Chapter3/case1
```

### ValidatedExceptionAdvice
```java
@Slf4j
@RestControllerAdvice(basePackages = {"com.whitepure.demo.validated"})
public class ValidatedExceptionAdvice {

    /**
     * json格式参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public R<String> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        log.error(e.getMessage(), e);
        return R.failed(Objects.requireNonNull(e.getBindingResult().getFieldError()).getDefaultMessage());
    }

    /**
     * 表单格式参数验证异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public R<String> handleMethodArgumentNotValidException(ConstraintViolationException e) {
        log.error(e.getMessage(), e);
        return R.failed(e.getMessage());
    }

    @ExceptionHandler(Exception.class)
    public R<String> handleRuntimeException(RuntimeException e, HttpServletRequest request) {
        String requestUri = request.getRequestURI();
        log.error("请求地址'{}',发生未知异常.", requestUri, e);
        return R.failed(e.getMessage().length() > 1000 ? "系统错误" : e.getMessage());
    }

}
```
