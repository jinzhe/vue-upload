# vue-upload

基于vuejs的上传插件,因为使用了Formdata仅仅支持ie10+。QQ讨论群: 240319632。
 
 

# 引入插件
```
var VueUpload = require('./plugins/vue-upload.js');
Vue.use(VueUpload);

```
# 组件上应用

```
<script>
module.exports = {
    ready:function(){
        // 上传绑定
        this.$upload({
            input:document.querySelector("#upload"),
            url:"/api/upload/",
            // 额外附加字段
            data:{
                token:'xxx'
            },
            // 无法连接网络
            error:function(file,responseText){
                
            },
            // 进度
            progress:function(file,loaded,total){

            },
            success:function(file,data){
                data=JSON.parse(data);
            }
        });
    }
}
</script>
```