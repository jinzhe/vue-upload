# Vue Upload

> A file upload components for Vue.js.


### Live Demo
> http://jinzhe.github.io/vue-upload/

### Getting Started

``` html
<upload 
    :action="upload.action"
    :headers="upload.headers"
    :data="upload.data"
    :name="upload.name"
    :limit="upload.limit"
    :accepts="upload.accepts"
    :multiple="upload.multiple"
    :queue="upload.queue"
    @progress="upload.progress"
    @success="upload.success"
    @error="upload.error">
    <button class="select">上传图片</button>
</upload>
```

```js
<script>
import upload from './upload.vue'
export default {
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
               // 当前上传文件进度
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
                    // 文件太大
                    if(type=="limit"){
                        for (let file of result) {
                          console.log("超过上传上限",file["type"],file["name"],(file["size"]/1024/1024).toFixed(2)+"MB")  
                        }
                    }
                    // 没有选择文件
                    if(type=="empty"){
                        alert("请选择文件")
                    }
                    // 没有选择文件
                    if(type=="action"){
                        alert("没有指定上传接口api")
                    }
                    // 服务器报错
                    if(type=="server"){
                         alert("服务器繁忙")
                    }
                }
            }
        }
    }
}
</script>
```

### Features
- Only supports modern browsers
- Support file upload progress
- Support block upload file
- Support for restricted upload sizes and formats
- Support for custom upload form names
- Support for custom request headers and form fields


### Props

- :action String * server api
- :headers Object default:{} * request headers
- :data Object default:{} * request post data
- :name String default:file *  input name
- :limit int * Maximum upload value
- :accepts Array default:["image/jpeg","image/png","image/gif"] * Allow upload Mime types
- :multiple Bool * Multiple choice
- :queue Bool * Show upload progress 
- :auto Bool * Select the file and upload it
- :chunked Bool * Chunked file and upload(Need server support)
- :dataType String * If the type is "json" ,then return the Object.

### events
- @success 
- @error
- @progress



### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build
```