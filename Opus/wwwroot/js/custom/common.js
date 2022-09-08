if (typeof mSoft_Common === 'undefined')
    mSoft_Common = {
        function: {},
        variable: {}
    }
// Parametre olarak gönderilen objenin bir değer içerip içermediğini geriye döner. Eğer empty bir değer ise, true empy değilse false döner. 
mSoft_Common.function.isEmpty = function (value) {
    if (value === undefined || value == 'undefined' || value == null || typeof value === 'undefined' || value == undefined || value == 'null')
        return true;
    return value.toString().replace(/\s/g, "").length <= 0 ? true : false;
}
// Parametre olarak gönderilen değerin bir email adresi olup olmadığını kontrol eder. Regex.
mSoft_Common.function.isEmail = function (value) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regex.test(value);
}
// Global ajax fonksiyonu. Parametreler ile ilgili request tamamlanır. Return datasını geriye fırlatır.
mSoft_Common.function.ajaxCall = function (url, type, data, _return_function) {
    $.ajax({
        async: false,
        type: type,
        dataType: 'JSON',
        url: url,
        data: data,
        contentType: "application/json charset=utf-8",
        success: function (result) {
            _return_function(JSON.parse(result))
        }
    })
}


$("#move").click(function () {

    $("form").attr("action", "Personmotion/Move");
    //$("form").submit();




});

$("#nw").click(function () {

    $("form").attr("action", "Personmotion/Nw");
    // $("form").submit();
});

$("#ul").click(function () {

    $("form").attr("action", "Personmotion/Ul");
    $("form").submit();
});






function formSuccess(data) {
    alert("Başarılı " + data.message);
    if (data.isSuccess) {
        alert("Başarılı " + data.message);
    }
    else {
        alert("Başarısız " + data.message);
    }
}




function Move() {

    $("form").attr("action", "Personmotion/Move");
    var data = $("#myform").serialize()

    $.ajax({

        url: "/Personmotion/Move/",
        type: "Post",
        data: data,
        success: function (data) {
            if (data.success) {

                location.reload();
            }

            else {
                $.toast({
                    heading: 'İşlem başarısız oldu!',
                    text: data.message,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'error',
                    hideAfter: 5500

                });
            }
        }

    });
}

function Nw() {

    $("form").attr("action", "Personmotion/Nw");
    var data = $("#myform").serialize()

    $.ajax({

        url: "/Personmotion/Nw",
        type: "Post",
        data: data,
        success: function (data) {
            if (data.success) {

                location.reload();
            }

            else {
                $.toast({
                    heading: 'İşlem başarısız oldu!',
                    text: data.message,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'error',
                    hideAfter: 5500

                });
            }
        }

    });
}


function Ul() {

    $("form").attr("action", "Personmotion/Ul");
    var data = $("#myform").serialize()

    $.ajax({

        url: "/Personmotion/Ul",
        type: "Post",
        data: data,
        success: function (data) {
            if (data.success) {

                location.reload();
            }

            else {
                $.toast({
                    heading: 'İşlem başarısız oldu!',
                    text: data.message,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'error',
                    hideAfter: 5500

                });
            }
        }

    });
}


function Exit() {


    var data = $("#myform").serialize()

    $.ajax({

        url: "/Personmotion/Exit/",
        type: "Post",
        data: data,
        success: function (data) {
            if (data.success) {

                location.reload();
            }
            else if (data.aciklama) {
                document.getElementById('detayexit').style.display = 'block';
                $.toast({
                    heading: 'İşlem başarısız oldu!',
                    text: data.message,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'error',
                    hideAfter: 5500

                });
            }
            else {
                $.toast({
                    heading: 'İşlem başarısız oldu!',
                    text: data.message,
                    position: 'top-right',
                    loaderBg: '#ff6849',
                    icon: 'error',
                    hideAfter: 5500

                });
            }
        }

    });
}

function showLoader() {
    $('#loader').attr('style', 'opacity: 0.99');
    $('#loader').attr('style', 'display: block');
}
function hideLoader() {
    $('#loader').attr('style', 'opacity: 0.01');
    $('#loader').attr('style', 'display: none');
}















