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
var listIndex = 0;
var listArray;

function getAllNotes(){
    var current_title;
    var current_text;
    var current_url;
    listArray = {};
    
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
                $('li').click(onListItemClicked);
                populateNoteTitles();
                return;
            }
            
            var title = cursor.value.title;
            if (title == undefined){
               title = String(cursor.value.text).split("\n",1);
               title = String(cursor.value.text).split(".",1);
               if (String(title).split(" ").length > 6){
                   title = String(title).split(" ",6).join(" ");
               }
            }
            note_object[title] = {"text":cursor.value.text,"url":cursor.key};
            title_object[cursor.key] = title;
            current_title = title;
            current_text = cursor.value.text;
            current_url = cursor.key;
            cursor.continue();            
        }
    }
}

function populateNoteTitles(){
    htmlstring = "";    
    for (var key in title_object){
        htmlstring += "<li class='note-list' " + "id=listitem" + listIndex +  " >" + title_object[key] + "</li>";
        listArray[key] = listIndex;
        listIndex++;    
        console.log("listindex " + listIndex);
    }
    $("ul").html(htmlstring);
    $("li").click(onListItemClicked);    
    showNote(0);
}

function onListItemClicked(){
    var index = $('li').index($(this));
    showNote(index);
}

function deleteNote(){
    var trans = mDb.transaction(["notebag_store"],mIDBTransaction.READ_WRITE);
    var store = trans.objectStore("notebag_store");
    var request_del = store.delete(current_note.url);  
    $("#listitem" + [listArray[current_note.url]]).remove();
    showNote(0);   
}

function docReady(){
    indexedDB = window.webkitIndexedDB;
    mIDBTransaction = window.webkitIDBTransaction||window.IDBTransaction;
    IDBKeyRange = window.webkitIDBKeyRange;

    // Fetch data from IndexedDB
    getAllNotes();
}

function showNote(lIndex){
    var itemstr = "#listitem" + lIndex;    
    var bodystr = note_object[$(itemstr).text()].text;
    bodystr = "<p>" + bodystr;
    bodystr = bodystr.replace(/\n/g,"</p><p>");
    bodystr += "</p>";
    $(".note-list-click").removeClass("note-list-click");
    $(itemstr).addClass("note-list-click");
    $("#note-title").text($(itemstr).text());
    $("#note-body").html(bodystr);
    $("#note-web-url").attr("href",note_object[$(itemstr).text()].url);
    var link_text = note_object[$(itemstr).text()].url;   
    $("#note-web-url").text(link_text.substr(0,75));
    current_note.title = $(itemstr).text();
    current_note.text = note_object[$(itemstr).text()].text;
    current_note.url = note_object[$(itemstr).text()].url;        
}
