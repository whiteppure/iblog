---
title: "Vue2.0基础入门笔记"
date: 2019-05-23
draft: false
tags: ["随笔"]
slug: "vue2-note"
---

## 参考资料
- 代码中的依赖库：[Vue2.x-lib.zip](/posts/annex/zip/vue2.x-lib.zip)
- Vue官方文档：[https://cn.vuejs.org/v2/guide](https://cn.vuejs.org/v2/guide)
- Vue参考视频资料：[https://www.bilibili.com/video/av50680998](https://www.bilibili.com/video/av50680998)
- Vue菜鸟教程文档：[https://www.runoob.com/vue2/vue-tutorial.html](https://www.runoob.com/vue2/vue-tutorial.html)
- Vue组件参考资料：[https://cn.vuejs.org/v2/guide/components.html#ad](https://cn.vuejs.org/v2/guide/components.html#ad)
- Vue路由参考资料1：[https://router.vuejs.org/zh/installation.html](https://router.vuejs.org/zh/installation.html)
- Vue路由参考资料2：[https://blog.csdn.net/weixin_42218847/article/details/81488075](https://blog.csdn.net/weixin_42218847/article/details/81488075)

## 代码案例

### 1.helloWorld.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <script src="./lib/vue.min.js" type="text/javascript"></script>
    <title>Document</title>
</head>
<body>

    <!-- 使用 vue 框架 开发大大简化了开发,提高了开发效率 代码 使得前端程序员只关心页面逻辑  -->
    <div class="app">
        <p>{{msg}}</p>
    </div>
    <script>
        var vm = new Vue({
           el: '.app',
           data: {
               msg: 'helloWord'
           }
        })
    </script>
</body>
</html>
```

### 2.vue一些指令.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <style>
        [v-cloak] {
            display: none;
        }
    </style>
</head>
<body>
    <!--v-cloak 和 v-text 可以避免 由于网速过慢vue 的闪烁问题
        "v-bind:" : 等同于 ":" 
        v-html : 转义渲染页面
        v-on:"事件名字"="函数名字"  绑定事件 
    -->
    <div id="app">
        <div v-cloak>{{msg}}</div>
        <div v-text="msg"></div>
        <div v-html="msg2"></div>
        <input type="button" value="按钮" :title="mytitle" v-on:click="show">
    </div>
    <script src="./lib/vue.min.js" type="text/javascript"></script>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                msg: '123',
                mytitle: '我是一个按钮!',
                msg2: '<h1>我是一个h1标签,.....</h1>',

            },
            methods:{
                show:function(){
                    alert("1234");
                }
            }
        })
    </script>
</body>
</html>
```

### 3.跑马灯效果.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js" type="text/javascript"></script>
</head>
<body>
    <div id="app">
        <button @click="lang">start</button>
        <button @click="stop">end</button>
        <div>{{ msg }}</div>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                msg: '猥琐发育别浪~~~',
                time: null,
            },
            methods: {
                //如果调用vue 本身的属性 用this
                lang(){
                    //如果定时器不等于null 说明开了定时器 就不能再开一个定时器了
                   if(this.time != null)return;
                    //开启定时器
                     this.time = setInterval(() => {
                          //截取字符串
                        var start = this.msg.substring(0,1);
                        var end = this.msg.substring(1);
                        //拼接成新的字符串
                        this.msg = end + start;

                    },400)
                },
                stop(){
                    //清除定时器
                    clearInterval(this.time);
                    //把time重新赋值为null
                    this.time = null;
                }
            }
        })
    </script>
</body>
</html>
```

### 4.事件修饰符.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js" type="text/javascript"></script>
    <style>
        .outDiv{
            height: 300px;
            background-color: red;
        }
        .innerDiv{
            height: 100px;
            background-color: aqua;
        }
    </style>
</head>
<body>
    <div id="app">
        <!-- 1.stop修饰符 组织冒泡事件 
             2.prevent 修饰符 阻止默认事件
             3.once 修饰符 once 事件只触发一次
             4.capture 从外往里执行事件 实现捕获触发事件的机制
             5.self 只有点击当前元素的时候才触发的处理函数 

             self 和 stop 都会阻止冒泡 区别:
             .self 只会阻止一层冒泡 stop 阻止所有冒泡
        -->
        <div class="outDiv" @click.self.capture="div1Handler">   
            <div class="innerDiv" @click.self="div2Handler">
                <button @click.stop="btn">戳我</button>
                <a href="https:www.baidu.com" @click.prevent="baidu">我是百度</a>
            </div>
        </div>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {

            },
            methods:{
                div1Handler(){
                    console.log("div1Handler事件");
                },
                div2Handler(){
                    console.log("div2Handler事件");
                },
                btn(){
                    console.log("点击了按钮");
                },
                baidu(){
                    console.log("点击了超链接!");
                }
            }
        })
    </script>
</body>
</html>
```
### 5.v-model指令.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js" type="text/javascript"></script>
</head>
<body>
    <!--  v-model 实现双向数据绑定
        1.只对表单元素生效 
        2. 使用 v-model 可以实现 表单元素和model中的数据 双向绑定
        v-bind 只能从 M -> V 无法实现数据双向绑定
    -->
    <div id="app">
        <div><h1>{{msg}}</h1></div>
        <input type="text" style="width: 100%;" v-model="msg">
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data:{
                msg: 'Hello Word',
            },
            methods:{
                
            }
        })
    </script>
</body>
</html>
```
### 6.双向绑定简易计算器.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>

<body>
    <div id="app">
        <input type="text" v-model="n1">
        <select v-model="opt">
            <option value="+">+</option>
            <option value="-">-</option>
            <option value="*">*</option>
            <option value="/">/</option>
        </select>
        <input type="text" v-model="n2">
        <button @click="calcu">=</button>
        <input type="text" v-model="result">
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                n1: 0,
                n2: 0,
                opt: '+',
                result: 0,
            },
            methods: {
                calcu() {
                    // switch (this.opt) {
                    //     case '+': this.result = parseInt(this.n1) + parseInt(this.n2)
                    //         break;
                    //     case '-': this.result = parseInt(this.n1) - parseInt(this.n2)
                    //         break;
                    //     case '*': this.result = parseInt(this.n1) * parseInt(this.n2)
                    //         break;
                    //     case '/': this.result = parseInt(this.n1) / parseInt(this.n2)
                    //         break;
                    // }
                   this.result = eval(parseInt(this.n1) + this.opt + parseInt(this.n2));
                }
            }
        })
    </script>
</body>

</html>
```
### 7.vue中的样式-class.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <style>
        .red{
            color: red;
        }
        .italic{
            font-style: italic;
        }
        .thin{
            font-weight: 100;
        }
    </style>
</head>
<body>
    <div id="app">
        <div>
            <!--
                vue 的class 选择器 可以通过v-band来绑定
                :class=""  可以放数组 可以放对象
                可以通过三目运算符 来进行运算
            -->
            <h1 :class="[flag?'thin':'red']">这是一个h1标签,大到你无法想象!</h1>
                <!-- <h1 :class="['red']">这是一个h1标签,大到你无法想象!</h1> -->
            <!-- <h1 :class="classObj">这是一个h1标签,大到你无法想象!</h1> -->
        </div>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data: {
                flag: true,
                classObj:{red: true,italic: true,thin: true},
            },
            methods:{

            }
        })
    </script>
