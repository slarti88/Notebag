window.onload = onDocLoad;
var tarea;
var addText;
var pageUrl;

var mDb;
var indexedDB = window.webkitIndexedDB;
var IDBTransaction = window.webkitIDBTransaction;
function onDocLoad(){
    tarea = document.getElementById("note_area");
    tarea.onchange = onTextChanged;

    pageUrl = window.location.href;

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

function addToDB(text){
    var trans = mDb.transaction(["notebag_store"],IDBTransaction.READ_WRITE,0);
    var store = trans.objectStore("notebag_store");
    var request = store.put({"text":text,"pageUrl":pageUrl});
    request.onsuccess = function (e) {
        console.log(e.target.result);
    }
}