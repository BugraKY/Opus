


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
        beforeSend: function () { // Before we send the request, remove the .hidden class from the spinner and default to inline-block.
            $('.loader').removeClass('hidden')
        },
        success: function (received) {
            console.log("received: " + received);
        },
        complete: function () { // Set our complete callback, adding the .hidden class and hiding the spinner.
            $('.loader').addClass('hidden')
        }
    });
}

function getDef(id) {

    console.log("getdef: " + id);
    $('#term30_edit').prop('checked', false);
    $('#term60_edit').prop('checked', false);
    $('#term90_edit').prop('checked', false);
    /*
    $.ajax({
        url: "/api/accounting/getsubcat",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify(data),
        success: function (received) {
            console.log("received: " + received);
            toggleWindow()
        }
    });
    
    */

    $.ajax({
        url: "/api/accounting/getDef/" + id,
        type: "get",
        contentType: "application/json; charset=utf-8",
        success: function (received) {
            console.log(received);

            $('#code_edit').val(received.identityCode);
            $('#idnum_edit').val(received.idNumber);
            $('#compid_edit').val(received.companyId);
            $('#commercialTitle_edit').val(received.commercialTitle);
            $('#streetAddress_edit').html(received.streetAddress);
            $('#taxAuthority_edit').val(received.taxAuthority);
            $('#taxNo_edit').val(received.taxNo);
            $('#definition_edit').selectpicker('val', received.identificationTypeId);
            $('#bank_edit').selectpicker('val', received.bankId);
            $('#iban_edit').val(received.iban);
            if (received.paymentTerm == 30)
                $('#term30_edit').prop('checked', true);
            if (received.paymentTerm == 60)
                $('#term60_edit').prop('checked', true);
            if (received.paymentTerm == 90)
                $('#term90_edit').prop('checked', true);
            toggleWindow();
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });



}





