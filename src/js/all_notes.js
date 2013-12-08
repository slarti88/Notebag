$(document).ready(docReady);

var note_object = new Object();
var title_object = new Object();
var current_note = new Object();

var listIndex = 0;
var listArray;

var noteData = null;

function getAllNotes(){
    listArray = {};

    chrome.storage.local.get(null,function (items){
        
        for (val in items) {

            var noteObject = items[val];

            if (noteObject.hasOwnProperty("title")) {                
                var title = noteObject.title;
                if (title === undefined){
                   title = String(noteObject.text).split("\n",1);
                   title = String(noteObject.text).split(".",1);
                   if (String(title).split(" ").length > 6){
                       title = String(title).split(" ",6).join(" ");
                   }
                }
                note_object[title] = {"text":noteObject.text,"url":val,"modified_at":noteObject.modified_at};
                title_object[val] = title;

                var current_title = title;
                console.log("current title " + current_title);
                var current_text = noteObject.text;
                var current_url = val;
                
                loadNote(current_title,current_text,current_url);
            }
        }
    });        
}    
    

function toggleSearch(){
    $("#note-search-box").show();
    $("#note-search-box").keyup(onSearchTextChange);
    console.log("searchNotes");
}

function onSearchTextChange() {
    var searchText = $(this).val();    
    searchNotes(searchText);
}

function searchNotes(text){
    var noteMatches = {};
    for (var key in title_object) {
        var subject = title_object[key];          
        var pattern = new RegExp(text,"gi");
        var match = String(subject).match(pattern);        
        if (match != null) {                
            noteMatches[key] = title_object[key];
        } else {
            subject = note_object[title_object[key]].text;
            match = String(subject).match(pattern);            
            if (match != null) {                
                noteMatches[key] = title_object[key];
            }
        }
    }    
    populateNoteTitles(noteMatches);
}

function saveNotes(){
    var requestFileSystem = window.requestFileSystem||window.webkitRequestFileSystem;
    requestFileSystem(window.TEMPORARY,1024*1024*5/*5MB*/,onInitFs,onFsError);
}

function onInitFs(fs){
    fs.root.getFile("notebag_data.json",{create:true},function (fileEntry){
        fileEntry.createWriter(function (fileWriter){
            fileWriter.onwriteend = function (e){
                console.log("Write complete");
            };
            fileWriter.onerror = function (e){
                console.log("Unable to write");
            };
            var BlobBuilder = BlobBuilder||window.WebKitBlobBuilder;
            var bb = new BlobBuilder();
            bb.append(JSON.stringify(note_object));
            fileWriter.write(bb.getBlob('text/plain'));
            var furl = fileEntry.toURL();
            window.open(furl);
        },onFsError);
    },onFsError);    
}

function onFsError(e){
    console.log("onInitFsError");
}

function populateNoteTitles(title_array){
    htmlstring = "";    
    listIndex = 0;
    for (var key in title_array){
        htmlstring += "<li class='note-list' " + "id=listitem" + listIndex +  " >" + title_array[key] + "</li>";
        listArray[key] = listIndex;
        listIndex++;            
    }
    $("ul").html(htmlstring);
    $("li").click(onListItemClicked);

    if (listIndex > 0){
        showNote(0);    
    }
}

function onListItemClicked(){
    var index = $('li').index($(this));
    showNote(index);
}

function deleteNote(){
    var trans = mDb.transaction(["notebag_store"],saction.READ_WRITE);
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

function loadNote(current_title,current_text,current_url){
    console.log("Load note " + current_title);
    current_note.title = current_title;
    current_note.note = current_text;
    current_note.url = current_url;
    $("#note-title").text(current_title);
    $("#note-body").text(current_text);
    $("#note-web-url").attr("href",current_url);
    $("#note-web-url").attr("target","_blank");

    $("#note-delete-link").click(deleteNote);
    // Set the note saving listener
    $("#note-save-link").click(saveNotes);
    // Set search notes listener
    $("#note-search-link").click(toggleSearch);
    // Specify certain css properties
    $('li').addClass("note-list");
    // Specify event handlers
    $('li').click(onListItemClicked);
    $("#note-search-box").hide();
    populateNoteTitles(title_object);
    return;
}


