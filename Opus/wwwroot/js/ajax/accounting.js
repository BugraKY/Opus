/*
var contactEnumerable = [
    { fullName, departmant, departmantId, mobileNumber, email }
];
*/
var _tableConts = ``;

var contactObj = { id:'', fullName:'', departmant:null, departmantId:'', mobileNumber:'', email:'' }
var contactEnumerable = [];
var definition = {
    identification_Item: {
        active: false,
        bankId: '',
        commercialTitle: '',
        companyId: '',
        iban: '',
        id: '',
        idNumber: 0,
        identificationTypeId: '',
        identityCode: '',
        paymentTerm: 0,
        streetAddress: '',
        taxAuthority: '',
        taxNo:''
    },
    contactEnumerable
}

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
function getDepartmants() {
    $.ajax({
        url: "/api/accounting/getalldep",
        type: "get",
        contentType: "application/json; charset=utf-8",
        success: function (received) {
            return received;
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert("Status: " + textStatus); alert("Error: " + errorThrown);
        }
    });
}


function getContacts(obj) {
    var _tbodyConts = ``;
    //var selectdep = getDepartmants();
    jQuery.each(obj, function (i, val) {

        _tbodyConts += `
                                                    <tr data-id="`+ i + `" class="hidden">
                                                        <td class="bg-lightest rounded text-center d-none">
                                                            <div class="bg-lightest rounded text-center">
                                                                <input name="id" type="text" class="form-control" value="`+ val.id + `" readonly="readonly" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="rounded text-center">
                                                                <input name="departmantId" type="text" class="form-control departmantid d-none" value="` + val.departmantId + `" hidden="" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="bg-lightest rounded text-center">
                                                                <input name="fullName" type="text" class="form-control fullname" value="`+ val.fullName + `" title="` + val.fullName + `" readonly="readonly" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="rounded text-center">
                                                                <input type="text" class="form-control" value="`+ val.departmant.name + `" title="` + val.departmant.name + `" readonly="readonly">
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="bg-lightest rounded text-center">
                                                                <input name="mobileNumber" type="text" class="form-control mobileNumber" value="`+ val.mobileNumber + `" title="` + val.mobileNumber + `" readonly="readonly" />
                                                            </div>
                                                        </td>
                                                        <td>
                                                            <div class="bg-lightest rounded text-center">
                                                                <input name="email" type="text" class="form-control email" value="`+ val.email + `" title="` + val.email + `" readonly="readonly" />
                                                            </div>
                                                        </td>

                                                        <td data-name="del">
                                                            <button disabled id="dellllllsadfas" type="button" class="waves-effect waves-light btn btn-danger btn-circle row-remove"><span class="icon-Trash1 fs-18"><span class="path1"></span></span></button>
                                                        </td>
                                                    </tr>
`


        //Add Model
        /*
        contactObj = {
            fullName: val.fullName,
            departmant: val.departmant,
            departmantId: val.departmantId,
            mobileNumber: val.mobileNumber,
            email: val.email
        }
        
        contactEnumerable.push(contactObj);*/
        //Add Model

    });

    _tableConts = `
                                                        <table class="table no-border" id="contacts_table">
                                                            <thead class="d-none">
                                                                <tr class="text-start">
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                    <th> </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody class="tbody_def" id="contacts_tbody">
                                                                ` + _tbodyConts + `
                                                            </tbody>
                                                        </table>`;

    console.log("contact Enum");
    console.log(contactEnumerable);
    if (obj.length === 0) {
        /*$('#contact_section').css("display", "none");*/
        $('#contact_list').html(
            `
        <div class="row p-10">
            <div class="col-12 text-center">
                <div class="badge badge-secondary shadow-1-strong">No contact has been added to this definition.</div>
            </div>
            
        </div>
`
        );
    } else {
        $('#contact_section').css("display", "block");
        $('#contact_list').html(_tableConts);
        //console.log(selectdep);
    }

    console.log('\n');

}

function updateDefinition() {


    /*
    $('#myForm').submit(function () {
        var values = $(this).serialize();

    });
    */


    /*
    var contact_table = $('#contacts_table');
    var data = [];
    
    contact_table.find('tr').each(function (i, el) {
        // no thead
        if (i != 0) {
            var $tds = $(this).find('td');
            var row = [];
            $tds.each(function (i, el) {
                row.push($(this).text());
            });
            data.push(row);
        }

    });
        console.log(data);
    */
    /*
    var contact_table = $('#contacts_table td').map(function (i, v) {
        return $(this).text();
    }).toArray();
    console.log(contact_table);
    */
    /*
     * 
    var fnamevalues = $("input[name='fullName']")
        .map(function () { return $(this).val(); }).get();
    var departmantIdvalues = $("input[name='departmantId']")
        .map(function () { return $(this).val(); }).get();
    var mobilevalues = $("input[name='mobileNumber']")
        .map(function () { return $(this).val(); }).get();
    var emailvalues = $("input[name='email']")
        .map(function () { return $(this).val(); }).get();*/

    console.clear();



    var k = 0;
    /*fullName, departmant, departmantId, mobileNumber, email*/
    var id_item = '';
    var fullName_item = '';
    var departmantId_item = '';
    var mobileNumber_item = '';
    var email_item = '';
    contactEnumerable = [];
    $('#contacts_tbody tr td div input').each(function (i, val) {
        var _eachVal = $(this).val();
        console.log(_eachVal);



        if (k == 0) {
            id_item = $(this).val();
            k++;
        }
        else if (k == 1) {
            departmantId_item = $(this).val();

            k++;
        }
        else if (k == 2) {
            fullName_item = $(this).val();
            k++;
        }
        else if (k == 3) {
            k++;
        }
        else if (k == 4) {
            mobileNumber_item = $(this).val();
            k++;
        }
        else if (k == 5) {
            email_item = $(this).val();
            k = 0;
            contactObj = {
                id:id_item,
                fullName: fullName_item,
                departmantId: departmantId_item,
                mobileNumber: mobileNumber_item,
                email: email_item
            }
            contactEnumerable.push(contactObj)
        }





    });
    console.log(contactEnumerable);






    
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
