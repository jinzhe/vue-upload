<style>
*{
    margin: 0;
    padding: 0;
    outline: 0;
    border: 0;
    font-family: "Helvetica Neue","Arial","PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;    -webkit-tap-highlight-color:rgba(0, 0, 0, 0);
    -webkit-touch-callout:none;
    -webkit-font-smoothing: antialiased;
}
b{
    font-weight: 600;
}
svg:not(:root) {
    overflow: hidden;
}
img {
    vertical-align: middle
}
table {
    border-collapse: collapse;
    border-spacing: 0;
}
a {
    text-decoration: none;
    color: #353535;
}
a:hover {
    text-decoration: none;
}
abbr[title] {
    border-bottom: 1px dotted;
}
b, strong {
    font-weight: 600;
}
dfn {
    font-style: italic;
}
mark {
    background: #ff0;
    color: #000;
}
code, kbd, pre, samp {
    font-family: monospace, serif;
    font-size: 1em;
}
pre {
    white-space: pre-wrap;
}
small {
    font-size: 80%;
}
sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
}
sup {
    top: -0.5em;
}
sub {
    bottom: -0.25em;
}

h1, h2, h3, h4, h5, h6 {
    font-family: inherit;
    font-weight: bold;
    margin: 8px 0;
    line-height: 120%;
}
article, aside, details, figcaption, figure, footer, header, hgroup, main, nav, section, summary {
    display: block;
}
audio, canvas, video {
    display: inline-block;
}
audio:not([controls]) {
    display: none;
    height: 0;
}
address, caption, cite, code, dfn, em, th, var {
    font-style: normal;
    font-weight: 500;
}
/* placeholder focus */
input:focus::-webkit-input-placeholder ,
textarea:focus::-webkit-input-placeholder {
    color: transparent;
}
input:focus::-moz-input-placeholder,
textarea:focus::-moz-input-placeholder {
    color: transparent;
}
input:focus::-ms-input-placeholder,
textarea:focus::-ms-input-placeholder {
    color: transparent;
}
::-ms-clear {
    display: none;
}
::selection {
    background: #333;
    color: white;
}
textarea {
    overflow: auto;
    vertical-align: top;
    resize:none;
}
/* 定位对齐 */
.pa,.absolute {
    position: absolute
}
.pr,.relative {
    position: relative;
}
.pf,.fixed {
    position: fixed
}
/* 手指 */
.cp,.pointer {
    cursor: pointer;
}
/* 文本对齐 */
.text.center {
    text-align: center;
}
.text.left {
    text-align: left;
}
.text.right {
    text-align: right;
}
/* 浮动对齐 */
.float.left, .float.right {
    display: inline;
}
.float.left {
    float: left;
}
.float.right {
    float: right;
}
.clear {
    clear: both;
    zoom: 1;
    font-size: 0;
    height: 0;
}
.clear:after {
    visibility: hidden;
    display: block;
    font-size: 0;
    content: " ";
    clear: both;
    height: 0;
}
:-webkit-autofill {
    -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,1) inset !important;
}
html,body {
    background-color: #fff;
    font-size: 14px;
    font-family: "Helvetica Neue","Arial","PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    line-height: 100%;
    height:100%;
    color: #555;
}

#app{
    height:100%;
}
.layout{
    box-sizing: border-box;
    padding-top:120px; 
}
.demo{
    margin:auto;
    padding:10px;
    width:200px;
    height:200px;
    /*background:#fbfbfb;*/
    border:1px solid #ddd;
    line-height: 200px;
    text-align: center;
    border-radius:2px;
    color:#999;
}
 
.github {
    position: absolute;
    top:-40px;
    left:-90px;
    display: block;
    width:200px;
    height:100px;
    font-size:10px;
    line-height: 160px;
    text-align: center;
    text-decoration: none;
    border-bottom:1px dashed #ccc;
    color:#555;
    background: #fbfbfb;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
}
.github:hover{
    background:#efefef;
    color:#000;
}
 
</style>
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
    <a class="github" href="https://github.com/jinzhe/vue-upload" target="_blank">GITHUB</a>
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