/// <reference path="../../../Scripts/jquery-1.7.2.js" />

//<![CDATA[
//__bannerContext = {"cateId":null,"pageId":189,"currentPage":0,"cityCode":null,"districtId":null}
//]]>
function isIE() {
    var myNav = navigator.userAgent.toLowerCase();
    return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

$(document).ready(function () {

    //showBannerFix();
    if (isIE()=='6') {
        $("#wrap-comment").css("display", "none");
    }

    var positionQuery = '';
    var rand = -1;

    $('.adPosition').each(function () {
        var position = $(this);
        var positionCode = position.attr('positioncode');

        if (positionQuery.length > 0)
            positionQuery += '@';
        if (position.attr('hasshare') != undefined && position.attr('hasnotshare') != undefined) {
            positionQuery += position.attr('hasshare') + '$' + position.attr('hasnotshare') + '$' + positionCode;

        } else {
            positionQuery += positionCode;
        }
    });

    if (positionQuery.length > 0) {
        $.getJSON('/HandlerWeb/BannerHandler.ashx', {
            cateId: __bannerContext.cateId,
            pageId: __bannerContext.pageId,
            currentPage: __bannerContext.currentPage,
            cityCode: __bannerContext.cityCode,
            districtId: __bannerContext.districtId,
            position: positionQuery
        }, function (data) {

            if (data != undefined && data != null && data.lst.length > 0) {

                for (var i = 0; i < data.lst.length; i++) {

                    var positionObj = data.lst[i];

                    if (positionObj.position == 'BANNER_POSITION_FIX')//fix bo qua vi tri nay.
                        continue;

                    var positionDom = $('.adPosition[positioncode=' + positionObj.position + ']');
                    if (positionDom.length > 0) {

                        var htmlPosition = '';
                        var stylex = positionDom.attr('stylex');

                        if (screen.width < 1366 && positionObj.position == 'BANNER_POSITION_RIGHT' && positionObj.banners.length > 1) {
                            $("#wrap-comment").css("display", "none");
                        }

                        for (var j = 0; j < positionObj.banners.length; j++) {

                            var isShare = false;

                            if (positionObj.position == 'BANNER_POSITION_FIX') {
                                if (rand > -1) continue;
                                var nlen = positionObj.banners[j].items.length;
                                rand = nlen == 1 ? 0 : GenerateRandom(nlen);

                                var bannerFix = positionObj.banners[j].items[rand];
                                if (bannerFix != 'undefined') {
                                    if (bannerFix.isShare && isShare == false) {
                                        isShare = true;
                                        htmlPosition += '<div class="adshared">';
                                    }
                                    if (bannerFix.isShare == false && isShare == true) {
                                        isShare = false;
                                        htmlPosition += '</div>';
                                    }

                                    htmlPosition += '<div class="aditem" time="' + bannerFix.TimeToLive + '" style = "height:' + bannerFix.Height + "px;" + stylex + '" src="' + bannerFix.Src + '" altsrc="' + bannerFix.AltSrc + '" link="' + bannerFix.LinkUrl + '" bid="' + bannerFix.BannerId + '" tip="' + bannerFix.Tooltip + '" tp="' + bannerFix.BannerTypeId + '" w="' + bannerFix.Width + '" h="' + bannerFix.Height + '"></div>';


                                    if (k == positionObj.banners[j].items.length - 1 && isShare == true) {
                                        htmlPosition += '</div>';
                                    }
                                }
                            } else {
                                var arrItem = new Array();
                                for (var k = 0; k < positionObj.banners[j].items.length; k++) {
                                    arrItem[k] = k;
                                }
                                //                                if (positionObj.banners[j].isshare) {
                                //                                    arrItem = shuffleArray(arrItem);
                                //                                    //console.log(positionObj.position + ' ' + arrItem);
                                //                                }

                                for (k = 0; k < positionObj.banners[j].items.length; k++) {
                                    var bannerObj = positionObj.banners[j].items[arrItem[k]];

                                    if (bannerObj.isShare && isShare == false) {
                                        isShare = true;
                                        htmlPosition += '<div class="adshared">';
                                    }
                                    if (bannerObj.isShare == false && isShare == true) {
                                        isShare = false;
                                        htmlPosition += '</div>';
                                    }

                                    if (isShare) {
                                        htmlPosition += '<div class="adshareditem aditem" time="' + bannerObj.TimeToLive + '" style="' + stylex + "display: " + (k == 0 ? 'block' : 'none') + '" src="' + bannerObj.Src + '" altsrc="' + bannerObj.AltSrc + '" link="' + bannerObj.LinkUrl + '" bid="' + bannerObj.BannerId + '" tip="' + bannerObj.Tooltip + '" tp="' + bannerObj.BannerTypeId + '" w="' + bannerObj.Width + '" h="' + bannerObj.Height + '"></div>';
                                    } else {
                                        htmlPosition += '<div class="aditem" time="' + bannerObj.TimeToLive + '" style="' + stylex + '" src="' + bannerObj.Src + '" altsrc="' + bannerObj.AltSrc + '" link="' + bannerObj.LinkUrl + '" bid="' + bannerObj.BannerId + '" tip="' + bannerObj.Tooltip + '" tp="' + bannerObj.BannerTypeId + '" w="' + bannerObj.Width + '" h="' + bannerObj.Height + '"></div>';
                                    }

                                    if (k == positionObj.banners[j].items.length - 1 && isShare == true) {
                                        htmlPosition += '</div>';
                                    }
                                }
                            }
                        }
                        positionDom.append(htmlPosition);
                        //GopY();
                    }
                }
            }

            $('.aditem').each(function () {

                if ($(this).children().length == 0) {

                    var src = $(this).attr('src');
                    var altsrc = $(this).attr('altsrc');
                    var link = $(this).attr('link');
                    var bid = $(this).attr('bid');
                    var tip = $(this).attr('tip');
                    var type = $(this).attr('tp');
                    var wid = $(this).attr('w');
                    var hei = $(this).attr('h');
                    if (hei == '0')
                        hei = 'auto';
                    else
                        hei = hei + 'px';
                    var attrRel = "nofollow"; // thuộc tính no-follow
                    // banner đặt làm trang chủ
                    if ($.browser.msie && bid == 733) {
                        src = "http://file1.batdongsan.com.vn/file.268294.jpg";
                        html = '<a rel="nofollow" title="" href="javascript:setHomepage();"><img bannerid="' + bid + '" class="view-count click-count" style="width: 100%; height:350px" src="' + src + '"></a>';
                        $(this).append(html);
                        return;
                    }

                    // banner fix
                    if (bid == 904 || bid == 907) {
                        src = src.replace('.jpg', '.swf');

                        html = '<object width="' + wid + 'px" border="0" height="' + hei + '" class="view-count" bannerid="' + bid + '" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param value="' + src + '" name="movie"><param value="link=http://batdongsan.com.vn/click.aspx?bannerid=' + bid + '" name="flashvars"><param value="always" name="AllowScriptAccess"><param value="High" name="quality"><param value="transparent" name="wmode"><embed width="' + wid + 'px" height="' + hei + '" allowscriptaccess="always" wmode="transparent" loop="true" play="true" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="' + src + '" flashvars="link=http://batdongsan.com.vn/click.aspx?bannerid=' + bid + '"></object>';
                        if ($.browser.msie) {
                            var vleft = (($(document).width() - $('.site').width()) / 2) - $('#ban_left').width();

                            $('#ban_left').children().first().css({ top: '0px', position: 'fixed', left: vleft + 'px' });
                            $('#ban_left').children().next().css({ top: '360px', position: 'fixed', left: vleft + 'px' });
                        }
                        else {
                            $('#ban_left').children().first().css({ top: '0px', position: 'fixed' });
                            $('#ban_left').children().next().css({ top: '360px', position: 'fixed' });
                        }
                        $('#ban_right').children().first().css({ top: '0px', position: 'fixed' });
                        $('#ban_right').children().next().css({ top: '360px', position: 'fixed' });

                        $(this).append(html);
                        return;
                    }

                    if (bid == 1228) attrRel = "dofollow";

                    if (type == 6) {

                        var html = '';

                        if (detectmob()) {
                            src = altsrc;
                            if (src.indexOf('/file.0.jpg') < 0) {
                                html = '<a href="' + link + '" target="_blank" title="' + tip + '" rel="' + attrRel + '" ><img src="' + src + '" style="width:100%; height:' + hei + '" class="view-count click-count" bannerid="' + bid + '"/></a>';
                            } else {
                                if ($(this).hasClass('adshareditem'))
                                    $(this).next().show();

                                $(this).remove();
                            }
                        }
                        else {
                            src = src.replace('.jpg', '.swf');

                            html = '<object id="obj' + bid + '" width="' + wid + 'px" border="0" height="' + hei + '" class="view-count" bannerid="' + bid + '" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000"><param value="' + src + '" name="movie"><param value="link=http://batdongsan.com.vn/click.aspx?bannerid=' + bid + '" name="flashvars"><param value="always" name="AllowScriptAccess"><param value="High" name="quality"><param value="transparent" name="wmode"><embed name="obj' + bid + '" width="' + wid + 'px" height="' + hei + '" allowscriptaccess="always" wmode="transparent" loop="true" play="true" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" src="' + src + '" flashvars="link=http://batdongsan.com.vn/click.aspx?bannerid=' + bid + '"></object>';
                            //$(this).addClass('click-cout');
                        }
                        $(this).append(html);
                    } else {

                        //default
                        //var html = '<a href="/click.aspx?bannerid=' + bid + '" target="_blank" title="' + tip + '" rel="' + attrRel + '" ><img src="' + src + '" style="width: 100%; height:96px;" class="view-count click-count test4" bannerid="' + bid + '"/></a>';
                        //edit
                        //BANNER_POSITION_TOP
                        if ($(this).parent().attr("positionCode") == 'BANNER_POSITION_TOP') {
                            var html = '<a href="/click.aspx?bannerid=' + bid + '" target="_blank" title="' + tip + '" rel="' + attrRel + '" ><img src="' + src + '" style="width: 100%; height:94px;" class="view-count click-count" bannerid="' + bid + '"/></a>';
                        } else {
                            var html = '<a href="/click.aspx?bannerid=' + bid + '" target="_blank" title="' + tip + '" rel="' + attrRel + '" ><img src="' + src + '" style="width: 100%; height:' + hei + ';" class="view-count click-count" bannerid="' + bid + '"/></a>';
                        }
                        $(this).append(html);
                    }

                }
            });

            var arrAd = new Array();
            $('.adshared').each(function (index) {
                if ($(this).find('.adshareditem').length >= 2) {
                    var ad = new AdPosition(this);
                    //ad.rotate();
                    arrAd[arrAd.length] = ad;
                } else if ($(this).find('.adshareditem').length == 1) {
                    $(this).children().first().show();
                }
            });

            if ($('#ban_left').length == 0 && $('#ban_right').length == 0)
                return;

            var bodywidth = 1000; // $('.site').width();
            var widthleft = $('#ban_left').width();
            var widthright = $('#ban_right').width();
            var xright = (($(document).width() - bodywidth) / 2) + bodywidth;
            var xleft = (($(document).width() - bodywidth) / 2) - widthleft;

            $(window).scroll(function () {
                RePosition();
            });

            $(window).resize(function () {
                RePosition();
            });

            function RePosition() {
                if ($(document.body).width() < bodywidth + widthleft + widthright) {
                    $('.ban_scroll').css('display', 'none');
                    return;
                } else {
                    $('.ban_scroll').css('display', 'block');
                }

                xright = (($(document.body).width() - 0 - bodywidth) / 2) + bodywidth + 10;

                if (widthleft == null) {
                    xleft = (($(document.body).width() - 0 - bodywidth) / 2) - widthright - 10;
                }
                else {
                    xleft = (($(document.body).width() - 0 - bodywidth) / 2) - widthleft - 10;
                }

                var $toado_old = 0;
                var $toado_curr = $(window).scrollTop();
                $('#ban_left').stop().animate({ 'top': $toado_curr - $toado_old + 0, 'left': xleft, 'height': $(window).height() }, 400)//Cách TOP 0px
                $('#ban_right').stop().animate({ 'top': $toado_curr - $toado_old + 0, 'right': xleft, 'height': $(window).height() }, 400)//Cách TOP 0px
                $toado_old = $toado_curr;
            }

            RePosition();

            // Thống kê pageview
            var viewBannerID = "";
            var viewBanner = $('.view-count');
            for (var i = 0; i < viewBanner.length; i++) {
                viewBannerID += "," + $(viewBanner[i]).attr('bannerid');
            }
            if (viewBannerID.length > 0) {
                viewBannerID = viewBannerID.substring(1);
                var img = new Image();
                img.src = $("#DomainStatistic").val() + '/StatisticServiceLibrary/bannerview/' + viewBannerID;
            }

        });
    }
});


function shuffleArray(array) {
    if (array.length > 1) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
    return array;
}

var AdPosition = function (postobj) {
    this._Position = $(postobj);
    this.arrRan = new Array();
    this.Length = this._Position.children().length;
    for (var i = 0; i < this.Length; i++) {
        this.arrRan[i] = i;
    }

    this.arrRan = shuffleArray(this.arrRan);
    this.currRan = -1;

    this.rotate = function () {
        var curr = this._Position.children().first();
        var time = parseInt($(curr).attr('time')) * 1000;
        var _this = this;
        setTimeout(function () {
            _this.nextitem();
        }, time);
    };
    this.nextitem = function () {

        this.currRan++;
        if (this.currRan >= this.arrRan.length) {
            this.currRan = 0;
        }

        this._Position.children().css('display', 'none');
        //this._Position.append(this._Position.children().first());
        //this._Position.children().first().css('display', 'block');
        $(this._Position.children()[this.arrRan[this.currRan]]).show();

        this.rotate();
    };

    this.nextitem();
};

function detectmob() {
    if (navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ) {
        return true;
    }
    else {
        return false;
    }
}

function GenerateRandom(nlen) {
    
    var prevItem = null;
    var rand = Math.floor(Math.random() * nlen);
    if (localStorage) {
        prevItem = localStorage.RandomNum;
    }

    if(prevItem != null) {
         while (prevItem == rand) {
            rand = Math.floor(Math.random() * nlen);
        }
    }
    if (localStorage) {
        localStorage["RandomNum"] = rand;
    }
    
    return rand;
}

function showBannerFix() {

    var lnk = window.location.href;

    if (lnk == 'http://batdongsan.com.vn/') {
        var html = '<div id="bannerfix">';
        html += '<div stylex="position:fixed; bottom:0px; right:0px; z-index:100;"><div h="184" w="300" tp="6" tip="" bid="1024" link="" altsrc="http://file1.batdongsan.com.vn/file.0.jpg" src="http://file1.batdongsan.com.vn/file.301818.jpg" style="position: fixed; bottom: 0px; right: 0px; z-index: 100; clip: rect(0px, 300px, 184px, 0px);" time="10" class="aditem"><object id="obj' + bid + '" height="184px" border="0" width="300px" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" bannerid="1024" class="view-count"><param name="movie" value="http://file1.batdongsan.com.vn/file.301818.jpg"><param name="flashvars" value="link=http://batdongsan.com.vn/click.aspx?bannerid=1024"><param name="AllowScriptAccess" value="always"><param name="quality" value="High"><param name="wmode" value="transparent"><embed height="184px" width="300px" name="obj' + bid + '" flashvars="link=http://batdongsan.com.vn/click.aspx?bannerid=1024" src="http://file1.batdongsan.com.vn/file.301818.jpg" pluginspage="http://www.macromedia.com/go/getflashplayer" type="application/x-shockwave-flash" play="true" loop="true" wmode="transparent" allowscriptaccess="always"></object></div></div>';
        html += '</div>';
        $('body').append(html);
    }
}

function bannermax() {
    var wh = $("#bannerfix .aditem").attr("w");
    var ht = $("#bannerfix .aditem").attr("h");
    $("#bannerfix .aditem").css("clip", "rect(0px, " + wh + "px, " + ht + "px, 0px)");
}
function bannermin(height) {
    
    var h = isNaN(height) ? 35 : height;    
    var wh = $("#bannerfix .aditem").attr("w");
    var ht = $("#bannerfix .aditem").attr("h");
    var nht = ht - h;
    $("#bannerfix .aditem").css("clip", "rect( " + nht + "px, " + wh + "px, " + ht + "px, 0px)");
}

