/**
 * date: 2017/5/15
 * author: wancheng(17033234)
 * desc:
 */



$(function () {
    var pjName = $('#projectName').val();
    var version = $('#version').val();
    var snpmMaxVersion = '';
    var maxVersion = $('#maxVersion').val();
    $.get('/package/async/' + encodeURIComponent(pjName) + '/versions', function (response) {
        if (response.data) {
            var array = response.data.split(',');
            if (array.length > 1) {
                $('.p-history').show();
                var html = '';
                for (var i = 0, len = array.length; i < len; i++) {
                    var temp = '<option value="' + array[i] + '">' + array[i] + '</option>';

                    if (version && (array[i] == version)) {
                        temp = '<option value="' + array[i] + '" selected>' + array[i] + '</option>';
                    }
                    html += temp;

                    if (i == (len - 1)) {
                        snpmMaxVersion = array[i];
                    }
                }
                $('.p-history select').append($(html));
            }
        }

        // 同步到最新版本
        if (snpmMaxVersion && maxVersion && snpmMaxVersion > maxVersion) {
            // 更新到最新版本
            var projectId = $('#projectId').val();

            if (projectId) {
                // 给出 默认升级提示
                $('#versionTips').popover({
                    placement: 'top',
                    title: "提示",
                    content: "正在同步至最新版本"
                }).popover('show');

                $.get('/package/async/' + encodeURIComponent(pjName) + '/last?id=' + projectId, function (res) {
                    $('#versionTips').popover('destroy');

                    if (res.data) {
                        $('#versionTips').popover({
                            placement: 'top',
                            title: "提示",
                            content: "已经同步到最新版本，请刷新浏览器重试。"
                        }).popover('show');
                    }
                });
            }
        }
    });

    //
    $('.p-history').on('change', 'select', function () {
        var $this = $(this);
        var val = $this.val();
        if (val && val !== $('#maxVersion').val()) {
            window.location.href = '/package/' + encodeURIComponent(pjName) + "/" + val;
        }
        else {
            window.location.href = '/package/' + encodeURIComponent(pjName);
        }
    });
});