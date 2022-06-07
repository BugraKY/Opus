function getFullName() {
    $.ajax({
        url: "/api/account/get-fullname",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        success: function (received) {
            $("#user-fulln").html(received);
        }
    });
}