/**
 * date: 2017/5/25
 * author: wancheng(17033234)
 * desc:
 */

$(function () {
    var _urlValid = false;

    var keyCode = {
        ESC: 27,
        TAB: 9,
        ENTER: 13,
        LEFT: 37,
        UP: 38,
        DOWN: 40
    };

    $('form').submit(function () {
        var result = true;

        var $url = $('[name="url"]');
        var $requires = $('[name="requires"]');
        var $response = $('[name="response"]');
        var $prefix = $('[name="prefix"]');

        var urlVal = $.trim($url.val());
        var reqVal = $.trim($requires.val());
        var resVal = $.trim($response.val());

        //
        if (_urlValid) {
            result = false;
            $url.closest('.controls').find('.help-inline3');
        }

        // 为空校验
        if (urlVal == '') {
            result = false;
            $url.closest('.controls').find('.help-inline').show();
        }

        if (resVal == '') {
            result = false;
            $response.closest('.controls').find('.help-inline').show();
        }

        if (reqVal) {
            try {
                if (reqVal.indexOf('{') !== 0 || reqVal.lastIndexOf('}') !== (reqVal.length - 1)) {
                    throw new Error();
                }
                else {
                    JSON.parse(reqVal);
                }
            }
            catch (e) {
                result = false;
                $requires.closest('.controls').find('.help-inline').show();
            }
        }


        // 如果是修改的话。需要讲请求参数 格式化成字符串
        if (window.IS_EDIT) {
            var data = [];
            $('.table tr').each(function () {
                var $this = $(this);

                var tempName = $this.find('[data-name="name"]').val();
                var tempNeed = $this.find('[data-name="isNeed"]').val();
                var tempType = $this.find('[data-name="type"]').val();
                var tempDesc = $this.find('[data-name="desc"]').val();

                if (tempName) {
                    var temp = {
                        name: tempName,
                        isNeed: tempNeed,
                        type: tempType,
                        desc: tempDesc || ''
                    };
                    data.push(temp);
                }
            });
            var result = {
                data: data
            };
            $('[name="requires"]').val(JSON.stringify(result));
        }


        //
        if (resVal) {
            // 如果
            var type = $('[name="type"]:checked').val();

            if (type == 'JSON') {
                try {
                    if (resVal.indexOf('{') !== 0 || resVal.lastIndexOf('}') !== (resVal.length - 1)) {
                        throw new Error();
                    }
                    else {
                        JSON.parse(resVal);
                    }
                }
                catch (e) {
                    result = false;
                    $response.closest('.controls').find('.help-inline2').show();
                }
            }
        }


        return result;
    });

    $('[name]').on('input propertychange', function () {
        $(this).closest('.controls').find('.require-tips').hide();
    });


    // 监听 url 变化，发送ajax 请求去校验
    $('[name="url"]').on('input propertychange', function () {
        _valid();
    });

    // 监听 method 变化，如果修改了，则根据URL判断，发送ajax请求
    $('[name="method"]').on('change', function () {
        _valid();
    });

    //
    $('[name="prefix"]').on('input propertychange', function () {
        var $this = $(this);
        var $api = $('.add-on');
        var val = $.trim($this.val());
        var showVal = '/api/';
        if (val) {
            showVal = '/api/' + val + '/';
        }

        $api.text(showVal);

        //
        _searchPrefix(val);

    });


    var _pre_prefix_data = '';

    $('[name="prefix"]').on('focus', function () {
        var $this = $(this);
        if (!_pre_prefix_data) {
            // 拉取所有数据
            $.get('/mock/prefixList/async', function (res) {
                if (res.data) {
                    _renderPrefixList(res.data);
                    _pre_prefix_data = res.data; // 缓存起来
                }
            })
        }
        else {
            _selectPrePrefix();
        }
        return false;
    });


    $('[name="prefix"]').on('keydown', function (e) {
        var $this = $(this);
        var arrow = e.which;
        if (!(arrow == keyCode.UP || arrow == keyCode.DOWN || arrow == keyCode.ENTER)) {
            return;
        }


        var preIndex = $('#prefixSearch li.s-selected').index();
        var size = $('#prefixSearch li').length;
        var nextIndex = 0;

        if (arrow == keyCode.UP || arrow == keyCode.DOWN) {
            $('#prefixSearch li').removeClass('s-selected');
        }

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
        //
        else if (arrow == keyCode.DOWN) {
            if (preIndex + 1 >= size) {
                nextIndex = 0
            }
            else {
                nextIndex = preIndex + 1;
            }
        }
        // enter 按键
        else if (arrow == keyCode.ENTER) {
            var preIndex = $('#prefixSearch li.s-selected').index();
            // 如果存在
            if (preIndex !== -1) {
                var preText = $('#prefixSearch li.s-selected').data('name');
                _handlePrefixClick(preText);

                return false;
            }
        }

        $('#prefixSearch li').eq(nextIndex).addClass('s-selected');

        return false;
    });


    $('#prefixSearch').on('click', 'li', function () {
        var $this = $(this);
        _handlePrefixClick($this.data('name'));
        return false;
    });

    $('body').on('click', function (e) {
        var $target = $(e.target);
        if (!$target.is('[name="prefix"]')) {
            $('#prefixSearch').hide();
        }
    });


    function _handlePrefixClick(preText) {
        $('[name="prefix"]').val(preText);
        $('#prefixSearch').empty().hide();
        $('.add-on').text('/api/' + preText + '/');
    }


    // 渲染 前缀列表
    function _renderPrefixList(data) {
        var html = '';
        var $prefixSearch = $('#prefixSearch');

        if (data.length > 0) {
            $.each(data, function (i, item) {
                var tempHtml = '<li data-name="' + item.name + '">' + item.name + '[' + item.description + ']</li>';
                html += tempHtml;
            });

            html = '<ul>' + html + '</ul>';
            $prefixSearch.html(html).show();

            _selectPrePrefix();
        }
        else {
            $prefixSearch.empty().hide();
        }
    }

    //
    function _searchPrefix(pre) {
        pre = ('' + $.trim(pre)).toLowerCase();
        var result = [];
        if (_pre_prefix_data) {
            //
            $.each(_pre_prefix_data, function (i, item) {
                var tempItem = (item.name).toLowerCase();
                if (tempItem.indexOf(pre) !== -1) {
                    var itemResult = {
                        name: tempItem,
                        description: item.description
                    };
                    result.push(itemResult);
                }
            })

        }
        _renderPrefixList(result);
    }

    function _selectPrePrefix() {
        var val = $.trim($('[name="prefix"]').val());
        var _lock = false;
        if (val) {
            $('#prefixSearch li').each(function () {
                if ($(this).text() == val) {
                    $(this).addClass('s-selected');
                    _lock = true;
                }
            });

            if (_lock) {
                $('#prefixSearch').show();
            }

        }
        else {
            $('#prefixSearch').show();
        }

        /*if (!_lock) {
         $('#prefixSearch li:first').addClass('s-selected');
         }*/
    }

    //
    function _valid() {
        var $url = $('[name="url"]');
        var urlVal = $.trim($url.val());
        var method = $('[name="method"]').val();
        var prefix = $('[name="prefix"]').val();
        var id = $('[name="id"]').val();

        var $error = $url.closest('.controls').find('.help-inline3')

        if (urlVal && method) {
            var data = {
                url: urlVal,
                method: method,
                prefix: prefix
            };
            if (id) {
                data.id = id;
            }

            $.get('/mock/url/valid', data, function (res) {
                //
                if (res === false || res === 'false') {
                    $error.show();
                    _urlValid = true;
                }
                else {
                    $error.hide();
                    _urlValid = false;
                }
            })
        }
    }
});