<template>
    <section class="page boxsiz home">
        <div class="tip-prompt boxsiz">
            <div class="time"></div>
            <div class="weather"></div>
        </div>
        <div class="auth-user" v-if="auth" v-for="item in userinfo">
            <p class="lineBlock va-m">亲爱的{{item.nickname}}</p>
            <p class="lineBlock va-m">{{item.sex | ruleFormat}}</p>
            <img :src="item.headimgurl" class="va-m headimg">
        </div>
        <div class="picwrap boxsiz" v-if="isShow">
            <input type="button" value="请授权登录" class="btn" @click.stop="authLogin" v-if="authbtn">
            <div v-if="uploadshow">
                <input type="button" value="上传图片" class="btn" @click.stop="chooseImage" v-if="flag">
                <ul class="piclist clr boxsiz">
                    <li v-for="(item,index) in piclist" @click="previewImage(index)">
                        <img :src="item" alt="" class="piclistattr">
                    </li>
                </ul>
                <input type="button" :value="btntext" class="btn" id="save" v-if="visibile" @click.stop="handleSubmit">
            </div>
        </div>
        <div class="entry" v-if="entry">
            <input type="button" value="点击进入你的相册页面" class="btn" @click.stop="entrySubmit">
        </div>
    </section>
</template>
<script>
    import $ from 'jquery'
    import {Toast} from 'mint-ui';
    import {Indicator} from 'mint-ui';
    import home from '../../assets/js/home.js'
    export default {
        name: 'home',
        data() {
            return {
                btntext:'心有灵犀一点',
                picid:'',
                entry:false,
                isShow:true,
                auth:false,
                authbtn:true,
                uploadshow:false,
                piclist: [],
                flag: true,
                visibile: false,
                count: 4,
                serverId: [],
                userinfo:[],
                openid:''
            }
        },
        mounted(){
            home.init();
            var path=this.$route.query.openid;
            if(path != undefined){
                this.getAuthinfo(path);
                this.openid=path;
            }else{
                this.getSession(path);
            }
        },
        watch: {
            $route(to){
                var path = to.path.substring(1);
                 if(path == 'home'){
                     this.btntext='心有灵犀一点';
                 }
            }
        },
        methods: {
            chooseImage(){
                var self = this;
                wx.ready(function () {
                    wx.chooseImage({
                        count: self.count,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['album', 'camera'],
                        success: function (res) {
                            for (var i = 0; i < res.localIds.length; i++) {
                                self.piclist.push(res.localIds[i]);
                            }
                            if (self.piclist.length > 0) {
                                self.visibile = true;
                                if (self.piclist.length >= self.count) {
                                    self.flag = false;
                                }
                            }
                        }
                    });
                });
            },
            handleSubmit(){
                var self = this;
                var i = 0, length = self.piclist.length;
                if (length <= 1) {
                    Toast({
                        message: '请至少上传1张以上图片',
                        duration: 1000
                    })
                    return false;
                } else {
                    function upload() {
                        wx.uploadImage({
                            localId: self.piclist[i],
                            success: function (res) {
                                i++;
                                self.serverId.push(res.serverId);
                                if (i < length) {
                                    upload();
                                } else {
                                    Indicator.open({
                                        text: '正在处理',
                                        spinnerType: 'fading-circle'
                                    });
                                    self.$http.post('upload', {url: self.serverId,openid:self.openid}).then(function (resu) {
                                        if (resu.data.status) {
                                            Indicator.close();
                                            let instance = Toast({
                                                message: resu.data.msg,
                                                iconClass: 'mintui mintui-success'
                                            });
                                            setTimeout(() => {
                                                instance.close();
                                                self.$router.push({path: '/person', query: {picid: resu.data.picid}});
                                            }, 500)
                                        }
                                    });
                                }
                            },
                            fail: function (res) {
                                Toast({
                                    message: '服务器出错',
                                });
                            }
                        });
                    }

                    upload();
                }
            },
            authLogin(){
                var self = this;
                self.$http.get('wx_login').then((res) => {
                    if (res.data.status) {
                        window.location.href=res.data.data;
                    }
                });
            },
            getAuthinfo(path){
                if(path){
                    this.$http.post('getAuthinfo',{
                        openid:path
                    }).then(res=>{
                       if(res.data.status){
                           if(res.data.data[0].url !=undefined &&  res.data.data[0].url.length > 0){
                               this.auth=true;
                               this.isShow=false;
                               this.entry=true;
                               this.userinfo=res.data.data;
                               this.picid=res.data.data[0].openid;
                           }else {
                               this.auth=true;
                               this.uploadshow=true;
                               this.authbtn=false;
                               this.userinfo=res.data.data;
                           }
                       }
                    });
                }
            },
            getSession(path){
                if(path == undefined){
                    this.$http.post('getSession').then(res=>{
                        if(res.data.status){
                            this.getAuthinfo(res.data.openid);
                            this.openid=res.data.openid;
                            if(res.data.dataid){
                                this.isShow=false;
                                this.entry=true;
                                this.picid=res.data.openid;
                            }
                        }
                    });
                }
            },
            entrySubmit(){
                this.$router.push({path: '/person', query: {picid: this.picid}});
            },
            previewImage(index){
                var self=this;
                wx.previewImage({
                    current: self.piclist[index],
                    urls: self.piclist
                });
            }
        }
    }
</script>
<style scoped>
    .home {
        width: 100%;
        height: 100%;
        background: url("../../assets/images/014eeb554403120000019ae9e1e273.jpg") no-repeat;
        background-size: cover;
        overflow: hidden;
    }
</style>
