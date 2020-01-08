
	function myFunction() {
	  window.open("/tis/gui/html/dashboard.html", "_blank", "toolbar=yes,scrollbars=yes,resizable=yes,top=0,left=0,width="+$(window).width()+",height="+$(window).height());
	}
$(document).ready(function(){
	userrole = '';
        fetchroles = function(){
        	var path = window.location.pathname;
			var page = path.split("/").pop();
			if (page == "home.html" || page == "combined_livedata.html" || page == "dashboard.html"){
				$.ajax({
		            url: '../utils/get_roles.php',
		            success: function(result) {
					var id_set = jQuery.parseJSON(result);
					//for(i=0; i<id_set.length;i++){
						add_entry(id_set[0].role)
					//}
					$("#menu_bar").append('<li role="presentation"><a href="javascript:void(0)" id="logout" onclick="logout()"><i class="fas fa-sign-out-alt nav-left-icon"></i> Logout</a></li>');
                	}
                });
			}
			else{
        		$.ajax({
		            url: '../../utils/get_roles.php',
		            success: function(result) {
					var id_set = jQuery.parseJSON(result);
					//for(i=0; i<id_set.length;i++){
						add_entry(id_set[0].role)
					//}
					$("#menu_bar").append('<li role="presentation"><a href="javascript:void(0)" id="logout" onclick="logout()"><i class="fas fa-sign-out-alt nav-left-icon"></i> Logout</a></li>');
                	}
                });        
  		    }
		}
	fetchroles();
	add_entry = function(role){
		userrole = role
		
		// if(role == "Admin" || role=="ManagerVMS" || role=="OperatorVMS"|| role=="ManagerMET" || role=="OperatorMET" || role=="ManagerATCC" || role=="OperatorATCC" || role=="ManagerCCTV" || role=="OperatorCCTV" || role=="ManagerECB" || role=="OperatorECB" || role=="ManagerNMS" || role=="OperatorNMS" || role=="ManagerSituation" || role=="ManagerMaintenance" || role=="OperatorSituation" || role=="ManagerSignal" || role=="OperatorSignal"){
		if(role=="ManagerSignal" || role=="OperatorSignal"){
				$("#menu_bar").append('<li role="presentation" id="home"><a href="/tis/gui/html/home.html"><i class="fas fa-home nav-left-icon"></i>&nbsp;Home</a></li>');
				$("#menu_bar").append('<li role="presentation" id="signal_control"><a href="/tis/gui/html/traffic_signal/signal_overview.html"><i class="fas fa-traffic-light nav-left-icon"></i>&nbsp;Traffic Signals</a></li>');
				$("#menu_bar").append('<li role="presentation" id="asset_management"><a href="/tis/gui/html/asset_management/asset_map.html"><i class="fas fa-tasks nav-left-icon"></i>&nbsp;Asset Management</a></li>');
				$("#menu_bar").append('<li role="presentation" id="maintenance"><a href="/tis/gui/html/maintenance/createSR.html"><i class="fas fa-tools nav-left-icon"></i>&nbsp;Maintenance</a></li>');
				// $("#menu_bar").append('<li role="presentation" id="user_management"><a href="/tis/gui/html/user_management/changePassword.html">Settings</a></li>');

		}
		else if(role == "Admin" || role=="ManagerSignal" || role=="OperatorSignal" || role=="ManagerMaintenance" || role=="OperatorMaintenance"){
				$("#menu_bar").append('<li role="presentation" id="home"><a href="/tis/gui/html/home.html"><i class="fas fa-home nav-left-icon"></i>&nbsp;Home</a></li>');
				$("#menu_bar").append('<li role="presentation" id="dashboard"><a href="javascript:void(0)" onclick="myFunction()"><i class="fas fa-file-contract nav-left-icon"></i>&nbsp;Dashboard</a></li>');
				
				// $("#menu_bar").append('<li role="presentation" id="htms"><a class="tab-name"><i class="fas fa-road nav-left-icon"></i>HTMS</a><ul class="htms_list"><li role="presentation" id="atcc"><a href="/tis/gui/html/atcc/atcc_map.html"><i class="fas fa-car nav-left-sub-icon"></i>&nbsp;ATCC</a></li><li role="presentation" id="cctv"><a href="/tis/gui/html/cctv/cctv_map.html"><i class="fas fa-video nav-left-sub-icon"></i>&nbsp;CCTV</a></li><li role="presentation" id="ecb"><a href="/tis/gui/html/ecb/ecb.html"><i class="fas fa-phone-square nav-left-sub-icon"></i>&nbsp;ECB</a></li><li role="presentation" id="met"><a href="/tis/gui/html/met/met_map.html"><i class="fas fa-cloud-sun-rain nav-left-sub-icon"></i>&nbsp;MET</a></li><li role="presentation" id="vms"><a href="/tis/gui/html/vms/vms_map.html"><i class="fas fa-chalkboard nav-left-sub-icon"></i>&nbsp;VMS</a></li></ul></li>');
				$("#menu_bar").append('<li role="presentation" id="cctv"><a href="/tis/gui/html/cctv/cctv_map.html"><i class="fas fa-video nav-left-sub-icon"></i>&nbsp;CCTV</a>');
				 
				 $("#menu_bar").append('<li role="presentation" id="detector"><a href="/tis/gui/html/detector/detector_map.html"><i class="fas fa-microchip nav-left-icon"></i>&nbsp;Detector</a></li>');
				// $("#menu_bar").append('<li role="presentation" id="enf_anpr"><a href="/tis/gui/html/anpr/anpr_map.html">ANPR</a></li>');
				 $("#menu_bar").append('<li role="presentation" id="signal_control"><a href="/tis/gui/html/traffic_signal/signal_overview.html"><i class="fas fa-traffic-light nav-left-icon"></i>&nbsp;Traffic Signals</a></li>');
				 // $("#menu_bar").append('<li role="presentation" id="ramp_meter"><a href="/tis/gui/html/ramp_meter/add_signal.html"><i class="fab fa-deviantart nav-left-icon" style="margin-right:10px"></i>&nbsp;Ramp Meter</a></li>');
				  $("#menu_bar").append('<li role="presentation" id="jtms"><a href="/tis/gui/html/travel_time/anpr_livedata.html"><i class="far fa-clock nav-left-icon"></i>&nbsp;Travel Time</a></li>');
				  $("#menu_bar").append('<li role="presentation" id="enforcement"><a href="/tis/gui/html/enforcement/rlvd_livedata.html"><i class="fas fa-landmark nav-left-icon" ></i>&nbsp;Enforcement</a></li>');
				$("#menu_bar").append('<li role="presentation" id="accidents"><a href="/tis/gui/html/situation/accidents.html"><i class="fas fa-car-crash nav-left-icon"></i>&nbsp;Situations</a></li>');
				 // $("#menu_bar").append('<li role="presentation" id="accidents"><a href="/tis/gui/html/accidents.html"><i class="fas fa-car-crash nav-left-icon"></i>&nbsp;TARS</a></li>');
				 // $("#menu_bar").append('<li role="presentation" id="user_tracking"><a href="/tis/gui/html/gps_tracking/gps_tracking.html"><i class="fas fa-satellite-dish nav-left-icon"></i></i>&nbsp;GPS Tracking</a></li>');
				
				// $("#menu_bar").append('<li role="presentation" id="vehicle_livedata"><a href="/tis/gui/html/vehicle_count/vehicle_cctv_map.html">Vehicle Count</a></li>');
				// $("#menu_bar").append('<li role="presentation" id="accidents"><a href="accidents.html">Situations</a></li>');
				
				// $("#menu_bar").append('<li role="presentation" id="rule_engine"><a href="/tis/gui/html/rule_engine/rule_live.html">Rule Engine</a></li>');
				// $("#menu_bar").append('<li role="presentation" id="nms"><a href="/tis/gui/html/nms/nms.html">NMS / Fault Report</a></li>');
				
				$("#menu_bar").append('<li role="presentation" id="asset_management"><a href="/tis/gui/html/asset_management/asset_map.html"><i class="fas fa-tasks nav-left-icon"></i>&nbsp;Asset Management</a></li>');

				$("#menu_bar").append('<li role="presentation" id="maintenance"><a href="/tis/gui/html/maintenance/createSR.html"><i class="fas fa-tools nav-left-icon"></i>&nbsp;Maintenance</a></li>');
				$("#menu_bar").append('<li role="presentation" id="user_management"><a href="/tis/gui/html/user_management/changePassword.html"><i class="fas fa-cog nav-left-icon"></i>&nbsp;User Settings</a></li>');
				// $("#menu_bar").append('<li role="presentation" id="licence"><a href="/tis/gui/html/licence/licence.html">Licence</a></li>');
				
				//$("#menu_bar").append('<li role="presentation" id="upload_xml"><a href="upload_xml.html">Upload XML</a></li>');
				$('.htms_list').slideUp()
				
				$('#htms').click(function(){
					if($('.htms_list').is(':visible')){
						if($('#vms').hasClass('active') || $('#met').hasClass('active') || $('#atcc').hasClass('active') || $('#cctv').hasClass('active') || $('#enforcement').hasClass('active') || $('#detector').hasClass('active') || $('#ecb').hasClass('active')){
							$('.htms_list').slideUp()
						}
						else{
							$(this).removeClass('active')
							$('.htms_list').slideUp()	
						}					
					}
					else{
						$(this).addClass('active')
						$('.htms_list').slideDown()
					}
				})

				$('.htms_list li').click(function(){
					window.location = $('a',this).attr('href')
				})
		}
		else if(role=="ManagerSignal" || role=="OperatorSignal"){
				$("#menu_bar").append('<li role="presentation" id="home"><a href="/tis/gui/html/home.html">Home</a></li>');
				$("#menu_bar").append('<li role="presentation" id="signal_control"><a href="/tis/gui/html/traffic_signal/signal_overview.html"><i class="fas fa-traffic-light nav-left-icon"></i>&nbsp;Traffic Signals</a></li>');
				$("#menu_bar").append('<li role="presentation" id="asset_management"><a href="/tis/gui/html/asset_management/asset_map.html"><i class="fas fa-tasks nav-left-icon"></i>&nbsp;Asset Management</a></li>');
				// $("#menu_bar").append('<li role="presentation" id="user_management"><a href="/tis/gui/html/user_management/changePassword.html">Settings</a></li>');

		}
		else if(role=="ManagerMaintenance" || role=="OperatorMaintenance"){
				$("#menu_bar").append('<li role="presentation" id="home"><a href="/tis/gui/html/home.html">Home</a></li>');
				$("#menu_bar").append('<li role="presentation" id="maintenance"><a href="/tis/gui/html/maintenance/createSR.html">Maintenance</a></li>');
				
		}
	}

	$('.live_group_type button').click(function(){
		var href = $('a',this).attr('href')
		window.location = href
	})
	
});
