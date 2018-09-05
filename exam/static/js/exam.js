var r_id = record_id;
$(function () {
    ajax("../../question/get_ques/", "post", null, s);
    $("#next_question").click(function (e) {
        show_questions(question_num + 1);
    });
    $("#end_question").click(function (e) {
        ajax("../exam/end_exam/", "post", {
            e_id: r_id
        }, e);
    });
});


//查询所有问题，回调函数展示问题
//常量储存当前题目
var questions = [];

function s(msg) {
    console.log(msg);
    questions = msg;
    show_questions(0);
}


//展示题目
var question_num = 0;

function show_questions(num) {
    var question = questions[num];
    question_num = num;
    $("#question").text((question_num + 1) + "." + question.text);
    var steps = question.steps
    if (steps) {
        create_table(steps);
    }
}


function create_table(data) {
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
            title: "marks(分值)"
        },
        {
            field: "remarks",
            title: "remarks",
            editable: true
        },
        {
            field: "scoring",
            title: "score(得分)",
            editable: true
        },
        {
            field: "right",
            title: "Satisfy"
        },
        {
            field: "not_right",
            title: "not Satisfy"
        }
    );
    $("#steps_dom").html("");
    $("#modal_table").clone(true).attr("id", "show_steps").appendTo("#steps_dom");
    $("#show_steps").bootstrapTable({
        columns: columns,
        pagination: true,
        data: data,
        pageSize: 10,
        pageList: [10, 20, 50],
        rowStyle: function (row, index) {
            console.log(row.importance);
            if (row.importance) {
                return {css: {"background-color": "#DDDDDD"}}
            } else {
                return {css: {"background-color": "white"}}
            }
        },
        onClickCell: function (field, value, row, $element) {
            if (field == "right") {
                row.is_right = 1;
                console.log(row);
                var question_id = questions[question_num].id;
                var step_id = row.id;
                var is_right = row.is_right
                var remark = row.remarks
                var score = row.scoring
                if (score > row.score) {
                    alert("Wrong score format");
                    return;
                }
                $element.html("pass(通过)");
                save_step_record(question_id, step_id, is_right, remark, score);
                setTimeout("remove_data(" + row.step_num + ")", 1000);
                //$('#show_steps').bootstrapTable('remove', {'field': 'step_num', values: [row.step_num]});
            }
            if (field == "not_right") {
                row.is_right = 0;
                var question_id = questions[question_num].id;
                var step_id = row.id;
                var is_right = row.is_right
                var remark = row.remarks
                var score = row.scoring
                if (score > row.score) {
                    alert("Wrong score format");
                    return;
                }
                $element.html("no pass(不通过)");
                if (row.importance) {
                    if (confirm("this step is importance,if not Satisfy," +
                            "this exam will be end and result is not pass,please confirm")) {
                        //储存不及格记录
                        save_step_record(question_id, step_id, is_right, remark, score);
                        //结束考试
                        setTimeout("remove_data(" + row.step_num + ")", 1000);
                        ajax("../exam/end_exam/", "post", {
                            e_id: r_id
                        }, e);
                    } else {
                        //修改为通过，储存
                        save_step_record(question_id, step_id, 1, remark, score);
                        setTimeout("remove_data(" + row.step_num + ")", 1000);
                        return;
                    }
                } else {
                    save_step_record(question_id, step_id, is_right, remark, score);
                    setTimeout("remove_data(" + row.step_num + ")", 1000);
                    return;
                }
                //setTimeout("remove_data(" + row.step_num + ")", 1000);

                //$("#show_steps").bootstrapTable('remove', {"field": 'step_num', values: [row.step_num]});
            }
        }
    });
}

function remove_data(step_num) {
    $("#show_steps").bootstrapTable('remove', {"field": 'step_num', values: [step_num]});
}


function save_step_record(question_id, step_id, is_right, remark, score) {
    ajax("../exam/save_answer/", "post", {
        q_id: question_id,
        s_id: step_id,
        r_id: r_id,
        is_right: is_right,
        remark: remark,
        score: score
    }, a);
}

function e(msg) {
    //结束考试的回调函数
    var columns = new Array();
    columns.push(
        {
            field: "question",
            title: "Test 考试题"
        },
        {
            field: "step",
            title: "step 步骤"
        },
        {
            field: "score",
            title: "Marks 分数"
        },
        {
            field: "is_pass",
            title: "Pass 合格"
        },
        {
            field: "remarks",
            title: "Remarks"
        }
    );
    $("#question").hide();
    $("#buttons").hide();
    $("#steps_dom").html("");
    $("#modal_table").clone(true).attr("id", "show_steps").appendTo("#steps_dom");
    $("#show_steps").bootstrapTable({
        columns: columns,
        pagination: true,
        data: msg,
        pageSize: 10,
        pageList: [10, 20, 50],
        showExport: true,
        exportDataType: "all",
        exportTypes: ["excel", "pdf"],
        buttonsAlign: "right",
        exportOptions: {
            //ignoreColumn: [0, 1],  //忽略某一列的索引
            fileName: "exam record",  //文件名称设置
            worksheetName: 'sheet1',  //表格工作区名称
            excelstyles: ['background-color', 'color', 'font-size', 'font-weight'],
            //onMsoNumberFormat: DoOnMsoNumberFormat
        }
    });
}


function a(msg) {
    //储存步骤记录的回调函数
}


function DoOnMsoNumberFormat(cell, row, col) {
    console.log("cell------>");
    console.log(cell);
    console.log("row------>");
    console.log(row);
    console.log("col------>");
    console.log(col);
}