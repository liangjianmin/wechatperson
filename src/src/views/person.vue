<template>
    <div class="phoneBox">
        <div class="nr">
            <div class="audio-btn autio-off autio-rotate" id="audio_btn">
                <audio id="bgmusic" preload="auto" autoplay="autoplay" loop="loop">
                    <source src="http://liangjm.bceapp.com/bean.mp3">
                </audio>
            </div>
            <section class="main-page" v-for="(item,index) in list" :class="{'z-current':current==index}">
                <div class="bg">
                    <span ref="piclist" class="person-pic" style=""></span>
                </div>
            </section>
            <div class="arrows"><i class="ico"></i></div>
        </div>
        <div class="ctrl_panel">
            <a id="pre_page" type="button" class="pre_btn btn">上一页</a>
            <a id="next_page" type="button" class="next_btn btn">下一页</a>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import person from '../../assets/js/h5.js'
    export default {
        name: 'person',
        data() {
            return {
                current: 0,
                list: [],
                personshare: {}
            }
        },
        mounted(){
            var path = this.$route.query.picid;
            this.getlist(path);
            this.play();
        },
        methods: {
            getlist(path){
                var self = this;
                self.$http.get('person?picid=' + path).then(function (res) {
                    if (res.data.status) {
                        document.title=res.data.data[0].nickname+'个人展示页面';
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
                    title:'这是我的个人展示页面，邀请您一起欣赏',
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
            }
        }
    }
</script>
<style scoped>
    @import '../../assets/css/person.css';
</style>
