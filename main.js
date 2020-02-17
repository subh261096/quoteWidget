/* This Quote Application works like a Windget
 which continuously shows Random Quotes fetching 
 data from the API and shows the quote on the Window */


//get the electron module
const electron = require("electron");
const { ipcMain, app, BrowserWindow } = electron; //app and browserwindow methods
const { autoUpdater } = require('electron-updater');
const log = require("electron-log");
const path = require("path"); //for accessing the local path of OS

autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';



let mainWin; //Single Window for REndering HTML

function createWindow() {
    mainWin = new BrowserWindow({
        width: 500,
        height: 150,
        frame: false,
        show: false,
        transparent: true,
        maxHeight: 200,
        maxWidth: 600,
        backgroundColor: "#800000",
        webPreferences: {
            nodeIntegration: true //Allowing Sub-Windows to access modules of Main
        },
        alwaysOnTop: true
    });

    //Setting the Widget on bottom-right corner
    mainWin.setPosition(900, 0);

    mainWin.loadFile('src/index.html');

    //show window after the loading of HTML complete
    mainWin.once("ready-to-show", () => {
        mainWin.show();
        autoUpdater.checkForUpdatesAndNotify();
    });


    //when exit or close button pressed
    mainWin.on("closed", () => {
        mainWin = null;
    });
}


app.on("ready", () => {
    log.info('App starting...');
    createWindow();
});

// for Darwin OS
app.on("window-all-closed", () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    })
    // for MAC OS
app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
})
autoUpdater.on('update-available', () => {
    mainWin.webContents.send('update_available');
});
autoUpdater.on('update-downloaded', () => {
    mainWin.webContents.send('update_downloaded');
});

ipcMain.on('restart_app', () => {
    autoUpdater.quitAndInstall();
});