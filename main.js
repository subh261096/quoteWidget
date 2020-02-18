/* This Quote Application works like a Windget
 which continuously shows Random Quotes fetching 
 data from the API and shows the quote on the Window */


//get the electron module
const electron = require("electron");
const { ipcMain, app, BrowserWindow } = electron; //app and browserwindow methods
const { autoUpdater } = require('electron-updater');
const log = require("electron-log");
const path = require("path"); //for accessing the local path of OS
log.transports.console.format = '{h}:{i}:{s} {text}';
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
    log.info("Loading HTML File")
    mainWin.loadFile('src/index.html');

    //show window after the loading of HTML complete
    ipcMain.on("show-window", (event, args) => {
        log.info('ready to show function');
        mainWin.show();
    });


    //when exit or close button pressed
    mainWin.on("closed", () => {
        log.info('Closing main window..');
        mainWin = null;
    });
}

//setting autoStart
app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
    path: app.getPath("exe")
})

// single instance Lock
const lock = app.requestSingleInstanceLock()

if (!lock) { app.quit() } else {
    app.on("ready", () => {
        log.info('App starting...');
        log.info('Creating Window');
        createWindow();
        setInterval(_ => {
            log.info("Checking for Update every 5 min !")
            autoUpdater.checkForUpdatesAndNotify();
        }, 50000)
    });

    // for Darwin OS
    app.on("window-all-closed", () => {
            log.info('Closing all Windows');
            if (process.platform !== 'darwin') {
                app.quit();
            }
        })
        // for MAC OS
    app.on('activate', () => {
        log.info('Activating Window for MacOS');
        if (win === null) {
            createWindow();
        }
    })
    autoUpdater.on('update-available', () => {
        log.info('updates Available')
        mainWin.webContents.send('update_available');
    });
    autoUpdater.on('update-downloaded', () => {
        log.info('updates downloaded');
        mainWin.webContents.send('update_downloaded');
    });

    ipcMain.on('restart_app', () => {
        log.info('Quiting and installing!!');
        autoUpdater.quitAndInstall();
    });
}