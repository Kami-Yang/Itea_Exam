$(function () {
    $("#libs").click(function (e) {
        $("#frame").attr("src", "../../question_lib/libs/");
    });
    $("#ques").click(function (e) {
        $("#frame").attr("src", "../../question/questions/");
    });
    $("#employee").click(function (e) {
        $("#frame").attr("src", "../../employee/emp_page/");
    });
    $("#materials").click(function(e){
        $("#frame").attr("src", "../../information/admin_page/");
    });
});



function changeFrameHeight(){
    $("#frame").height(document.documentElement.clientHeight);
}

window.onresize=function(){
     changeFrameHeight();
}