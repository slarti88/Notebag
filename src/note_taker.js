var pageUrl;
var noteframe = document.createElement("iframe");
var note_url = chrome.extension.getURL("src/note.html");
noteframe.setAttribute("style","z-index: 10002;position:fixed;width:270px;height:100%;top:0px;right:0px;bottom:0px");
noteframe.setAttribute("src",note_url);
noteframe.setAttribute("id","note_iframe");
document.body.appendChild(noteframe);
/*
function onDocLoad(){
    //var nframe = document.getElementById("note_iframe");
    //var iframedoc = nframe.contentDocument || nframe.contentWindow.document;
    //console.log(iframedoc);
    //console.log(nframe);
    tarea = document.getElementById("note_area");
    home_button = document.getElementById("all_notes");
    tarea.onchange = onTextChanged;
    home_button.onclick= allNotes;
    console.log("pageUrl " + pageUrl);
    var request = indexedDB.open("notebag_db");
    request.onsuccess = function (e){
        mDb = e.target.result;
        var v = "1.0";
        if (v != mDb.version){
            var setVRequest = mDb.setVersion(v);
            setVRequest.onsuccess = function(e){
                var store = mDb.createObjectStore("notebag_store",{keyPath:"pageUrl"});
            }
        }
    }
}

function onTextChanged(){
    var tareatext = tarea.value;
    addToDB(tareatext);
}

function allNotes(){
    window.open("all_notes.html");
}

function addToDB(text){
    var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
    var store = trans.objectStore("notebag_store");
    var request = store.put({"text":text,"pageUrl":pageUrl});
    request.onsuccess = function (e) {
        console.log(e.target.result);
    }
}*/