$(document).ready(start);
var tarea;
var home_button;
var addText;

var mDb;
var indexedDB = window.webkitIndexedDB;
var IDBKeyRange = window.webkitIDBKeyRange;
var mIDBTransaction = window.webkitIDBTransaction||window.IDBTransaction;
var gChrome;

var firstTime = true;

function start(){    
    chrome.extension.sendRequest({"method":"getUrl"},function(response){
        pageUrl = response.url;
        onDocLoad();
    });
}

function onDocLoad(){
    $("#side-note-text-area").change(onTextChanged);
    $("#all_notes").click(allNotes);
    $("#side-note-hide-btn").hover(function(){
        $(this).attr("src","../res/note-hide-hover.png");
    });

    $("#side-note-hide-btn").mouseout(function(){
        $(this).attr("src","../res/note-hide.png");
    });

    $("#side-note-hide-btn").click(hideBar);

    $("#side-note-web-btn").click(allNotes);

    $("#side-note-web-btn").mouseover(function(){
        $(this).attr("src","../res/note-link-hover.png");
    });

    $("#side-note-web-btn").mouseout(function(){
        $(this).attr("src","../res/note-link.png");
    });

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
                    $("#side-note-text-area").text(notestring);
                    firstTime = false;                    
                }
            };
        }

    };
    request.onerror = function(e){

    };
}

function onTextChanged(){
    var tareatext = $(this).val();
    console.log("onTextChanged " + tareatext);
    addToDB(tareatext);
}

function allNotes(){
    window.open("all_notes.html");
}

function hideBar(){
    $('#side-note-show').hide();
    $('#side-note-hidden').show();
    $('#side-note-show-btn').mouseover(function(){
        $(this).attr("src","../res/note-show-hover.png");
    });
    $('#side-note-show-btn').mouseout(function(){
        $(this).attr("src","../res/note-show.png");
    });
    $('#side-note-show-btn').click(function() {
        $('#side-note-show').show();
        $('#side-note-hidden').hide();
    });
}

function addToDB(text){
    console.log("AddtoDb");
    var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
    var store = trans.objectStore("notebag_store");
    var title =String(text).split("\n",1);
    title =String(title).split(".",1);
    if (String(title).split(" ").length > 6){
        title = String(title).split(" ",6).join(" ");
    }
    var request = store.put({"text":text,"pageUrl":pageUrl,"title":title,"modified_at":(new Date()).getTime()});
    request.onsuccess = function (e) {
        console.log("pageurl " + pageUrl + " added");        
        if (firstTime) {
            addToBookmarks(title,pageUrl);
        }
    };
}

function addToBookmarks(titlevar, urlvar) {
    chrome.extension.sendMessage({"id":"bookmark","head":titlevar,"url":urlvar}, function (response) {
        console.log("created");
    });    
}
