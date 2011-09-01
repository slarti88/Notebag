var Ti = {fs: Titanium.Filesystem};
var currentTime = new Date();
var filename = currentTime.getDate() + "_" + currentTime.getMonth() + "_" + currentTime.getYear() + ".txt";
var note_header = "";
var text = "";
var init_text = "";
var note_object;

var now = new Date();
var mon = now.getMonth() + 1;
var yr = now.getFullYear();
var dt = now.getDate()
var filename =  yr + "-"  + mon + "-" + dt + ".txt";

function input_text(evt) {
	if(evt.which == 13) {
		// ENter is pressed
		saveNote();		  
	}	
}

function saveNote() {
	// Call php file with type = "save"		
	text = $("#note_area").val();
	
	if (note_header == "") {
		note_header = text;
	}
		
	note_object = {"title":note_header,"body":text};
	var filedata = JSON.stringify(note_object);
	saveText(filename, filedata);
				
}

function openNote() {	
	$data = openText(filename);
	if ($data) {
		$data_obj = JSON.parse($data);		
		$('#note_area').val($data_obj.body);
	}
}
