---
title: "Java整合支付功能"
date: 2023-08-10
draft: false
tags: ["应用","设计","Java","小程序"]
slug: "pay-code"
---


## 结构
![整合支付功能](/iblog/posts/annex/images/essays/整合支付功能-01.jpg)

完整代码：[https://gitee.com/gitee_pikaqiu/easy-archetype](https://gitee.com/gitee_pikaqiu/easy-archetype)
## pom.xml
```xml
<dependencies>
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
        <groupId>com.alipay.sdk</groupId>
        <artifactId>alipay-sdk-java</artifactId>
        <version>4.9.9</version>
    </dependency>

    <dependency>
        <groupId>com.github.binarywang</groupId>
        <artifactId>weixin-java-pay</artifactId>
        <version>4.5.0</version>
    </dependency>

</dependencies>
```
## application.yml
```yaml
server:
  port: 8080

pay:
  wechat:
    #微信公众号或者小程序等的appid
    appId: ""
    #微信支付商户号
    mchId: ""
    #微信支付商户密钥
    mchKey: ""
    #服务商模式下的子商户公众账号ID
    subAppId:
    #服务商模式下的子商户号
    subMchId:
    # p12证书的位置，可以指定绝对路径，也可以指定类路径（以classpath:开头）
    keyPath:
  alipay:
    # 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
    appId: ""
    # 商户私钥，您的PKCS8格式RSA2私钥
    merchantPrivateKey: ""
    # 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
    alipayPublicKey: ""
    # 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
    notifyUrl: "http://localhost:8080/ali/paymentNotify"
    # 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
    returnUrl: "http://localhost:8080/ali/paymentNotify"
    # 签名方式
    signType: "RSA2"
    # 字符编码格式
    charset: "utf-8"
    # 格式
    format: "json"
    # 支付宝网关
    gatewayUrl: "https://openapi.alipaydev.com/gateway.do"
```

## 公共部分

### PayService
```java
public interface PayService {


    /**
     * 获取支付平台类型
     *
     * @return 支付平台类型
     */
    PayPlatformTypeEnum getPayPlatformType();


    /**
     * 支付时可能存在的行为; 支付订单 查询订单 生成支付二维码 退款等
     *
     * @param orderInfo 订单信息
     * @return any
     */
    <T extends CommonPayRequest> Object apply(T orderInfo);

}
```

### PayRefundAble
```java
public interface PayRefundAble extends PayService{
}
```

### PayOrderQueryAble
```java
public interface PayOrderQueryAble extends PayService{
}
```

### PayOrderCloseAble
```java
public interface PayOrderCloseAble extends PayService{
}
```

### PaymentAble
```java
public interface PaymentAble extends PayService{
}
```

### AbstractPayService
```java
@Slf4j
public abstract class AbstractPayService<Q extends CommonPayRequest,S> implements PayService{


    @Override
    @SneakyThrows
    public Object apply(CommonPayRequest payRequest) {
        Q orderInfo = (Q) payRequest;

        // 前置处理
        log.debug("开始执行前置处理.");
        if (!preprocessing(orderInfo)) {
            throw new PayException("支付前置处理失败,不能继续执行");
        }
        log.debug("前置处理执行完毕");

        // 执行
        log.info("开始执行,请求参数 {}", JSON.toJSONString(orderInfo));
        S result = processing(orderInfo);
        log.info("执行完毕,响应参数 {}", JSON.toJSONString(result));

        // 后置处理
        log.debug("开始执行后置处理.");
        postprocessing(orderInfo);
        log.debug("后置处理执行完毕.");
        return result;
    }




    /**
     * 前置处理
     *
     * @param orderInfo 订单信息
     * @return true 通过 ; false 不通过
     */
    protected  boolean preprocessing(Q orderInfo){
        return true;
    }


    /**
     * 核心处理方法
     *
     * @param orderInfo 订单信息
     * @return 支付结果
     */
    protected abstract S processing(Q orderInfo) throws PayException;


    /**
     * 后置处理
     *
     * @param orderInfo 订单信息
     */
    protected void postprocessing(Q orderInfo){
    }


}
```
### CommonPayRequest
```java
public interface CommonPayRequest {


    /**
     * 获取平台类型
     */
    PayPlatformTypeEnum getPayTypeEnum();


}
```

### PayPlatformTypeEnum
```java
public enum PayPlatformTypeEnum {

    // 支付平台
    ALIPAY,
    WECHAT,

}
```

### PayFacade
```java
public interface PayFacade {


    /**
     * 支付调用接口（指定操作传入class，传入请求参数）
     *
     * @param <T>       支付操作类型 {@linkplain  PayService}
     * @param orderInfo 订单信息
     */
    <T extends PayService> Object execute(Class<T> payClass, CommonPayRequest orderInfo);
}
```

### PayFacadeImpl
```java
@Slf4j
@Component
public class PayFacadeImpl implements PayFacade {

    
    @Override
    public  <T extends PayService> Object execute(Class<T> payClass, CommonPayRequest orderInfo){
        Optional<T> payItem = new ArrayList<>(SpringUtil.getBeansOfType(payClass).values())
                .stream()
                .filter(item -> item.getPayPlatformType().equals(orderInfo.getPayTypeEnum()))
                .findFirst();
        log.info("支付行为[{}],调用平台类型[{}]",payClass.getSimpleName(),orderInfo.getPayTypeEnum());

        @SuppressWarnings("unchecked")
        Optional<PayService> payService = (Optional<PayService>) payItem;
        if (payService.isPresent()) {
            return payService.get().apply(orderInfo);
        }
        throw new IllegalArgumentException("未获取到支付平台类型");
    }


}
```

### PayException
```java
public class PayException extends RuntimeException{


    private String msg;

    public PayException(String message) {
        super(message);
        this.msg = message;
    }

    public PayException(String message, Throwable cause) {
        super(message, cause);
        this.msg = message;
    }

}
```

## 支付宝

### AlipayRefundService
```java
@Service
public class AlipayRefundService extends AbstractPayService<AlipayRefundRequest,AlipayTradeRefundResponse> implements PayRefundAble {

    @Autowired
    private AlipayClient alipayClient;

    @Override
    protected AlipayTradeRefundResponse processing(AlipayRefundRequest orderInfo) throws PayException {
        AlipayTradeRefundRequest alipayRequest = new AlipayTradeRefundRequest ();
        alipayRequest.setBizContent(JSON.toJSONString(orderInfo));
        AlipayTradeRefundResponse response = null;
        try {
            response = alipayClient.execute(alipayRequest);
        } catch (AlipayApiException e) {
            throw new PayException(e.getMessage(),e);
        }
        if (response.isSuccess()) {
            // 退款成功
            return response;
        }
        return response;
    }


    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.ALIPAY;
    }


}
```

### AlipayPayOrderQueryService
```java
@Slf4j
@Service
public class AlipayPayOrderQueryService extends AbstractPayService<AlipayQueryOrderRequest,AlipayTradeQueryResponse> implements PayOrderQueryAble {


    @Autowired
    private AlipayClient alipayClient;


    @Override
    protected AlipayTradeQueryResponse processing(AlipayQueryOrderRequest orderInfo) throws PayException {
        AlipayTradeQueryRequest alipayRequest = new AlipayTradeQueryRequest();
        alipayRequest.setBizContent(JSON.toJSONString(orderInfo));
        AlipayTradeQueryResponse response = null;
        try {
            response = alipayClient.execute(alipayRequest);
        } catch (AlipayApiException e) {
            throw new PayException(e.getMessage(),e);
        }
        if (response.isSuccess()) {
            // 支付成功
            return response;
        }
        return response;
    }


    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.ALIPAY;
    }
}
```

### AlipayPaymentService
```java
@Slf4j
@Service
public class AlipayPaymentService extends AbstractPayService<AlipayPaymentRequest, AlipayTradePagePayResponse> implements PaymentAble {


    @Autowired
    private AlipayClient alipayClient;

    @Autowired
    private AlipayProperties aliPayProperties;


    protected AlipayTradePagePayRequest buildUnifiedOrderRequest(AlipayPaymentRequest alipayPaymentRequest) {
        AlipayTradePagePayRequest alipayRequest = new AlipayTradePagePayRequest();
        alipayRequest.setReturnUrl(aliPayProperties.getReturnUrl());
        alipayRequest.setNotifyUrl(aliPayProperties.getNotifyUrl());
        alipayRequest.setBizContent(JSON.toJSONString(alipayPaymentRequest));
        return alipayRequest;
    }


    @Override
    protected AlipayTradePagePayResponse processing(AlipayPaymentRequest alipayPaymentRequest) throws PayException {
        try {
            return alipayClient.pageExecute(buildUnifiedOrderRequest(alipayPaymentRequest));
        } catch (AlipayApiException e) {
            throw new PayException(e.getMessage(), e);
        }
    }


    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.ALIPAY;
    }


}
```

### AlipayOrderCloseService
```java
@Service
public class AlipayOrderCloseService extends AbstractPayService<AlipayOrderCloseRequest,AlipayTradeCloseResponse> implements PayOrderCloseAble {


    @Autowired
    private AlipayClient alipayClient;


    @Override
    protected AlipayTradeCloseResponse processing(AlipayOrderCloseRequest orderInfo) throws PayException {
        AlipayTradeCloseRequest alipayRequest = new AlipayTradeCloseRequest();
        alipayRequest.setBizContent(JSON.toJSONString(orderInfo));
        AlipayTradeCloseResponse response = null;
        try {
            response = alipayClient.execute(alipayRequest);
        } catch (AlipayApiException e) {
            throw new PayException(e.getMessage(),e);
        }
        if (response.isSuccess()) {
            // 关闭成功
            return response;
        }
        return response;
    }



    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.ALIPAY;
    }


}
```

### AliApp
```java
@Service
public class AliApp extends AlipayPaymentService {

    @Override
    protected AlipayTradePagePayRequest buildUnifiedOrderRequest(AlipayPaymentRequest alipayPaymentRequest) {
        alipayPaymentRequest.setProduct_code("QUICK_MSECURITY_PAY");
        return super.buildUnifiedOrderRequest(alipayPaymentRequest);
    }


}
```

### AliH5
```java
@Service
public class AliH5 extends AlipayPaymentService {

    @Override
    protected AlipayTradePagePayRequest buildUnifiedOrderRequest(AlipayPaymentRequest alipayPaymentRequest) {
        alipayPaymentRequest.setProduct_code("QUICK_WAP_WAY");
        return super.buildUnifiedOrderRequest(alipayPaymentRequest);
    }


}
```

### AliPc
```java
@Service
public class AliPc extends AlipayPaymentService {

    @Override
    protected AlipayTradePagePayRequest buildUnifiedOrderRequest(AlipayPaymentRequest alipayPaymentRequest) {
        alipayPaymentRequest.setProduct_code("FAST_INSTANT_TRADE_PAY");
        return super.buildUnifiedOrderRequest(alipayPaymentRequest);
    }

}

```

### AlipayOrderCloseRequest
```java
@Data
@Accessors(chain = true)
public class AlipayOrderCloseRequest implements CommonPayRequest {

    /**
     * 该交易在支付宝系统中的交易流水号
     */
    private String trade_no;

    /**
     * 订单支付时传入的商户订单号,和支付宝交易号不能同时为空。 trade_no,out_trade_no如果同时存在优先取trade_no
     */
    private String out_trade_no;


    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.ALIPAY;

    }

}
```

### AlipayPaymentRequest
```java
@Data
@Accessors(chain = true)
public class AlipayPaymentRequest implements CommonPayRequest {

    /**
     * 商户订单号
     */
    private String out_trade_no;

    /**
     * 订单名称
     */
    private String subject;

    /**
     * 付款金额
     */
    private String total_amount;

    /**
     * 商品描述
     */
    private String body;

    /**
     * 超时时间参数
     */
    private String timeout_express = "60m";

    /**
     * 产品编号
     */
    private String product_code;

    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.ALIPAY;
    }

}
```

### AlipayQueryOrderRequest
```java
@Data
@Accessors(chain = true)
public class AlipayQueryOrderRequest implements CommonPayRequest {


    /**
     * 商户订单号;
     */
    private String out_trade_no;


    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.ALIPAY;
    }


}
```

### AlipayRefundRequest
```java
@Data
@Accessors(chain = true)
public class AlipayRefundRequest implements CommonPayRequest {

    /**
     * 支付宝交易号
     */
    private String trade_no;

    /**
     * 商户订单号
     */
    private String out_trade_no;

    /**
     * 退款请求号
     */
    private String out_request_no;

    /**
     * 退款金额
     */
    private String refund_amount;


    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.ALIPAY;
    }

}
```

### AlipayConfiguration
```java
@Configuration
@EnableConfigurationProperties(AlipayProperties.class)
@AllArgsConstructor
public class AlipayConfiguration {

    private AlipayProperties aliPayProperties;


    @Bean
    public AlipayClient alipayClient() {
        return new DefaultAlipayClient(
                aliPayProperties.getGatewayUrl(),
                aliPayProperties.getAppId(),
                aliPayProperties.getMerchantPrivateKey(),
                aliPayProperties.getFormat(),
                aliPayProperties.getCharset(),
                aliPayProperties.getAlipayPublicKey(),
                aliPayProperties.getSignType()
        );
    }


}
```

### AlipayProperties
```java
@Data
@ConfigurationProperties(prefix = "pay.alipay")
public class AlipayProperties {

    /**
     * 应用ID,您的APPID，收款账号既是您的APPID对应支付宝账号
     */
    private String appId;

    /**
     * 商户私钥，您的PKCS8格式RSA2私钥
     */
    private String merchantPrivateKey;

    /**
     * 支付宝公钥,查看地址：https://openhome.alipay.com/platform/keyManage.htm 对应APPID下的支付宝公钥。
     */
    private String alipayPublicKey;

    /**
     * 服务器异步通知页面路径  需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
     */
    private String notifyUrl;

    /**
     * 页面跳转同步通知页面路径 需http://格式的完整路径，不能加?id=123这类自定义参数，必须外网可以正常访问
     */
    private String returnUrl;

    /**
     * 签名方式
     */
    private String signType;

    /**
     * 字符编码格式
     */
    private String charset;

    /**
     * 格式
     */
    private String format;

    /**
     * 支付宝网关
     */
    private String gatewayUrl;


}
```

## 微信

### WxpayRefundService
```java
@Service
public class WxpayRefundService extends AbstractPayService implements PayRefundAble {

    @Autowired
    protected WxPayService wxPayService;


    @Override
    protected Object processing(CommonPayRequest orderInfo) throws PayException {
        WxRefundRequest wxRefundRequest = (WxRefundRequest) orderInfo;
        WxPayRefundRequest refundRequest = new WxPayRefundRequest();
        refundRequest.setOutRefundNo(wxRefundRequest.getOutRefundNo());
        refundRequest.setRefundAccount(wxRefundRequest.getRefundAccount());
        refundRequest.setRefundDesc(wxRefundRequest.getRefundDesc());
        refundRequest.setRefundFee(wxRefundRequest.getRefundFee());
        refundRequest.setNotifyUrl(wxRefundRequest.getNotifyUrl());
        refundRequest.setRefundFeeType(wxRefundRequest.getRefundFeeType());
        refundRequest.setTransactionId(wxRefundRequest.getTransactionId());
        refundRequest.setOutRefundNo(wxRefundRequest.getOutTradeNo());
        refundRequest.setTotalFee(wxRefundRequest.getTotalFee());

        try {
            return wxPayService.refund(refundRequest);
        } catch (WxPayException e) {
            throw new PayException(e.getMessage(),e);
        }
    }




    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.WECHAT;
    }


}
```

### WxpayPaymentService
```java
@Slf4j
@Service
public class WxpayPaymentService extends AbstractPayService implements PaymentAble {


    @Autowired
    protected WxPayService wxPayService;


    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.WECHAT;
    }


    protected WxPayUnifiedOrderRequest buildUnifiedOrderRequest(WxpayPaymentRequest wxpayOrder) {
        // 微信统一下单请求对象
        WxPayUnifiedOrderRequest request = new WxPayUnifiedOrderRequest();
        request.setOutTradeNo(wxpayOrder.getOut_trade_no());
        request.setBody(wxpayOrder.getBody());
        request.setFeeType(wxpayOrder.getFee_type());
        request.setTotalFee(Integer.valueOf(wxpayOrder.getTotal_fee()));
        request.setSpbillCreateIp(wxpayOrder.getSpbill_create_ip());
        request.setNotifyUrl(wxpayOrder.getNotify_url());
        request.setProductId(String.valueOf(System.currentTimeMillis()));
        request.setTimeExpire(wxpayOrder.getTime_expire());
        request.setTimeStart(wxpayOrder.getTime_start());
        request.setProfitSharing("Y");
        return request;
    }


    @Override
    protected Object processing(CommonPayRequest orderInfo) throws PayException {
        try {
            return wxPayService.unifiedOrder(buildUnifiedOrderRequest((WxpayPaymentRequest) orderInfo));
        } catch (WxPayException e) {
            throw new PayException(e.getMessage(),e);
        }
    }


}
```

### WxpayOrderQueryService
```java
@Service
public class WxpayOrderQueryService extends AbstractPayService implements PayOrderQueryAble {

    @Autowired
    private WxPayService wxPayService;

    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.WECHAT;
    }


    @Override
    protected Object processing(CommonPayRequest orderInfo) throws PayException {
        WxOrderQueryRequest wxQueryOrder = (WxOrderQueryRequest) orderInfo;
        WxPayOrderQueryRequest req = new WxPayOrderQueryRequest();
        req.setSubMchId(wxQueryOrder.getSubMchId());
        req.setSubAppId(wxQueryOrder.getSubMchAppId());
        req.setOutTradeNo(wxQueryOrder.getPayOrderId());
        WxPayOrderQueryResult result;
        try {
            result = wxPayService.queryOrder(req);
        } catch (WxPayException e) {
            throw new PayException("微信订单查询异常", e);
        }
        // 根据状态判断
        if ("SUCCESS".equals(result.getTradeState())) {
            // 支付成功
            return result;
        } else if ("USERPAYING".equals(result.getTradeState())) {
            // 支付中，等待用户输入密码
            return result;
        } else if ("CLOSED".equals(result.getTradeState()) || "REVOKED".equals(result.getTradeState()) || "PAYERROR".equals(result.getTradeState())) {
            // CLOSED—已关闭， REVOKED—已撤销(刷卡支付), PAYERROR--支付失败(其他原因，如银行返回失败) 支付失败
            return result;
        } else {
            // unknow
            return result;
        }
    }


}
```

### WxpayOrderCloseService
```java
@Service
public class WxpayOrderCloseService extends AbstractPayService implements PayOrderCloseAble {


    @Autowired
    private WxPayService wxPayService;

    @Override
    protected Object processing(CommonPayRequest orderInfo) throws PayException {
        WxpayOrderCloseRequest wxOrderInfo = (WxpayOrderCloseRequest) orderInfo;
        WxPayOrderCloseRequest wxPayRequest = new WxPayOrderCloseRequest();
        wxPayRequest.setOutTradeNo(wxOrderInfo.getOut_trade_no());
        WxPayOrderCloseResult result = null;
        try {
            result = wxPayService.closeOrder(wxPayRequest);
        } catch (WxPayException e) {
            throw new PayException(e.getMessage(), e);
        }
        return result;
    }


    @Override
    public PayPlatformTypeEnum getPayPlatformType() {
        return PayPlatformTypeEnum.WECHAT;
    }

}
```

### WxApp
```java
@Service
public class WxApp extends WxpayPaymentService {


    @Override
    protected WxPayUnifiedOrderRequest buildUnifiedOrderRequest(WxpayPaymentRequest wxpayOrder) {
        WxPayUnifiedOrderRequest wxPayUnifiedOrderRequest = super.buildUnifiedOrderRequest(wxpayOrder);
        wxPayUnifiedOrderRequest.setTradeType(WxPayConstants.TradeType.APP);
        wxPayUnifiedOrderRequest.setOpenid(wxpayOrder.getOpenid());
        return wxPayUnifiedOrderRequest;
    }


}
```

### WxH5
```java
@Service
public class WxH5 extends WxpayPaymentService {



    @Override
    protected WxPayUnifiedOrderRequest buildUnifiedOrderRequest(WxpayPaymentRequest wxpayOrder) {
        WxPayUnifiedOrderRequest wxPayUnifiedOrderRequest = super.buildUnifiedOrderRequest(wxpayOrder);
        wxPayUnifiedOrderRequest.setTradeType(WxPayConstants.TradeType.MWEB);
        wxPayUnifiedOrderRequest.setOpenid(wxpayOrder.getOpenid());
        return wxPayUnifiedOrderRequest;
    }


}
```

### WxJsapi
```java
@Service
public class WxJsapi extends WxpayPaymentService {



    @Override
    protected WxPayUnifiedOrderRequest buildUnifiedOrderRequest(WxpayPaymentRequest wxpayOrder) {
        WxPayUnifiedOrderRequest wxPayUnifiedOrderRequest = super.buildUnifiedOrderRequest(wxpayOrder);
        wxPayUnifiedOrderRequest.setTradeType(WxPayConstants.TradeType.JSAPI);
        wxPayUnifiedOrderRequest.setOpenid(wxpayOrder.getOpenid());
        return wxPayUnifiedOrderRequest;
    }


}
```

### WxNative
```java
@Service
public class WxNative extends WxpayPaymentService {

    @Override
    protected WxPayUnifiedOrderRequest buildUnifiedOrderRequest(WxpayPaymentRequest wxpayOrder) {
        WxPayUnifiedOrderRequest wxPayUnifiedOrderRequest = super.buildUnifiedOrderRequest(wxpayOrder);
        wxPayUnifiedOrderRequest.setTradeType(WxPayConstants.TradeType.NATIVE);
        return wxPayUnifiedOrderRequest;
    }

}
```

### WxOrderQueryRequest
```java
@Data
@Accessors(chain = true)
public class WxOrderQueryRequest implements CommonPayRequest {

    /**
     * 支付订单号
     */
    private String payOrderId;


    // 特约商户传入
    /** 子商户ID **/
    private String subMchId;

    /** 子账户appID **/
    private String subMchAppId;


    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.WECHAT;
    }

}
```

### WxpayOrderCloseRequest
```java
@Data
@Accessors(chain = true)
public class WxpayOrderCloseRequest implements CommonPayRequest {


    /**
     * 商户订单号
     */
    private String out_trade_no;


    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.WECHAT;
    }


}
```

### WxpayPaymentRequest
```java
@Data
@Accessors(chain = true)
public class WxpayPaymentRequest implements CommonPayRequest {


    /**
     * 公众账号appid
     */
    private String appid;


    /**
     * 商户号
     */
    private String mch_id;

    /**
     * 商品描述
     */
    private String body;


    /**
     * 附加数据; 在查询API和支付通知中原样返回，可作为自定义参数使用。
     */
    private String attach;

    /**
     * 商户订单号; 要求32个字符内（最少6个字符），只能是数字、大小写字母_-|*且在同一个商户号下唯一
     */
    private String out_trade_no;

    /**
     * 总金额(分)
     */
    private String total_fee;

    /**
     * 默认人民币：CNY
     */
    private String fee_type;


    /**
     * 交易起始时间 格式为yyyyMMddHHmmss
     */
    private String time_start;


    /**
     * 交易结束时间 格式为yyyyMMddHHmmss
     */
    private String time_expire;

    /**
     * 交易类型;
     * JSAPI -JSAPI支付
     * NATIVE -Native支付
     * APP -APP支付
     */
    private String trade_type;


    /**
     * 商品ID; trade_type=NATIVE时，此参数必传
     */
    private String product_id;

    /**
     * 用户标识; trade_type=JSAPI时（即JSAPI支付），此参数必传
     */
    private String openid;

    /**
     * 是否分账 不传默认不分账
     * <p>
     * Y-是，需要分账
     * N-否，不分账
     */
    private String profit_sharing;

    /**
     * 回调地址
     */
    private String notify_url;

    /**
     * 支持IPV4和IPV6两种格式的IP地址。用户的客户端IP
     */
    private String spbill_create_ip;

    /**
     * 随机字符串； 长度要求在32位以内
     */
    private String nonce_str;

    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.WECHAT;
    }


}
```

### WxRefundRequest
```java
@Data
@Accessors(chain = true)
public class WxRefundRequest implements CommonPayRequest {

    /**
     * 微信支付订单号
     */
    private String transactionId;
    /**
     * 商户订单号
     */
    private String outTradeNo;

    /**
     * 商户退款单号
     */
    private String outRefundNo;
    /**
     * 订单金额
     */
    private Integer totalFee;
    /**
     * 退款金额
     */
    private Integer refundFee;
    /**
     * 退款货币种类
     */
    private String refundFeeType;
    /**
     * 退款资金来源
     */
    private String refundAccount;
    /**
     * 退款原因
     */
    private String refundDesc;
    /**
     * 退款结果通知url
     */
    private String notifyUrl;

    @Override
    public PayPlatformTypeEnum getPayTypeEnum() {
        return PayPlatformTypeEnum.WECHAT;
    }
}
```

### WxpayConfiguration
```java
@Configuration
@ConditionalOnClass(WxPayService.class)
@EnableConfigurationProperties(WxpayProperties.class)
@AllArgsConstructor
public class WxpayConfiguration {

    private WxpayProperties properties;

    @Bean
    @ConditionalOnMissingBean
    public WxPayService wxService() {
        WxPayConfig payConfig = new WxPayConfig();
        payConfig.setAppId(StringUtils.trimToNull(this.properties.getAppId()));
        payConfig.setMchId(StringUtils.trimToNull(this.properties.getMchId()));
        payConfig.setMchKey(StringUtils.trimToNull(this.properties.getMchKey()));
        payConfig.setSubAppId(StringUtils.trimToNull(this.properties.getSubAppId()));
        payConfig.setSubMchId(StringUtils.trimToNull(this.properties.getSubMchId()));
        payConfig.setKeyPath(StringUtils.trimToNull(this.properties.getKeyPath()));
        // 可以指定是否使用沙箱环境
        payConfig.setUseSandboxEnv(false);
        WxPayService wxPayService = new WxPayServiceImpl();
        wxPayService.setConfig(payConfig);
        return wxPayService;
    }

}
```

### WxpayProperties
```java
@Data
@ConfigurationProperties(prefix = "pay.wechat")
public class WxpayProperties {
  /**
   * 设置微信公众号或者小程序等的appid
   */
  private String appId;

  /**
   * 微信支付商户号
   */
  private String mchId;

  /**
   * 微信支付商户密钥
   */
  private String mchKey;

  /**
   * 服务商模式下的子商户公众账号ID，普通模式请不要配置，请在配置文件中将对应项删除
   */
  private String subAppId;

  /**
   * 服务商模式下的子商户号，普通模式请不要配置，最好是请在配置文件中将对应项删除
   */
  private String subMchId;

  /**
   * apiclient_cert.p12文件的绝对路径，或者如果放在项目中，请以classpath:开头指定
   */
  private String keyPath;

  /**
   * 支付回调地址
   */
  private String payNotifyUrl;

  /**
   * 退款回调地址
   */
  private String refundNotifyUrl;

}
```

## 调用测试

### AlipayExampleController
```java
@RestController
@RequestMapping("/example/alipay")
@AllArgsConstructor
public class AlipayExampleController {

    private AlipayClient alipayClient;


    /**
     * 统一下单
     * 接口地址: https://opendocs.alipay.com/open/59da99d0_alipay.trade.page.pay
     *
     * @param request 请求对象
     * @return 返回 {@link com.alipay.api.AlipayResponse}包下的类对象
     */
    @SneakyThrows
    @PostMapping("/unifiedOrder")
    public AlipayTradePagePayResponse unifiedOrder(@RequestBody AlipayTradePagePayRequest request) {
        return alipayClient.pageExecute(request);
    }


    /**
     * 交易查询
     * 接口地址: https://opendocs.alipay.com/open/bff76748_alipay.trade.query
     *
     * @param request 请求对象
     * @return 返回 {@link com.alipay.api.AlipayResponse}包下的类对象
     */
    @SneakyThrows
    @PostMapping("/queryOrder")
    public AlipayTradeQueryResponse queryOrder(@RequestBody AlipayTradeQueryRequest request) {
        return alipayClient.pageExecute(request);
    }

    /**
     * 交易退款
     * 接口地址: https://opendocs.alipay.com/open/357441a2_alipay.trade.fastpay
     *
     * @param request 请求对象
     * @return 返回 {@link com.alipay.api.AlipayResponse}包下的类对象
     */
    @SneakyThrows
    @PostMapping("/refund")
    public AlipayTradeRefundResponse refund(@RequestBody AlipayTradeRefundRequest request) {
        return alipayClient.pageExecute(request);
    }

    /**
     * 退款查询
     * 接口地址: https://opendocs.alipay.com/open/357441a2_alipay.trade.fastpay.refund.query
     *
     * @param request 请求对象
     * @return 返回 {@link com.alipay.api.AlipayResponse}包下的类对象
     */
    @SneakyThrows
    @PostMapping("/refundQuery")
    public AlipayTradeFastpayRefundQueryResponse refundQuery(@RequestBody AlipayTradeFastpayRefundQueryRequest request) {
        return alipayClient.pageExecute(request);
    }


    /**
     * 交易关闭
     * 接口地址: https://opendocs.alipay.com/open/8dc9ebb3_alipay.trade.close
     *
     * @param request 请求对象
     * @return 返回 {@link com.alipay.api.AlipayResponse}包下的类对象
     */
    @SneakyThrows
    @PostMapping("/closeOrder")
    public AlipayTradeCloseResponse closeOrder(@RequestBody AlipayTradeCloseRequest request) {
        return alipayClient.pageExecute(request);
    }


}
```

### WxpayExampleController
```java
@RestController
@RequestMapping("/example/wxpay")
@AllArgsConstructor
public class WxpayExampleController {

    private WxPayService wxService;

    /**
     * <pre>
     * 查询订单(详见https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_2)
     * 该接口提供所有微信支付订单的查询，商户可以通过查询订单接口主动查询订单状态，完成下一步的业务逻辑。
     * 需要调用查询接口的情况：
     * ◆ 当商户后台、网络、服务器等出现异常，商户系统最终未接收到支付通知；
     * ◆ 调用支付接口后，返回系统错误或未知交易状态情况；
     * ◆ 调用被扫支付API，返回USERPAYING的状态；
     * ◆ 调用关单或撤销接口API之前，需确认支付状态；
     * 接口地址：https://api.mch.weixin.qq.com/pay/orderquery
     * </pre>
     *
     * @param transactionId 微信订单号
     * @param outTradeNo    商户系统内部的订单号，当没提供transactionId时需要传这个。
     */
    @GetMapping("/queryOrder")
    public WxPayOrderQueryResult queryOrder(@RequestParam(required = false) String transactionId,
                                            @RequestParam(required = false) String outTradeNo)
            throws WxPayException {
        return this.wxService.queryOrder(transactionId, outTradeNo);
    }

    @PostMapping("/queryOrder")
    public WxPayOrderQueryResult queryOrder(@RequestBody WxPayOrderQueryRequest wxPayOrderQueryRequest) throws WxPayException {
        return this.wxService.queryOrder(wxPayOrderQueryRequest);
    }

    /**
     * <pre>
     * 关闭订单
     * 应用场景
     * 以下情况需要调用关单接口：
     * 1. 商户订单支付失败需要生成新单号重新发起支付，要对原订单号调用关单，避免重复支付；
     * 2. 系统下单后，用户支付超时，系统退出不再受理，避免用户继续，请调用关单接口。
     * 注意：订单生成后不能马上调用关单接口，最短调用时间间隔为5分钟。
     * 接口地址：https://api.mch.weixin.qq.com/pay/closeorder
     * 是否需要证书：   不需要。
     * </pre>
     *
     * @param outTradeNo 商户系统内部的订单号
     */
    @GetMapping("/closeOrder/{outTradeNo}")
    public WxPayOrderCloseResult closeOrder(@PathVariable String outTradeNo) throws WxPayException {
        return this.wxService.closeOrder(outTradeNo);
    }

    @PostMapping("/closeOrder")
    public WxPayOrderCloseResult closeOrder(@RequestBody WxPayOrderCloseRequest wxPayOrderCloseRequest) throws WxPayException {
        return this.wxService.closeOrder(wxPayOrderCloseRequest);
    }

    /**
     * 调用统一下单接口，并组装生成支付所需参数对象.
     *
     * @param request 统一下单请求参数
     * @param <T>     请使用{@link com.github.binarywang.wxpay.bean.order}包下的类
     * @return 返回 {@link com.github.binarywang.wxpay.bean.order}包下的类对象
     */
    @PostMapping("/createOrder")
    public <T> T createOrder(@RequestBody WxPayUnifiedOrderRequest request) throws WxPayException {
        return this.wxService.createOrder(request);
    }

    /**
     * 统一下单(详见https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_1)
     * 在发起微信支付前，需要调用统一下单接口，获取"预支付交易会话标识"
     * 接口地址：https://api.mch.weixin.qq.com/pay/unifiedorder
     *
     * @param request 请求对象，注意一些参数如appid、mchid等不用设置，方法内会自动从配置对象中获取到（前提是对应配置中已经设置）
     */
    @PostMapping("/unifiedOrder")
    public WxPayUnifiedOrderResult unifiedOrder(@RequestBody WxPayUnifiedOrderRequest request) throws WxPayException {
        return this.wxService.unifiedOrder(request);
    }

    /**
     * <pre>
     * 微信支付-申请退款
     * 详见 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_4
     * 接口链接：https://api.mch.weixin.qq.com/secapi/pay/refund
     * </pre>
     *
     * @param request 请求对象
     * @return 退款操作结果
     */
    @PostMapping("/refund")
    public WxPayRefundResult refund(@RequestBody WxPayRefundRequest request) throws WxPayException {
        return this.wxService.refund(request);
    }

    /**
     * <pre>
     * 微信支付-查询退款
     * 应用场景：
     *  提交退款申请后，通过调用该接口查询退款状态。退款有一定延时，用零钱支付的退款20分钟内到账，
     *  银行卡支付的退款3个工作日后重新查询退款状态。
     * 详见 https://pay.weixin.qq.com/wiki/doc/api/jsapi.php?chapter=9_5
     * 接口链接：https://api.mch.weixin.qq.com/pay/refundquery
     * </pre>
     * 以下四个参数四选一
     *
     * @param transactionId 微信订单号
     * @param outTradeNo    商户订单号
     * @param outRefundNo   商户退款单号
     * @param refundId      微信退款单号
     * @return 退款信息
     */
    @GetMapping("/refundQuery")
    public WxPayRefundQueryResult refundQuery(@RequestParam(required = false) String transactionId,
                                              @RequestParam(required = false) String outTradeNo,
                                              @RequestParam(required = false) String outRefundNo,
                                              @RequestParam(required = false) String refundId)
            throws WxPayException {
        return this.wxService.refundQuery(transactionId, outTradeNo, outRefundNo, refundId);
    }

    /**
     * 退款查询
     * @param wxPayRefundQueryRequest 请求对象
     * @return 退款信息
     * @throws WxPayException
     */
    @PostMapping("/refundQuery")
    public WxPayRefundQueryResult refundQuery(@RequestBody WxPayRefundQueryRequest wxPayRefundQueryRequest) throws WxPayException {
        return this.wxService.refundQuery(wxPayRefundQueryRequest);
    }

    /**
     * 支付回调通知处理
     */
    @PostMapping("/notify/order")
    public String parseOrderNotifyResult(@RequestBody String xmlData) throws WxPayException {
        final WxPayOrderNotifyResult notifyResult = this.wxService.parseOrderNotifyResult(xmlData);
        // TODO 根据自己业务场景需要构造返回对象
        return WxPayNotifyResponse.success("成功");
    }

    /**
     * 退款回调通知处理
     * @param xmlData
     */
    @PostMapping("/notify/refund")
    public String parseRefundNotifyResult(@RequestBody String xmlData) throws WxPayException {
        final WxPayRefundNotifyResult result = this.wxService.parseRefundNotifyResult(xmlData);
        // TODO 根据自己业务场景需要构造返回对象
        return WxPayNotifyResponse.success("成功");
    }

    /**
     * 扫码支付回调通知处理
     */
    @PostMapping("/notify/scanpay")
    public String parseScanPayNotifyResult(String xmlData) throws WxPayException {
        final WxScanPayNotifyResult result = this.wxService.parseScanPayNotifyResult(xmlData);
        // TODO 根据自己业务场景需要构造返回对象
        return WxPayNotifyResponse.success("成功");
    }


    /**
     * <pre>
     * 扫码支付模式一生成二维码的方法
     * 二维码中的内容为链接，形式为：
     * weixin://wxpay/bizpayurl?sign=XXXXX&appid=XXXXX&mch_id=XXXXX&product_id=XXXXXX&time_stamp=XXXXXX&nonce_str=XXXXX
     * 其中XXXXX为商户需要填写的内容，商户将该链接生成二维码，如需要打印发布二维码，需要采用此格式。商户可调用第三方库生成二维码图片。
     * 文档详见: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_4
     * </pre>
     *
     * @param productId  产品Id
     * @param logoFile   商户logo图片的文件对象，可以为空
     * @param sideLength 要生成的二维码的边长，如果为空，则取默认值400
     * @return 生成的二维码的字节数组
     */
    public byte[] createScanPayQrcodeMode1(String productId, File logoFile, Integer sideLength) {
        return this.wxService.createScanPayQrcodeMode1(productId, logoFile, sideLength);
    }

    /**
     * <pre>
     * 扫码支付模式一生成二维码的方法
     * 二维码中的内容为链接，形式为：
     * weixin://wxpay/bizpayurl?sign=XXXXX&appid=XXXXX&mch_id=XXXXX&product_id=XXXXXX&time_stamp=XXXXXX&nonce_str=XXXXX
     * 其中XXXXX为商户需要填写的内容，商户将该链接生成二维码，如需要打印发布二维码，需要采用此格式。商户可调用第三方库生成二维码图片。
     * 文档详见: https://pay.weixin.qq.com/wiki/doc/api/native.php?chapter=6_4
     * </pre>
     *
     * @param productId 产品Id
     * @return 生成的二维码URL连接
     */

```

### PayTestController
```java
@Slf4j
@RestController
@RequestMapping("/example/iPay")
public class PayTestController {

    @Autowired
    private PayFacade payFacade;


    @GetMapping("/alipayUnifiedOrder")
    public String alipayUnifiedOrder() {
        payFacade.execute(PaymentAble.class,
                new AlipayPaymentRequest()
                        .setBody("商品描述")
                        .setSubject("支付宝测试商品")
                        .setTotal_amount("0.1")
                        .setOut_trade_no("2023009999999")
        );
        return "支付宝-支付-交易成功";
    }


    @RequestMapping("/alipayUnifiedOrderNotify")
    public String alipayUnifiedOrderNotify() {
        log.info("支付宝-支付回调-交易成功");
        return "交易成功！";
    }


    @GetMapping("/wxUnifiedOrder")
    public String wxUnifiedOrder() {
        payFacade.execute(PaymentAble.class,
                new WxpayPaymentRequest()
                        .setBody("微信测试商品")
                        .setTotal_fee("0.1")
                        .setOut_trade_no("2023009999999")
        );
        return "微信-支付-交易成功";
    }


    @RequestMapping("/wxUnifiedOrderNotify")
    public String wxUnifiedOrderNotify() {
        log.info("微信-支付回调-交易成功");
        return "交易成功！";
    }

}
```


