$(function () {

});

if (typeof mSoft_Staff === 'undefined')
    mSoft_Staff = {
        function: {},
        variable: {}
    }
// StafItems da staff değişkenleri topluyoruz. C# tarafından veya veritabanı tarafındaki nameler ile birebir eşit isimler verilmeli. Çünkü değerleri yakalam noktasında object eşitmeleri kullanılmaktadır.
mSoft_Staff.variable.staffItems = {
    Personeller: {
        id: null,
        sicilNo: null,
        adi: null,
        soyadi: null,
        kimlikNo: null,
        durum: null,
        girisTarihi: null,
        cikisTarihi: null,
        medeniDurum: null,
        gsm: null,
        sabitTel: null,
        yedekTel: null,
        adres: null,
        anneAdi: null,
        babaAdi: null,
        dogumYeri: null,
        dogumTarihi: null,
        cocukSayisi: null,
        kanGrubu: null,
        d2Test: null,
        msaTest: null,
        guncelMaas: null,
        iban: null,
        ulkeId: null,
        beyazYaka: null,
        karaListe: null,
        egitimDurumu: null,
        image: null
    },
    kaseEklensinMi: null,
}
// StaffItems objesini doldurur.... Değişken isimlerini otomatik olarak formdan yakalar. !!!ÖNEMLİ!!! Aynı nameden başka bir html eleman ilgili sayfada olmaması gerekmektedir. Aksi takdirde son fokus olanı yakalar.
mSoft_Staff.function.calculateStafItems = function (complete) {
    Object.keys(mSoft_Staff.variable.staffItems['Personeller']).forEach(function (element) {
        mSoft_Staff.variable.staffItems['Personeller'][element] = $('[name="' + element + '"]').val()
    })
    // Personeller objesi doldurulduktan sonra diğer objeleri de dolduruyoruz...
    mSoft_Staff.variable.staffItems['kaseEklensinMi'] = $('select[name="kaseEklensinMi"]').val()
    complete(mSoft_Staff.variable.staffItems)
}
// Ajax ile bir işlemi tamamlama... Personelleri kayıt etme.
mSoft_Staff.function.addUser = function () {
    // Objeleri yakala... ve sonra add user'ı çalıştır
    mSoft_Staff.function.calculateStafItems(function (oData) {
        // File inputları da ekle               
        mSoft_Common.function.ajaxCall('/Staff/Add', 'POST', JSON.stringify(oData), function (result) {
            if (result.isSuccess)
                alert('Kayıt İşlemi Başarılı')
            else
                alert('Hata Oluştu: ' + result.message)
        });
    });

}

function AllClick() {
    // Geri butonuna tıklandığında, belgeler de kayıt edebilmek için formu hazırla...
    $('#steps-uid-0 > div.actions.clearfix > ul > li:nth-child(1) > a').on('click', function () { $('#steps-uid-0-p-3').removeClass('current-save'); })
    // Next butonuna tıklandığında, belgeler adımını hazırla ve zorunlu kayıt aşaması geldiğinde kaydı başlat...
    $('#steps-uid-0 > div.actions.clearfix > ul > li:nth-child(2) > a').on('click', function () {
        const isEquipmentsActive = $('#steps-uid-0-p-3').hasClass('current-save');
        if (isEquipmentsActive & $('form[id="steps-uid-0"]').valid()) {
            $(this).closest('li').addClass('disabled')
            $('#steps-uid-0 > div.actions.clearfix > ul > li:nth-child(1) > a').closest('li').addClass('disabled')
            // Form submit edilsin
            $('form[id="steps-uid-0"]').submit();
        }
        if ($('#steps-uid-0-p-3').hasClass('current'))
            $('#steps-uid-0-p-3').addClass('current-save');
        else
            $('#steps-uid-0-p-3').removeClass('current-save');
    })
}

