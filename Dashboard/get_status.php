<?php
include 'dblinker.php';

function get_status(){
	try{

		$link = linkToTIS();
		$online = 0;
		$count = 0;
	    $handle=$link->prepare("SELECT DISTINCT `SystemCodeNumber` FROM tis_cctv_fault"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		foreach ($result as $key => $row) {
			$handle=$link->prepare("SELECT online FROM tis_cctv_fault WHERE SystemCodeNumber=:id AND LastUpdated=(SELECT MAX(LastUpdated) from tis_cctv_fault WHERE SystemCodeNumber=:id)"); 
		    $handle->execute(array('id' => $row["SystemCodeNumber"]));
			$status = $handle->fetch(PDO::FETCH_ASSOC)["online"];
			$online = $online + $status;
			$count = $count + 1; 
		}


	    $handle=$link->prepare("SELECT DISTINCT `SystemCodeNumber` FROM tis_detector_fault"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		foreach ($result as $key => $row) {
			$handle=$link->prepare("SELECT online FROM tis_detector_fault WHERE SystemCodeNumber=:id AND LastUpdated=(SELECT MAX(LastUpdated) from tis_detector_fault WHERE SystemCodeNumber=:id)"); 
		    $handle->execute(array('id' => $row["SystemCodeNumber"]));
			$status = $handle->fetch(PDO::FETCH_ASSOC)["online"];
			$online = $online + $status;
			$count = $count + 1; 
		}

    	$handle=$link->prepare("SELECT DISTINCT `SystemCodeNumber` FROM tis_nvr_fault"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		foreach ($result as $key => $row) {
			$handle=$link->prepare("SELECT online FROM tis_nvr_fault WHERE SystemCodeNumber=:id AND LastUpdated=(SELECT MAX(LastUpdated) from tis_nvr_fault WHERE SystemCodeNumber=:id)"); 
		    $handle->execute(array('id' => $row["SystemCodeNumber"]));
			$status = $handle->fetch(PDO::FETCH_ASSOC)["online"];
			$online = $online + $status;
			$count = $count + 1; 
		}
		

		// $handle=$link->prepare("SELECT DISTINCT `SystemCodeNumber` FROM tis_ramp_meter_fault"); 
	 //    $handle->execute();
		// $result=$handle->fetchall(PDO::FETCH_ASSOC);
		// foreach ($result as $key => $row) {
		// 	$handle=$link->prepare("SELECT online FROM tis_ramp_meter_fault WHERE SystemCodeNumber=:id AND LastUpdated=(SELECT MAX(LastUpdated) from tis_ramp_meter_fault WHERE SystemCodeNumber=:id)"); 
		//     $handle->execute(array('id' => $row["SystemCodeNumber"]));
		// 	$status = $handle->fetch(PDO::FETCH_ASSOC)["online"];
		// 	$online = $online + $status;
		// 	$count = $count + 1; 
		// }

		$handle=$link->prepare("SELECT DISTINCT `SystemCodeNumber` FROM tis_traffic_signal_fault"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		foreach ($result as $key => $row) {
			$handle=$link->prepare("SELECT online FROM tis_traffic_signal_fault WHERE SystemCodeNumber=:id AND LastUpdated=(SELECT MAX(LastUpdated) from tis_traffic_signal_fault WHERE SystemCodeNumber=:id)"); 
		    $handle->execute(array('id' => $row["SystemCodeNumber"]));
			$status = $handle->fetch(PDO::FETCH_ASSOC)["online"];
			$online = $online + $status;
			$count = $count + 1; 
		}

		$handle=$link->prepare("SELECT DISTINCT `SystemCodeNumber` FROM tis_vms_fault"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		foreach ($result as $key => $row) {
			$handle=$link->prepare("SELECT online FROM tis_vms_fault WHERE SystemCodeNumber=:id AND LastUpdated=(SELECT MAX(LastUpdated) from tis_vms_fault WHERE SystemCodeNumber=:id)"); 
		    $handle->execute(array('id' => $row["SystemCodeNumber"]));
			$status = $handle->fetch(PDO::FETCH_ASSOC)["online"];
			$online = $online + $status;
			$count = $count + 1; 
		}

		$offline = $count - $online;

		return json_encode(array('online' => $online, 'offline' => $offline));
	}
	catch(Exception $e){
	    return "F";
	}
}

echo get_status();
?>
