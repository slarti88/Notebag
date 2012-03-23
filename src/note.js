window.onload = start;
var tarea;
var home_button;
var addText;

var mDb;
var indexedDB = window.webkitIndexedDB;
var IDBKeyRange = window.webkitIDBKeyRange;
var mIDBTransaction = window.webkitIDBTransaction||window.IDBTransaction;

function start(){
    console.log("start");
    chrome.extension.sendRequest({"method":"getUrl"},function(response){
        pageUrl = response.url;
        onDocLoad();
    });
}

var xkcd = 1;
function onDocLoad(){
    console.log("note.js onDocLoad");
    tarea = document.getElementById("note_area");
    home_button = document.getElementById("all_notes");
    tarea.onchange = onTextChanged;
    home_button.onclick= allNotes;
    console.log("pageUrl " + pageUrl);
    var request = indexedDB.open("notebag_db");
    request.onsuccess = function (e){
        console.log("indexedb opened");
        mDb = e.target.result;
        var v = "1.0";
        if (v != mDb.version){
            var setVRequest = mDb.setVersion(v);
            setVRequest.onsuccess = function(e){
                var store = mDb.createObjectStore("notebag_store",{keyPath:"pageUrl"});
            }
        }
    }
    request.onerror = function(e){
        console.log("error opening indexedDB");
    }
}

function onTextChanged(){
    var tareatext = tarea.value;
    console.log("onTextChanged " + tareatext);
    addToDB(tareatext);
}

function allNotes(){
    window.open("all_notes.html");
}

function addToDB(text){
    var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
    var store = trans.objectStore("notebag_store");
    var title =String(text).split("\n",1);
    var title =String(title).split(".",1);
    if (String(title).split(" ").length > 6){
        title = String(title).split(" ",6).join(" ");
        console.log("title " + title);
    }
    var request = store.put({"text":text,"pageUrl":pageUrl,"title":title});
    request.onsuccess = function (e) {
        console.log("success storage " + pageUrl + "-" + text);
    }
}