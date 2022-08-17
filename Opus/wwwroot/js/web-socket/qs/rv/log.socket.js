"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/hubs").build();
console.clear();
console.log("connecting..");

connection.on("ReceiveTrigger", function (data) {
    getLogScanner();
    getLogInput();
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
        getLogScanner();
        getLogInput();
    } catch (err) {
        //console.log(err);
        console.log("Connecting Failed.");
        setTimeout(start, 5000);

    }
};

/*
console.clear();
const connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:5000/opusHub")
    .configureLogging(signalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};

connection.onclose(async () => {
    await start();
});

// Start the connection.
start();*/