//function AllClick() {
//    // Geri butonuna tıklandığında, belgeler de kayıt edebilmek için formu hazırla...
//    $('#steps-uid-0-t-0 > div.actions.clearfix > ul > li:nth-child(1) > a').on('click', function () { $('#steps-uid-0-t-0-p-3').removeClass('current-save'); })
//    // Next butonuna tıklandığında, belgeler adımını hazırla ve zorunlu kayıt aşaması geldiğinde kaydı başlat...
//    $('#steps-uid-0-t-0 > div.actions.clearfix > ul > li:nth-child(2) > a').on('click', function () {
//        const isEquipmentsActive = $('#steps-uid-0-t-0-p-3').hasClass('current-save');
//        if (isEquipmentsActive & $('form[id="steps-uid-0-t-0"]').valid()) {
//            $(this).closest('li').addClass('disabled')
//            $('#steps-uid-0-t-0 > div.actions.clearfix > ul > li:nth-child(1) > a').closest('li').addClass('disabled')
//            // Form submit edilsin
//            $('form[id="steps-uid-0-t-0"]').submit();
//        }
//        if ($('#steps-uid-0-t-0-p-3').hasClass('current'))
//            $('#steps-uid-0-t-0-p-3').addClass('current-save');
//        else
//            $('#steps-uid-0-t-0-p-3').removeClass('current-save');
//    })
//}

