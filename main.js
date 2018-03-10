const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain}= electron;

//set env

process.env.NODE_ENV="production";

let mainWindow;
let addWindow;

app.on('ready', function(){
    //Create new Window
    mainWindow = new BrowserWindow({});
    //Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    })); 

    //Quit app when closed
    mainWindow.on('closed', function(){
        app.quit();
    });

    //build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMeunTemplate);

    Menu.setApplicationMenu(mainMenu);
});



//Handle CreateAddWindow
function createAddWindow(){

    addWindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add Items'
    });
    //Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'addWindow.html'),
        protocol: 'file:',
        slashes: true
    })); 

    addWindow.on('close',function(){
        addWindow = null;
    })
}

//Catch item: add
ipcMain.on('item:add', function(e, item){
    console.log(item);
    mainWindow.webContents.send('item:add', item);
    addWindow.close();
})

ipcMain.on('item:clear', function(){
    addWindow.close();
})

//menu
const mainMeunTemplate = [
    {
        label: 'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label:'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear')
                }
            },
            {
                label:'Quit',
                accelerator: process.platform =='darwin' ? 'Command+Q' :
                'Ctrl + Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

// Platform Check
if(process.platform =='darwin'){
    mainMeunTemplate.unshift({});
}

//Add Dev TOol if not in prod
if(process.env.NODE_ENV !=='production'){
    mainMeunTemplate.push({
        label: 'Developer Tools',
        submenu:[
            {
                label: 'Toggle DevTool',
                accelerator: process.platform =='darwin' ? 'Command + I' :
                'Ctrl + I',
                click(item, focusWindow){
                    focusWindow.toggleDevTools();
                }
            },
            {
                role:'reload'
            }
        ]
    })
}