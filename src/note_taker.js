var pageUrl;
var noteframe = document.getElementById("note_iframe");
if (noteframe == null) {
    noteframe = document.createElement("iframe");
    var note_url = chrome.extension.getURL("src/note.html");
    noteframe.setAttribute("style","z-index: 10002;position:fixed;width:270px;height:100%;top:0px;right:0px;bottom:0px");
    noteframe.setAttribute("src",note_url);
    noteframe.setAttribute("id","note_iframe");
    document.body.appendChild(noteframe);
}
