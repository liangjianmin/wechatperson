module.exports = {
   init:function () {
     function mobilecheck() {
       var a = !1;
       return function (b) {
         (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(b) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(b.substr(0, 4))) && (a = !0)
       }(navigator.userAgent || navigator.vendor || window.opera), a}

     function isWeixin() {
       var a = navigator.userAgent.toLowerCase();
       return "micromessenger" == a.match(/MicroMessenger/i) ? !0 : !1
     }

     function countCharacters(a) {
       for (var b = 0,
              c = 0; c < a.length; c++) {
         var d = a.charCodeAt(c);
         d >= 1 && 126 >= d || d >= 65376 && 65439 >= d ? b++ : b += 2
       }
       return b
     }

     function completeEffect(a) {
       return $(a).find("canvas")[0] && (!$(a).find("canvas").hasClass("noOp") || $(a).find("canvas").hasClass("noMove")) || $(a).find(".finger_background")[0] && !$(a).find(".finger_background").hasClass("noFinger") || $(a).find(".video_mask")[0] ? !1 : !0
     }

     function verticalMove() {
       if (Math.abs(moveDistanceY) > Math.abs(moveDistanceX) && completeEffect(currentPage))
         if (moveDistanceY > 0) {
           if (theClass._isDisableFlipPrevPage) return;
           isNext || isFirstTime ? (isNext = !1, isFirstTime = !1, activePage && (activePage.classList.remove("z-active"), activePage.classList.remove("z-move")), scroll ? triggerLoop = !0 : currentPage.previousElementSibling && currentPage.previousElementSibling.classList.contains("main-page") ? activePage = currentPage.previousElementSibling : (activePage = theClass._$pages.last().get(0), triggerLoop = !0), activePage && activePage.classList.contains("main-page") ? (activePage.classList.add("z-active"), activePage.classList.add("z-move"), activePage.style.webkitTransition = "none", activePage.style.webkitTransform = "translateY(-" + window.innerHeight + "px)", activePage.style.mozTransition = "none", activePage.style.mozTransform = "translateY(-" + window.innerHeight + "px)", activePage.style.transition = "none", activePage.style.transform = "translateY(-" + window.innerHeight + "px)", $(activePage).trigger("active"), currentPage.style.webkitTransformOrigin = "bottom center", currentPage.style.mozTransformOrigin = "bottom center", currentPage.style.transformOrigin = "bottom center") : (currentPage.style.webkitTransform = "translateY(0px) scale(1)", currentPage.style.mozTransform = "translateY(0px) scale(1)", currentPage.style.transform = "translateY(0px) scale(1)", activePage = null)) : (activePage.style.webkitTransform = "translateY(-" + (window.innerHeight - moveDistanceY) + "px)", activePage.style.mozTransform = "translateY(-" + (window.innerHeight - moveDistanceY) + "px)", activePage.style.transform = "translateY(-" + (window.innerHeight - moveDistanceY) + "px)", "1" == theClass._scrollMode && (currentPage.style.webkitTransform = "scale(" + (window.innerHeight / (window.innerHeight + moveDistanceY)).toFixed(3) + ")", currentPage.style.mozTransform = "scale(" + (window.innerHeight / (window.innerHeight + moveDistanceY)).toFixed(3) + ")", currentPage.style.transform = "scale(" + (window.innerHeight / (window.innerHeight + moveDistanceY)).toFixed(3) + ")"))
         } else if (0 > moveDistanceY) {
           if (theClass._isDisableFlipNextPage) return;
           !isNext || isFirstTime ? (isNext = !0, isFirstTime = !1, activePage && (activePage.classList.remove("z-active"), activePage.classList.remove("z-move")), scroll ? triggerLoop = !0 : currentPage.nextElementSibling && currentPage.nextElementSibling.classList.contains("main-page") ? activePage = currentPage.nextElementSibling : (activePage = theClass._$pages.first().get(0), triggerLoop = !0), activePage && activePage.classList.contains("main-page") ? (activePage.classList.add("z-active"), activePage.classList.add("z-move"), activePage.style.webkitTransition = "none", activePage.style.webkitTransform = "translateY(" + window.innerHeight + "px)", activePage.style.mozTransition = "none", activePage.style.mozTransform = "translateY(" + window.innerHeight + "px)", activePage.style.transition = "none", activePage.style.transform = "translateY(" + window.innerHeight + "px)", $(activePage).trigger("active"), currentPage.style.webkitTransformOrigin = "top center", currentPage.style.mozTransformOrigin = "top center", currentPage.style.transformOrigin = "top center") : (currentPage.style.webkitTransform = "translateY(0px) scale(1)", currentPage.style.mozTransform = "translateY(0px) scale(1)", currentPage.style.transform = "translateY(0px) scale(1)", activePage = null)) : (activePage.style.webkitTransform = "translateY(" + (window.innerHeight + moveDistanceY) + "px)", activePage.style.mozTransform = "translateY(" + (window.innerHeight + moveDistanceY) + "px)", activePage.style.transform = "translateY(" + (window.innerHeight + moveDistanceY) + "px)", "1" == theClass._scrollMode && (currentPage.style.webkitTransform = "scale(" + ((window.innerHeight + moveDistanceY) / window.innerHeight).toFixed(3) + ")", currentPage.style.mozTransform = "scale(" + ((window.innerHeight + moveDistanceY) / window.innerHeight).toFixed(3) + ")", currentPage.style.transform = "scale(" + ((window.innerHeight + moveDistanceY) / window.innerHeight).toFixed(3) + ")"))
         }
     }

     function verticalEnd() {
       Math.abs(moveDistanceY) > Math.abs(moveDistanceX) && Math.abs(moveDistanceY) > 20 ? ("1" == theClass._scrollMode ? (currentPage.style.webkitTransform = "scale(0.2)", activePage.style.webkitTransform = "translateY(0px)", currentPage.style.mozTransform = "scale(0.2)", activePage.style.mozTransform = "translateY(0px)", currentPage.style.transform = "scale(0.2)", activePage.style.transform = "translateY(0px)") : (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateY(0px)", currentPage.style.mozTransform = "scale(1)", activePage.style.mozTransform = "translateY(0px)", currentPage.style.transform = "scale(1)", activePage.style.transform = "translateY(0px)"), $(activePage).find("canvas")[0] && !$(activePage).find("canvas").hasClass("noOp") ? $("#audio_btn").css("opacity", 0) : $(activePage).find(".finger_background")[0] && !$(activePage).find(".finger_background").hasClass("noFinger") && $("#audio_btn").css("opacity", 0), setTimeout(function () {
             activePage.classList.remove("z-active"),
               activePage.classList.remove("z-move"),
               activePage.classList.add("z-current"),
               currentPage.classList.remove("z-current"),
               currentPage.classList.remove("z-move"),
               theClass._isDisableFlipPage = !1,
               theClass.$currentPage = $(activePage).trigger("current"),
               $(currentPage).trigger("hide")
           },
           500)) : (isNext ? (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateY(100%)", currentPage.style.mozTransform = "scale(1)", activePage.style.mozTransform = "translateY(100%)", currentPage.style.transform = "scale(1)", activePage.style.transform = "translateY(100%)") : (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateY(-100%)", currentPage.style.mozTransform = "scale(1)", activePage.style.mozTransform = "translateY(-100%)", currentPage.style.transform = "scale(1)", activePage.style.transform = "translateY(-100%)"), setTimeout(function () {
             activePage.classList.remove("z-active"),
               activePage.classList.remove("z-move"),
               theClass._isDisableFlipPage = !1
           },
           500))
     }

     function horizontalMove() {
       if (Math.abs(moveDistanceX) > Math.abs(moveDistanceY) && completeEffect(currentPage))
         if (moveDistanceX > 0) {
           if (theClass._isDisableFlipPrevPage) return;
           isNext || isFirstTime ? (isNext = !1, isFirstTime = !1, activePage && (activePage.classList.remove("z-active"), activePage.classList.remove("z-move")), scroll ? triggerLoop = !0 : currentPage.previousElementSibling && currentPage.previousElementSibling.classList.contains("main-page") ? activePage = currentPage.previousElementSibling : (activePage = theClass._$pages.last().get(0), triggerLoop = !0), activePage && activePage.classList.contains("main-page") ? (activePage.classList.add("z-active"), activePage.classList.add("z-move"), activePage.style.webkitTransition = "none", activePage.style.webkitTransform = "translateX(-" + window.innerWidth + "px)", activePage.style.mozTransition = "none", activePage.style.mozTransform = "translateX(-" + window.innerWidth + "px)", activePage.style.transition = "none", activePage.style.transform = "translateX(-" + window.innerWidth + "px)", $(activePage).trigger("active"), currentPage.style.webkitTransformOrigin = "center right", currentPage.style.mozTransformOrigin = "center right", currentPage.style.transformOrigin = "center right") : (currentPage.style.webkitTransform = "translateX(0px) scale(1)", currentPage.style.mozTransform = "translateX(0px) scale(1)", currentPage.style.transform = "translateX(0px) scale(1)", activePage = null)) : (activePage.style.webkitTransform = "translateX(-" + (window.innerWidth - moveDistanceX) + "px)", activePage.style.mozTransform = "translateX(-" + (window.innerWidth - moveDistanceX) + "px)", activePage.style.transform = "translateX(-" + (window.innerWidth - moveDistanceX) + "px)", "3" == theClass._scrollMode && (currentPage.style.webkitTransform = "scale(" + (window.innerWidth / (window.innerWidth + moveDistanceX)).toFixed(3) + ")", currentPage.style.mozTransform = "scale(" + (window.innerWidth / (window.innerWidth + moveDistanceX)).toFixed(3) + ")", currentPage.style.transform = "scale(" + (window.innerWidth / (window.innerWidth + moveDistanceX)).toFixed(3) + ")"))
         } else if (0 > moveDistanceX) {
           if (theClass._isDisableFlipNextPage) return;
           !isNext || isFirstTime ? (isNext = !0, isFirstTime = !1, activePage && (activePage.classList.remove("z-active"), activePage.classList.remove("z-move")), scroll ? triggerLoop = !0 : currentPage.nextElementSibling && currentPage.nextElementSibling.classList.contains("main-page") ? activePage = currentPage.nextElementSibling : (activePage = theClass._$pages.first().get(0), triggerLoop = !0), activePage && activePage.classList.contains("main-page") ? (activePage.classList.add("z-active"), activePage.classList.add("z-move"), activePage.style.webkitTransition = "none", activePage.style.webkitTransform = "translateX(" + window.innerWidth + "px)", activePage.style.mozTransition = "none", activePage.style.mozTransform = "translateX(" + window.innerWidth + "px)", activePage.style.transition = "none", activePage.style.transform = "translateX(" + window.innerWidth + "px)", $(activePage).trigger("active"), currentPage.style.webkitTransformOrigin = "center left", currentPage.style.mozTransformOrigin = "center left", currentPage.style.transformOrigin = "center left") : (currentPage.style.webkitTransform = "translateX(0px) scale(1)", currentPage.style.mozTransform = "translateX(0px) scale(1)", currentPage.style.transform = "translateX(0px) scale(1)", activePage = null)) : (activePage.style.webkitTransform = "translateX(" + (window.innerWidth + moveDistanceX) + "px)", activePage.style.mozTransform = "translateX(" + (window.innerWidth + moveDistanceX) + "px)", activePage.style.transform = "translateX(" + (window.innerWidth + moveDistanceX) + "px)", "3" == theClass._scrollMode && (currentPage.style.webkitTransform = "scale(" + ((window.innerWidth + moveDistanceX) / window.innerWidth).toFixed(3) + ")", currentPage.style.mozTransform = "scale(" + ((window.innerWidth + moveDistanceX) / window.innerWidth).toFixed(3) + ")", currentPage.style.transform = "scale(" + ((window.innerWidth + moveDistanceX) / window.innerWidth).toFixed(3) + ")"))
         }
     }

     function horizontalEnd() {
       Math.abs(moveDistanceX) > Math.abs(moveDistanceY) && Math.abs(moveDistanceX) > 20 ? ("3" == theClass._scrollMode ? (currentPage.style.webkitTransform = "scale(0.2)", activePage.style.webkitTransform = "translateX(0px)", currentPage.style.mozTransform = "scale(0.2)", activePage.style.mozTransform = "translateX(0px)", currentPage.style.transform = "scale(0.2)", activePage.style.transform = "translateX(0px)") : (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateX(0px)", currentPage.style.mozTransform = "scale(1)", activePage.style.mozTransform = "translateX(0px)", currentPage.style.transform = "scale(1)", activePage.style.transform = "translateX(0px)"), $(activePage).find("canvas")[0] && !$(activePage).find("canvas").hasClass("noOp") ? $("#audio_btn").css("opacity", 0) : $(activePage).find(".finger_background")[0] && !$(activePage).find(".finger_background").hasClass("noFinger") && $("#audio_btn").css("opacity", 0), setTimeout(function () {
             activePage.classList.remove("z-active"),
               activePage.classList.remove("z-move"),
               activePage.classList.add("z-current"),
               currentPage.classList.remove("z-current"),
               currentPage.classList.remove("z-move"),
               theClass._isDisableFlipPage = !1,
               theClass.$currentPage = $(activePage).trigger("current"),
               $(currentPage).trigger("hide");
           },
           500)) : (isNext ? (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateX(100%)", currentPage.style.mozTransform = "scale(1)", activePage.style.mozTransform = "translateX(100%)", currentPage.style.transform = "scale(1)", activePage.style.transform = "translateX(100%)") : (currentPage.style.webkitTransform = "scale(1)", activePage.style.webkitTransform = "translateX(-100%)", currentPage.style.mozTransform = "scale(1)", activePage.style.mozTransform = "translateX(-100%)", currentPage.style.transform = "scale(1)", activePage.style.transform = "translateX(-100%)"), setTimeout(function () {
             activePage.classList.remove("z-active"),
               activePage.classList.remove("z-move"),
               theClass._isDisableFlipPage = !1;
           },
           500))
     }

     function pageScroll(a) {
       scroll = !0;
       var b = $(currentPage).find(".m-img").attr("id").charAt(4),
         c = $(currentPage).siblings(".main-page").find("#page" + a);
       activePage = $(c).parent(".main-page")[0],
         b > a ? prePage() : a > b && nextPage()
     }

     function scrollStart(a) {
       isMobile && a && (a = event),
       theClass._isDisableFlipPage || (currentPage = theClass._$pages.filter(".z-current").get(0), scroll || (activePage = null), currentPage && completeEffect(currentPage) && (isStart = !0, isNext = !1, isFirstTime = !0, moveDistanceX = 0, moveDistanceY = 0, a && "mousedown" == a.type ? (startX = a.pageX, startY = a.pageY) : a && "touchstart" == a.type && (startX = a.touches[0].pageX, startY = a.touches[0].pageY), currentPage.classList.add("z-move"), currentPage.style.webkitTransition = "none", currentPage.style.mozTransition = "none", currentPage.style.transition = "none"))
     }

     function scrollMove(a) {
       isMobile && a && (a = event),
       isStart && theClass._$pages.length > 1 && (a && "mousemove" == a.type ? (moveDistanceX = a.pageX - startX, moveDistanceY = a.pageY - startY) : a && "touchmove" == a.type && (moveDistanceX = a.touches[0].pageX - startX, moveDistanceY = a.touches[0].pageY - startY), "0" == theClass._scrollMode || "2" == theClass._scrollMode || "1" == theClass._scrollMode ? verticalMove() : ("4" == theClass._scrollMode || "3" == theClass._scrollMode) && horizontalMove())
     }

     function scrollEnd() {
       isStart && completeEffect(currentPage) && (isStart = !1, activePage ? (theClass._isDisableFlipPage = !0, currentPage.style.webkitTransition = "-webkit-transform 0.4s ease-out", activePage.style.webkitTransition = "-webkit-transform 0.4s ease-out", currentPage.style.mozTransition = "-moz-transform 0.4s ease-out", activePage.style.mozTransition = "-moz-transform 0.4s ease-out", currentPage.style.transition = "transform 0.4s ease-out", activePage.style.transition = "transform 0.4s ease-out", "0" == theClass._scrollMode || "2" == theClass._scrollMode || "1" == theClass._scrollMode ? verticalEnd() : ("4" == theClass._scrollMode || "3" == theClass._scrollMode) && horizontalEnd()) : currentPage.classList.remove("z-move")),
         scroll = !1;
     }

     function prePage() {
       var a = 0;
       scrollStart();
       var b = setInterval(function () {
           a += 1,
             0 == flipMode || 1 == flipMode || 2 == flipMode ? moveDistanceY = a : (3 == flipMode || 4 == flipMode) && (moveDistanceX = a),
             scrollMove(),
           a >= 21 && (clearInterval(b), scrollEnd());
         },
         1);
     }

     function nextPage() {
       var a = 0;
       scrollStart();
       var b = setInterval(function () {
           a -= 1,
             0 == flipMode || 1 == flipMode || 2 == flipMode ? moveDistanceY = a : (3 == flipMode || 4 == flipMode) && (moveDistanceX = a),
             scrollMove(), -21 >= a && (clearInterval(b), scrollEnd());
         },
         1);
     }

     var currentPage = null,
       activePage = null,
       triggerLoop = !0,
       startX = 0,
       startY = 0,
       moveDistanceX = 0,
       moveDistanceY = 0,
       isStart = !1,
       isNext = !1,
       isFirstTime = !0,
       theClass, scroll = !1,
       isMobile = mobilecheck(),
       flipMode,
       App = function (a, b) {
         this._$app = a,
           this._$pages = this._$app.find(".main-page"),
           this.$currentPage = this._$pages.eq(0),
           this._isFirstShowPage = !0,
           this._isInitComplete = !1,
           this._isDisableFlipPage = !1,
           this._isDisableFlipPrevPage = !1,
           this._isDisableFlipNextPage = !1,
           this._scrollMode = b,
           flipMode = b,
           theClass = this;
         var c = $("#app");
         !function () {
           c.on("scroll.elasticity",
             function (a) {
               a.preventDefault();
             }).on("touchmove.elasticity",
             function (a) {
               a.preventDefault();
             }),
             c.delegate("img", "mousemove",
               function (a) {
                 a.preventDefault();
               });
         }(),
           theClass._$app.on("mousedown touchstart",
             function (a) {
               scrollStart(a);
             }).on("mousemove touchmove",
             function (a) {
               scrollMove(a);
             }).on("mouseup touchend mouseleave",
             function (a) {
               scrollEnd(a);
             })
       };
     new App($(".nr"), 2);
     $("#pre_page").on('click', function () {
       prePage();
     });
     $("#next_page").on('click', function () {
       nextPage();
     });
   }
}

