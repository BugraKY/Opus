// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.

var countSelect = 0;
var equTr = 0;
$(document).ready(function () {






    $("#add_row").on("click", function () {
        // Dynamic Rows Code

        // Get max row id and set new id
        var newid = 0;
        $.each($("#tab_logic tr"), function () {
            if (parseInt($(this).data("id")) > newid) {
                newid = parseInt($(this).data("id"));
            }
        });
        newid++;

        var tr = $("<tr></tr>", {
            id: "addr",
            "data-id": newid
        });

        // loop through each td and create new elements with name of newid
        $.each($("#tab_logic tbody tr:nth(0) td"), function () {
            var td;
            var cur_td = $(this);

            var children = cur_td.children();

            // add new td and element if it has a nane
            if ($(this).data("name") !== undefined) {
                td = $("<td></td>", {
                    "data-name": $(cur_td).data("name")
                });

                var c = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
                c.attr("name", $(cur_td).data("name"));

                /*
                c.children("#familyMembersFamilyRelationshipId").attr("name", "FamilyMembers[" + newid + "].FamilyRelationshipId");
                c.children("#familyMembersFullName").attr("name", "FamilyMembers[" + newid + "].FullName");
                c.children("#familyMembersIdentityNumber").attr("name", "FamilyMembers[" + newid + "].IdentityNumber");
                c.children("#familyMembersBirthPlace").attr("name", "FamilyMembers[" + newid + "].BirthPlace");
                c.children("#familyMembersDateOfBirth").attr("name", "FamilyMembers[" + newid + "].DateOfBirth");
                c.children("#familyMembersDel").attr("name", newid);
                */
                c.appendTo($(td));
                td.appendTo($(tr));
            } else {
                td = $("<td></td>", {
                    'text': $('#tab_logic tr').length
                }).appendTo($(tr));
            }
        });



        // add the new row
        $(tr).appendTo($('#tab_logic'));

        $(tr).find("td button.row-remove").on("click", function () {
            $(this).closest("tr").remove();
            console.log(JSON.stringify($(this)) + " - Removed!");
        });
    });


    $("#add_Equipment_row").on("click", function () {
        const equDelivery_val = $("#equDelivery").val();
        const equReturn_val = $("#equReturn").val();

        const selectedText = $("#select_equ option:selected").text();
        const selectedValue = $("#select_equ option:selected").val();
        const equDelivery = equDelivery_val.toString('dd-MM-yy');
        const equReturn = equReturn_val.toString('dd-MM-yy');
        const equQua = $("#equQua").val();





        var selectedElementTxt = `<input type="text" class="form-control" value="` + selectedText + `" title="` + selectedText+`" disabled/>`;
        var selectedElementVal = `<input type="text" name="StaffEquipment.ProductId" class="form-control d-none" value="` + selectedValue + `" hidden/>`;

        var tbody_equ_item = `
                                                    <tr id='equ' data-id="`+equTr+`" class="hidden">
                                                        <td data-name="products">
                                                            <div class="rounded text-center">
                                                                `+ selectedElementTxt + selectedElementVal+ `
                                                            </div>
                                                        </td>
                                                        <td data-name="quantity" style="min-width: 50px; max-width: 50px; ">
                                                            <div class="bg-lightest rounded text-center">
                                                                <input type="number" class="form-control" name="StaffEquipment.Quantity" value="`+ equQua + `" title="` + equQua +`" readonly="readonly"/>

                                                            </div>
                                                        </td>
                                                        <td data-name="deliveryDate">
                                                            <div class="bg-lightest rounded text-center">
                                                                <input type="date" class="form-control" name="StaffEquipment.DeliveryDate" value=`+ equDelivery_val + ` title="` + equDelivery +`" readonly="readonly"/>
                                                            </div>
                                                        </td>
                                                        <td data-name="returnDate">
                                                            <div class="bg-lightest rounded text-center">
                                                                <input type="date" class="form-control" name="StaffEquipment.ReturnDate" value="`+ equReturn_val + `" title="` + equReturn +`" readonly="readonly"/>
                                                            </div>
                                                        </td>
                                                        <td data-name="del">
                                                            <button id="delEqu" type="button" class="waves-effect waves-light btn btn-danger btn-circle row-remove"><span class="icon-Trash1 fs-18"><span class="path1"></span></span></button>
                                                        </td>
                                                    </tr>

`;
        $(".tdoby_equ").append(tbody_equ_item);
        console.log(tbody_equ_item);
        //console.log("Selected: " + selectedElement);
        $("#equDelivery").val("");
        $("#equReturn").val("");
        $("#equQua").val("");
        equTr++;
    });
    $("#zzzz").on("click", function () {
        // Dynamic Rows Code

        // Get max row id and set new id
        var newid = 0;
        $.each($("#tab_equp tr"), function () {
            if (parseInt($(this).data("id")) > newid) {
                newid = parseInt($(this).data("id"));
            }
        });
        newid++;

        var tr = $("<tr></tr>", {
            id: "addr",
            "data-id": newid
        });

        // loop through each td and create new elements with name of newid
        $.each($("#tab_equp tbody tr:nth(0) td"), function () {
            var td;
            var cur_td = $(this);

            var children = cur_td.children();

            // add new td and element if it has a nane
            if ($(this).data("name") !== undefined) {
                td = $("<td></td>", {
                    "data-name": $(cur_td).data("name")
                });

                var c = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
                console.log(c);
                c.attr("name", $(cur_td).data("name"));


                c.appendTo($(td));
                td.appendTo($(tr));
            } else {
                td = $("<td></td>", {
                    'text': $('#tab_equp tr').length
                }).appendTo($(tr));
            }
        });



        // add the new row
        $(tr).appendTo($('#tab_equp'));

        $(tr).find("td button.row-remove").on("click", function () {
            $(this).closest("tr").remove();
            console.log(JSON.stringify($(this)) + " - Removed!");
        });
    });
    $("#myform").on('click', "#delEqu", function () {
        console.log("clicked.");
        $(this).parent().parent().remove();

    });

    // İk Ürünler

    $("#add_rowik").on("click", function () {
        // Dynamic Rows Code

        // Get max row id and set new id
        var newid = 0;
        $.each($("#tab_logicik tr"), function () {
            if (parseInt($(this).data("id")) > newid) {
                newid = parseInt($(this).data("id"));
            }
        });
        newid++;

        var tr = $("<tr></tr>", {
            id: "addrik",
            "data-id": newid
        });

        // loop through each td and create new elements with name of newid
        $.each($("#tab_logicik tbody tr:nth(0) td"), function () {
            var td;
            var cur_td = $(this);

            var children = cur_td.children();

            // add new td and element if it has a nane
            if ($(this).data("name") !== undefined) {
                td = $("<td></td>", {
                    "data-name": $(cur_td).data("name")
                });

                var c = $(cur_td).find($(children[0]).prop('tagName')).clone().val("");
                c.attr("name", $(cur_td).data("name"));
                c.appendTo($(td));
                td.appendTo($(tr));
            } else {
                td = $("<td></td>", {
                    'text': $('#tab_logicik tr').length
                }).appendTo($(tr));
            }
        });



        // add the new row
        $(tr).appendTo($('#tab_logicik'));

        $(tr).find("td button.row-removeik").on("click", function () {
            $(this).closest("tr").remove();
        });
    });




    // Sortable Code
    var fixHelperModified = function (e, tr) {
        var $originals = tr.children();
        var $helper = tr.clone();

        $helper.children().each(function (index) {
            $(this).width($originals.eq(index).width())
        });

        return $helper;
    };

    $(".table-sortable tbody").sortable({
        helper: fixHelperModified
    }).disableSelection();

    $(".table-sortable thead").disableSelection();



    $("#add_row").trigger("click");
});

function addRow() {
    //copy the table row and clear the value of the input, then append the row to the end of the table
    $("#formTable tbody tr:first").clone().find("input").each(function () {
        $(this).val('');
    }).end().appendTo("#formTable");
}

function GetDetails(id) {
    $.ajax({
        url: "/User/Edit/" + id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (response) {
            $('#id').val(response.id);
            $('#kullaniciAdi').val(response.kullaniciAdi);
            $('#adi').val(response.adi);
            $('#soyadi').val(response.soyadi);
            $('#yetki').val(response.yetki);
            $('#profilResmi').val(response.profilResmi);
            $('#editmodal').modal('show');
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    return false;
}

function PersonmotionDetails(id) {
    $.ajax({
        url: "/Personmotion/Info/" + id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (response) {
            $('#id').val(response.id);
            $('#adi').html(response.adi) + (response.soyadi);
            $('#infoModal').modal('show');
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    return false;
}


function Add08() {
    document.getElementById("time").value = "08:00";
}
function Add16() {
    document.getElementById("time").value = "16:00";
}
function Add00() {
    document.getElementById("time").value = "00:00";
}
