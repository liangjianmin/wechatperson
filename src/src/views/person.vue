<template>
    <div class="person">
        <div class="phoneBox" :class="{'visibility':isvisibility}">
            <div class="nr">
                <div class="audio-btn autio-off autio-rotate" id="audio_btn">
                    <audio id="bgmusic" preload="auto" autoplay="autoplay" loop="loop">
                        <source src="http://liangjm.bceapp.com/world.mp3">
                    </audio>
                </div>
                <section class="main-page" v-for="(item,index) in list" :class="{'z-current':current==index}">
                    <div class="bg">
                        <div ref="piclist" class="person-pic"></div>
                        <div v-if="animationtext">
                            <div class="intrduction" v-if="index == 0">
                                <img :src="personshare.headimgurl" alt="" class="headpic">
                                <div class="head"></div>
                            </div>
                            <template v-if="index%2 == 0">
                                <span class="left-text">人生处处是风景</span>
                            </template>
                            <template v-else>
                                <span class="right-text">生活处处是诗意</span>
                            </template>
                        </div>
                    </div>
                    <span class="pagenum">{{index+1}}/{{list.length}}</span>
                </section>
                <section class="u-arrow-bottom">
                    <div class="pre-wrap-bottom">
                        <div class="pre-box1">
                            <div class="pre1"></div>
                        </div>
                        <div class="pre-box2">
                            <div class="pre2"></div>
                        </div>
                    </div>
                </section>
            </div>
            <div class="ctrl_panel">
                <a id="pre_page" type="button" class="pre_btn btn">上一页</a>
                <a id="next_page" type="button" class="next_btn btn">下一页</a>
            </div>
        </div>
        <div class="redux" v-if="redux">
            <img id="redux" src="images/bg.png" class="redux"/>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import eraser from '../../assets/js/eraser.js'
    import person from '../../assets/js/h5.js'
    export default {
        name: 'person',
        data() {
            return {
                redux:true,
                isvisibility: true,
                current: 0,
                list: [],
                personshare: {},
                animationtext:false
            }
        },
        mounted(){
            var path = this.$route.query.picid;
            this.getlist(path);
            this.play();
            eraser.Initialization();
        },
        methods: {
            getlist(path){
                var self = this;
                self.$http.get('person?picid=' + path).then(function (res) {
                    if (res.data.status) {
                        document.title = res.data.data[0].nickname + '个人展示页面';
                        self.list = res.data.data[0].url.split(',');
                        self.personshare = res.data.data[0];
                        if (self.list.length > 0) {
                            setTimeout(() => {
                                self.init();
                                self.share();
                            }, 0)
                        }
                    }
                });
            },
            init(){
                var self = this;
                var url = document.location.origin;
                person.init();
                for (var i = 0; i < this.$refs.piclist.length; i++) {
                    $(".person-pic").eq(i).css('backgroundImage', 'url(' + url + '/upload/' + self.list[i] + '.jpg)');
                }
                $('#redux').eraser({
                    progressFunction: function (p) {
                        var oSize=Math.round(p * 100);
                        if (parseInt(oSize) > 10) {
                            $('#redux').eraser('clear');
                            self.isvisibility = false;
                            self.animationtext=true;
                            setTimeout(()=>{
                                self.redux=false;
                            },100)
                        }
                    }
                });

            },
            play(){
                audioAutoPlay();
                function audioAutoPlay() {
                    var audio = document.querySelector("#bgmusic"),
                        play = function () {
                            audio.play();
                            document.removeEventListener("touchstart", play, false);
                        };
                    audio.play();
                    document.addEventListener("WeixinJSBridgeReady", function () {
                        play();
                    }, false);
                    document.addEventListener('YixinJSBridgeReady', function () {
                        play();
                    }, false);
                    document.addEventListener("touchstart", play, false);
                }

                $("#audio_btn").click(function () {
                    var music = document.querySelector("#bgmusic");
                    if (music.paused) {
                        $("#audio_btn").addClass("autio-rotate");
                        music.play();
                    } else {
                        $("#audio_btn").removeClass("autio-rotate");
                        music.pause();
                    }
                });
            },
            share(){
                var self = this;
                var href = window.location.href;
                //  分享给朋友
                wx.onMenuShareAppMessage({
                    title: self.personshare.nickname,
                    desc: '这是我的个人页面，邀请您一起欣赏',
                    link: href,
                    imgUrl: self.personshare.headimgurl,
                    trigger: function (res) {

                    },
                    success: function (res) {

                    },
                    cancel: function (res) {

                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: '这是我的个人展示页面，邀请您一起欣赏',
                    link: href,
                    imgUrl: self.personshare.headimgurl,
                    trigger: function (res) {

                    },
                    success: function (res) {

                    },
                    cancel: function (res) {

                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
                // 分享到QQ
                wx.onMenuShareQQ({
                    title: self.personshare.nickname,
                    desc: '这是我的个人页面，邀请您一起欣赏',
                    link: href,
                    imgUrl: self.personshare.headimgurl,
                    trigger: function (res) {

                    },
                    complete: function (res) {

                    },
                    success: function (res) {

                    },
                    cancel: function (res) {

                    },
                    fail: function (res) {
                        alert(JSON.stringify(res));
                    }
                });
            }
        }
    }
</script>
<style scoped>
    @import '../../assets/css/person.css';

    .person {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
    }

    .redux {
        width: 100%;
        height: 100%;
    }
</style>
