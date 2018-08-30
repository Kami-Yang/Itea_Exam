$(function () {
    //初始化展示问题表格
    creat_table($("#select_type option:selected").val());
    //所选类型改变时重新生成表格
    $("#select_type").change(function (e) {
        creat_table($("#select_type").val());
    });
    $("#add_step").click(function (e) {
        $("#modal_input").clone(true).attr("id", "add_step_"
            + $("#steps_dom input[type='text']").length).appendTo("#steps_dom");
        $("#modal_check").clone(true).attr("id", "add_check_" +
            $("#steps_dom input[type='checkbox']").length).appendTo("#steps_dom");
    });
    $("#add_select_type").change(function (e) {
        var val = $("#add_select_type").val();
        $("#add_question_body div").hide();
        if (val == 1) {
            $("#select_question").show();
        }
        if (val == 2) {
            $("#completion").show();
        }
        if (val == 3) {
            $("#judgment_problem").show();
        }
        if (val == 4) {
            $("#operation_question").show();
            $("#steps_dom").html("");
            $("#modal_input").clone(true).attr("id", "add_step_0").appendTo("#steps_dom");
            $("#modal_check").clone(true).attr("id", "add_check_0").appendTo("#steps_dom");
        }
    });
    $("#edit_que_type").change(function (e) {
        var val = $("#edit_que_type").val();
        $("#edit_question_body div").hide();
        if (val == 1) {
            $("#edit_select_question").show();
            $("#edit_select_question input").val();
        }
        if (val == 2) {
            $("#edit_completion").show();
            $("#edit_completion input").val();
        }
        if (val == 3) {
            $("#edit_judgment_problem").show();
        }
        if (val == 4) {
            return;
        }
    })
    //新增题目
    $("#add_que").click(function (e) {
        $("#add_que_modal").modal("show");
        $("#add_que_text").val("");
        $("#select_question input").val("");
        $("#completion input").val("");
    });
    //保存题目
    $("#save_que").click(function (e) {
        var que = $("#add_que_text").val();
        if (isEmpty(que)) {
            return;
        }
        var type = $("#add_select_type").val();
        var data = {text: que, que_type: type}
        if (type == 1) {
            data.option_a = $("#select_a").val();
            data.option_b = $("#select_b").val();
            data.option_c = $("#select_c").val();
            data.option_d = $("#select_d").val();
            data.right_key = $("#select_e").val();
        }
        if (type == 2) {
            data.answer = $("#add_answer").val();
        }
        if (type == 3) {
            data.is_right = $("input[name='is_right']:checked").val();
        }
        if (type == 4) {
            var array = new Array();
            //var inputs = $("#steps_dom").find("input");
            for(var i = 0 ; i < $("#steps_dom input").length ; i++){
                console.log($("#add_check_" + i).prop("checked"));
                array.push($("#add_step_" + i).val() + "/" + $("#add_check_" + i).prop("checked"));
            }
            data.steps = array.join(";");
        }
        ajax("question/saveQue/", "post", data, s);
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
        if(type == 1){
            data.option_a = $("#edit_select_a").val();
            data.option_b = $("#edit_select_b").val();
            data.option_c = $("#edit_select_c").val();
            data.option_d = $("#edit_select_d").val();
            data.right_key = $("#edit_select_e").val();
        }
        if(type == 2){
            data.answer = $("#edit_answer").val();
        }
        if(type == 3){
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
    if (type == 1) {
        array.push(
            {
                field: "option_a",
                title: "option a"
            }, {
                field: "option_b",
                title: "option b"
            }, {
                field: "option_c",
                title: "option c"
            }, {
                field: "option_d",
                title: "option d"
            }, {
                field: "right_key",
                title: "right key"
            }
        )
    }
    if (type == 2) {
        array.push(
            {
                field: "answer",
                title: "answer"
            }
        )
    }
    if (type == 3) {
        array.push(
            {
                field: "is_right",
                title: "is right",
                formatter: right_format
            }
        )
    }
    if (type == 4) {
        //暂时不添加问答题功能，留待日后补充
        return;
    }
    init_table("../queryQues/", "ques_table_dom", "show_ques", array, {type: type});
}


/**
 * 修改问题的回调函数
 * the callback of edit question
 * */
var x = function (msg) {
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
var s = function (msg) {
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
        return "Short Answer Questions 简答题";
    }
}

function right_format(value, row, index) {
    if (value) {
        return "right(正确)";
    }
    return "error(错误)";
}