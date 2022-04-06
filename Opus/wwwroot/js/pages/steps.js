$(".tab-wizard").steps({
    headerTag: "h6"
    , bodyTag: "section"
    , transitionEffect: "none"
    , titleTemplate: '<span class="step">#index#</span> #title#'
    , labels: {
        finish: "Submit"
    }
    , onFinished: function (event, currentIndex) {
       swal("Your Order Submitted!", "Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.");
            
    }
});


var form = $(".validation-wizard").show();

$(".validation-wizard").steps({
    headerTag: "h6"
    , bodyTag: "section"
    , transitionEffect: "none"
    , titleTemplate: '<span class="step">#index#</span> #title#'
    , labels: {
        finish: "Save"
    }
    , onStepChanging: function (event, currentIndex, newIndex) {
        return currentIndex > newIndex || !(3 === newIndex && Number($("#age-2").val()) < 18) && (currentIndex < newIndex && (form.find(".body:eq(" + newIndex + ") label.error").remove(), form.find(".body:eq(" + newIndex + ") .error").removeClass("error")), form.validate().settings.ignore = ":disabled,:hidden", form.valid())
    }
    , onFinishing: function (event, currentIndex) {
        return form.validate().settings.ignore = ":disabled", form.valid()
    }
    , onFinished: function (event, currentIndex) {

        /*
        var respBool = false;

        console.log("step: " + currentIndex);
        var idval = $("#idnum").val();
        var _leng = $('#idnum').val().length;
        console.log("identity has been Change Length: " + idval);
        if (_leng > 10) {
            authIdNum(idval, respBool);
        }
        if (respBool) {
            StaffAdd();
        }
        console.log("Step Response: " + respBool);*/
        $.ajax({
            type: "POST",
            url: "/api/checkid-num",
            data: JSON.stringify($("#idnum").val()),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (response) {
                if (!(response)) {
                    $.toast({
                        heading: 'ID Number Auth',
                        text: 'Identity number is already being used.',
                        icon: 'warning',
                        showHideTransition: 'slide',
                        loader: false,        // Change it to false to disable loader
                        loaderBg: '#9EC600',  // To change the background
                        position: 'top-right',
                        hideAfter: 5000
                    });
                }
                else {
                    StaffAdd();
                }
            },
            failure: function (response) {
                console.log("Kayýt baþarýsýz! - Failure response");
                $(':a').prop('disabled', true);
                $(':button').prop('disabled', true);
            },
            error: function (response) {
                console.log("Kayýt baþarýsýz! - Error response");
            }
        });
        // swal("Your Form Submitted!", "Sed dignissim lacinia nunc. Curabitur tortor. Pellentesque nibh. Aenean quam. In scelerisque sem at dolor. Maecenas mattis. Sed convallis tristique sem. Proin ut ligula vel nunc egestas porttitor.");
    }
}), $(".validation-wizard").validate({
    ignore: "input[type=hidden]"
    , errorClass: "text-danger"
    , successClass: "text-success"
    , highlight: function (element, errorClass) {
        $(element).removeClass(errorClass)
    }
    , unhighlight: function (element, errorClass) {
        $(element).removeClass(errorClass)
    }
    , errorPlacement: function (error, element) {
        error.insertAfter(element)
    }
    , rules: {
        email: {
            email: !0
        },
		
		 "gsm": {
         required: true,
         minlength: 10
        }


					

    }
	
	
	
	
})