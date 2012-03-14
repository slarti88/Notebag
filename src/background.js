chrome.browserAction.onClicked.addListener(function () {
    var notejs = chrome.extension.getURL("src/note_taker.js");
    chrome.tabs.executeScript(null,{file:"src/note_taker.js"});
});

var gURL="about:blank"; //A default url just in case below code doesn't work
chrome.tabs.onUpdated.addListener(function(tabId,changeInfo,tab){ //onUpdated should fire when the selected tab is changed or a link is clicked
    chrome.tabs.getSelected(null,function(tab){
        gURL=tab.url;
    });
});

chrome.extension.onRequest.addListener(function chromeRequestListener(requestObj){
    var method = requestObj.method;
    if (method == "getUrl"){
        console.log("url is " + requestObj.url);
    }
});