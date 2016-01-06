(function() {
	var upload = {
		input: null, //html file控件
		drag: null, //拖拽敏感区域
		button: null, //提交按钮
		url: "", //ajax地址
		auto: true, //自动上传
		multiple: true,
		filename: "file",
		data: {},
		header: {},
		ext: "jpg,png,gif",
		limit: 1024 * 1024 * 100,
		files: [], //过滤后的文件数组
		filter: function(files) { //选择文件组的过滤方法
			return files;
		},
		mimes: {
			"jpg": "image/jpeg",
			"png": "image/png",
			"gif": "image/gif",
			"mp4": "video/mp4",
			"mov": "video/quicktime",
			"wmv": "video/x-ms-wmv",
			"flv": "video/x-flv",
			"svg": "image/svg+xml",
			"psd": "image/photoshop",
			"mp3": "audio/mpeg",
			"rar": "application/x-rar-compressed",
			"zip": "application/zip",
			"json": "application/json",
			"docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
			"xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			"pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
			"doc": "application/msword",
			"pdf": "application/pdf",
			"xls": "application/vnd.ms-excel",
			"ppt": "application/vnd.ms-powerpoint"
		},
		select: function() {}, //文件选择后
		delete: function() {}, //文件删除后
		dragover: function() {}, //文件拖拽到敏感区域时
		dragleave: function() {}, //文件离开到敏感区域时
		progress: function() {}, //文件上传进度
		success: function() {}, //文件上传成功时
		error: function() {}, //文件上传失败时,
		done: function() {}, //文件全部上传完毕时



		//获取选择文件，file控件或拖放
		getFiles: function(e) {
			// 取消鼠标经过样式
			e.stopPropagation();
			e.preventDefault();
			// this[e.type === "dragover" ? "onDragOver" : "onDragLeave"].call(e.target);

			//继续添加文件
			this.files = e.target.files || e.dataTransfer.files;
			for (var i = 0, f; f = this.files[i]; i++) {
				if (f.size <= this.limit) {
					f.index = Math.random().toString().substr(2); //增加唯一索引值
				} else {
					this.delete(f.name);
				}

			}
			//执行选择回调
			this.select(this.files);
			return this;
		},
		//删除对应的文件
		delete: function(name) {
			var arrFile = [];
			for (var i = 0, file; file = this.files[i]; i++) {
				if (file != name) {
					arrFile.push(file);
				} else {
					this.delete(name);
				}
			}
			this.files = arrFile;
			return this;
		},

		//文件上传
		go: function() {
			var that = this;
			if (location.host.indexOf("sitepointstatic") >= 0) {
				//非站点服务器上运行
				return;
			}

			for (var i = 0, f; f = this.files[i]; i++) {
				(function(file) {
					var xhr = new XMLHttpRequest();
					if (xhr.upload) {

						var data = new FormData();
						data.append(that.filename, file);
						for (key in that.data) {
							data.append(key, that.data[key]);
						}

						// 上传中
						xhr.upload.addEventListener("progress", function(e) {
							that.progress(file, e.loaded, e.total);
						}, false);

						// 文件上传成功或是失败
						xhr.onreadystatechange = function(e) {
							if (xhr.readyState == 4) {
								if (xhr.status == 200) {
	 
									if(xhr.responseText.substr(0,1)=="{"){
										xhr.responseText=eval("("+xhr.responseText+")");
									}
									that.success(file, xhr.responseText);
									that.delete(file);
									if (!that.files.length) {
										//全部完毕
										that.done();
									}
								} else {
									that.error(file, xhr.responseText);
								}
							}
						};

						// 开始上传
						xhr.open("POST", that.url, true);
						// xhr.setRequestHeader('Cache-Control', 'no-cache')
						// xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
						// xhr.setRequestHeader("Content-Type", "multipart/form-data");
						// xhr.setRequestHeader('X-Request-With','XMLHttpRequest');
						for (key in that.header) {
							xhr.setRequestHeader(key, that.header[key]);
						}
 						xhr.withCredentials = false;
						xhr.send(data);
					}
				})(f);
			}

		},

		init: function() {
			var that = this;

			if (that.drag) {
				that.drag.addEventListener("dragover", function(e) {
					that.dragover(e);
				}, false);
				that.drag.addEventListener("dragleave", function(e) {
					that.dragleave(e);
				}, false);
				that.drag.addEventListener("drop", function(e) {
					that.getFiles(e);
				}, false);
			}

			//文件选择控件选择
			if (that.input) {
				var accepts = [];
				var exts = that.ext.split(",");
				for (var i = 0; i < exts.length; i++) {
					accepts.push(that.mimes[exts[i]]);
				};
				that.input.setAttribute("accept", accepts.join(","));
				if (that.multiple) {
					that.input.setAttribute("multiple", "multiple");
				}
				var up = function(e) {
					that.getFiles(e);
					if (that.auto) {
						that.go(e);
					}
				};
				that.input.addEventListener("change", function(e) {
					that.getFiles(e);
					if (that.auto) {
						that.go(e);
					}
					that.input.value="";
				}, false);
			}

			//上传按钮提交
			if (that.button) {
				that.button.addEventListener("click", function(e) {
					that.go(e);
				}, false);
			}
		}

	};
	
	var VueUpload={
		install:function(Vue){
			Vue.prototype.$upload=function(options){
				for(key in options){
					upload[key]=options[key];
				}
				upload.init();
			};
		}
	}
 
	if (typeof exports == "object") {
		module.exports = VueUpload;
	} else if (typeof define == "function" && define.amd) {
		define([], function() {
			return VueUpload
		});
	} else if (window.Vue) {
		window.VueUpload = VueUpload;
		Vue.use(VueUpload);
	};
})();