<?php
include 'dblinker.php';

function get_status(){
	try{

		$link = linkToTIS();
		$CongestionPercent = 0;
		$count = 0;
	    $handle=$link->prepare("SELECT DISTINCT SystemCodeNumber FROM utmc_transport_link_data_dynamic"); 
	    $handle->execute();
		$result=$handle->fetchall(PDO::FETCH_ASSOC);
		foreach ($result as $key => $row) {
			$count = $count + 1;
			$handle=$link->prepare("SELECT IFNULL(n1.CongestionPercent, 0) CongestionPercent, n1.SystemCodeNumber, n1.LastUpdated FROM utmc_transport_link_data_dynamic n1 WHERE n1.SystemCodeNumber=:id AND n1.LastUpdated=(SELECT MAX(LastUpdated) FROM utmc_transport_link_data_dynamic WHERE SystemCodeNumber=:id)"); 
		    $handle->execute(array('id' => $row["SystemCodeNumber"]));
			$CongestionPercent= $CongestionPercent + $handle->fetch(PDO::FETCH_ASSOC)["CongestionPercent"];
			echo($CongestionPercent);
		}
		$CongestionPercent = $CongestionPercent / $count;
		return json_encode(array('CongestionPercent' => $CongestionPercent));
	}
	catch(Exception $e){
	    return "F";
	}
}

echo get_status();
?>