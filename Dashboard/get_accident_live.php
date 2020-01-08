<?php
include 'dblinker.php';

function get_status(){
	try{

		$link = linkToTIS();
		$ret = new \stdClass();
	    $handle=$link->prepare("SELECT COUNT(*) count FROM utmc_event_static WHERE Active=1"); 
	    $handle->execute();
		$result=$handle->fetch(PDO::FETCH_ASSOC);
		$ret->event = $result[0]['count'];

	    $handle=$link->prepare("SELECT COUNT(*) count FROM utmc_accident_static WHERE Active=1"); 
	    $handle->execute();
		$result=$handle->fetch(PDO::FETCH_ASSOC);
		$ret->accident = $result[0]['count'];

	    $handle=$link->prepare("SELECT COUNT(*) count FROM utmc_incident_static WHERE Active=1"); 
	    $handle->execute();
		$result=$handle->fetch(PDO::FETCH_ASSOC);
		$ret->incident = $result[0]['count'];

	    $handle=$link->prepare("SELECT COUNT(*) count FROM utmc_crime_static WHERE Active=1"); 
	    $handle->execute();
		$result=$handle->fetch(PDO::FETCH_ASSOC);
		$ret->crime = $result[0]['count'];

	    $handle=$link->prepare("SELECT COUNT(*) count FROM utmc_roadwork_static WHERE Active=1"); 
	    $handle->execute();
		$result=$handle->fetch(PDO::FETCH_ASSOC);
		$ret->roadwork = $result['count'];

		return json_encode($ret);
	}
	catch(Exception $e){
		var_dump($e);
	    return "F";
	}
}

echo get_status();
?>
