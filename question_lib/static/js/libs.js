$(function () {
    //初始化表格展示当前题库
    init_table("../queryLib/", "libs_table_dom", "show_libs", [
        {
            checkbox: true
        },
        {
            field: "name",
            title: "lib(题库)"
        },
        {
            field: "questions",
            title: "questions count(题目数量)"
        }
    ], "");
    //添加题库的动作
    $("#add_lib").click(function (e) {
        $("#addlib_modal").modal("show");
        $("#libname").val("");
        init_table("../../question/queryQues/", "add_ques", "show_ques", [
            {
                checkbox: true
            },
            {
                field: "text",
                title: "question(问题)"
            },
            {
                field: "que_type",
                title: "type(问题类型)",
                formatter: type_format
            }
        ], "");
    })
    //新增题库并保存关联的题目
    $("#saveLib").click(function (e) {
        var name = $("#libname").val()
        if (isEmpty(name)) {
            $("#err_mes").show();
            return;
        } else {
            $("#err_mes").hide()
            //ajax("question_lib/saveLib/", "post", {name: name}, s);
            var data = $("#show_ques").bootstrapTable('getSelections');
            var ids = "";
            for (var i = 0; i < data.length; i++) {
                ids += data[i].id + ",";
            }
            console.log(ids);
            ajax("question_lib/saveLib/", "post", {name: name, que_ids: ids}, s);
        }
    });
    //删除题库
    $("#del_lib").click(function (e) {
        var data = $("#show_libs").bootstrapTable('getSelections');
        if (isEmpty(data)) {
            alert("Please select at least one record.(请至少选择一条记录)");
            return;
        }
        var array = new Array();
        for (var i = 0; i < data.length; i++) {
            array[i] = data[i].id;
        }
        ajax("question_lib/del_lib/", "post", {
            "ids": array.join(",")
        }, d);
    });
    //编辑题库，新增关联题目
    $("#add_qu").click(function () {
        var data = $("#show_libs").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        lib = data[0];
        $("#add_que_modal").modal("show");
        init_table("../que_lib_no_ques/", "add_que_dom", "no_ques", [
            {
                checkbox: true
            },
            {
                field: "text",
                title: "question(问题)"
            },
            {
                field: "que_type",
                title: "type(问题类型)",
                formatter: type_format
            }
        ], {id: lib.id});
    });
    //选好题目后，保存
    $("#save_que_add").click(function () {
        var data = $("#no_ques").bootstrapTable('getSelections');
        if (isEmpty(data)) {
            return;
        }
        var array = new Array();
        for (var i = 0; i < data.length; i++) {
            array[i] = data[i].id;
        }
        var data1 = $("#show_libs").bootstrapTable('getSelections');
        if (isEmpty(data1) || data1.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)");
            return;
        }
        var lib = data1[0];
        ajax("question_lib/save_add_que/", "post", {
            libId: lib.id,
            qids: array.join(",")
        }, n);
    });
    //从题库里移除题目
    $("#remove_qu").click(function () {
        var data = $("#show_libs").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        var lib = data[0];
        $("#del_que_modal").modal("show");
        init_table("../question_lib/queryLib_ques/", "del_que_dom", "show_ques_lib", [
            {
                checkbox: true
            },
            {
                field: "text",
                title: "question(问题)"
            },
            {
                field: "que_type",
                title: "type(问题类型)",
                formatter: type_format
            }
        ], {id: lib.id});
    });
    //保存移除
    $("#save_que_del").click(function () {
        var data = $("#show_ques_lib").bootstrapTable('getSelections');
        if (isEmpty(data)) {
            return;
        }
        var array = new Array();
        for (var i = 0; i < data.length; i++) {
            array[i] = data[i].id;
        }
        var data1 = $("#show_libs").bootstrapTable('getSelections');
        if (isEmpty(data) || data1.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)");
            return;
        }
        lib = data1[0];
        ajax("question_lib/save_del_que/", "post", {
            libId: lib.id,
            qids: array.join(",")
        }, m);
    })
})

/**
 * the callback of add question
 * 为题库添加题目的回调函数
 * */
function n(msg) {
    if (msg.msg) {
        $("#add_que_modal").modal("hide");
        //初始化表格展示当前题库
        init_table("../queryLib/", "libs_table_dom", "show_libs", [
            {
                checkbox: true
            },
            {
                field: "name",
                title: "lib(题库)"
            },
            {
                field: "questions",
                title: "questions count(题目数量)"
            }
        ], "");
    }
}

/**
 * the callback of add question
 * 为题库添加题目的回调函数
 * */
function m(msg) {
    if (msg.msg) {
        $("#del_que_modal").modal("hide");
        //初始化表格展示当前题库
        init_table("../queryLib/", "libs_table_dom", "show_libs", [
            {
                checkbox: true
            },
            {
                field: "name",
                title: "lib(题库)"
            },
            {
                field: "questions",
                title: "questions count(题目数量)"
            }
        ], "");
    }
}


/**
 * the callback of delete lib
 * 删除题库的回调函数
 * */
var d = function (msg) {
    init_table("../questionlib/queryLib/", "libs_table_dom", "show_libs", [
        {
            checkbox: true
        },
        {
            field: "name",
            title: "lib(题库)"
        }
    ]);
}


/**
 * the callback of savelib
 * 保存试题库的回调函数
 * */
var s = function (msg) {
    if (!msg.msg) {
        alert(msg.result);
        return;
    }
    $("#addlib_modal").modal("hide");
    init_table("../queryLib/", "libs_table_dom", "show_libs", [
        {
            checkbox: true
        },
        {
            field: "name",
            title: "lib(题库)"
        },
        {
            field: "questions",
            title: "questions count(题目数量)"
        }
    ]);
}

/**
 * 为题库增加题目
 * save question by lib
 * */
var saveQuesByLib = function (libid, ids) {
    console.log(ids);
    ajax("questionlib/saveQuesByLib/", "post", {
        libId: libid,
        quesIds: ids.toString()
    }, b);
}

/**
 * the callback of saveQuesByLib
 * 为题库增加题目的回调函数
 * */
var b = function (msg) {
    if (msg.msg) {
        alert("save success");
        //初始化表格展示当前题库
        init_table("../queryLib/", "libs_table_dom", "show_libs", [
            {
                checkbox: true
            },
            {
                field: "name",
                title: "lib(题库)"
            }
        ], "");
    } else {
        alert(msg.result);
    }
    $("#addlib_modal").modal("hide");
}


function type_format(value, row, index) {
    if (value == 1) {
        return "Choice(选择)";
    }
    if (value == 2) {
        return "Completion(填空)";
    }
    if (value == 3) {
        return "Judge(判断)";
    }
    if (value == 4) {
        return "Answer(问答)";
    }
}