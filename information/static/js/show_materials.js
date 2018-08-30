$(function () {
    init_table();
    for (var i = 0; i < document.getElementsByTagName("audio").length; i++) {
        var aud = document.getElementsByTagName("audio")[i];
        aud.onended = function () {
            alert("bofang wancheng");
        }
    }
});


function init_table() {
    $("#table_dom").html("");
    $("#modal_table").clone(true).attr("id", "show_details").appendTo("#table_dom");
    var columns = new Array();
    columns.push(
        {
            field: "ch_name",
            title: "中文"
        },
        {
            field: "en_name",
            title: "English"
        },
        {
            field: "file_path",
            title: "Audio",
            formatter: path_format
        }
    )
    $("#show_details").bootstrapTable({
        url: "../../information/query_info/",
        columns: columns,
        method: "post",
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        pagination: true,
        search: true,
        trimOnSearch: true,
        rowStyle: function () {
            return {
                css: {
                    "font-size": "20px"
                }
            }
        },
        searchText: "",
        pageSize: 10,
        pageList: [5, 10, 15, 20],
        onLoadSuccess: function (result) {
            // console.log(result);
        }
    });
}

function reload(obj) {
    obj.load();
}

function path_format(value, row, index) {
    var html = '<audio src="' + value + '" controls="controls" onended="reload($(this))"></audio>';
    console.log(html);
    return html;
}

