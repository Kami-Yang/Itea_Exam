/**
 * function tools send ajax
 * 发送ajax请求的工具方法
 */
var ajax = function(url, type, data, callback) {
	$.ajax({
		url : "/" + url,
		type : type,
		data : data,
		success : function(msg) {
			callback(msg);
		}
	});
}


/**
 * init table to display libs
 * 初始化表格，展示已有题库
 * @url url
 * @sel dom id
 * @pk_name table id
 * */
function init_table(url, sel, pk_name, columns, data) {
    $("#" + sel).html("");
    $("#modal_table").clone(true).attr("id", pk_name).appendTo("#" + sel);
    $("#" + pk_name).bootstrapTable({
        url: url,
        columns: columns,
        method : "post",
        queryParams : function (params) {
            for(var key in data) {
                params[key] = data[key];
            }
            return params;
        },
        contentType:'application/x-www-form-urlencoded; charset=UTF-8',
        pagination: true,
        pageSize: 5,
        pageList: [5, 10, 15, 20],
		onLoadSuccess : function (result) {
			// console.log(result);
        }
    });
}


/**
 * function tools，judge empty
 */
function isEmpty(obj) {
	if (obj == undefined || obj == null || obj.length == 0) {
		return true;
	}
	return false;
}


/**
 * 工具方法，获取当前时间
 * */
function getDate(){
	//获取当前时间
	var date = new Date();
	var year = date.getFullYear();
	var month = date.getMonth() + 1;
	var day = date.getDate();
	if (month < 10) {
	    month = "0" + month;
	}
	if (day < 10) {
	    day = "0" + day;
	}
	return year + "-" + month + "-" + day;
}