</body>

</html>
```
### 8.vue中的样式-style.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <!--
            vue 中的内联样式
            :style="" 可以写对象
            可以写多个对象
            可以写数组 和 外联样式 class 一样
        -->
        <h1 :style="[styleObj,styleObj2]">我是h1, 我为自己代言</h1>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data:{
                //样式名称有横杠 必须用单引号
                styleObj: {color: 'red','font-weight': 100},
                styleObj2:{'font-style': 'italic'}
            },
            methods:{

            }
        })
    </script>
</body>
</html>
```
### 9.v-for迭代数字.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>

    <div id="app">
        <!--  v-for 循环索引从 1 开始 -->
        <p v-for="count in 10">这是第{{count}}次循环</p>
    </div>

    <script>
        var vm = new Vue({
            el:'#app',
            data:{

            }
        })
    </script>
</body>
</html>
```
### 10.v-for遍历对象.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    
    <div id="app">
        <p v-for="(val, key) in user">值:{{val}} 键:{{key}}</p>
    </div>

    <script>
        var vm = new Vue({
            el:'#app',
            data:{
                user:{
                    name: '张三',
                    sex: '男',
                    age: '19',
                }
            },
            methods:{

            }
        })
    </script>
</body>
</html>
```
### 11.v-for遍历数组.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>


    <div id="app">
        <p v-for="item in list">list中的元素:{{item}}</p>
    </div>

    <script>
        var vm = new Vue({
            el: '#app',
            data:{
                list:[1,2,,3,4,5,6]
            },
            methods:{

            }
        })
    </script>
</body>
</html>
```
### 12.v-for中key的使用.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <label>
            id:<input type="text" v-model="id">
        </label>
        <label>
            Name: <input type="text" v-model="name">
        </label>
        <input type="button" value="添加" @click="add">
        <!--
            v-for 循环的时候 key 的值只能为 String或number 不能是对象或者其他的
            使用key的时候 必须用v-bind: 绑定
            在组件中 如果使用v-for有问题 但又必须使用 v-for 要指明key的值
            不指明的话 默认是按索引寻找的 
        -->
        <p v-for="item in list" :key="item.id">
            id:{{item.id}}-----name:{{item.name}}
        </p>
    </div>
    <script>
        var vm = new Vue({
            el: '#app',
            data:{
                id: '',
                name: '',
                list:[
                    {id:  1, name: '张三'},
                    {id:  2, name: '李四'},
                    {id:  3, name: 'abc'},
                    {id:  4, name: '王五'},
                    {id:  5, name: '赵六'},
                ],
            },
            methods:{
                add(){
                    this.list.push({ id: this.id,name: this.name}); 
                }
            }
        })
    </script>
</body>
</html>
```
### 13.v-for和v-show使用特点.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    
    <div id="app">
        <input type="button"  value="戳我" @click="show">
        <h1 v-show="flag">这是用v-show控制的元素.</h1>
        <h1 v-if="flag">这是用v-if控制的元素.</h1>  
        <!--
            v-show  和  v-if  区别:
            v-show: 是用style:display:none; 来控制元素
            v-if: 是控制dom 删除或者添加元素 
        -->
    </div>

    <script>
        var vm = new Vue({
            el: '#app',
            data:{
                flag: false,
            },
            methods:{
                show(){
                    this.flag = !this.flag;
                }
            }
        })
    </script>
