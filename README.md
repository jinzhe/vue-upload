# vue-upload

基于vuejs+webpack环境使用的上传组件

[Live demo](http://jinzhe.github.io/vue-upload/)

* 支持服务器的域名和接口单独设置
* 支持自定义提交字段
* 支持自定义xhr 提交的header字段/表单name/限定上传格式/文件大小／
* 支持图片上传前预先裁剪，其中包括裁减按钮替换、宽高、质量（quality）
* 支持自定义回调方法
* 支持裁减图片缩放，包括移动端手势支持


![](http://ww1.sinaimg.cn/large/823603acgw1ez1n57t8jug20d40acwjw.gif)


# Options

* :server   (string)  服务器地址 // Server host,like "http://jinzhe.net"
* :api   (string)      // Server api path,like "/api/v1/getdata/"
* :params  (object) 	额外附加的字段，它是一个object
* :filename   (string)  文件表单名称，默认为file
* :file   (string)    返回的文件名或地址
* :ext    (string)    限制文件格式如“jpg,png,zip”
* :header   (object)   提交服务端的头部字段，它是一个object
* :limit  (int)  限制大小
* :multiple	 (bool) 多文件上传
* :preview   (bool)	预览图片
* :auto	     (bool)	是否自动上传
* :crop      (bool) 是否开启裁减
* :width      (int) 裁减宽度
* :height      (int) 裁减高度
* :quality      (float) 裁减质量 （0～1），默认0.8
* :ok   (string)    确定裁减显示文本
* :cancel   (string)    取消裁减显示文本
* :container   (DOM)    包含组件的根dom节点，这个是为了在网页内容很长的情况下为了显示正常使用的（移动滚动条），不设置默认指向document.body。
* :success    (function)    成功上传回调 

# How to use?

```
<template>
<div class="layout">
    <div class="demo">
        <upload 
        :server="upload.server" 
        :api="upload.api" 
        :params="upload.params"
        :success="upload.success"
        :file.sync="upload.file"
        :crop="upload.crop"
        :width="upload.width"
        :height="upload.height"
        :ok="upload.ok" 
        :cancel="upload.cancel">
            <img src="./upload.svg">
        </upload>
    </div>
</div>
</template>

<script>
import upload from "./upload.vue"
export default {
    components:{
        upload
    },
    data() {
        return {
            upload:{
                server:"",
                api:"",
                params:{
                    token:"test"
                },
                file:"",
                preview:true,
                crop:true,
                width:400,
                height:400,
                cancel:"取消",
                ok:"裁剪",
                success:(data)=>{
                    alert(data.length)
                }
            },
        }
    }
}
</script>
```
 
# Conatct
- Author: [zee](http://jinzhe.net)
- Tencent QQ Group: 240319632
- E-mail: 129@jinzhe.net