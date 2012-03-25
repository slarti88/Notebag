$(document).ready(start);
var tarea;
var home_button;
var addText;

var mDb;
var indexedDB = window.webkitIndexedDB;
var IDBKeyRange = window.webkitIDBKeyRange;
var mIDBTransaction = window.webkitIDBTransaction||window.IDBTransaction;

function start(){
    chrome.extension.sendRequest({"method":"getUrl"},function(response){
        pageUrl = response.url;
        onDocLoad();
    });
}

function onDocLoad(){
    $("#note_area").change(onTextChanged);
    $("#all_notes").click(allNotes);
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
        else{
            var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
            var store = trans.objectStore("notebag_store");
            var cursorRequest = store.get(pageUrl);
            cursorRequest.onsuccess = function (event){
                var cursor = event.target.result;
                if (!!cursor == false){
                    return;
                }
                else{
                    notestring = cursor.text;
                    $("#note_area").text(notestring)
                }
            };
        }

    };
    request.onerror = function(e){

    };
}

function onTextChanged(){
    var tareatext = $("#note_area").val();
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
    }
    var request = store.put({"text":text,"pageUrl":pageUrl,"title":title});
    request.onsuccess = function (e) {
    };
}