</body>
</html>
```
### 14.品牌管理案例.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <link rel="stylesheet" href="./lib/bootstrap.css">
</head>

<body>
    <div id="app">

        <div class="panel panel-primary">
            <div class="panel-heading">
                <h3 class="panel-title">添加品牌</h3>
            </div>
            <div class="panel-body form-inline">
                <label>
                    ID
                    <input type="text" class="form-control" v-model="id">
                </label>
                <label>
                    Name
                <!--
                    
                -->
                    <input type="text" class="form-control" v-model="name" @keyup.space="add">
                </label>
                <label>
                    <!-- 方法带括号 可以传参数 -->
                    <input type="button" value="添加" class="btn btn-primary" @click="add()">
                </label>
                <label>
                    搜索名称关键字
                    <!-- 
                        v-color=" 'blue' "
                        如果不加单引号 会认为 blue 是 date里边的对象 会从date里边去找
                        加了就是字符串
                     -->
                    <input type="text" class="form-control" v-model="keywords" v-focus v-color="'blue'">
                </label>
            </div>
        </div>

        <table class="table table-bordered table-hover table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Time</th>
                    <th>Operation</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in search(keywords)" :key="item.id">
                    <td>{{ item.id }}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.time | dateFormat()}}</td>
                    <td><a href="" @click.prevent="del(item.id)">删除</a></td>
                </tr>
            </tbody>
        </table>
    </div>
    <script>
        //自定义全局指令 使用该指令 进入该页面 获取焦点
        //定义指令的时候不用加 v-... 但是调用的时候 要加 v-...
        Vue.directive('focus', {
            //钩子函数
            //在这三个函数中 第一个参数永远都是 el 表示 被绑定了的那个元素
            //el 为 原声的  DOM 对象
            bind: function(el){//当指令绑定到元素上的时候 会执行该函数 只执行1次
                //bind 函数常用来 控制样式 
            },
            inserted: function(el){//当元素插入到 DOM 的时候会执行该函数 只执行1次
                //当控制 js 行为的时候 最好放在inserted中 防止不执行该行为
                el.focus()
            },
            updated: function(el){// 当VVOde 节点更新的时候 会执行该函数 可执行多次

            }
        });

        Vue.directive('color',{
            bind(el,binding){
                el.style.color = binding.value
            }
        });


        //自定义键盘修饰符
        Vue.config.keyCodes.space = 32
        // Vue.config.devtools = true
        //定义全局过滤器 格式化时间
        Vue.filter('dateFormat', function (dateStr) {
            // var date = new Date(dateStr)

            // //padStart 可以在前边补0 第一个参数为总长度 第二个为 补的东西
            // var year = date.getFullYear()
            // var month = (date.getMonth() + 1).toString().padStart(2, 0)
            // var day = date.getDate().toString().padStart(2, 0)
            // var hour = date.getHours().toString().padStart(2, 0)
            // var minutes = date.getMinutes().toString().padStart(2, 0)
            // var seconds = date.getSeconds().toString().padStart(2, 0)

            // return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
        })


        // vue 入口
        var vm = new Vue({
            el: "#app",
            data: {
                list: [
                    { id: 1, name: '奔驰', time: new Date() },
                    { id: 2, name: '奔奔', time: new Date() },
                    { id: 3, name: '奔奔x', time: new Date() },
                    { id: 4, name: '宝马', time: new Date() },
                    { id: 5, name: '宝马x', time: new Date() },
                    { id: 6, name: '宝宝', time: new Date() },
                ],
                id: '',
                name: '',
                keywords: ''
            },
            methods: {
                add() {//添加方法
                    var car = ({
                        id: this.id,
                        name: this.name,
                        time: new Date()
                    })
                    this.list.push(car)
                    this.id = this.name = ''
                },
                del(id) {//删除方法

                    //some 循环 根据指定的条件进行判断 如果返回true 则终止循环
                    this.list.some((item, i) => {
                        if (item.id == id) {
                            this.list.splice(i, 1)
                            return true;
                        }
                    });

                    //findIndex 方法直接查找索引 根据索引删除

                    // var index = this.list.findIndex((item) => {
                    //     if(item.id == id){
                    //         return true;
                    //     }
                    // })
                    // this.list.splice(index, 1)
                },
                search(keywords) {//搜索关键字
                    // var newList = []
                    // this.list.forEach(item => {
                    //     //判断搜索的名称 包不包含 该关键字 包含不等于-1
                    //     if(item.name.indexOf(keywords) != -1){
                    //         newList.push(item)
                    //     }
                    // });
                    // return newList

                    //另一种实现方式 es6 新增
                    return this.list.filter(item => {
                        if (item.name.includes(keywords)) {
                            return item
                        }
                    });
                }
            },
            filters: {//自定义过滤器 
                //如果 全局的过滤器 和自定义的过滤器名称相同 则优先调用自定义的过滤器
                //就近原则
                dateFormat: function (dateStr) {
                    var date = new Date(dateStr)

                    //padStart 可以在前边补0 第一个参数为总长度 第二个为 补的东西
                    var year = date.getFullYear()
                    var month = (date.getMonth() + 1).toString().padStart(2, 0)
                    var day = date.getDate().toString().padStart(2, 0)
                    var hour = date.getHours().toString().padStart(2, 0)
                    var minutes = date.getMinutes().toString().padStart(2, 0)
                    var seconds = date.getSeconds().toString().padStart(2, 0)

                    return year + '-' + month + '-' + day + ' ' + hour + ':' + minutes + ':' + seconds
                }
            },
            //定义私有指令
            //和自定义过滤器相似 就近原则
            directives:{
                // 'color':{
                //     bind:function(el,binding){
                //         el.style.color = 'pink'
                //     },
                //     inserted:function(el,binding){

                //     }
                // }
                //简写指令 
                //等同于 在 bind 和 updated 这两个钩子函数中各写了一份
                'fontsize':function(el,binding){
                    el.style.color  = parseInt(binding.value) + 'px'
                }
            }
        })
    </script>
</body>

</html>
```
### 15.过滤器的使用.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <!-- 
            调用过滤器 
            必须在差值表达式或v-bind中使用
            调用格式: {{msg | 过滤器名称 | 过滤器名称}}
            可以调用多个过滤器 可以传多个参数 但注意过滤器的第一个参数是 要处理的数据 function(data)
        -->
        <p>{{ msg | msgFormat('昨天') | test() }}</p>
    </div>
    <script>
        //自定义过滤器 
        Vue.filter( 'msgFormat' , function(msg,arg1){
            return  msg.replace(/今天/g , arg1)
        })

        Vue.filter('test' , function(data){
            return data + "123" 
        })

        var vm = new Vue({
            el: '#app',
            data: {
                msg: '今天是2019年6月2日,星期日,天气多云,今天和昨天一样,今天.....',
            },
            methods:{

            }
        })
    </script>
