const isElement = function(element) {
    return element instanceof Element || element instanceof HTMLDocument;  
}

const elementsFromXpath = function(xpathToExecute){
    var result = [];
    var nodesSnapshot = document.evaluate(xpathToExecute, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );
    for ( var i=0 ; i < nodesSnapshot.snapshotLength; i++ ){
      result.push( nodesSnapshot.snapshotItem(i) );
    }
    return result;
}

const visibleAndHasTextNode = function(element, hasTextNode){
    const style = getComputedStyle(element);
    //check if display none, of if one of the height/width elements is < 0 then it wouldn't be visible, so count as hidden.
    if(style.display === 'none' || style.width <= 0 || style.height <= 0) return false;
    // check if the element has a text node, if so, make sure it's not just whitespace.
    if(hasTextNode) {
        return Array.from(element.childNodes).find(node=>node.nodeType===3 && node.textContent.trim().length>1);
    }
    return true;
}

const createXPathFromElement = function(elm) { 
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

exports.isElement = isElement;
exports.elementsFromXpath = elementsFromXpath;
exports.visibleAndHasTextNode = visibleAndHasTextNode;
exports.createXPathFromElement = createXPathFromElement;  