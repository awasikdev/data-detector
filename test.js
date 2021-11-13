const {
  BrowserWindow,
  app,
  ipcMain,
} = require('electron');
const pie = require('puppeteer-in-electron');
const puppeteer = require('puppeteer-core');
const path = require('path');
const randomUseragent = require('random-useragent');

const preload = path.resolve(path.join(__dirname, 'src/preload.js'));

const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);
  createWindow(app, browser);
};

async function createWindow(app, browser) {
  const window = new BrowserWindow({
    webPreferences: {
      webSecurity: false,
      webviewTag: true,
      devTools: true,
      nodeIntegration: true,
      //nodeIntegrationInSubFrames: true,
      enableRemoteModule: true,
      preload: preload
    },
  });

  window.maximize();
  window.show();

  //const url = "https://www.amazon.pl/s?k=geforce&__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss_2";
  //const url = "https://www.kwejk.pl";
  //const url = "https://www.ceneo.pl/63909339";
  //const url = "https://www.onet.pl/";
  const url = 'https://www.wykop.pl/mikroblog';
  
  const userAgent = randomUseragent.getRandom(function (ua) {
    console.log(ua.deviceType);
    return ua.browserName === 'Firefox';
  });

  console.log(userAgent);

  window.webContents.setUserAgent(userAgent);
  window.webContents.loadURL(url);
  window.webContents.openDevTools();

  ipcMain.on('elementSelected', (event, arg) => {
    console.log('name inside main process is: ', arg); 
    window.webContents.send('elementSelected', arg); 
  });

  ipcMain.on('invokeAction', (event, arg) => {
    console.log('name inside main process is: ', arg); 
  });
}

main();