</body>
</html>
```
### 16.vue-recourse基本使用.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <!-- vue-resource.js 依赖于 vue.js 导入的时候 注意顺序 -->
    <script src="./lib/vue-resource.js"></script>
</head>
<body>
   <div id="app">
        <input value="get方式" @click="getInfo" type="button">
        <input value="post方式" @click="postInfo" type="button">
        <input value="jsonp方式" @click="jsonpInfo" type="button">
        <p>{{message}}</p>
   </div>
   <script>

       // 设置全局的根域名
       // 如果配置了全局的根域名,则在每次单独发起调用http的请求的时候,请求的url应以相对路径开头 前边不能带"/",否则不会启用根路径作拼接
       Vue.http.options.root = "http://jsonplaceholder.typicode.com"

       //设置全局的 emulateJson 选项
       Vue.http.options.emulateJSON = true

       var vm = new Vue({
           el: '#app',
           data:{
            message:"这里显示控制台的输出"
           },
           methods:{
            getInfo(){
                this.$http.get('users').then(function(result){
                    console.log(result.body)
                    this.message = result.body
                })
            },
            postInfo(){
                //post 默认表单格式
                // 第三个参数为: emulateJSON : true 表单格式 相当于设置  application/x-www-form-urlencoded
                //第二个参数为: options 可选参数
                this.$http.post('users',{},{emulateJSON: true}).then(result =>{
                    console.log(result.body)
                    this.message = result.body
                })
            },
            jsonpInfo(){
                this.$http.jsonp('users').then(result => {
                    console.log(result.body)
                    this.message = result.body
                })
            }

           }
       })
   </script>
</body>

</html>
```
### 17.todoSthing.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <link rel="stylesheet" href="./lib/bootstrap.css">
</head>

<body>
    <div id="app">
        <div class="panel-body form-inline">
            ID: <input type="text" v-model="id" class="form-control">
            Name: <input type="text" v-model="name" class="form-control">
            Age:<input type="text" v-model="age" class="form-control" @keydown="doAdd($event)">
            <input type="button" value="添加" class="btn btn-primary" @click="add()">
        </div>
        <table class="table table-bordered table-hover table-striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>姓名</th>
                    <th>年龄</th>
                    <th>时间</th>
                    <th>操作</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,key) in list" :key="item.id">
                    <td>{{item.id}}</td>
                    <td>{{ item.name }}</td>
                    <td>{{ item.age }}</td>
                    <td>{{ item.time}}</td>
                    <td><a href="" @click.prevent="del(item.id)">删除</a></td>
                </tr>
            </tbody>
        </table>

    </div>
    <script>

        // 自定义键盘码
        Vue.config.keyCodes.f3 = 113

        var vm = new Vue({
            el: '#app',
            data: {
                id: '',
                name: '',
                age: '',
                list: [{
                    id: '1',
                    name: '张三',
                    age: '18',
                    time: new Date()
                }]
            },
            methods: {
                add() {
                    var user = ({
                        id: this.id,
                        name: this.name,
                        age: this.age,
                        time: new Date()
                    })
                    this.list.push(user)
                    this.id = this.name = this.age = ''
                },
                doAdd(e) {
                    if (e.keyCode == 13)
                        this.add()
                },
                del(id) {
                    this.list.some(
                        (item, i) => {
                            if (item.id == id) {
                                this.list.splice(i, 1)
                                return true;
                            }
                        }
                    )
                },
            },

        })
    </script>
</body>

