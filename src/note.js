window.onload = start;
var tarea;
var home_button;
var addText;

var mDb;
var indexedDB = window.webkitIndexedDB;
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
}