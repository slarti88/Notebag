<?php

function saveText($data) {
	$date = date("y-m-d");
	//$formatted_date = $date->format("Y-m-d");
	$formatted_date = $date.".txt";
	$fn = fopen($formatted_date,"w");		 
	fwrite($fn, $data,strlen($data));
	fclose($fn);
	return $formatted_date;
}

try {
	$op_string = $_GET['type']; 	
	if (isset($_GET['type'])) {
		switch ($_GET['type']) {
			case 'save':
				$op_string .= " Inside save ";
				//saveText();
				break;	
		}
	}
	$op = json_encode(array("op"=>$op_string));
	echo $op;
}
catch (exception $e) {
	
}			
?>