</html>
```
### 18.动画animate.css的使用.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <link rel="stylesheet" href="./lib/animate.css">
    <!-- <link rel="stylesheet" href="https://raw.githubusercontent.com/daneden/animate.css/master/animate.css"> -->
</head>

<body>
    <div id="app">
        <!-- 使用 :duration="{enter:300,leave:300}" 来设置出场离场的时间 -->
        <input type="button" value="animate基本使用" @click="flag = !flag">
        <transition enter-active-class="bounceIn" leave-active-class="bounceOut" :duration="{enter:300,leave:300}">
            <h4 v-if="flag" class="animated">animate的基本使用</h4>
        </transition>
    </div>

</body>

<script>
    var vm = new Vue({
        el: "#app",
        data: {
            flag: false
        }
    })
</script>

</html>
```
### 19.使用钩子函数完成半场动画.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <link rel="stylesheet" href="./lib/animate.css">
    <style>
        .boll {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background-color: red;
        }
    </style>
</head>

<body>
    <div id="app">
        <input @click="flag = !flag" type="button" value="加入购物车">
        <!--  -->
        <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
            <div class="boll" v-if="flag"></div>
        </transition>
    </div>
</body>
<script>
    var vm = new Vue({
        el: "#app",
        data: {
            flag: false
        },
        methods: {
            // 动画执行钩子函数第一个参数: el 表示 JavaScript原生的dom元素 ,可理解为通过 document.getElememtById得到的dom对象   
            // 动画入场前
            beforeEnter(el) {
                // 设置小球的初始位置
                el.style.transform = "translate(0, 0)"
            },
            //表示动画开始之后的样式,这里可以设置小球完成动画之后的结束状态
            enter(el,done) {
                // offsetTop没有实际意义 可以理解为offsetTop 强制会刷新动画
                el.offsetTop
                // 设置动画过渡时间
                el.style.transition = "all 1s ease"
                //设置小球结束位置
                el.style.transform = "translate(150px,450px)"
                // done() 相当于afterEnter函数的调用 
                done()
            },
            afterEnter(el) {
                this.flag = !this.flag
            }
        },
    })
</script>

</html>
```
### 20.使用transform-group.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>animate动画效果</title>
    <script src="./lib/vue.min.js"></script>
    <link rel="stylesheet" href="./lib/animate.css">
    <style>
        li {
            margin: 10px;
            border: 1px #ccc solid;
            font-size: 12px;
            width: 100%;
            padding: 10px;
            list-style: none;
        }

        li:hover {
            background-color: hotpink;
            transition: all .6s ease;
        }

        .v-enter,
        .v-leave-to {
            opacity: 0;
            transform: translateY(80px);
        }

        .v-enter-active,
        .v-leave-active {
            transition: all 0.6s ease;
        }

        .v-move {
            transition: all .6s ease;
        }

        .v-leave-active {
            position: absolute;
        }
    </style>
</head>

<body>
    <div id="app">
        <div>
            ID: <input type="text" v-model="id">
            姓名: <input type="text" v-model="name">
            <input type="button" value="添加" @click="add()">
        </div>

        <!-- 在实现列表过渡的时候,如果过渡的元素是通过v-for循环渲染出来的,不能使用transition包裹,需要使用transitionGroup -->
        <!--使用 transition-group v-for必须指明 :key 属性  -->
        <!-- appear实现入场效果 tag 外围标签渲染ul标签 如果不指定外围标签渲染为span元素-->
        <transition-group appear tag="ul">
            <li v-for="(item,index) in list" :key="item.id" @click="del(index)" title="点我删除哦~">
                ID:{{item.id}}-----姓名:{{ item.name}}
            </li>
        </transition-group>



    </div>
</body>
<script>
    var vm = new Vue({
        el: "#app",
        data: {
            id: '',
            name: '',
            list: [
                { id: 1, name: "张三" },
                { id: 2, name: "李四" },
                { id: 3, name: "王五" },
                { id: 4, name: "赵六" },
                { id: 5, name: "孙七" },
            ]
        },
        methods: {
            //添加功能
            add() {
                this.list.push({ id: this.id, name: this.name })
                this.id = this.name = ''
            },
            //删除功能
            del(index) {
                this.list.splice(index, 1)
            }
        },
    })
</script>

</html>
```
### 21.vue中的组件.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>

<body>
    <div id="app">
        <!-- 组件使用 直接使用标签即可 -->
        <!-- 第一种方式创建组件使用 -->
        <test1></test1>
        <!-- 第二种方式创建组件使用 -->
        <test2></test2>
        <!-- 第三种方式创建组件使用 -->
        <test3></test3>
        <!-- 私有组件 -->
        <personalcom></personalcom>
        <!-- 组件中的data测试 -->
        <test4></test4>
    </div>

    <!-- 第三种方式创建组件 详情看JavaScript-->
    <template id="testTemplate">
        <div>
            <h4>这是第三种创建组件的方式</h4>
        </div>
    </template>

    <!-- 定义私有组件 -->
    <template id="personal">
        <div>
            <h4>这是定义的私有组件</h4>
        </div>
    </template>

    <template id="testData">
        <div>
            <h4>组件中data测试---{{msg}}</h4>
        </div>
    </template>
