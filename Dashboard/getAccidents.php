<?php
include 'dblinker.php';

function get_accidents(){
	try{
		$link = linkToTIS();
	    $handle=$link->prepare("SELECT * FROM `utmc_accident_static` WHERE `Active`=1"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		return json_encode($result);
	}
	catch(Exception $e){
		var_dump($e);
	    return "F";
	}
}

echo get_accidents();
?>