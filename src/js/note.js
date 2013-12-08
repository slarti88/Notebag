// This is the script invoked by note.html which is the side bar. This listens to the events 
// like addition of text to textarea and closing of the sidebar


$(document).ready(start);


var tarea;
var home_button;
var addText;

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

    console.log("PageUrl " + pageUrl);

    chrome.storage.local.get(pageUrl,function(item) {
        
        for (val in item){
            console.log("val " + item[val]);

            var noteObject = item[val];
            notestring = noteObject.text;
            console.log("noteobject title " + noteObject.title);
            $("#side-note-text-area").text(notestring);        
        }
    });
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


// This function is when we want ot add the text in the text area to the liocal storage
function addToDB(text){
    console.log("AddtoDb");
    
    var title =String(text).split("\n",1);
    title =String(title).split(".",1);
    if (String(title).split(" ").length > 6){
        title = String(title).split(" ",6).join(" ");
    }

    var noteObject = {"text":text,"title":title,"modified_at":(new Date()).getTime()};
    var storeObject = {};
    storeObject[pageUrl] = noteObject;

    chrome.storage.local.set(storeObject,function () {
        console.log("pageurl " + pageUrl + " added");        
        if (firstTime) {
            addToBookmarks(title,pageUrl);
        }
    });
}

function addToBookmarks(titlevar, urlvar) {
    chrome.extension.sendMessage({"id":"bookmark","head":titlevar,"url":urlvar}, function (response) {
        console.log("created");
    });    
}
