//request for require module from NodeIntegration
const request = require("request");
const log = require("electron-log");
const { ipcRenderer } = require("electron")

//API request for the quote
log.info('Requesting from API');
request("https://api.whatdoestrumpthink.com/api/v1/quotes/random", (err, response, body) => {

    let bodyJson = JSON.parse(body);
    let randomQuote = bodyJson["message"];
    document.getElementById("quote").innerHTML = randomQuote;
    log.info("Telling main Window to show window")
    ipcRenderer.send("show-window");

});

//Interval calls to fetch new Random Quotes
setInterval(() => {

    log.info('Again updating data from API');
    request("https://api.whatdoestrumpthink.com/api/v1/quotes/random", (err, response, body) => {

        let bodyJson = JSON.parse(body);
        let randomQuote = bodyJson["message"];
        document.getElementById("quote").innerHTML = randomQuote;
    });

}, 10000);

ipcRenderer.on('update_available', () => {
    log.info("A new update is available. Downloading now...");
    ipcRenderer.removeAllListeners('update_available');
});

ipcRenderer.on('update_downloaded', () => {

    log.info("Update Downloded");
    ipcRenderer.removeAllListeners('update_downloaded');
    ipcRenderer.send('restart_app');
});