//request for require module from NodeIntegration
let request = require("request");
//API request for the quote
request("https://api.whatdoestrumpthink.com/api/v1/quotes/random", (err, response, body) => {
    let bodyJson = JSON.parse(body);
    let randomQuote = bodyJson["message"];
    document.getElementById("quote").innerHTML = randomQuote;
});

//Interval calls to fetch new Random Quotes
setInterval(() => {
    request("https://api.whatdoestrumpthink.com/api/v1/quotes/random", (err, response, body) => {
        let bodyJson = JSON.parse(body);
        let randomQuote = bodyJson["message"];
        document.getElementById("quote").innerHTML = randomQuote;
    });
}, 10000);

const notification = document.getElementById('notification');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart-button');
ipcRenderer.on('update_available', () => {
    ipcRenderer.removeAllListeners('update_available');
    message.innerText = 'A new update is available. Downloading now...';
    notification.classList.remove('hidden');
});
ipcRenderer.on('update_downloaded', () => {
    ipcRenderer.removeAllListeners('update_downloaded');
    message.innerText = 'Update Downloaded. It will be installed on restart. Restart now?';
    restartButton.classList.remove('hidden');
    notification.classList.remove('hidden');
});

function closeNotification() {
    notification.classList.add('hidden');
}

function restartApp() {
    ipcRenderer.send('restart_app');
}