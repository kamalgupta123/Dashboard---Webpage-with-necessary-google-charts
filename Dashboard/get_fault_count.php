<?php
include 'dblinker.php';

function get_fault_count(){
	try{
		$link = linkToTIS();
	    $handle=$link->prepare("SELECT c.FaultDescription, c.Fault_TypeID, IFNULL(b.fault_count, 0) fault_count FROM (SELECT a.FaultType, COUNT(*) fault_count FROM utmc_device_fault a WHERE a.ClearedDate IS NULL group BY (a.FaultType)) b RIGHT JOIN utmc_device_fault_typeid c ON c.Fault_TypeID=b.FaultType"); 
	    $handle->execute();
		$result=$handle->fetchAll(PDO::FETCH_ASSOC);
		return json_encode($result);
	}
	catch(Exception $e){
	    return "F";
	}
}

echo get_fault_count();
?>