$(document).ready(function () {
    //AllClick();




    $("#file").change(function (e) {
        var img = e.target.files[0];
        document.getElementById("profilepic").style.display = 'block';
        if (!iEdit.open(img, true, function (res) {
            $("#profilepic").attr("src", res);
            document.getElementById("image").value = res;
        })) {
            alert("Please check file type !!!");
        }
    });


    // CROP START

    function windowOffset(elem) {
        var iTop = elem.offset().top;
        var iLeft = elem.offset().left;
        var res = {
            top: iTop - $(window).scrollTop(),
            left: iLeft - $(window).scrollLeft()
        }
        return res;
    }


    //Inserting required elements.
    var iEditHTML = '<div class="iEdit-img-edit"><canvas class="iEdit-img-edit-can"></canvas><canvas class="iEdit-img-edit-process-can"></canvas><div class="iEdit-img-edit-select"><div class="iEdit-img-edit-select-resize"></div></div><div class="iEdit-img-edit-act iEdit-img-edit-save"> Done </div><div class="iEdit-img-edit-act iEdit-img-edit-cancel"> Cancel </div></div>';
    $("body").append(iEditHTML);


    //Main Image Editor Object
    window.iEdit = {

        //Caching Selectors
        can: $('.iEdit-img-edit-can')[0],
        processCan: $('.iEdit-img-edit-process-can')[0],
        selectionBox: $('.iEdit-img-edit-select'),
        container: $('.iEdit-img-edit'),
        saveBtn: $(".iEdit-img-edit-save"),
        cancelBtn: $('.iEdit-img-edit-cancel'),

        //Internal Properties
        drag: true,
        resize: true,
        square: false,
        status: false,
        grcx: null,
        grcy: null,
        callback: null,
        imageType: null,
        imageQuality: 1,

        //Open the Image Editor with appropriate settings
        open: function (imgObj, square, callback, imageType, imageQuality) {

            if (imgObj.constructor !== File || !imgObj.type.match('image.*')) {
                return false;
            }

            this.drag = false;
            this.resize = false;

            //Using the supplied settings or using defaults in case of invalid settings

            this.square = (square === true) ? true : false;
            this.imageQuality = (Number(imageQuality) > 0 && Number(imageQuality) <= 1) ? Number(imageQuality) : 1;

            if (imageType == "jpeg" || imageType == "png" || imageType == "gif" || imageType == "bmp") { //JPG and any other would default to JPEG//
                this.imageType = imageType;
            } else {
                this.imageType = "jpeg";
            }

            //false: Not In Use
            this.grcx = false;
            this.grcy = false;

            //Checking if callback is a valid function
            var getType = {};
            this.callback = (callback && getType.toString.call(callback) === '[object Function]') ? callback : false;

            this.status = true;

            var ctx = this.can.getContext("2d");

            //Shwoing the conatiner on screen
            iEdit.container.css("display", "block").stop().animate({ "opacity": "1" });

            var img = new Image();
            var that = this;

            //Draw the image on the visible canvas depending on the aspect ratio of the image.
            $(img).on("load", function () {

                if (img.width > img.height) {
                    that.can.width = img.width;
                    that.can.height = img.height;

                    that.can.style.width = ($(window).width() / 2 * 1) + "px";
                    that.can.style.height = (img.height * (($(window).width() / 2 * 1) / img.width)) + "px";


                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, that.can.width, that.can.height);

                    ctx.drawImage(img, 0, 0, that.can.width, that.can.height);

                    iEdit.selectionBox.height($(that.can).height() - 20);
                    iEdit.selectionBox.width($(that.can).height() - 20);

                    iEdit.selectionBox.css({ 'left': (($(window).width() / 2) - $(that.can).height() / 2) + 10 + 'px', 'top': $(window).height() / 2 - $(that.can).height() / 2 - 15 + 'px' });

                } else if (img.width < img.height) {

                    that.can.width = img.width;
                    that.can.height = img.height;

                    that.can.style.width = (img.width * (($(window).height() / 3 * 2) / img.height)) + "px";
                    that.can.style.height = ($(window).height() / 3 * 2) + "px";

                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, that.can.width, that.can.height);

                    ctx.drawImage(img, 0, 0, that.can.width, that.can.height);

                    iEdit.selectionBox.height($(that.can).width() - 20);
                    iEdit.selectionBox.width($(that.can).width() - 20);

                    iEdit.selectionBox.css({ 'left': (($(window).width() / 2) - $(that.can).width() / 2) + 10 + 'px', 'top': $(window).height() / 2 - $(that.can).width() / 2 - 15 + 'px' });


                } else {

                    that.can.width = img.width;
                    that.can.height = img.height;

                    that.can.style.width = ($(window).height() / 4.8 * 3.3) + "px";
                    that.can.style.height = ($(window).height() / 4.8 * 3.3) + "px";


                    ctx.fillStyle = '#fff';
                    ctx.fillRect(0, 0, that.can.width, that.can.height);

                    ctx.drawImage(img, 0, 0, that.can.width, that.can.height);

                    iEdit.selectionBox.height($(that.can).width() - 20);
                    iEdit.selectionBox.width($(that.can).width() - 20);

                    iEdit.selectionBox.css({ 'left': (($(window).width() / 2) - $(that.can).width() / 2) + 10 + 'px', 'top': $(window).height() / 2 - $(that.can).width() / 2 - 15 + 'px' });
                }

            });

            img.src = URL.createObjectURL(imgObj);
            return true;
        },

        //Close the image editor and reset the settings.
        close: function () {
            this.drag = false;
            this.resize = false;
            this.square = false;
            this.status = false;
            this.grcx = undefined;
            this.grcy = undefined;
            this.callback = undefined;

            this.can.height = 0;
            this.can.width = 0;

            this.processCan.height = 0;
            this.processCan.width = 0;

            var pCtx = this.processCan.getContext("2d");
            var ctx = this.can.getContext("2d");

            ctx.clearRect(0, 0, 0, 0);
            pCtx.clearRect(0, 0, 0, 0);

            iEdit.selectionBox.css({
                "height": '0px',
                "width": '0px',
            });

            iEdit.container.stop().animate({
                "opacity": "0"
            }, 300);

            setTimeout(function () {
                iEdit.container.css({ "display": "none" });
            }, 300);

        }
    }

    //Set flags to stop tracking mouse movement.
    $(document).on("mouseup", function () {
        iEdit.drag = false;
        iEdit.resize = false;

        iEdit.grcx = false;
        iEdit.grcy = false;
    });


    //Set flags to start trachong mouse movement.
    iEdit.selectionBox.on("mousedown", function (e) {
        var that = $(this);

        var rcx = e.clientX - windowOffset(that).left;
        var rcy = e.clientY - windowOffset(that).top;

        iEdit.grcx = false;
        iEdit.grcy = false;

        if ((iEdit.selectionBox.width() - rcx <= 28) && (iEdit.selectionBox.height() - rcy <= 28)) {
            iEdit.drag = false;
            iEdit.resize = true;
        } else {
            iEdit.drag = true;
            iEdit.resize = false;
        }


    });


    //Track mouse movements when the flags are set.
    $(document).on('mousemove', function (e) {

        var rcx = e.clientX - windowOffset(iEdit.selectionBox).left;
        var rcy = e.clientY - windowOffset(iEdit.selectionBox).top;

        if (iEdit.drag === true && iEdit.status) {

            if (iEdit.grcx === false) {
                iEdit.grcx = rcx;
            }

            if (iEdit.grcy === false) {
                iEdit.grcy = rcy;
            }

            var xMove = e.clientX - iEdit.grcx;
            var yMove = e.clientY - iEdit.grcy;


            if ((xMove + iEdit.selectionBox.width() >= $(iEdit.can).width() + windowOffset($(iEdit.can)).left) || xMove <= windowOffset($(iEdit.can)).left) {
                if (xMove <= windowOffset($(iEdit.can)).left) {
                    iEdit.selectionBox.css({ "left": windowOffset($(iEdit.can)).left + "px" });
                } else {
                    iEdit.selectionBox.css({ "left": windowOffset($(iEdit.can)).left + $(iEdit.can).width() - iEdit.selectionBox.width() + "px" });
                }
            } else {
                iEdit.selectionBox.css({ "left": xMove + "px" });
            }


            if ((yMove + iEdit.selectionBox.height() >= $(iEdit.can).height() + windowOffset($(iEdit.can)).top) || (yMove <= windowOffset($(iEdit.can)).top)) {
                if (yMove <= windowOffset($(iEdit.can)).top) {
                    iEdit.selectionBox.css({ "top": windowOffset($(iEdit.can)).top + "px" });
                } else {
                    iEdit.selectionBox.css({ "top": windowOffset($(iEdit.can)).top + $(iEdit.can).height() - iEdit.selectionBox.height() + "px" });
                }
            } else {
                iEdit.selectionBox.css({ "top": yMove + "px" });
            }

        } else if (iEdit.resize === true && iEdit.status) {

            var nWidth = rcx;
            var nHeight = rcy;

            if (iEdit.square) {
                if (nWidth >= nHeight) {//Width is the dominating dimension; 
                    nHeight = nWidth;
                    if (nWidth < 100) {
                        nWidth = 100;
                        nHeight = 100;
                    }
                } else {//Height is the dominating dimension; 
                    nWidth = nHeight;
                    if (nHeight < 100) {
                        nWidth = 100;
                        nHeight = 100;
                    }
                }

                if ((nWidth + windowOffset(iEdit.selectionBox).left) >= $(iEdit.can).width() + windowOffset($(iEdit.can)).left) {
                    nWidth = (windowOffset($(iEdit.can)).left + $(iEdit.can).width()) - (windowOffset(iEdit.selectionBox).left);
                    if (windowOffset(iEdit.selectionBox).top + nWidth > $(iEdit.can).height() + windowOffset($(iEdit.can)).top) {
                        nWidth = (windowOffset($(iEdit.can)).top + $(iEdit.can).height()) - (windowOffset(iEdit.selectionBox).top);
                    }
                    nHeight = nWidth;
                } else if ((nHeight + windowOffset(iEdit.selectionBox).top) >= $(iEdit.can).height() + windowOffset($(iEdit.can)).top) {
                    nHeight = (windowOffset($(iEdit.can)).top + $(iEdit.can).height()) - (windowOffset(iEdit.selectionBox).top);
                    if (windowOffset(iEdit.selectionBox).left + nHeight > $(iEdit.can).width() + windowOffset($(iEdit.can)).left) {
                        nHeight = (windowOffset($(iEdit.can)).left + $(iEdit.can).width()) - (windowOffset(iEdit.selectionBox).left);
                    }
                    nWidth = nHeight;
                }


            } else {

                if (nWidth <= 100) {
                    nWidth = 100;
                }
                if (nHeight <= 100) {
                    nHeight = 100;
                }
                if (e.clientX >= $(iEdit.can).width() + windowOffset($(iEdit.can)).left) {    //REASON: nWidth + windowOffset(iEdit.selectionBox).left = e.clientX;
                    nWidth = (windowOffset($(iEdit.can)).left + $(iEdit.can).width()) - (windowOffset(iEdit.selectionBox).left);
                }
                if (e.clientY >= $(iEdit.can).height() + windowOffset($(iEdit.can)).top) {	//REASON: Same logic as nWidth
                    nHeight = (windowOffset($(iEdit.can)).top + $(iEdit.can).height()) - (windowOffset(iEdit.selectionBox).top);
                }
            }

            iEdit.selectionBox.css({
                "width": nWidth + "px",
                "height": nHeight + "px",
            });

        }

    });

    //Process the selected region and return it as an image to the user defined callback.
    iEdit.saveBtn.on("click", function () {

        if (!iEdit.callback) {
            iEdit.close();
            return;
        }

        var ratio = iEdit.can.width / $(iEdit.can).width();

        var h = iEdit.selectionBox.height() * ratio;
        var w = iEdit.selectionBox.width() * ratio;
        var x = (windowOffset(iEdit.selectionBox).left - windowOffset($(iEdit.can)).left) * ratio;
        var y = (windowOffset(iEdit.selectionBox).top - windowOffset($(iEdit.can)).top) * ratio;

        iEdit.processCan.height = h;
        iEdit.processCan.width = w;

        var pCtx = iEdit.processCan.getContext("2d");

        pCtx.drawImage(iEdit.can, x, y, w, h, 0, 0, w, h);


        iEdit.callback(iEdit.processCan.toDataURL("image/" + iEdit.imageType, iEdit.imageQuality));
        iEdit.close();

    });

    //Close the canvas without processing the image on cancel.
    iEdit.cancelBtn.on("click", function () {
        iEdit.close();
    });

    //Setup canvas when window is resized. 
    $(window).on("resize", function () {
        if (iEdit.status) {
            iEdit.selectionBox.css({ 'left': (($(window).width() / 2) - $(iEdit.can).height() / 2) + 10 + 'px', 'top': $(window).height() / 2 - $(iEdit.can).height() / 2 + 10 + 'px' });
        }
    });
    // CROP END



});


