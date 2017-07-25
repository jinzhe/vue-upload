<template>
<div id="app">
    <h1 style="color:Red">上传空间是jd云服务器将在2017-08-13日到期</h1>
    <h3>自动上传</h3>
    <upload 
        :action="upload.action"
        :headers="upload.headers"
        :data="upload.data"
        :name="upload.name"
        :limit="upload.limit"
        :accepts="upload.accepts"
        :multiple="upload.multiple"
        :queue="upload.queue"
        @change="upload.change"
        @progress="upload.progress"
        @success="upload.success"
        @error="upload.error">
        <button class="select">上传图片</button>
    </upload>

    {{upload.result}}

    <h3>手动上传/分块上传（需要<a href="https://github.com/jinzhe/gum/blob/master/demo-upload.php" target="_blank">服务端(Gum)</a>配合）</h3>
    <upload 
        ref="upload"
        :action="upload2.action"
        :headers="upload2.headers"
        :data="upload2.data"
        :auto="upload2.auto"
        :name="upload2.name"
        :limit="upload2.limit"
        :accepts="upload2.accepts"
        :multiple="upload2.multiple"
        :chunked="upload2.chunked"
        :queue="upload2.queue"
        @progress="upload2.progress"
        @success="upload2.success"
        @error="upload2.error">
        <button class="select">选择zip压缩包</button>
    </upload>
    <div>{{upload2.result}}</div>
    <button @click="submit" class="select">立即上传</button>
</div>
</template>

<script>
import upload from './upload.vue'
export default {
    name: 'app',
    components:{
        upload
    },
    data(){
        return {
            upload:{
                action:"http://113.209.72.220/demo-upload.php",
                headers:{
                    "Accept":"application/json; charset=utf-8"
                },
                name:"file",
                limit:10, //10MB
                accepts:["image/jpeg","image/png","image/gif"],
                multiple:true,
                queue:true,
                // 选择文件后
                change:(files)=>{
                    console.log(files);
                },
               // 上传文件进度
                progress:(percent)=>{
                    console.log(percent)
                },
                // 成功上传一次文件
                success:(result)=>{
                    this.upload.result=result
                    // console.log(JSON.parse(result));
                },
                // 错误
                error:(type,result)=>{
                    if(type=="limit"){
                        for (let file of result) {
                          console.log("超过上传上限",file["type"],file["name"],(file["size"]/1024/1024).toFixed(2)+"MB")  
                        }
                    }
                    if(type=="empty"){
                        alert("请选择文件")
                    }
                    if(type=="action"){
                        alert("没有指定上传接口api")
                    }
                    if(type=="server"){
                         alert("服务器繁忙")
                    }
                },
                result:""
            },
            upload2:{
                action:"http://113.209.72.220/demo-upload.php",
                data:{
                    "time":Date.now(),
                },
                chunked:true,
                auto:false,
                accepts:["application/zip"],
                multiple:true,
                queue:true,
               // 当前上传文件进度
                progress:(percent)=>{
                    console.log(percent)
                },
                // 成功上传一次文件
                success:(result)=>{
                    this.upload2.result='/data/'+result
                },
                // 错误
                error:(type,result)=>{
                    if(type=="limit"){
                        for (let file of result) {
                          console.log("超过上传上限",file["type"],file["name"],(file["size"]/1024/1024).toFixed(2)+"MB")  
                        }
                    }
                    if(type=="empty"){
                        alert("请选择文件")
                    }
                    if(type=="action"){
                        alert("没有指定上传接口api")
                    }
                    if(type=="server"){
                         alert("服务器繁忙")
                    }
                },
                result:""
            }
        }
    },
    methods:{
        // 手动上传
        submit(){
            // ...可以做一些逻辑判断
            this.$refs.upload.submit()
        }
    }
}
</script>

<style scoped>
.select{
    display: inline-block;
    margin:5px 0;
    padding:6px 20px;
    border:none;
    border-radius: 2px;
    background:#138d92;
    font-size:12px;
    color:#fff;
}
</style>
