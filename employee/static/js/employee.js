$(function () {
    create_table();

    //删除考试记录
    $("#del_emp").click(function () {
        var datas = $("#show_record").bootstrapTable("getSelections");
        if (isEmpty(datas)) {
            alert("Please select at least one record.(请至少选择一条记录)");
            return;
        }

        if (confirm("confirm to delete? This will delete the selected record and is not recoverable!")) {
            var array = new Array();
            for (var i = 0; i < datas.length; i++) {
                array.push(datas[i].id);
            }
            ajax("../employee/del_record/", "post", {ids: array.join(",")}, d);
        }
    });


    $("#record_detail").click(function () {
        var data = $("#show_record").bootstrapTable("getSelections");
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one record and only one.(请选择一条记录且只能选择一条)");
            return;
        }
        $("#record_detail_modal").modal("show");
        var record = data[0];
        $("#show_record").text(record.name);
        show_record_table(record.id);
    });

    $('#record_detail_modal').on('hidden.bs.modal', function (e) {
        create_table();
    });
});


function show_record_table(record_id) {
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
    $("#record_dom").html("");
    $("#modal_table").clone(true).attr("id", "show_steps").appendTo("#record_dom");
    $("#show_steps").bootstrapTable({
        url: "../query_detail/",
        queryParams: function (params) {
            params["r_id"] = record_id;
            return params;
        },
        contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
        method: "post",
        columns: columns,
        pagination: true,
        pageSize: 10,
        pageList: [10, 20, 50],
        search: true,
        trimOnSearch: true,
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


function d(msg) {
    if (msg.msg) {
        create_table();
    }
}


function create_table() {
    //初始化表格展示当前题库
    init_table("../show_record/", "emp_table_dom", "show_record", [
        {
            checkbox: true
        },
        {
            field: "name",
            title: "name(姓名)"
        },
        {
            field: "join_date",
            title: "join date(入职时间)"
        },
        {
            field: "exam_date",
            title: "exam date(考试时间)"
        },
        {
            field: "score",
            title: "score(得分)"
        },
        {
            field: "is_pass",
            title: "is pass(合格)"
        },
        {
            field: "exam_count",
            title: "Exam Number(考试次数)",
            formatter: count_format
        }
    ], "");
}


function count_format(value, row, index) {
    return value + "th";
}