function StaffAdd() {
    //Test kaldırılacak!
    $('#myform').submit();
    //Test

    console.log("submitting");
    /*
    if($('input[id=Files_Identity').val()==""){
        $('input[id=Files_Identity').addClass("bb-3 border-info");
        alert("Identity cannot Empty");
    }*/
    var fileIdentity = $('input[id=Files_Identity]').val().split('\\').pop();
    var fileHealthReport = $('input[id=Files_HealthReport]').val().split('\\').pop();
    var fileOHSInstructionCommitmentForm = $('input[id=Files_OHSInstructionCommitmentForm]').val().split('\\').pop();
    var fileInsurance = $('input[id=Files_Insurance]').val().split('\\').pop();
    var fileCommitmentForm = $('input[id=Files_CommitmentForm]').val().split('\\').pop();
    var fileCriminalReport = $('input[id=Files_CriminalReport]').val().split('\\').pop();
    var filesD2test = $('input[id=Files_D2Test]').val().split('\\').pop();

    if (fileIdentity == '') { $('input[id=Files_Identity]').addClass("bb-3 border-danger"); }
    if (fileHealthReport == '') { $('input[id=Files_HealthReport]').addClass("bb-3 border-danger"); }
    if (fileOHSInstructionCommitmentForm == '') { $('input[id=Files_OHSInstructionCommitmentForm]').addClass("bb-3 border-danger"); }
    if (fileInsurance == '') { $('input[id=Files_Insurance]').addClass("bb-3 border-danger"); }
    if (filesD2test == '') { $('input[id=Files_D2Test]').addClass("bb-3 border-danger"); }

    if (fileCommitmentForm == '') { $('input[id=Files_CommitmentForm]').addClass("bb-3 border-danger"); }
    if (fileCriminalReport == '') { $('input[id=Files_CriminalReport]').addClass("bb-3 border-danger"); }
    if (fileIdentity != '' && fileHealthReport != '' && fileOHSInstructionCommitmentForm != '' && fileInsurance != '' && fileCommitmentForm != '' && fileCriminalReport != '' && filesD2test != '') {
        console.log("Success"); $('#myform').submit();
    }
    else {
        $.toast({
            heading: 'Required file fields',
            text: 'Attention to the require fields for documents.',
            icon: 'warning',
            showHideTransition: 'slide',
            loader: false,        // Change it to false to disable loader
            loaderBg: '#9EC600',  // To change the background
            position: 'top-right',
            hideAfter: 5000
        });
    }
}
/*
$(function () {



    $('#urunlers').change(function () {

        var id = $('#urunler').val();

        $.ajax({

            url: '/Staff/bedengetir',
            data: { p: id },
            type: "POST",
            dataType: "Json",
            success: function (data) {
                console.log(data);
                $('#bedenler').empty();
                if (data.length <= 0) {
                    $.toast({
                        heading: 'İşlem başarısız oldu!',
                        text: 'Seçtiğiniz ürüne ait stok bulunamadı!',
                        position: 'top-right',
                        loaderBg: '#ff6849',
                        icon: 'error',
                        hideAfter: 5500

                    });
                }
                else {
                    for (var i = 0; i < data.length; i++) {

                        $('#bedenler').append("<option value='" + data[i].Value + "'>" + data[i].Text + "</Option>");
                    }
                }


            }

        });

    });

});
*/
/*
function ikBedenGüncelle(id) {
    $.ajax({
        url: "/Staff/IkSizeEdit/" + id,
        typr: "GET",
        contentType: "application/json;charset=UTF-8",
        dataType: "json",
        success: function (response) {
            $('#id').val(response.id);
            $('#bedenAdi').val(response.bedenAdi);
            $('#stok').val(response.stok);
            $('#ikUrunlerId').val(response.ikUrunlerId);
            $('#editsizemodal').modal('show');
        },
        error: function (response) {
            alert(response.responseText);
        }
    });
    return false;
}
*/

