const ipcRenderer = require('electron').ipcRenderer;
document.remoteIpcRenderer = ipcRenderer;
console.log("preload.js");

const electron = require('electron');

function search(){
    const input = document.querySelector('input[name="q"]');
    input.value = "test";
}


console.log("inside dupa");

document.addEventListener("DOMContentLoaded", function(event){
    console.log("inside dupa2");

    const visibleElementsWithText = Array.from(document.body.querySelectorAll('*'))
        .filter(el => visibleAndHasTextNode(el,true));

    const children1 = getChildren(document.body, 1);
    console.log(children1);


    const elements = elementsFromXpath(children1.xpath);

    const elementsWithText = elements.map( el =>  {
                                        return Array.from(el.querySelectorAll('*'))
                                                    .filter((v) => visibleAndHasTextNode(v,true))
                                                    .map(child => {
                                                        const xpath = createXPathFromElement(child);
                                                        return {xpath, child};
                                                    });            
                                        });
    console.log(elementsWithText);

    elements.forEach(el => {
       // el.style.backgroundColor = "grey"; 
       const xpath = createXPathFromElement(el);

       const elementsWithText = Array.from(el.querySelectorAll('*'))
            .filter((v) => visibleAndHasTextNode(v,true));
       
       elementsWithText.forEach(el => el.style.backgroundColor = "#cfe1ff"); 
    });


    // const children2 = getChildren(children1[0].el);
    // console.log(children2);

    // const children3 = getChildren(children2[0].el);
    // console.log(children3);

    // const children4 = getChildren(children3[0].el);
    // console.log(children4);

    // const children5 = getChildren(children4[0].el);
    // console.log(children5);
    
    // const children6 = getChildren(children5[0].el);
    // console.log(children6);

    // const children7 = getChildren(children6[0].el);
    // console.log(children7);

    // const children8 = getChildren(children7[0].el);
    // console.log(children8);

    // const children9 = getChildren(children8[0].el);
    // console.log(children9);


    const xPaths = visibleElementsWithText.map(el => {
        return createXPathFromElement(el);
    });
    
    console.log(xPaths);
    
});

ipcRenderer.send('invokeAction', 'someData2');

function getChildren(element, elsAvg) {
    console.log("BEFPRE: ChildNodes: %o", element.childNodes);
    const test = Array.from(element.childNodes).map(el => {
        let width = el.offsetWidth || 0;
        let height = el.offsetHeight || 0;
        let elArea = width * height || 0;
        const xpath = createXPathFromElement(el);
        let style = "";
        let rect = "";
        if(isElement(el)) {
            style = window.getComputedStyle(el);
            rect = el.getBoundingClientRect();
            width = rect.width;
            height = rect.height;
            elArea = width * height;
        }
        return {el, elArea, width, height, xpath, style, rect};
    })
    .filter(function(e) {
        // console.log(e.el);
        // console.log(e.el.className);
        // console.log(e.rect);
        // console.log("area: " + e.elArea);
        // console.log("area: " + e.width);
        // console.log("area: " + e.height);
        // console.log("style: %o", e.style);
        return e.width > 0 || e.height > 0;
    })
    .sort(function(a, b) { 
        return b.elArea - a.elArea;
    });

    let curEls = test.length;

    console.log("curEls: " + curEls);
    console.log("elsAvg: " + elsAvg * 1.5);
    if(curEls > elsAvg * 1.2) {

        test.forEach(function(el, index, arr) {
            const xpath = el.xpath;        
            const count = arr.reduce((acc, cur) => cur.xpath === xpath ? ++acc : acc, 0);
            el.count = count;
        });
    
        console.log("Checkpoint check: " + curEls / 1.5);
        console.log("Point: " + test[0].count);
        if(test[0].count > curEls / 1.5) {
            return test[0];
        }
    }

    let newElsAvg = (elsAvg + curEls) / 2;   

    console.log("Round: ");
    console.log(test);
    return getChildren(test[0].el, newElsAvg);
}