</body>
<script>

    //第一种方式创建组件 通过 Vue.extend来创建全局的组件模板
    //给组件起名字 初始化组件 注意组件命名.如果组件名称使用驼峰命名,则在引用组件的时候需要把大写字母改成小写字母,同时两个单词之间用 '-' 连接
    Vue.component('test1', Vue.extend({
        // template 指定组件要展示的HTML结构
        template: "<h4>这是第一种方式创建组件</h4>"
    }))

    //第二种创建组件的方式 直接通过component创建组件
    // 注意: 无论通过那种方式创建组件  组件的template 模板内容,必须有且只能有唯一的一个根元素
    Vue.component('test2', ({
        template: "<h4>这是创建组件的第二种方式</h4>"
    }));

    //第三种方式创建组件  在 #app 外 创建
    Vue.component('test3', {
        template: '#testTemplate'
    });

    //组件中data测试
    // 组件中可以存在data, data必须为一个方法, data必须返回一个对象,组件中data的用法和vue中的用法一样
    Vue.component('test4', {
        template: '#testData',
        data: () => {
            return {
                msg: "组件中data的数据"
            }
        }
    })


    var vm = new Vue({
        el: "#app",
        data: {

        },
        methods: {

        },
        //私有组件
        components: {
            personalcom: {
                template: "#personal"
            }
        },
    });
</script>

</html>
```
### 22.vue组件切换-方式1.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>


<body>
    <div id="app">
        <input @click="flag=true" type="button" value="login">
        <input @click='flag=false' type="button" value="register">
        <login v-if='flag'></login>
        <register v-else='flag'></register>
    </div>

    <!-- 登录组件测试 -->
    <template id="login">
        <div>
            <h3>登录组件</h3>
        </div>
    </template>

    <!-- 注册组件测试 -->
    <template id="register">
        <div>
            <h3>注册组件</h3>
        </div>
    </template>
</body>
<script>
    var vm = new Vue({
        el: "#app",
        data: {
            flag:false
        },
        components: {
            login: {
                template: '#login'
            },
            register: {
                template: '#register'
            }
        }
    })
</script>

</html>
```
### 23.vue组件切换-方式2.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>


<body>
    <div id="app">
        <a href="" @click.prevent='componentName="login"'>显示登录组件</a>
        <a href="" @click.prevent='componentName="register"'>显示注册组件</a>
        <component :is="componentName"></component>
    </div>

    <!-- 登录组件测试 -->
    <template id="login">
        <div>
            <h3>登录组件</h3>
        </div>
    </template>

    <!-- 注册组件测试 -->
    <template id="register">
        <div>
            <h3>注册组件</h3>
        </div>
    </template>
</body>
<script>
    var vm = new Vue({
        el: "#app",
        data: {
            componentName:'login'
        },
        components: {
            login: {
                template: '#login'
            },
            register: {
                template: '#register'
            }
        }
    })
</script>

</html>
```
### 24.vue组件中动画的切换.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <style>

        .v-enter,
        .v-leave-to{
            opacity: 0;
            transform: translateX(100px);
        }

        .v-enter-active,
        .v-leave-active{
            transition: all 0.5s ease;
        }
    </style>
</head>


<body>
    <div id="app">
        <a href="" @click.prevent='componentName="login"'>显示登录组件</a>
        <a href="" @click.prevent='componentName="register"'>显示注册组件</a>

        <!-- 通过mode 属性,设置组件切换时候的模式 -->
        <transition mode='out-in'>
                <component :is="componentName"></component>
        </transition>
    </div>

    <!-- 登录组件测试 -->
    <template id="login">
        <div>
            <h3>登录组件</h3>
        </div>
    </template>

    <!-- 注册组件测试 -->
    <template id="register">
        <div>
            <h3>注册组件</h3>
        </div>
    </template>
</body>
<script>
    var vm = new Vue({
        el: "#app",
        data: {
            componentName:'login'
        },
        components: {
            login: {
                template: '#login'
            },
            register: {
                template: '#register'
            }
        }
    })
</script>

</html>
```
### 25.父子组件传值.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>

<body>
    <div id="app">
        <p>父子组件传值测试</p>
        <!-- 父组件可以在引用子组件的时候,通过v-bind绑定的形式,把需要传递给子组件的数据,传递到子组件的内部,共子组件使用 -->
        <test v-bind:parentmsg="msg"></test>
    </div>
    <template id="test">
        <div>
            <h4>这是子组件-----{{parentmsg}}</h4>
            <input type="button" value="点我修改值" @click="hello">
        </div>
    </template>
</body>
<script>
    var vm = new Vue({
        el: '#app',
        data: {
            msg: '父组件的值'
        },
        components: {
            test: {
                template: '#test',
                //定义在props里边的数据都是只读数据 不可修改
                //把父组件传递过来的parentmsg属性,现在props数组里边定义一下,这样才能使用这个数据
                props: ['parentmsg'],
                //定义在data里边的数据 并不是通过父组件传递过来的 而是私有的
                //data里边的数据都是可读可写的
                data() {
                    return {
                        commsg: '这是组件data里边的数据'
                    }
                },

                methods: {
                    hello() {
                        this.parentmsg = "修改后的值~"
                    }
                },
            },
        }
    });
</script>

</html>
```
### 26.子组件获取父组件中的方法.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head> 
<body>
    <div id="app">
        <com1 @func='show'></com1>
    </div>
    <template id="template1">
        <div>
            <h4>这是子组件</h4>
            <input type="button" value="点我" @click='com1show'>
        </div>
    </template>
</body>
<script>
    var com1 = {
        template: '#template1',
        data() {
            return {
                msg: { name: 'test', age: 22 }
            }
        },
        methods: {
            com1show() {
                // emit 触发调用父元素中绑定的方法
                this.$emit('func', this.msg)
            }
        },
    }

    var vm = new Vue({
        el: '#app',
        components: {
            com1
        },
        methods: {
            show(data) {
                console.log(data)
            }
        },
    });
</script>

</html>
```
### 27.实现用户评论功能.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <link href="./lib/bootstrap.css" rel="stylesheet">
    </script>