// İk Ürünler

var Products = []
/*
function LoadProduct(element) {
    if (Products.length == 0) {
        //veri çek
        $.ajax({
            type: "GET",
            url: '/staff/getSizeProducts',
            success: function (data) {
                Products = data;
                //ürünleri oluştur
                renderProduct(element);
            }
        })
    }
    else {
        //ürünü işle
        renderProduct(element);
    }
}
*/
/*
function renderProduct(element) {
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select Product'));
    $.each(Products, function (i, val) {
        $ele.append($('<option/>').val(val.id).text(val.urunAdi));

    })

}
*/

//bedenleri getir
/*
function LoadSize(urunId) {
    $.ajax({
        type: "GET",
        url: "/staff/getSizes",
        data: { 'id': $(urunId).val() },
        success: function (data) {
            //bedenleri id ye göre getir
            renderSize($(urunId).parents('.mycontainer').find('select.beden'), data);
        },
        error: function (error) {
            console.log(error);
        }

    })
}
*/
/*
function renderSize(element, data) {
    //beden yazdır
    var $ele = $(element);
    $ele.empty();
    $ele.append($('<option/>').val('0').text('Select Size'));
    $.each(data, function (i, val) {
        $ele.append($('<option/>').val(val.id).text(val.bedenAdi).attr("stok", val.stok));

    })


}
*/

