var noteframe = document.createElement("iframe");
var note_url = chrome.extension.getURL("src/note.html");
console.log()
noteframe.setAttribute("style","z-index: 10002;position:fixed;width:270px;height:100%;top:0px;right:0px;bottom:0px");
noteframe.setAttribute("src",note_url);
document.body.appendChild(noteframe);
