const {BrowserWindow, BrowserView, app, systemPreferences, ipcMain} = require("electron");
const ipcRenderer = require('electron').ipcRenderer;
const pie = require("puppeteer-in-electron")
const puppeteer = require("puppeteer-core");
const path = require('path');
const url = require("url");
const randomUseragent = require('random-useragent');

if(isDev()){
  filepath = path.join(__dirname, "myscripts/myscript1.sh");
} else {
  filepath = path.join(process.resourcesPath, "app/myfolder/subfolder/myscripts/myscript1.sh");
}

const getWebContentDirectory = () => isDev()
    ? path.join(__dirname, "dist/index.html") // or wherever your local build is compiled
    : path.join(__dirname, 'dist/index.html'); // asar location

const getSourceDirectory = () => isDev()
    ? path.join(__dirname, "public/preload.js") // or wherever your local build is compiled
    : path.join(__dirname, "public/preload.js"); // asar location

// const getSourceDirectory = () => isDev()
//     ? path.join(process.cwd()) // or wherever your local build is compiled
//     : path.join(process.resourcesPath, 'app', 'src'); // asar location

const preload = path.resolve(getSourceDirectory());
console.log(preload);

// const view = path.resolve(getSourceDirectory(), 'view.js');

const main = async () => {
  await pie.initialize(app);
  const browser = await pie.connect(app, puppeteer);
  createWindow1(app,browser);

  //console.log(data);

 // window.destroy();
};

async function createWindow1 (app, browser) {
 // console.log(preload);
  const window = new BrowserWindow(    {webPreferences: {
    webSecurity: false,
    webviewTag: true,
    devTools: true,
    nodeIntegration: true,
    nodeIntegrationInSubFrames: true,
    enableRemoteModule: true
  }}
);

  window.maximize();
  window.show();
  

  var size = window.getSize();
  
 //const urlWykop = "https://www.amazon.pl/s?k=geforce&__mk_pl_PL=%C3%85M%C3%85%C5%BD%C3%95%C3%91&ref=nb_sb_noss_2";
 const urlWykop = "https://www.wykop.pl/mikroblog";
//  const urlWykop = "https://www.kwejk.pl";
  //const urlWykop = "https://www.ceneo.pl/63909339";


  //const urlWykop = "https://www.onet.pl/";

 
  // await window.loadURL(url);
 
  const secondView = new BrowserView(
      {webPreferences: {
        webSecurity: false,
        webviewTag: true,
        devTools: true,
        nodeIntegration: true,
       // nodeIntegrationInSubFrames: true,
        enableRemoteModule: true,
        preload: preload
      }}
   );

  window.addBrowserView(secondView)
  secondView.setBounds({ x: 0, y: 0, width: size[0], height: size[1] });
  const userAgent = randomUseragent.getRandom(function (ua) {
    return ua.browserName === 'Firefox';
  });
  
  secondView.webContents.setUserAgent(userAgent);
  console.log(userAgent);
  secondView.webContents.loadURL(urlWykop);
  
 secondView.webContents.openDevTools();


  // const firstView = new BrowserView({
  //   webPreferences:{
  //    preload: preload,
  //    devTools: true
  //   }
  //  });
  //  firstView.webContents.openDevTools();

  // window.addBrowserView(firstView);
  // firstView.setBounds({ x: 280, y: 80, width: parseInt(size[0]-280), height: size[1] });
  // console.log("before1");
  // firstView.webContents.loadURL(urlWykop);
  
  ipcMain.on('elementSelected', (event, arg) => {
    console.log("name inside main process is: ", arg); // this comes form within window 1 -> and into the mainProcess
    //event.sender.send('nameReply', { not_right: false }) // sends back/replies to window 1 - "event" is a reference to this chanel.
    secondView.webContents.send( 'elementSelected', arg ); // sends the stuff from Window1 to Window2.
  });

  ipcMain.on('invokeAction', (event, arg) => {
    console.log("name inside main process is: ", arg); // this comes form within window 1 -> and into the mainProcess
    //event.sender.send('nameReply', { not_right: false }) // sends back/replies to window 1 - "event" is a reference to this chanel.
  //  secondView.webContents.send( 'elementSelected', arg ); // sends the stuff from Window1 to Window2.
  });

  //await delay(5000);

console.log("before");
  const page = await pie.getPage(browser, window);
  console.log(page.url());
  console.log("test3");

  // await page.evaluate(() => {
  //   document.addEventListener('mousemove', function(e) {
  //     console.log(document.elementFromPoint(e.pageX, e.pageY));
  //     var test = document.elementFromPoint(e.pageX, e.pageY);

  //     var origColor = test.style.backgroundColor;
  //     test.style.backgroundColor = "#1bbede"; 
  //     document.remoteIpcRenderer.send('invokeAction', 'someData');

  //     test.addEventListener("mouseout", function( event ) {
  //       test.style.backgroundColor = "#fff";
  //     }, false);

  //     test.addEventListener("mouseleave", function( event ) {
  //       test.style.backgroundColor = "#fff";
  //     }, false);

  //     test.addEventListener('click', (event) => {
  //       test.style.backgroundColor = "#aasd";
  //     })
  
  //   }); 
    
    
  // });


  // const page = await pie.getPage(browser, window);

  // await page.goto('https://www.wykop.pl/mikroblog/', {
  //   waitUntil: ['load', 'networkidle2'],
  // });

  // var frames = await page.frames();
  // var myframe = frames.find((f) => f.name().indexOf('cmp-iframe') > -1);

  // await myframe.waitForSelector('[data-button-type="acceptAll"]');
  // await (await myframe.$('[data-button-type="acceptAll"]')).click();
  // await page.waitForSelector('a[id$="popup-close"]');
  // await page.evaluate(() =>
  //   document.querySelector('a[id$="popup-close"]').click(),
  // );

  // console.log("test");
  // let textContent = await page.$('.text ');
  // await textContent.evaluate((el) =>{
  //   console.log(el); 
  //   console.log("test2");
  //   el.style.color = "red";
  // });

//   const data = await page.evaluate(() => {
//     const tds = Array.from(document.querySelectorAll('[data-type="entry"]'));
//     return tds
//       .map((td) => {
//         // const originalBackground = td.style.backgroundColor;
//         // td.addEventListener("mouseover", function( event ) {
//         //   test = event.target.style.backgroundColor;
//         //   td.style.backgroundColor = "black";        
//         // }, false);
        
//         // td.addEventListener("mouseout", function( event ) {
//         //   td.style.backgroundColor = originalBackground;        
//         // }, false);

//         var id = td.getAttribute('data-id');
//         var text = Array.from(td.getElementsByClassName('text')).map(
//           (e) => e.innerText,
//         );
//         var html = Array.from(td.getElementsByClassName('text')).map(
//           (e) => e.innerHTML,
//         );
//         var author = Array.from(
//           td.getElementsByClassName('showProfileSummary'),
//         ).map((e) => e.innerText);
//         var published = Array.from(td.getElementsByTagName('time')).map((e) =>
//           e.getAttribute('datetime'),
//         );
//         var points = Array.from(td.getElementsByClassName('vC')).map((e) =>
//           e.getAttribute('data-vc'),
//         );

//         var entry = {
//           _id: id,
//           text: text,
//           html: html,
//           author: author,
//           published: published,
//           points: points,
//         };

//         return entry;
//       })
//       .filter((td) => td.author.length !== 0);
//   });

//   //console.log(data);
}



function isDev() {
  return false;
}

main();