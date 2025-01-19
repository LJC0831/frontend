const { app, BrowserWindow } = require('electron'); 

function createMain() { 
    const mainFrame = new BrowserWindow({ 
        width: 500, 
        height: 1000, 
    }); 
    
    mainFrame.loadURL("https://friendtalk.netlify.app")
}

app.whenReady().then(() => {
     createMain() 
     app.on('activate', () => { 
        if(BrowserWindow.getAllWindows().length === 0) createMain() 
        }) 
    }) 
app.on('window-all-closed', () => { 
    if(process.platform !== 'darwin') app.quit() 
    })