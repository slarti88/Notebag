chrome.browserAction.onClicked.addListener(function () {
    var notejs = chrome.extension.getURL("src/note_taker.js");
    chrome.tabs.executeScript(null,{file:"src/note_taker.js"});
});