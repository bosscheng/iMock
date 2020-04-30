/**
 * date: 2017/5/2
 * author: wancheng(17033234)
 * desc: 登录弹出层
 */


$(function () {
    "use strict";

    $('#searchInput').on('input propertychange', function () {
        var $this = $(this);
        var val = $.trim($this.val());
        var $result = $('#searchResult');
        if (val) {
            $.get('/search/async?q=' + val, function (response) {
                var datas = response.data;

                if (datas.length > 0) {
                    var html = '';
                    $.each(datas, function (i, n) {
                        var tempHtml = '<a href="/package/' + encodeURIComponent(n.title) + '"><div class="nav-search_r_item">' + n.title + '<span class="badge badge-important">' + n.type + '</span> <br/> <span class="desc">' + n.description + '</span></div></a>';
                        html += tempHtml;
                    });
                    $result.html(html).show();
                }
                else {
                    $result.hide();
                }
            });
        }
        else {
            $result.hide();
        }
    })


    var keyCode = {
        ESC: 27,
        TAB: 9,
        RETURN: 13,
        LEFT: 37,
        UP: 38,
        DOWN: 40
    };

    // 监听 keydown
    $('#searchInput').on('keydown', function (e) {
        var $this = $(this);
        var arrow = e.which;
        if (!(arrow == keyCode.UP || arrow == keyCode.DOWN)) {
            return;
        }
        //
        var preIndex = $('#searchResult a.pre-select').index();
        $('#searchResult a').removeClass('pre-select');
        var size = $('#searchResult a').length;
        var nextIndex = 0;

        if (arrow == keyCode.UP) {
            if (preIndex - 1 >= 0) {
                nextIndex = preIndex - 1;
            }
            else {
                nextIndex = size - 1;
            }
            setTimeout(function () {
                // 光标定位在最后
                var preVal = $this.val();
                $this.val('').focus().val(preVal);
            }, 1);
        }
        else if (arrow == keyCode.DOWN) {
            if (preIndex + 1 >= size) {
                nextIndex = 0
            }
            else {
                nextIndex = preIndex + 1;
            }
        }
        $('#searchResult a').eq(nextIndex).addClass('pre-select');
    });

    $('#headerSearchForm').submit(function () {
        var result = true;
        var preIndex = $('#searchResult a.pre-select').index();
        // 当存在
        if (preIndex !== -1) {
            result = false;
            window.location.href = $('#searchResult a.pre-select').attr('href');
        }
        return result;
    });


    $('.dropmenu').click(function(e){

        e.preventDefault();

        $(this).parent().find('ul').slideToggle();

    });
});
