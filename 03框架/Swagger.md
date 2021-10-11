



Swagger 是一个规范和完整的框架，用于生成、描述、调用和可视化 RESTful 风格的 Web 服务(https://swagger.io/)。 它的主要作用是：
1、使得前后端分离开发更加方便，有利于团队协作
2、接口的文档在线自动生成，降低后端开发人员编写接口文档的负担

## 如何使用？

项目中SpringBoot集成Swagger，Spring已经将Swagger纳入自身的标准，通过在项目中引入`Springfox` ，即可非常简单快捷的使用Swagger。

### 添加依赖

在XXXX-common项目中添加依赖，只需要在XXXX-common中进行配置即可，因为其他微服务工程都直接或间接依赖XXXX-common。

> 在pom.xml新增Swagger-ui的相关依赖

```xml
<!--Swagger-UI API文档生产工具-->
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger2</artifactId>
  <version>2.7.0</version>
</dependency>
<dependency>
  <groupId>io.springfox</groupId>
  <artifactId>springfox-swagger-ui</artifactId>
  <version>2.7.0</version>
</dependency>
```

### 在config包中添加Swagger配置类

@EnableSwagger2 ，

指定头部信息，包含标题、联系人、版本等，

扫描的Controller包

```java
package com.shanjupay.merchant.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

/**
 * @author Administrator
 * @version 1.0
 **/
@Configuration
@ConditionalOnProperty(prefix = "swagger",value = {"enable"}, havingValue = "true")
@EnableSwagger2
public class SwaggerConfiguration {

    @Bean
    public Docket buildDocket() {
        return new Docket(DocumentationType.SWAGGER_2)
                .apiInfo(buildApiInfo())
                .select()
                // 要扫描的API(Controller)基础包
                .apis(RequestHandlerSelectors.
                      basePackage("com.shanjupay.merchant.controller"))
                .paths(PathSelectors.any())
                .build();
    }

    /**
     * @param
     * @return springfox.documentation.service.ApiInfo
     * @Title: 构建API基本信息
     * @methodName: buildApiInfo
     */
    private ApiInfo buildApiInfo() {
        Contact contact = new Contact("开发者",
                                      "http://www.tianmao.com","2510751@qq.com");
        return new ApiInfoBuilder()
                .title("闪聚支付-商户应用API文档")
                .description("开发测试阶段")
                .contact(contact)
                .version("1.0.0").build();
    }

}

```

### 添加SpringMVC配置类：WebMvcConfig，让外部可直接访问Swagger文档

添加静态资源文件外部可以直接访问。

```java
package com.shanjupay.merchant.config;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @author Administrator
 * @version 1.0
 **/
@Component
public class WebMvcConfig implements WebMvcConfigurer {
    /**
     * 添加静态资源文件，外部可以直接访问地址
     *
     * @param registry
     */
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**").addResourceLocations("classpath:/static/");

        registry.addResourceHandler("swagger-ui.html")
                .addResourceLocations("classpath:/META-INF/resources/");

        registry.addResourceHandler("/webjars/**")
                .addResourceLocations("classpath:/META-INF/resources/webjars/");
    }
}

```





![image-20211011102238715](https://i.loli.net/2021/10/11/iVQFbeqJSndRIzg.png)







## 常用注解

`@ApiXXX`

### 类 -》 方法 -》请求参数

@Api：修饰整个类，描述Controller的作用 

@ApiOperation：描述一个类的一个方法，或者说一个接口

@ApiParam：单个参数的描述信息

@ApiImplicitParam：一个请求参数

@ApiImplicitParams：多个请求参数的描述信息

```java

@Api(value = "商户平台-应用管理-value", tags = "商户平台-应用相关-tags", description = "商户平台-应用相关-desc")
@RestController
public class AppController {

    @Reference
    AppService appService;

    @ApiOperation("商户创建应用-ApiOperation")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "app", value = "应用信息", required = true, dataType = "AppDTO", paramType = "body")})
    @PostMapping(value = "/my/apps")
    public AppDTO createApp(@RequestBody AppDTO app){
        //得到商户id
        Long merchantId = SecurityUtil.getMerchantId();

       return  appService.createApp(merchantId,app);
    }

    @ApiOperation("查询商户下的应用列表")
    @GetMapping(value = "/my/apps")
    public List<AppDTO> queryMyApps() {
        //商户id
        Long merchantId = SecurityUtil.getMerchantId();
        return appService.queryAppByMerchant(merchantId);
    }

    @ApiOperation("根据应用id查询应用信息")
    @ApiImplicitParam(value = "应用id",name = "appId",dataType = "String",paramType = "path")
    @GetMapping(value = "/my/apps/{appId}")
    public AppDTO getApp(@PathVariable("appId") String appId){
        return appService.getAppById(appId);
    }
    
    //上传证件照
    @ApiOperation("上传证件照")
    @PostMapping("/upload")
    public String upload(@ApiParam(value = "证件照",required = true) @RequestParam("file") MultipartFile multipartFile) throws IOException {

        //调用fileService上传文件
        //生成的文件名称fileName，要保证它的唯一
        //文件原始名称
        String originalFilename = multipartFile.getOriginalFilename();
        //扩展名
        String suffix = originalFilename.substring(originalFilename.lastIndexOf(".")-1);
        //文件名称
        String fileName = UUID.randomUUID()+suffix;
        //byte[] bytes,String fileName
        return fileService.upload(multipartFile.getBytes(),fileName);
    }
}
```

### 实体模型+模型属性

@ApiModel：用对象来接收参数

@ApiModelProperty：用对象接收参数时，描述对象的一个字段

```java
@ApiModel(value = "AbilityDTO", description = "套餐包含功能描述,JSON格式的角色与权限")
@Data
public class AbilityDTO implements Serializable {

    @ApiModelProperty("角色名称")
    private String roleName;

    @ApiModelProperty("角色编码")
    private String roleCode;

    @ApiModelProperty("权限（数组）")
    private String[] privileges;

}
```

### 其他

@ApiResponse：HTTP响应其中1个描述

@ApiResponses：HTTP响应整体描述

@ApiIgnore：使用该注解忽略这个API

@ApiError ：发生错误返回的信息