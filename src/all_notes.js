$(document).ready(docReady);

var indexedDB;
var mIDBTransaction;
var IDBKeyRange;
var mDb;

/*
var gods_object = {};
gods_object["The Seven Gods"] = "The seven gods were worshipped by the Andals, who came from the free cities.\
                        Jorah Mormont and Cately Tully were among such people. The seven gods were, the smith, the crone,\
                        the mother, the father, the maiden, the warrior and the stranger, who is also considered one of the many faces of the god \
                        worshipped by the faceless assassins of Braavos";

gods_object["The Drowned God"] = "Krakens worship them gods only know why.";
gods_object["Lord of Light Rh'llor"] = "Hot Melisandre is alli can say";
*/

var note_object = new Object();
var title_object = new Object();

var current_note = new Object();

function getAllNotes(){
    var current_title;
    var current_text;
    var current_url;

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
        var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
        var store = trans.objectStore("notebag_store");

        var keyRange = IDBKeyRange.lowerBound(0);
        var cursorRequest = store.openCursor(keyRange);
        cursorRequest.onsuccess = function (event){
            var cursor = event.target.result;
            if (!!cursor == false) {
                current_note.title = current_title;
                current_note.note = current_text;
                current_note.url = current_url;
                $("#note-title").text(current_title);
                $("#note-body").text(current_text);
                $("#note-web-url").attr("href",current_url);
                $("#note-web-url").attr("target","_blank");

                $("#note-delete-link").click(deleteNote);
                // Specify certain css properties
                $('li').addClass("note-list");
                // Specify event handlers
                $('li').click(showNote);
                popoulateNoteTitles();
                return;
            }
            var title = cursor.value.title;
            if (title == undefined){
               title =String(cursor.value.text).split("\n",1);
               title =String(cursor.value.text).split(".",1);
               if (String(title).split(" ").length > 6){
                   title = String(title).split(" ",6).join(" ");
               }
            }
            console.log("Url + text " + cursor.key + " - " + cursor.value.text + " : " + title);
            note_object[title] = {"text":cursor.value.text,"url":cursor.key};
            title_object[cursor.key] = title;
            current_title = title;
            current_text = cursor.value.text;
            current_url = cursor.key;
            cursor.continue();
        }
    }
}

function popoulateNoteTitles(){
    htmlstring = "";
    for (var key in title_object){
        htmlstring += "<li class='note-list'>" + title_object[key] + "</li>";
    }
    $("ul").html(htmlstring);
    $("li").click(showNote);
}

function deleteNote(){
    var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
    var store = trans.objectStore("notebag_store");
    var request_del = store.delete(current_note.url);url;  
}

function docReady(){
    indexedDB = window.webkitIndexedDB;
    mIDBTransaction = window.webkitIDBTransaction||window.IDBTransaction;
    IDBKeyRange = window.webkitIDBKeyRange;

    // Fetch data from IndexedDB
    getAllNotes();
}

function showNote(){
    $(".note-list-click").removeClass("note-list-click");
    $(this).addClass("note-list-click");
    $("#note-title").text($(this).text());
    $("#note-body").text(note_object[$(this).text()].text)
    $("#note-web-url").attr("href",note_object[$(this).text()].url);
    var link_text = note_object[$(this).text()].url;   
    $("#note-web-url").text(link_text.substr(0,75));
    current_note.title = $(this).text();
    current_note.text = note_object[$(this).text()].text;
    current_note.url = note_object[$(this).text()].url;    
}
