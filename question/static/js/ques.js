$(function () {
    //初始化展示问题表格
    creat_table($("#select_type option:selected").val());
    //所选类型改变时重新生成表格
    $("#select_type").change(function (e) {
        creat_table($("#select_type").val());
    });
    $("#add_step").click(function (e) {
        var datas = $("#add_steps_table").bootstrapTable("getData");
        var data = {"step_class": "", "step_num": datas.length + 1, "detail": "", "importance": "", "score": ""}
        datas.push(data);
        $("#add_steps_table").bootstrapTable('load', data);
    });
    //新增题目
    $("#add_que").click(function (e) {
        $("#add_que_modal").modal("show");
        $("#add_text").val("");
        init_add_table("");
    });
    //保存题目
    $("#save_ques").click(function (e) {
        var text = $("#add_text").val();
        var datas = $("#add_steps_table").bootstrapTable("getData");
        var array = new Array();
        for (var i = 0; i < datas.length; i++) {
            array.push("step_class:" + datas[i].step_class + ",step_num:" +
                    datas[i].step_num +",detail:" + datas[i].detail + ",importance:" +
                    datas[i].importance + ",score:" + datas[i].score
            );
        }
        ajax("question/save_que/", "post", {
            text: text,
            steps: array.join(";")
        }, a);
    });
    //删除题目
    $("#del_que").click(function (e) {
        var data = $("#show_ques").bootstrapTable('getSelections');
        if (isEmpty(data)) {
            alert("Please select at least one record.(请至少选择一条记录)");
            return;
        }
        var ids = new Array();
        for (var i = 0; i < data.length; i++) {
            ids[i] = data[i].id
        }
        ajax("question/del_que/", "post", {
            ids: ids.join(",")
        }, d);
    });
    //修改题目
    $("#edit_que").click(function (e) {
        var data = $("#show_ques").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        var question = data[0];
        $("#edit_que_modal").modal("show");
        $("#edit_question_body div").hide();
        $("#edit_que_text").val(question.text);
        var type = $("#select_type").val();
        $("#edit_que_type").val(type);

        if (type == 1) {
            $("#edit_select_question").show();
            $("#edit_select_a").val(question.option_a);
            $("#edit_select_b").val(question.option_b);
            $("#edit_select_c").val(question.option_c);
            $("#edit_select_d").val(question.option_d);
            $("#edit_select_e").val(question.right_key);
        }
        if (type == 2) {
            $("#edit_completion").show();
            $("#edit_answer").val(question.answer);
        }
        if (type == 3) {
            $("#edit_judgment_problem").show();
            var i;
            if (question.is_right) {
                i = 1;
            } else {
                i = 0;
            }
            $("input[name='edit_is_right'][value='" + i + "']").prop("checked", "checked");
        }
    });
    //保存修改
    $("#save_que_edit").click(function (e) {
        var data = $("#show_ques").bootstrapTable('getSelections');
        var q_id = data[0].id;
        var q_text = $("#edit_que_text").val();
        var data = {
            id: q_id,
            text: q_text
        }
        var type = $("#edit_que_type").val();
        data.que_type = type
        if (type == 1) {
            data.option_a = $("#edit_select_a").val();
            data.option_b = $("#edit_select_b").val();
            data.option_c = $("#edit_select_c").val();
            data.option_d = $("#edit_select_d").val();
            data.right_key = $("#edit_select_e").val();
        }
        if (type == 2) {
            data.answer = $("#edit_answer").val();
        }
        if (type == 3) {
            data.is_right = $("input[name='edit_is_right']:checked").val();
        }
        ajax("question/edit_que/", "post", data, x);
    })
});

function creat_table(type) {
    //初始化表格展示当前题库
    var array = [
        {
            checkbox: true
        },
        {
            field: "text",
            title: "question(问题)"
        },
        {
            field: "que_type",
            title: "type",
            formatter: type_format
        }
    ]
    init_table("../get_ques/", "ques_table_dom", "show_ques", array, "");
}


/**
 * 修改问题的回调函数
 * the callback of edit question
 * */
var e = function (msg) {
    if (msg.msg) {
        $("#edit_que_modal").modal("hide");
        var type = $("#select_type").val();
        creat_table(type);
    }
}


/**
 * 删除题目后的回调函数
 * the callback of delete question
 * */
var d = function (msg) {
    if (msg.msg) {
        var type = $("#select_type").val();
        creat_table(type);
    }
}


/**
 * 保存题目的回调函数
 * the callback of save question
 * */
var a = function (msg) {
    if (msg.msg) {
        $("#add_que_modal").modal("hide");
        var type = $("#select_type").val();
        creat_table(type);
    }
}


function type_format(value, row, index) {
    if (value == 1) {
        return "Choice question 选择题";
    }
    if (value == 2) {
        return "Completion 填空题";
    }
    if (value == 3) {
        return "Judgment problem 判断题";
    }
    if (value == 4) {
        return "Operation Questions 操作题";
    }
}


function init_add_table(data) {
    var columns = new Array();
    columns.push(
        {
            field: "step_class",
            title: "NO."
        },
        {
            title: "step(步骤)",
            field: "step_num"
        },
        {
            field: "detail",
            title: "Explain(说明)"
        },
        {
            field: "score",
            title: "score(分值)"
        },
        {
            field: "importance",
            title: "importance(重要性)",
            formatter: show_format
        }
    );
    $("#add_que_table").html("");
    $("#modal_table").clone(true).attr("id", "add_steps_table").appendTo("#add_que_table");
    $("#add_steps_table").bootstrapTable({
        columns: columns,
        pagination: true,
        data: data,
        pageSize: 5,
        pageList: [5, 10, 15, 20],
        onClickCell: function (field, value, row, $element) {
            if (field == "importance") {
                if ($element.text() == "Y") {
                    $element.html("N");
                    row.importance = "N";
                } else {
                    $element.html("Y");
                    row.importance = "Y";
                }
                return;
            }
            var val = $element.text();
            var $in = $("#modal_input").clone(true).removeAttr("id");
            if (val) {
                $in.val(val);
            } else {
                $in.val("");
            }
            $element.html("").append($in);
            $in.focus();
            $in.blur(function () {
                var v = $(this).val();
                eval("row." + field + " = v");
                $element.html(v);
            });
        }
    });
}

function show_format(value, row, index) {
    if (value == "Y") {
        return "Y";
    }
    else {
        return "N";
    }
}