/*
$(document).ready(function () {



    $('#add').click(function () {





        //form hata kontrolü
        var isAllValid = true;



        if ($('#urunler').val() == "0") {
            isAllValid = false;
            $.toast({
                heading: 'İşlem başarısız oldu!',
                text: 'Ürün Seçmediniz!',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 5500

            });
        }


        if ($('#bedenler').val() == "0") {
            isAllValid = false;
            $.toast({
                heading: 'İşlem başarısız oldu!',
                text: 'Beden Seçmediniz!',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 5500

            });
        }





        if ($('#adet').val() <= 0) {
            isAllValid = false;
            $.toast({
                heading: 'İşlem başarısız oldu!',
                text: 'Adet 0 dan büyük olmalı!',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 5500

            });

        }

        var stok = $('#bedenler').find(':selected').attr('stok');
        if ($('#adet').val() > stok) {
            isAllValid = false;
            $.toast({
                heading: 'İşlem başarısız oldu!',
                text: 'Yeterli stok bulunamadı! En fazla ' + stok + ' adet girebilirsiniz!',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 5500

            });
        }

        if ($('#verilisTarihi').val() == "") {
            isAllValid = false;
            $.toast({
                heading: 'İşlem başarısız oldu!',
                text: 'Veriliş tarihi alanı zorunlu!',
                position: 'top-right',
                loaderBg: '#ff6849',
                icon: 'error',
                hideAfter: 5500

            });
        }



        if (isAllValid) {
            
            var $newRow = $('#mainrow').clone().removeAttr('id');
            $('.urun', $newRow).val($('#urunler').val());
            $('.beden', $newRow).val($('#bedenler').val());

            //Ekle butonunu Sil butonu ile değiştir
            $('#add', $newRow).addClass('remove').val('Remove').removeClass('btn-success').addClass('waves-light btn btn-danger row-remove');


           
            
            //yeni satırlardan id yi kaldır name ekle
            var urunler = $('#urunler', $newRow).attr('id');
            var bedenler = $('#bedenler', $newRow).attr('id');
            var adet = $('#adet', $newRow).attr('id');
            var verilisTarihi = $('#verilisTarihi', $newRow).attr('id');
            var iadeTarihi = $('#iadeTarihi', $newRow).attr('id');

            $('#urunler', $newRow).removeAttr('id').attr('name', urunler).prop("disabled", false);
            $('#bedenler', $newRow).removeAttr('id').attr('name', bedenler).prop("disabled", false);
            $('#adet', $newRow).removeAttr('id').attr('name', adet).prop("disabled", false);
            $('#verilisTarihi', $newRow).removeAttr('id').attr('name', verilisTarihi).prop("disabled", false);
            $('#iadeTarihi', $newRow).removeAttr('id').attr('name', iadeTarihi).prop("disabled", false);
            $('#add', $newRow).removeAttr('id');
           
            $('span.error', $newRow).remove();
            //satırı klonla
            $('#equipmentdetailsItems').append($newRow);

            //formu temizle
            $('#urunler,#bedenler').val('0');
            $('#adet,#verilisTarihi,#iadeTarihi').val('');
            $('#equipmentItemError').empty();
            

        }

    })

    //silme kaldır
    
    $('#equipmentdetailsItems').on('click', '.remove', function () {
        $(this).parents('tr').remove();
    });
    








});
*/

//LoadProduct($('#urunler'));
