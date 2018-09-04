$(function () {
    $("#begin_exam").click(function (e) {
        var text = "If you quit after starting the exam, " +
            "the current score record is saved, and the default is not passed!"
        if(confirm(text)){
            var name = $("#name").val();
            var assessor = $("#assessor").val();
            var join_date = $("#join_date").val();
            var exam_date = $("#exam_date").val();
            if(isEmpty(name)){
                alert("name can't be null");
                return;
            }
            if(isEmpty(assessor)){
                alert("assessor can't be null");
                return;
            }
            if(isEmpty(join_date)){
                alert("join date can't be null");
                return;
            }
            window.location.href = "../../exam/begin_exam/?name=" + name + "&assessor=" + assessor
                + "&join_date=" + join_date + "&exam_date=" + exam_date;
        }
    })
})