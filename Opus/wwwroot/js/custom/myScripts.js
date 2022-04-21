//var Categories = []
//fetch categories from database
/*
function LoadCategory(element) {
    if (Categories.length == 0) {
        //ajax function for fetch data
        $.ajax({
            type: "GET",
            url: '/staff/getProductCategories',
            success: function (data) {
                Categories = data;
                //render catagory
                renderCategory(element);
            }
        })
    }
    else {
        //render catagory to the element
        renderCategory(element);
    }
}
*/
/*
function renderCategory(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(Categories, function (i, val) {
        $ele.append($('<option/>').val(val.id).text(val.urunAdi));
    })
}
*/

//fetch products
/*
function LoadProduct(categoryDD) {
    $.ajax({
        type: "GET",
        url: "/staff/getProducts",
        data: { 'id': $(categoryDD).val() },
        success: function (data) {
            //render products to appropriate dropdown
            renderProduct($(categoryDD).parents('.mycontainer').find('select.product'), data);
        },
        error: function (error) {
            console.log(error);
        }
    })
}*/
/*
function renderProduct(element, data) {
    //render product
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select'));
    $.each(data, function (i, val) {
        $ele.append($('<option/>').val(val.ikUrunlerId).text(val.bedenAdi));
    })
}
*/
$(document).ready(function () {
    //Add button click event
    $('#add').click(function () {
        //validation and add order items
        var isAllValid = true;

        /*
        if ($('#urunler').val() == "0") {
            isAllValid = false;
            $('#urunler').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#urunler').siblings('span.error').css('visibility', 'hidden');
        }

        if ($('#bedenler').val() == "0") {
            isAllValid = false;
            $('#bedenler').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#bedenler').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#quantity').val().trim() != '' && (parseInt($('#quantity').val()) || 0))) {
            isAllValid = false;
            $('#quantity').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#quantity').siblings('span.error').css('visibility', 'hidden');
        }

        if (!($('#rate').val().trim() != '' && !isNaN($('#rate').val().trim()))) {
            isAllValid = false;
            $('#rate').siblings('span.error').css('visibility', 'visible');
        }
        else {
            $('#rate').siblings('span.error').css('visibility', 'hidden');
        }
        */
        
        /*
        if (isAllValid) {
            
            var $newRow = $('#mainrow').clone().removeAttr('id');
            $('.pc', $newRow).val($('#urunler').val());
            $('.product', $newRow).val($('#bedenler').val());

            //Replace add button with remove button
            $('#add', $newRow).addClass('remove').val('Remove').removeClass('btn-success').addClass('btn-danger');

            //remove id attribute from new clone row
            $('#urunler,#bedenler,#quantity,#rate,#add', $newRow).removeAttr('id');
            $('span.error', $newRow).remove();
            //append clone row
            $('#orderdetailsItems').append($newRow);

            //clear select data
            $('#urunler,#bedenler').val('0');
            $('#quantity,#rate').val('');
            $('#orderItemError').empty();
            
        }*/

    })

    //remove button click event
    $('#orderdetailsItems').on('click', '.remove', function () {
        $(this).parents('tr').remove();
    });




});

//LoadCategory($('#urunler'));