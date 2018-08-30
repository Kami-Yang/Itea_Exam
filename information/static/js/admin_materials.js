$(function () {
    create_table();
    $("#add_info").click(function (e) {
        $("#add_info_modal").modal("show");
        $(".modal-body input").val("");
    });
    $("#save_info").click(function () {
        ajax("../../information/save_info/", "post", {
            ch_name: $("#ch_name").val(),
            en_name: $("#en_name").val(),
            type: $("#type_select").val()
        }, showResponse)
    })
});

function showResponse(msg) {
    if (!isEmpty(msg)) {
        $("#add_info_modal").modal("hide");
        create_table();
    }
}


function create_table() {
    var array = new Array();
    array.push(
        {
            checkbox: true
        },
        {
            field: "info_type",
            title: "type(类别)",
            formatter: type_form
        },
        {
            field: "ch_name",
            title: "chinese name(中文名)"
        },
        {
            field: "en_name",
            title: "english name(英文名)"
        }
    )
    init_table("../query_info/", "info_table_dom", "show_info", array, "");
}


function type_form(value, row, index) {
    if (value == 1) {
        return "Commonly Use Words";
    }
    if (value == 2) {
        return "Commonly Use Words Menu";
    }
}