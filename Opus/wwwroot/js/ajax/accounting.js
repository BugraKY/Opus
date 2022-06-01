


function addDepartmant(name) {
    $.ajax({
        url: "/api/accounting/add-dep",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(name),
        success: function (data) {
            $('#modal-dep').modal('toggle');
            $('#depinp').val('');
            //#deps_table
            $('#deps_table').DataTable({
                "ajax": {
                    "url": "/api/accounting/getalldep/",
                    dataSrc: '',
                },
                "columns": [
                    { "data": "name", "width": "100%" },
                    { "data": "id", "class": "d-none" }
                ],
                processing: true,
                serverSide: true,
                searching: false,
                paging: false,
                info: false,
                destroy: true,

            });
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


            $('#modal-bank').modal('toggle');
            $('#bankinp').val('');

            $('#banks_table').DataTable({
                "ajax": {
                    "url": "/api/accounting/getallbank/",
                    dataSrc: '',
                },
                "columns": [
                    { "data": "name", "width": "100%" },
                    { "data": "id", "class": "d-none" }
                ],
                processing: true,
                serverSide: true,
                searching: false,
                paging: false,
                info: false,
                destroy: true,
                

            });
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



