﻿function authIdNum(idval) {
    $.ajax({
        type: "POST",
        url: "/api/checkid-num",
        data: JSON.stringify(idval),
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (response) {
            if (!(response)) {
                $(':a').prop('disabled', false);
                $(':button').prop('disabled', false);
                $.toast({
                    heading: 'ID Number Auth',
                    text: 'Identity number is already using',
                    icon: 'warning',
                    showHideTransition: 'slide',
                    loader: false,        // Change it to false to disable loader
                    loaderBg: '#9EC600',  // To change the background
                    position: 'top-right',
                    hideAfter: 5000
                })
            }
        },
        failure: function (response) {
            console.log("Kayıt başarısız! - Failure response");
            $(':a').prop('disabled', true);
            $(':button').prop('disabled', true);
        },
        error: function (response) {
            console.log("Kayıt başarısız! - Error response");
        }
    });
};

