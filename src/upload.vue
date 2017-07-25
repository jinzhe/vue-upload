<script>
export default {
	props: {
        action: {
            type: String,
        },
        headers:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        data:{
            type:Object,
            default:()=>{
                return {}
            }
        },
        dataType: {
            type: String,
        },
        auto: {
            type: Boolean,
            default:true
        },
        name: {
            type: String,
            default:"file"
        },
        // File upload limit
        limit:{
            type:Number,
        },
        accepts:{
            type:Array,
            default:()=>{
                return [
	                "image/jpeg",
	                "image/png",
	                "image/gif"
                ]
            }
        },
        multiple: {
            type: Boolean,
            default:true
        },
        chunked: {
            type: Boolean,
            default:false
        },
        queue: {
            type: Boolean,
            default:true
        },
    },
	data(){
        return {
        	files:[],
            safeFiles:[],//合格的文件
            unsafeFiles:[],//不合格的文件
            input:null,
        }
    },
    methods:{
    	// 选择文件
    	change(e){
    		this.input=e.target
            this.files=[]
            this.unsafeFiles=[]
            this.files = e.target.files || e.dataTransfer.files
            for (let i = 0, file; file = this.files[i]; i++) {// 遍历选中文件
            	if(this.limit==undefined){
            		this.addFile(file)
            	}else{
	                if (file.size <= this.limit * 1024 * 1024) {// 判断大小

	                	this.addFile(file)
	                }else{
	                	this.unsafeFiles.push(file)
	                }
            	}

            }
            this.$emit("change",this.safeFiles)
            if (this.auto){
            	this.upload()
            	this.safeFiles=[]
            }
    	},
    	// 添加文件到暂存区
    	addFile(newFile){
    		let isIn=false
        	for (let i = 0, file; file = this.safeFiles[i]; i++) {// 遍历已存在的文件
        		if(newFile.name==file.name){
        			isIn=true

        		}
        	}
        	if(!isIn){
            	newFile.progress=0
	            this.safeFiles.push(newFile)
        	}
    	},
        // 执行上传
    	upload(){
    		// 拦截包含非法文件
    		if(this.unsafeFiles.length>0){
				 this.$emit("error","limit",this.unsafeFiles)
				 return false
    		}
    		// 点击手动上传的时候会有这个可能
			if(this.safeFiles.length==0){
				 this.$emit("error","empty")
				 return false
			}
			if(this.action==undefined){
				 this.$emit("error","action")
				 return false
			}
			this.input.value=""
            for (let i = 0, file; file = this.safeFiles[i]; i++) {
                (file=>{
                	console.log(file)
                	// 开启分块并且文件大于5mb才会分块上传
                	if(file.size > 5 * 1024 * 1024 && this.chunked){
                		this.uploadChunked(file)
                	}else{
                		this.uploadNormal(file)
                	}
                })(file)
            }
    	},
    	uploadNormal(file){
            file.xhr = new XMLHttpRequest()
            if (file.xhr.upload) {
                let formData = new FormData()
                formData.append(this.name, file)
                if(this.data!=undefined){
                    for (let key in this.data)formData.append(key, this.data[key])  
                }
                file.xhr.upload.addEventListener("progress",e=>{
                    file.progress=Math.floor(e.loaded/e.total*100)
                    if(file.progress==100){
                    	window.setTimeout(()=>{
                    		file.done=true
                    		this.$forceUpdate()
                    	},1000);
                    }
                    this.$emit("progress",file.progress)
                    this.$forceUpdate()
                }, false)

                file.xhr.onreadystatechange = e=> {
                    if (file.xhr.readyState == 4) {
                        if (file.xhr.status == 200) {
                            let data=file.xhr.responseText;
                            if(this.dataType=="json"){
                                data=JSON.parse(data)
                            }
                            this.$emit("success",data)
                        } else {
                            this.$emit("error","server",this.file)
                        }
                    }

                }
                file.xhr.open("POST", this.action, true)
                if(this.headers!=undefined){
                    for (let key in this.headers)file.xhr.setRequestHeader(key, this.headers[key])
                }
                file.xhr.withCredentials = false
                file.xhr.send(formData)
            }
    	},
    	uploadChunked(file){
    		let chunkedID=Math.random().toString(36).substr(2)
    		let chunkedSize=1024*1024
    		let chunkedTotal=Math.ceil(file.size/chunkedSize)
    		let i=0;
    		let chunkedLoaded=0;
    		let step=()=>{
                let start=i*chunkedSize
                let end=start+chunkedSize
				file.xhr = new XMLHttpRequest()
	            if (file.xhr.upload) {
	                let formData = new FormData()
	                formData.append("chunked","true")
	                formData.append("chunkedIndex",i)
	                formData.append("chunkedID",chunkedID)
	                formData.append("chunkedTotal",chunkedTotal)
	                formData.append("chunkedData",file.slice(start,end))
 
	                if(this.data!=undefined){
	                    for (let key in this.data)formData.append(key, this.data[key])  
	                }
	                file.xhr.upload.addEventListener("progress",e=>{
	                	chunkedLoaded=chunkedLoaded+e.loaded
	                    file.progress=Math.floor(chunkedLoaded/file.size*100)
	                    if(file.progress==100){
	                    	window.setTimeout(()=>{
	                    		file.done=true
	                    		this.$forceUpdate()
	                    	},1000);
	                    }
	                    this.$emit("progress",file.progress)
	                    this.$forceUpdate()
	                }, false)

	                file.xhr.onreadystatechange = e=> {
	                    if (file.xhr.readyState == 4) {
	                        if (file.xhr.status == 200) {
	                            let data=file.xhr.responseText;
	                            if(this.dataType=="json"){
	                                data=JSON.parse(data)
	                            }
	                  			i++;
	                            if(i<chunkedTotal){
	                            	step()
	                            }
	                            this.$emit("success",data)
	                        } else {
	                            this.$emit("error","server",this.file)
	                        }

	                    }

	                }
	                file.xhr.open("POST", this.action, true)
	                if(this.headers!=undefined){
	                    for (let key in this.headers)file.xhr.setRequestHeader(key, this.headers[key])
	                }
	                file.xhr.withCredentials = false
	                file.xhr.send(formData)
	            }
    		}
    		step()
    	},
    	submit(){
    		this.upload()
    	},
    	cancel(key){
    		this.safeFiles[key].xhr && this.safeFiles[key].xhr.abort();
    		this.safeFiles.splice(key,1);
    		this.input.value=""
    	}
    }
}
</script>

