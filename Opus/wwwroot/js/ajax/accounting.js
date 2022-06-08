
var contactEnumerable = [
    { fullName, departmant, departmantId, mobileNumber, email }
    /*{ departmant },
    { departmantId },
    { mobileNumber },
    { email }*/
];

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
            console.clear();
            console.log(received);

            $('#code_edit').val(received.identification_Item.identityCode);
            $('#idnum_edit').val(received.identification_Item.idNumber);
            $('#compid_edit').val(received.identification_Item.companyId);
            $('#commercialTitle_edit').val(received.identification_Item.commercialTitle);
            $('#streetAddress_edit').html(received.identification_Item.streetAddress);
            $('#taxAuthority_edit').val(received.identification_Item.taxAuthority);
            $('#taxNo_edit').val(received.identification_Item.taxNo);
            $('#definition_edit').selectpicker('val', received.identification_Item.identificationTypeId);
            $('#bank_edit').selectpicker('val', received.identification_Item.bankId);
            $('#iban_edit').val(received.identification_Item.iban);

            getContacts(received.contactEnumerable);




            if (received.identification_Item.paymentTerm == 30)
                $('#term30_edit').prop('checked', true);
            if (received.identification_Item.paymentTerm == 60)
                $('#term60_edit').prop('checked', true);
            if (received.identification_Item.paymentTerm == 90)
                $('#term90_edit').prop('checked', true);
            toggleWindow();
            $("body").css("overflow", "hidden");
            $('nav').css('display', 'none');
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });
}


function getContacts(obj) {
    var _tbodyConts = ``;
    jQuery.each(obj, function (i, val) {
        _tbodyConts += `
                                                    <tr data-id="`+ i + `" class="hidden">
                                                        <td>
                                                            <div class="bg-lightest rounded text-center">
                                                                <input type="text" class="form-control fullname" value="`+ val.fullName + `" title="` + val.fullName + `" readonly="readonly" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="rounded text-center">
                                                                <input type="text" class="form-control" value="`+ val.departmant.name + `" title="` + val.departmant.name + `" readonly="readonly"><input type="text" class="form-control departmantid d-none" value="` + val.departmantId + `" hidden="" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="bg-lightest rounded text-center">
                                                                <input type="text" class="form-control mobileNumber" value="`+ val.mobileNumber + `" title="` + val.mobileNumber + `" readonly="readonly" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="bg-lightest rounded text-center">
                                                                <input type="text" class="form-control email" value="`+ val.email + `" title="` + val.email + `" readonly="readonly" />
                                                            </div>
                                                        </td>

                                                        <td data-name="del">
                                                            <button id="dellllllsadfas" type="button" class="waves-effect waves-light btn btn-danger btn-circle row-remove"><span class="icon-Trash1 fs-18"><span class="path1"></span></span></button>
                                                        </td>
                                                    </tr>
`


        contactEnumerable.push(
            {
                fullName: val.fullName,
                departmant: val.departmant,
                departmantId: val.departmantId,
                mobileNumber: val.mobileNumber,
                email:val.email
            }
        );      
    });

    var _tableConts = `
                                                        <table class="table no-border" id="">
                                                            <thead class="d-none">
                                                                <tr class="text-start">
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th></th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="tbody_def">
                                                                ` + _tbodyConts + `
                                                            </tbody>
                                                        </table>`;

    console.log(obj);
    console.log("contact Enum");
    console.log(contactEnumerable);
    if (obj.length === 0) {
        $('#contact_section').css("display", "none");
    } else {
        $('#contact_section').css("display", "block");
        $('#contact_list').html(_tableConts);
    }
}





