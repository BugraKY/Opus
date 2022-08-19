"use strict";


var connection = new signalR.HubConnectionBuilder().withUrl("/hubs").build();
console.log("connecting..");





$.ajax({
    url: "/api/auth/check",
    type: "GET",
    success: function (received) {
        console.log(received);
        if (received) {

            connection.on("ReceiveTypeTrigger", function (data) {
                if (data == 1) {
                    console.log("incoming notifiy trigger");
                }
                if (data == 2) {
                    console.log("incoming chat trigger");
                }
                if (data == 3) {
                    console.log("incoming qs_ref_log trigger");

                }
                //getLogScanner();
                //getLogInput();
            });


            connection.start().then(function () {
            }).catch(function (err) {
            });

            connection.onclose(async () => {
                console.clear();
                console.log("reconnecting..");
                //setTimeout(start, 5000);
                await start();
            });

            async function start() {

                try {
                    await connection.start();
                    console.log("SignalR ReConnected.");
                    //getLogScanner();
                    //getLogInput();
                } catch (err) {
                    //console.log(err);
                    console.log("Connecting Failed.");
                    setTimeout(start, 5000);

                }
            };

        }
    }
});

