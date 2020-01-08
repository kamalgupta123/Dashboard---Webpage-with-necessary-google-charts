<?php
include 'dblinker.php';

function get_status(){
	try{

		$link = linkToTIS();
	    $handle=$link->prepare("SELECT `EventType`, COUNT(*) count FROM `tis_raw_data_rlvd` WHERE `TimeStamp` >= NOW() - INTERVAL 1 HOUR GROUP BY `EventType`"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);

		return json_encode($result);
	}
	catch(Exception $e){
	    return "F";
	}
}

echo get_status();
?>
