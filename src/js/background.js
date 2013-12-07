// The backround page that runs when the application is launched, it listens to the possible events
// for eg when browser action is clicked it will execute the script note_taker.js 

var gUrl;

chrome.browserAction.onClicked.addListener(function (tab) {
    var notejs = chrome.extension.getURL("src/js/note_taker.js");
    chrome.tabs.executeScript(null,{file:"src/js/note_taker.js"});
    console.log("tab id " + tab.id + " url " + tab.url);
    gUrl = tab.url;
});

chrome.extension.onRequest.addListener(function (requestObj,sender,sendResponse){
    var method = requestObj.method;
    if (method == "getUrl"){
        console.log("getUrl ");
        sendResponse({"url":gUrl});
    }
});

chrome.extension.onMessage.addListener(
    function (request, sender,response) {
        if (request.id == "bookmark") {
            console.log(request);
            var head = request.head;
            var url = request.url;  
            var bookmarkFolder = "Notebag"                        
            chrome.bookmarks.create({"title":head.toString(),"url":url});                
        }
});                    