</head>

<body>
    <div id="app">
        <comment @func="loadComments"></comment>

        <ul class="list-group">
            <li class="list-group-item" v-for="item in list" :key="item.id">
                <span class="badge">评论人:{{ item.name }}</span>
                {{ item.content }}
            </li>
        </ul>

    </div>
    
    <template id="templateComment">
        <div class="">
            评论人:<input type="text" class="form-control" v-model='name'>
            评论内容:<textarea class="form-control" v-model='content'></textarea>
            <input type="button" value="发布评论" class="btn btn-primary" @click="postComment">
        </div>
    </template>

</body>
<script>

    //用户评论组件
    var cmts = {
        data() {
            return {
                name: '',
                content: ''
            }
        },
        template: '#templateComment',
        methods: {
            postComment() {
            //创建评论对象
            var comment = {
                id: Date.now(),
                name: this.name,
                content: this.content
            }

            //从localstorage获取数据
            var list =  JSON.parse(localStorage.getItem('cmts') || '[]')
            //添加到list
            list.unshift(comment)
            //存到localstorage 
            localStorage.setItem('cmts',JSON.stringify(list))
            //清空input
            this.name = this.content = ''

            this.$emit('func')
        }
        },
        
    }

    var vm = new Vue({
        el: '#app',
        data: {
            list: [
                { id: Date.now(), name: '测试1', content: "这是一条评论!" },
                { id: Date.now(), name: '测试2', content: "23333333!" },
                { id: Date.now(), name: '测试3', content: "helloworld!" }
            ]
        },
        created() {
            //自动刷新评论列表
            this.loadComments()
        },
        methods: {
            loadComments() {
                this.list = JSON.parse(localStorage.getItem('cmts') || '[]')
            }
        },
        components: {
            'comment': cmts
        }
    })
</script>

</html>
```
### 28.vue中ref的使用.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <templ ref="templ"></templ>
        <input type="button" value="点我" @click="func">
        <h4 ref="myh4">测试</h4>
    </div>
    <template id="templ">
        <div>
            <h4>ref获取组件测试,请点击按钮后,按F12检查</h4>
        </div>
    </template>
</body>
<script>

    var templ = {
        template:'#templ',
        data() {
            return {
                msg:"这是组件中的msg"
            }
        },
    }

    var vm = new Vue({
        el:'#app',
        data:{

        },
        methods: {
            func(){
                console.log(this.$refs.templ.msg)
                console.log("这是获取页面中的dom==>"+this.$refs.myh4.innerText)
            }
        },
        components:{
            templ
        }
    })
</script>
</html>
```
### 29.路由-路由的基本使用.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <script src="./lib/vue-router.js"></script>
    <style>
        /* 设置router-link的样式  
        也可以设置默认的 router-link-exact-active 类的样式
        */
        .myActive {
            color: red;
            font-size: 30px;
            font-weight: 500;
        }

        .v-enter,
        .v-leave-to {
            opacity: 0;
            transform: translateX(150px);
        }

        .v-enter-active,
        .v-leave-active {
            transition: all .5s ease;
        }
    </style>
</head>

<body>
    <div id="app">
        <!-- <a href="#/login">登录</a>
        <a href="#/register">注册</a> -->
        <!-- 会默认渲染a标签 -->
        <router-link to="/login">登录[routerlink]</router-link>
        <router-link to="/register">注册[routerlink]</router-link>
        <!-- 这是vue-router提供的组件,专门用来当做占位符,将来路由规则匹配到的组件,就会展示到这个router-view中 -->
        <transition mode='out-in'>
            <router-view></router-view>
        </transition>

    </div>
</body>
<script>

    var login = {
        template: '<h2>登录组件</h2>'
    }

    var register = {
        template: '<h2>注册组件</h2>'
    }


    //创建路由对象
    const routerobj = new VueRouter({
        //路由的匹配规则
        // 每个路由规则都是一个对象  这个规则对象身上必须有两个属性
        //属性1: path,表示监听那个路由的连接
        // 属性2: component: 表示如果路由匹配到的path,则展示对应的component
        routes: [
            //重定向 根路径 到登录组件
            { path: '/', redirect: login },
            { path: '/login', component: login },
            { path: '/register', component: register }
        ],

        //修改router-link样式
        linkActiveClass: 'myActive'
    })
    new Vue({
        el: '#app',
        //将路由对象挂载到vue上
        router: routerobj
    })
</script>