<template>
<div>
	<div class="__upload__">
	    <slot></slot>
	    <input type="file" @change="change($event)" :accept="accepts" :multiple="multiple">
	</div>
	<div class="__queue__" v-if="queue && safeFiles.length>0">
		<transition-group name="fade"  mode="out-in">
		<div class="__item__" v-for="(file,key) in safeFiles"  v-if="!file.done" :key="key">
			<div class="__progress__" :style="{'width':file.progress+'%'}"></div>
	 		<div class="__name__">
				<svg viewBox="0 0 1024 1024">
				<path d="M636.974339 66.552765 139.739625 66.552765l0 890.583384 742.153844 0L881.893468 304.049854 636.974339 66.552765 636.974339 66.552765zM591.950913 348.826664 591.950913 125.932154 822.506916 348.826664 591.950913 348.826664 591.950913 348.826664zM591.950913 348.826664"></path>
				</svg>
	 			{{file.name}}
	 		</div>
	 		<div class="__percent__" v-if="file.progress>0 && file.progress<100">{{file.progress}}%</div>
			<div class="__cancel__"  v-if="file.progress<100" @click="cancel(key)">
				<svg viewBox="0 0 1024 1024"><path d="M512.325411 0c-282.578844 0-511.653099 229.075279-511.653099 511.653099 0 282.578844 229.074256 511.653099 511.653099 511.653099s511.653099-229.074256 511.653099-511.653099C1023.978511 229.075279 794.904255 0 512.325411 0zM726.690664 761.454422c-4.821819 4.146437-10.754948 6.183839-16.663518 6.183839-7.194866 0-14.352893-3.022847-19.412119-8.906857L509.457084 548.069497 329.953827 760.043283c-5.059226 5.983271-12.272511 9.05626-19.535939 9.05626-5.838985 0-11.710716-1.986237-16.520255-6.058996-10.780531-9.131985-12.123109-25.269523-2.991124-36.051077l184.773284-218.201627L302.096363 306.936601c-9.212826-10.717086-7.995091-26.868951 2.716878-36.080753 10.711969-9.193383 26.881231-8.000208 36.080753 2.716878L509.160325 469.24729l166.813237-196.993606c9.118682-10.799974 25.296129-12.123109 36.051077-2.991124 10.79281 9.131985 12.130272 25.276686 2.998287 36.056194L542.939663 508.529969l186.472995 216.84984C738.619344 736.083591 737.40775 752.23648 726.690664 761.454422z" fill="#e84122"></path></svg>
			</div>
			<div class="__success__" v-if="file.progress==100">
				<svg viewBox="0 0 1024 1024">
					<path d="M512 0C229.239467 0 0 229.239467 0 512s229.239467 512 512 512 512-229.239467 512-512S794.760533 0 512 0z m-68.778667 699.733333l-0.170666-0.136533-0.1536 0.136533L238.933333 490.376533l35.328-34.594133 168.789334 157.934933L752.298667 324.266667 785.066667 359.287467 443.221333 699.733333z"></path>
				</svg>
			</div>
		</div>
		</transition-group>
	</div>
</div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0
}
.__upload__{
	display: inline-block;
    position: relative;
    cursor: pointer;
    border-radius: inherit;
}
.__upload__>[type="file"]{
	position: absolute;
	left:0;
	top:0;
	bottom: 0;
	right:0;
	width:100%;
	height:100%;
	opacity: 0;
}
.__queue__{
	width:400px;
	position: relative;
}
.__item__{
	position: relative;
	line-height: 30px;
	height:30px;
	margin:10px 0;
	background:#efefef;
	border-radius: 2px;
	overflow: hidden;
}
.__item__>div{
	position: absolute;
	font-size: 12px;
	height:30px;
}
.__name__{
	z-index:1;
	left:10px;
	color: #138d92;
	right:50px;
	text-overflow: ellipsis;
	overflow: hidden;
}
.__name__>svg{
	display: inline-block;
	width:12px;
	height:12px;
	fill:currentColor;
	vertical-align: middle;
	transform: translateY(-2px);
}
.__progress__{
	left:0;
	top:0;
	bottom:0;
	background:#d9eaea;
	/*width:50% !important;*/
	z-index:0;
}
.__percent__{
	right:50px;
	top:0px;
	width:40px;
	height:30px;
	text-align: center;
	font-size:10px;
	color: #138d92;
}
.__cancel__{
	right:0;
	top:0px;
	width:30px;
	height:30px;
	text-align: center;
	color:#fff;
}
.__cancel__>svg{
	width:14px;
	height:14px;
	fill:red;
	transform: translateY(4px);
}
.__success__{
	right:0;
	top:0px;
	width:20px;
	color: #138d92;
	transform: translateY(2px);
}
.__success__>svg{
	width:12px;
	height:12px;
	fill:currentColor;
}
</style>