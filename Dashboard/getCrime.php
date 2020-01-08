<?php
include 'dblinker.php';

function get_crimes(){
	try{
		$link = linkToTIS();
	    $handle=$link->prepare("SELECT * FROM `utmc_crime_static` WHERE `Active`=1"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		return json_encode($result);
	}
	catch(Exception $e){
	    return "F";
	}
}

echo get_crimes();
?>