function isElement(element) {
    return element instanceof Element || element instanceof HTMLDocument;  
}
//injectScript();
function elementsFromXpath(xpathToExecute){
    var result = [];
    var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    for ( var i=0 ; i < nodesSnapshot.snapshotLength; i++ ){
      result.push( nodesSnapshot.snapshotItem(i) );
    }
    return result;
    //return result.filter(visibleAndHasTextNode, false);
}
// ipcRenderer.send('invokeAction', elementData);

function getElementByXpath(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

async function injectScript() {
    // while(!document.querySelector("#webview")) {
    //     await new Promise(r => setTimeout(r, 500));
    // }
    
    document.addEventListener('mousemove', function(e) {
        //console.log(document.elementFromPoint(e.pageX, e.pageY));
        // var test = document.elementFromPoint(e.pageX, e.pageY);
        console.log("loool");
        var test = document.elementsFromPoint(e.pageX, e.pageY).at(0);
        var origColor = test.style.backgroundColor;
        test.style.backgroundColor = "#1bbede"; 
        ipcRenderer.send('invokeAction', 'someData');
    
        addEventListener(test, "mouseout", function( event ) {
            test.style.backgroundColor = "#fff"; 
        });
    
        addEventListener(test, "mouseleave", function( event ) {
            test.style.backgroundColor = "#fff";
        });
    
        addEventListener(test, 'click', (event) => {
            var str = JSON.stringify(event.target.attributes, null, 4); // (Optional) beautiful indented output.
            console.log(str); // Logs output to dev tools console.
    
            ipcRenderer.send('elementSelected', {
                "id": event.target.id,
                "attributes": toObject(event.target.attributes),
                "className": event.target.className,
                "innerHTML": event.target.innerHTML,
                "textContent": event.target.textContent
            });
        })
    }, false);     
}

function addEventListener(element, type, listener) {
    if(!isListener(element,type)) {
        element.addEventListener(type, listener, false);      
        element.setAttribute('listener-'+type, 'true');
    }
}
function isListener(element, type) {
    return element.getAttribute('listener-'+type) === 'true';
}

function toObject(namedNodeMap) {
    // return Object.assign({},
    //     ...Array.from(namedNodeMap, ({name, value}) => ({[name]: value}))
    // );
    return Object.assign({},
        ...Array.from(namedNodeMap, ({name, value}) => ({[name]: value}))
    );
}

function getTextNodes(element) {
    return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
}

function visibleAndHasTextNode(element, hasTextNode){
    const style = getComputedStyle(element);
    //check if display none, of if one of the height/width elements is < 0 then it wouldn't be visible, so count as hidden.
    if(style.display === 'none' || style.width <= 0 || style.height <= 0) return false;
    // check if the element has a text node, if so, make sure it's not just whitespace.
    if(hasTextNode) {
        return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
    }
    return true;
}
// use document.body.querySelectorAll as everything in the head will be

function createXPathFromElement(elm) { 
    var allNodes = document.getElementsByTagName('*'); 
    for (var segs = []; elm && elm.nodeType == 1; elm = elm.parentNode) 
    { 
        if (elm.hasAttribute('id')) { 
                var uniqueIdCount = 0; 
                for (var n=0;n < allNodes.length;n++) { 
                    if (allNodes[n].hasAttribute('id') && allNodes[n].id == elm.id) uniqueIdCount++; 
                    if (uniqueIdCount > 1) break; 
                }; 
                if ( uniqueIdCount == 1) { 
                    segs.unshift('id("' + elm.getAttribute('id') + '")'); 
                    return segs.join('/'); 
                } else { 
                    segs.unshift(elm.localName.toLowerCase() + '[@id="' + elm.getAttribute('id') + '"]'); 
                } 
        } else if (elm.hasAttribute('class')) { 
            segs.unshift(elm.localName.toLowerCase() + '[@class="' + elm.getAttribute('class') + '"]'); 
        } else { 
            for (i = 1, sib = elm.previousSibling; sib; sib = sib.previousSibling) { 
                if (sib.localName == elm.localName)  i++; }; 
                segs.unshift(elm.localName.toLowerCase() + '[' + i + ']'); 
        }; 
    }; 
    return segs.length ? '/' + segs.join('/') : null; 
}; 
