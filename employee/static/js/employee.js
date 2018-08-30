$(function () {
    create_table();
    $("#add_emp").click(function (e) {
        $("#add_user_modal").modal("show");
        $("#employee_message input").val("");
    });
    //保存新增用户
    $("#save_user_add").click(function (e) {
        var name = $("#add_name").val();
        if (isEmpty(name)) {
            alert("name not be null");
            return;
        }
        var username = $("#add_username").val();
        if (isEmpty(username)) {
            alert("username not be null");
            return;
        }
        var password = $("#add_password").val();
        if (isEmpty(password)) {
            alert("password not be null");
            return;
        }
        var join_date = $("#add_join_date").val();
        ajax("employee/save_user/", "post", {
            "name": name,
            "username": username,
            "password": password,
            "join_date": join_date
        }, s);
    });

    //编辑用户模态框
    $("#edit_emp").click(function (e) {
        var data = $("#show_emp").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        var user = data[0];
        console.log(user);
        $("#edit_name").val(user.name);
        $("#edit_username").val(user.username);
        $("#edit_user_modal").modal("show");
    });


    //保存用户修改
    $("#save_user_edit").click(function (e) {
        var data = $("#show_emp").bootstrapTable('getSelections');
        var user = data[0];
        var name = $("#edit_name").val();
        if (isEmpty(name)) {
            alert("name not be null");
            return;
        }
        var username = $("#edit_username").val();
        if (isEmpty(username)) {
            alert("username not be null");
            return;
        }
        var password = $("#edit_password").val();
        ajax("employee/save_user/", "post", {
            user_id: user.id,
            name: $("#edit_name").val(),
            username: $("#edit_username").val(),
            password: isEmpty(password) ? user.password : password
        }, s);
    });
    //删除用户
    $("#del_emp").click(function (e) {
        var data = $("#show_emp").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        var user = data[0];
        ajax("employee/del_user/", "post", {
            user_id: user.id
        }, d);
    });
    //详情查看
    $("#record_detail").click(function (e) {
        var data = $("#show_emp").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        var user = data[0];
        $("#show_name").text(user.name);
        //初始化表格展示当前学生考试记录
        init_table("../record/", "record_dom", "show_record", [
            {
                checkbox: true
            },
            {
                field: "exam_date",
                title: "exam date(考试日期)"
            },
            {
                field: "lib_name",
                title: "lib name(题库)"
            },
            {
                field: "is_pass",
                title: "is pass(是否通过)",
                formatter: type_format
            },
            {
                field: "score",
                title: "score(得分)"
            },
            {
                field: "exam_count",
                title: "exam count(考试次数)",
                formatter: count_format
            }
        ], {"user_id": user.id});
        $("#record_detail_modal").modal("show");
    });
    //详情界面查看具体成绩
    $("#show_details").click(function (e) {
        var data = $("#show_record").bootstrapTable('getSelections');
        if (isEmpty(data) || data.length != 1) {
            alert("Please select one and only one record..(请选择一条且只能选择一条记录)")
            return;
        }
        var record = data[0];
        window.open("../../employee/record/?id=" + record.id);
    });
});

var count_format = function (value, row, index) {
    return value + "th";
}


var type_format = function (value, row, index) {
    if(value){
        return true;
    }else{
        return false;
    }
}


//删除用户回调函数
var d = function (msg) {
    if (msg.status) {
        create_table();
    }
}


//保存用户的回调函数
var s = function (msg) {
    if (msg.status) {
        $("#add_user_modal").modal("hide");
        $("#edit_user_modal").modal("hide");
    }
    create_table();
}


function create_table() {
    //初始化表格展示当前题库
    init_table("../show_employee/", "emp_table_dom", "show_emp", [
        {
            checkbox: true
        },
        {
            field: "name",
            title: "name(姓名)"
        },
        {
            field: "username",
            title: "username(用户名)"
        },
        {
            field: "join_date",
            title: "join date(入职时间)"
        }
    ], "");
}
