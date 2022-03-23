// Please see documentation at https://docs.microsoft.com/aspnet/core/client-side/bundling-and-minification
// for details on configuring this project to bundle and minify static web assets.

// Write your JavaScript code.
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


                c.children("#familyMembersFamilyRelationshipId").attr("name", "FamilyMembers[" + newid + "].FamilyRelationshipId");
                c.children("#familyMembersFullName").attr("name", "FamilyMembers[" + newid + "].FullName");
                c.children("#familyMembersIdentityNumber").attr("name", "FamilyMembers[" + newid + "].IdentityNumber");
                c.children("#familyMembersBirthPlace").attr("name", "FamilyMembers[" + newid + "].BirthPlace");
                c.children("#familyMembersDateOfBirth").attr("name", "FamilyMembers[" + newid + "].DateOfBirth");
                c.children("#familyMembersDel").attr("name", newid);

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
