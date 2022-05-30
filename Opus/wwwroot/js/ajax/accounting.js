


function addDepartmant(name) {
    $.ajax({
        url: "/api/accounting/add-dep",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(name),
        success: function (data) {
            alert(data);
        }
    });
};

function addBank(name) {
    $.ajax({
        url: "/api/accounting/add-bank",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(name),
        success: function (data) {
            alert(data);
        }
    });
};

function getSubcat(data) {
    $.ajax({
        url: "/api/accounting/getsubcat",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (received) {
            console.log("received: " + received);
        }
    });
}