</html>
```
### 30.路由-路由的参数传递.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <script src="./lib/vue-router.js"></script>
    <style>
        /* 设置router-link的样式  
        也可以设置默认的 router-link-exact-active 类的样式
        */
        .myActive {
            color: red;
            font-size: 30px;
            font-weight: 500;
        }

        .v-enter,
        .v-leave-to {
            opacity: 0;
            transform: translateX(150px);
        }

        .v-enter-active,
        .v-leave-active {
            transition: all .5s ease;
        }
    </style>
</head>

<body>
    <div id="app">
        <!-- <a href="#/login">登录</a>
        <a href="#/register">注册</a> -->
        <!-- 会默认渲染a标签 -->
        <router-link to="/login?id=99&name=zs">登录[routerlink]</router-link>
        <router-link to="/register/20/ls">注册[routerlink]</router-link>
        <!-- 这是vue-router提供的组件,专门用来当做占位符,将来路由规则匹配到的组件,就会展示到这个router-view中 -->
        <transition mode='out-in'>
            <router-view></router-view>
        </transition>

    </div>
</body>
<script>

    var login = {
        //第一种方式显示参数
        template: '<h2>登录组件 id:{{$route.query.id}} 姓名:{{$route.query.name}}</h2>',
        created() {
            console.log(this.$route)
        },
    }

    var register = {
        //第二种方式显示参数
        template: '<h2>注册组件 年龄:{{$route.params.age}} 姓名:{{$route.params.name}}</h2>'
    }

    var index = {
        template: '<h2>index首页</h2>'
    }

    //创建路由对象
    const routerobj = new VueRouter({
        //路由的匹配规则
        // 每个路由规则都是一个对象  这个规则对象身上必须有两个属性
        //属性1: path,表示监听那个路由的连接
        // 属性2: component: 表示如果路由匹配到的path,则展示对应的component
        routes: [
            //重定向 根路径 到登录组件  注意重定向路径要写字符串
            { path: '/', redirect:'/index' },
            { path: '/index', component: index },
            { path: '/login', component: login },
            { path: '/register/:age/:name', component: register }
        ],

        //修改router-link样式
        linkActiveClass: 'myActive'
    })
    new Vue({
        el: '#app',
        //将路由对象挂载到vue上
        router: routerobj
    })
</script>

</html>
```
### 31.路由-嵌套子路由.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <script src="./lib/vue-router.js"></script>
</head>

<body>
    <div id="app">
        <router-link to="/account">跳转到account组件</router-link>
        <router-view></router-view>
    </div>

    <template id="templ">
        <div>
            <h2>account组件</h2>
            <router-link to="/account/login">登录</router-link>
            <router-link to="/account/register">注册</router-link>

            <router-view></router-view>
        </div>
    </template>
</body>
<script>

    var account = {
        template: '#templ'
    }

    var login = {
        template: '<h3>登录组件</h3>'
    }

    var register = {
        template: '<h3>注册组件</h3>'
    }

    const router = new VueRouter({
        routes: [
            {
                path: '/account',
                component: account,
                // 子路由的嵌套
                children: [
                    {

                        path: 'register', component: register
                    },
                    {
                        path: 'login', component: login,
                    }
                ]
            },
        ]
    })

    new Vue({
        el: '#app',
        router
    })
</script>

</html>
```
### 32.路由-使用视图实现经典布局.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <script src="./lib/vue-router.js"></script>
    <style>
        html,body{
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
        }
        h1 {
            margin: 0;
            padding: 0;
        }

        .header {
            height: 100px;
            background-color: blanchedalmond;
        }
        .container{
            display: flex;
            height: 653px;
        }

        .left {
            flex: 2;
            background-color: chocolate;
        }
        .main{
            flex: 8;
            background-color: darkgoldenrod;
        }
    </style>
</head>

<body>
    <div id="app">
        <router-view></router-view>
        <div class="container">
            <router-view name='left'></router-view>
            <router-view name='main'></router-view>
        </div>

    </div>
</body>
<script>

    var header = {
        template: '<h1 class="header">头部组件<h1>'
    }
    var leftBox = {
        template: '<h1 class="left">左边导航组件<h1>'
    }
    var main = {
        template: '<h1 class="main">中间内容组件<h1>'
    }

    const router = new VueRouter({
        routes: [
            {
                //设置路由匹配规则
                path: '/', components: {
                    'default': header,
                    'left': leftBox,
                    'main': main
                }
            }
        ]
    })

    new Vue({
        el: '#app',
        router
    })
</script>

</html>
```
### 33.路由-监控路由watch基本使用.html
```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
    <script src="./lib/vue-router.js"></script>
</head>

<body>
    <div id="app">
        <router-link to="/login">登录[routerlink]</router-link>
        <router-link to="/register">注册[routerlink]</router-link>
        <router-view></route-view>
    </div>
</body>
<script>

    var login = {
        template: '<h3>登录组件</h3>'
    }

    var register = {
        template: '<h3>注册组件</h3>'
    }

    const router = new VueRouter({
        routes: [
            {
                path: '/login', component: login
            },

            {
                path: '/register', component: register
            }
        ]
    })

    new Vue({
        el: "#app",
        router,
        //watch 监控
        watch: {
            '$route.path': (newVal, oldVal) => {
                // console.log("路由的newVal==>"+newVal)
                // console.log("路由的oldVal==>"+oldVal)
                if(newVal === '/login' )
                console.log("登录组件")
                if(newVal === '/register' )
                console.log("注册组件")
            }
        }
    })
</script>

</html>
```
### 34.computed的使用.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="./lib/vue.min.js"></script>
</head>
<body>
    <div id="app">
        <input type="text" v-model='firstName'>+
        <input type="text" v-model='lastName'>=
        <input type="text" v-model='fullName'>
    </div>
</body>
<script>
    new Vue({
        el:'#app',
        data:{
            firstName:'',
            lastName:'',
        },
        computed: {
            // 计算的结果会被缓存起来
            //计算属性在引用的时候一定不要加 () 直接把他当做普通的属性去调用
            // 只要这个计算属性的function内部的data发生了变化,就会立即重新计算这个属性的值
            fullName(){
               return  this.lastName +'----'+ this.firstName
            }
        },
    })
</script>
</html>
```