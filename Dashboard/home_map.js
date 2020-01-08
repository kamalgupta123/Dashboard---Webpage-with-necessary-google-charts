
function json_to_csv(json_data, title, label, fromDate, toDate, json_data_devices) {
    //Json  Parser
    console.log(json_data,json_data_devices)
    var arr_data = json_data;
    var arr_data_devices = JSON.parse(json_data_devices);
    var csv = '';    
    
    if (label) {
        var row = "";
        for (var index in arr_data_devices[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        //new line
        csv += row + '\r\n';
    }


    //Traffic data extraction
    if($('input[name=orderDir]').attr('value') == 'asc'){
        for (var i = arr_data_devices.length-1; i >= 0; i--) {
            var row = "";        
            for (var index in arr_data_devices[i]) {
                row += '"' + arr_data_devices[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }
    else{
        for (var i = 0; i < arr_data_devices.length; i++) {
            var row = "";        
            for (var index in arr_data_devices[i]) {
                row += '"' + arr_data_devices[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }

    //Title of the csv file, utilize it if needed 
    csv += '\r\n\n'+title + '\r\n\n';

    // column labels extraction
    if (label) {
        var row = "";
        for (var index in arr_data[0]) {
            row += index + ',';
        }
        row = row.slice(0, -1);
        //new line
        csv += row + '\r\n';
    }

    //Traffic data extraction
    if($('input[name=orderDir]').attr('value') == 'asc'){
        for (var i = arr_data.length-1; i >= 0; i--) {
            var row = "";        
            for (var index in arr_data[i]) {
                row += '"' + arr_data[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }
    else{
        for (var i = 0; i < arr_data.length; i++) {
            var row = "";        
            for (var index in arr_data[i]) {
                row += '"' + arr_data[i][index] + '",';
            }
            row.slice(0, row.length - 1);
            //add a line break after each row
            csv += row + '\r\n';
        }
    }

    if (csv == '') {        
        alert("No data found");
        return;
    }   
    
    // file name declaration change accordingly
    var file_name = "vehicleCount_report_"+fromDate+"_"+toDate;
    var uri = 'data:text/csv;charset=utf-8,' + escape(csv);    
    var link = document.createElement("a");    
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = file_name + ".csv";    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

function goToPlayback(scn){
    window.open("cctv_playback.html?scn="+scn,"_blank")
}

function setLiveLink(SystemCodeNumber) {
    $.ajax({
        url: '../utils/cctv_map_link.php',
        type: 'POST',
        data: {SystemCodeNumber:SystemCodeNumber},
        success: function(result_cctv) {
            var links = jQuery.parseJSON(result_cctv);
            var link = links[0].LiveLink;
            var ip = links[0].NVRIPAddress;
            var channel = links[0].Channel;
            $.ajax({
                url:'../utils/get_cctv_login.php',
                success:function(res){
                    res = JSON.parse(res)
                   document.getElementById('videoTag').innerHTML = '<object classid="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921" codebase="./axvlc.cab" id="vlc" events="True" height="430" width="525" style="width: 100%; height: 430px;"><param name="Src" value="rtsp://'+res[0].login+':'+res[0].pass+'@'+ip+':561/unicast/c'+channel+'/s0/live" /><param name="ShowDisplay" value="True" /><param name="AutoLoop" value="False" /><param name="AutoPlay" value="True" /></object>'
                    // document.getElementById('videoTag').innerHTML = '<video width="525" height="430px" style="width: 100%; height: 430px;" preload="none" autoplay="true" src="'+link+'" loop="true"></video>';
                    $('#videoTag object').css('width','100%')
                    $('#liveModal').modal()
                    $('#liveModal').on('shown.bs.modal', function (e) {
                      $('#videoTag object').css('width','100%')
                    })
                    $('#videoTag object').css('width','100%')
                }
            })
        }
    }); 
}

function getDetectorReport(SystemCodeNumber) {
    $('#vehicle_count').DataTable().destroy()
    $('#createReport').attr('scn',SystemCodeNumber)
    $('#downloadReport').attr('scn',SystemCodeNumber)
    get_dt(SystemCodeNumber)
}

$(document).ready(function(){
    var map = L.map('home_map').setView([10.512882, 76.219563], 10);
    markers=[],markers_array=[],markers_group = L.featureGroup()

    var myIcon_cctvOn = L.icon({iconUrl: '../images/cctvOn.png',iconSize:[25,30],iconAnchor:[12.5,15]});
    var myIcon_cctvOff = L.icon({iconUrl: '../images/cctvOff.png',iconSize:[25,30],iconAnchor:[12.5,15]});
    var myIcon_anprOn = L.icon({iconUrl: '../images/anprcameraOn.png',iconSize:[25,30],iconAnchor:[12.5,10]});
    var myIcon_anprOff = L.icon({iconUrl: '../images/anprcameraOff.png',iconSize:[25,30],iconAnchor:[12.5,10]});
    var myIcon_detectorOn = L.icon({iconUrl: '../images/detectorcameraOn.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
    var myIcon_detectorOff = L.icon({iconUrl: '../images/detectorcameraOff.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});

    get_dt = function(scn){
        $('#vehicle_count').DataTable({
            "processing": true,
            "serverSide": true,
            "searching": false,
            "order":[[1,"desc"]],
            "ajax": {
                "url": "../utils/get_vehicle_data.php",
                "data": function ( d ) {
                    d.scn = scn
                    _scn = d.scn

                    if($('#from').val() == "")
                        d.fromDate = '1111-11-11 00:00:00'
                    else
                        d.fromDate = $('#from').val()
                    _fromDate = d.fromDate

                    if($('#to').val() == "")
                        d.toDate = '2099-12-30 23:59:59'
                    else
                        d.toDate = $('#to').val()
                    _toDate = d.toDate

                    $('input[name=orderCol]').attr('value',d.order[0].column)
                    $('input[name=orderDir]').attr('value',d.order[0].dir)

                },
                // dataFilter:function(res){
                //     var check = JSON.parse(res);
                //     // $('.new_ttime').html(check.latestVal)
                //     // $('.new_lupdated').html(check.latestTime)
                //     $('.graph_container svg').remove();
                //     // $('.graph_container').append('<svg width="1000" height="700"></svg>')
                //     // creategraph();
                //     // draw(check.data);
                //     // v12(check.data)
                //     allLinks = check.links.Links.split(",")
                //     getGraphData(_scn,_fromDate,_toDate,allLinks)
                //     $('input[name=totalValues]').attr('value',(JSON.parse(res)).recordsTotal)
                //     return res;
                // }
                dataFilter:function(res){
                    console.log((JSON.parse(res)).recordsTotal)
                    $('input[name=totalValues]').attr('value',(JSON.parse(res)).recordsTotal)
                    return res
                },
            },
            "columns": [
                { "data": "camera_scn" },
                { "data": "count" }
            ]
        });
    }

    var myIcon_patrol = L.icon({iconUrl: '../images/location.png',iconSize:[25,30],iconAnchor:[12.5,0]});
    
     $.ajax({
        url:'../utils/get_live_location.php',
        method:'POST',
        success:function(res){
            res = JSON.parse(res)
            for(var i =0;i<res.length;i++){
                markers_array.push(new L.marker([res[i].latitude,res[i].longitude]))
                marker = new L.marker([res[i].latitude,res[i].longitude],{icon: myIcon_patrol}).bindPopup('<span style="font-size:14px;"><b>Username:</b> '+res[i].username+'</span><br><span style="font-size:14px;"><b>Last Seen:</b> '+res[i].time+'</span>');
                marker.addTo(markers_group);
                markers_group.addTo(map);
                markers.push(marker);
            }

            // markers_group = new L.featureGroup(markers_array);
            map.fitBounds(markers_group.getBounds());
        }
    })


    $('#createReport').on('click',function(){
        $('#vehicle_count').DataTable().destroy()
        get_dt($(this).attr('scn'))
    })

    download_report = function(){

        var downloadPermission = false;

        $.ajax({
            url: '../utils/get_roles.php',
            success: function(result) {
                var id_set = jQuery.parseJSON(result);
                downloadPermission = true;

                if(downloadPermission){

                    var scnval = $('#downloadReport').attr('scn');
                    var fromDate=$('#from').val();
                    var toDate=$('#to').val();
                                    
                    if($('#from').val() == "")
                        fromDate = '1111-11-11 00:00:00'

                    if($('#to').val() == "")
                        toDate = '2099-12-30 23:59:59'
                                        
                    scn = scnval
                    start_time = fromDate
                    end_time = toDate

                    var q = new Date();
                    var m = q.getMonth();
                    var d = q.getDate();
                    var y = q.getFullYear();
                    var date = new Date(y,m,d);
                    mydate=new Date(fromDate);
                    
                    if(fromDate > toDate){
                        alert("From Date should be less than To Date");
                        return;
                    }
                    else{
                        $.ajax({
                            url: '../utils/vehiclecount_report.php',
                            data:{
                                scn:scnval,fromDate:fromDate,toDate:toDate,download:'1',draw:1,length:$('input[name=totalValues]').attr('value'),order:[{column:$('input[name=orderCol]').attr('value'),dir:$('input[name=orderDir]').attr('value')}]
                            },
                            success: function(result) {
                                result = JSON.parse(result)
                                if(result.length == 2){
                                    alert("Connection Error please try again");
                                }
                                else{
                                    $.ajax({
                                        url: '../utils/cctv_raw.php',
                                        method:'POST',
                                        success: function(result_devices) {
                                            
                                            $.ajax({
                                                url: '../utils/get_username.php',
                                                success: function(result_username) {
                                                    var username = result_username;
                                                    var currentdate = new Date(); 
                                                    var ts = "Downloaded at: " + currentdate.getDate() + "/"
                                                                    + (currentdate.getMonth()+1)  + "/" 
                                                                    + currentdate.getFullYear() + " @ "  
                                                                    + currentdate.getHours() + ":"  
                                                                    + currentdate.getMinutes() + ":" 
                                                                    + currentdate.getSeconds();

                                                    //console.log(result)
                                                    json_to_csv(result.data,"Vehicle Count Report",true,fromDate,toDate,result_devices,username,ts);

                                                }
                                            });
                                        }
                                    });

                                }
                            }
                        });
                    }

                } else{

                    alert("Permission denied. Please contact your administrator");
                }

            }

        });

    }
    $("#downloadReport").click(function() {
            download_report();
    });
    // $.ajax({
 //     url: '../utils/get_zones.php',
 //     success: function(data) {
 //         var zones = jQuery.parseJSON(data);

 //         for(var j=0;j<zones.length;j++) {
                $.ajax({
                    url: '../utils/cctv_map.php',
                    type: 'POST',
                    // data: {siteId:zones[j].SiteId},
                    success: function(result_cctv) {
                        var devices_set_cctv = jQuery.parseJSON(result_cctv);
                        for(i=0; i<devices_set_cctv.length;i++){
                            var fault = devices_set_cctv[i].online;
                            var icon = myIcon_cctvOn
                            if(fault === "1"){
                                if(devices_set_cctv[i].type == "cctv")
                                    icon = myIcon_cctvOn
                                else if(devices_set_cctv[i].type == "anpr")
                                    icon = myIcon_anprOn
                                else if(devices_set_cctv[i].type == "detector")
                                    icon = myIcon_detectorOn
                            } else if(fault === "0"){
                                if(devices_set_cctv[i].type == "cctv")
                                    icon = myIcon_cctvOff
                                else if(devices_set_cctv[i].type == "anpr")
                                    icon = myIcon_anprOff
                                else if(devices_set_cctv[i].type == "detector")
                                    icon = myIcon_detectorOff
                            }
                            markers_array.push(new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting]))

                            if(devices_set_cctv[i].type == "cctv"){
                                marker = new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting],{icon: icon}).bindPopup('<div class="tets"><div class="tets2">'+devices_set_cctv[i].SystemCodeNumber+'</div><br><div><table><tbody><tr><td><button class="btn btn-danger" data-toggle="modal" data-target="#liveModal" onClick=setLiveLink("'+devices_set_cctv[i].SystemCodeNumber+'");><span class="glyphicon glyphicon-picture"></span>&nbsp;Live View</button></td><td><button class="btn btn-primary playbackbtn" onclick=goToPlayback("'+devices_set_cctv[i].SystemCodeNumber+'")><span class="glyphicon glyphicon-film"></span>&nbsp;Playback</button></td></tr></tbody></table></div>')
                                marker.addTo(markers_group);
                                markers_group.addTo(map);
                            }
                            else if(devices_set_cctv[i].type == "anpr"){
                                marker = new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting],{icon: icon})
                                marker.addTo(markers_group);
                                markers_group.addTo(map);
                                marker.bindPopup('<div class="tets anprpopup"><div class="tets2">'+devices_set_cctv[i].SystemCodeNumber+'</div><br><div><table><tbody><tr><td><button class="btn btn-danger" data-toggle="modal" data-target="#liveModal" onClick=setLiveLink("'+devices_set_cctv[i].SystemCodeNumber+'");><span class="glyphicon glyphicon-picture"></span>&nbsp;Live View</button></td></tr></tbody></table></div><br><table class="table table-bordered livedatatable"><thead><tr><th>SystemCodeNumber</th><th>Place</th><th>VRN</th><th>TimeStamp</th></tr></thead><tbody></tbody></table></div>',{maxWidth:'auto'})
                                $(marker._icon).addClass('anprmarker');
                                $(marker._icon).attr('scn',devices_set_cctv[i].SystemCodeNumber)
                            }
                            else if(devices_set_cctv[i].type == "detector"){
                                marker = new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting],{icon: icon}).bindPopup('<div class="tets"><div class="tets2">'+devices_set_cctv[i].SystemCodeNumber+'</div><div><table><tbody><tr><td><button class="btn btn-info" data-toggle="modal" data-target="#detectorReportModal" onClick=getDetectorReport("'+devices_set_cctv[i].SystemCodeNumber+'");><span class="glyphicon glyphicon-file"></span>&nbsp;Detector Reports</button></td></tr></tbody></table></div><table class="table table-bordered detectortable"><thead><tr><strong>Traffic Count</strong></tr></thead><tbody><tr class="warning"><td>Last 5 minutes</td><td id="last5min"></td></tr><tr class="info"><td>Last 15 minutes</td><td id="last15min"></td></tr><tr class="success"><td>Last 30 min</td><td id="last30min"></td></tr></tbody></table></div>')
                                marker.addTo(markers_group);
                                markers_group.addTo(map);
                                $(marker._icon).addClass('detectormarker');
                                $(marker._icon).attr('scn',devices_set_cctv[i].SystemCodeNumber)
                            }

                            markers.push(marker);
                        }
                        // markers_group = new L.featureGroup(markers_array);
                        map.fitBounds(markers_group.getBounds().pad(0.05));

                        $('.leaflet-marker-pane .anprmarker').click(function(){
                            // $('.leaflet-popup-pane .leaflet-popup-content-wrapper .leaflet-popup-content').css('width','auto')
                            // $('.leaflet-popup-pane .leaflet-popup-tip-container').css('left','-85px')
                            // $('.leaflet-popup-pane .leaflet-popup-tip-container').css('margin-bottom','15px')
                            setTimeout(function(){$('.leaflet-popup').css('left',-($('.leaflet-popup').width()/2))},50)

                            var scn = $(this).attr('scn')
                            $.ajax({
                                url:'../utils/get_anpr_livedata.php',
                                method:'POST',
                                data:{
                                    scn:scn
                                },
                                success:function(res){
                                    res = JSON.parse(res)
                                    $('.livedatatable tbody tr').remove()
                                    for(var i=0;i<res.length;i++){
                                        $('.livedatatable tbody').append('<tr><td>'+res[i].SystemCodeNumber+'</td><td>'+res[i].Place+'</td><td>'+res[i].VRN+'</td><td>'+res[i].TimeStamp+'</td></tr>')
                                    }
                                }
                            });
                        })

                        $('.leaflet-marker-pane .detectormarker').click(function(){
                    
                            var scn = $(this).attr('scn')
                            $.ajax({
                                url:'../utils/get_last_detector_data.php',
                                method:'POST',
                                data:{
                                    scn:scn
                                },
                                success:function(res){
                                    res = JSON.parse(res)
                                    $('#last5min').html(res.data5minute.length == 0 ? "0" : res.data5minute[0]['count'])
                                    $('#last15min').html(res.data15minute.length == 0 ? "0" : res.data15minute[0]['count'])
                                    $('#last30min').html(res.data30minute.length == 0 ? "0" : res.data30minute[0]['count'])
                                }
                            });
                        })
                    }
                });

    //      }
            
    //  }
    // });
                            
    // $.ajax({
    //  url: '../utils/vms_map.php',
    //  success: function(result_vms){
    //      var devices_set_vms = jQuery.parseJSON(result_vms);
    //      for(i=0; i<devices_set_vms.length;i++){
    //          var fault = devices_set_vms[i].online;
    //          if(fault === "1"){
    //              //var myIcon_vms = L.icon({iconUrl: '../images/vmsOn.png',iconSize:[25,30],iconAnchor:[12.5,30]});
    //              var myIcon_vms = L.icon({iconUrl: '../images/vmsOn.png',iconSize:[37,11],iconAnchor:[18,5]});
    //          } else if(fault === "0"){
    //              //var myIcon_vms = L.icon({iconUrl: '../images/vmsOff.png',iconSize:[25,30],iconAnchor:[12.5,30]});
    //              var myIcon_vms = L.icon({iconUrl: '../images/vmsOff.png',iconSize:[37,11],iconAnchor:[18,5]});
    //          }
    //          markers_array.push(new L.marker([devices_set_vms[i].Northing,devices_set_vms[i].Easting]))
    //          marker = new L.marker([devices_set_vms[i].Northing,devices_set_vms[i].Easting],{icon:myIcon_vms}).bindPopup('<a href="../html/vms_live.html">'+devices_set_vms[i].SystemCodeNumber+'</a>')
 //                marker.addTo(markers_group);
 //                markers_group.addTo(map);
    //          //if you want you can edit the bindPopup() to show what ever data you want on popup.
    //          markers.push(marker);
    //      }
    //      // markers_group = new L.featureGroup(markers_array);
    //      map.fitBounds(markers_group.getBounds().pad(0.05));

    //  }
    // });
    
 //    $.ajax({
 //        url: '../utils/met_map.php',
 //        success: function(result_met){
 //            var devices_set_met = jQuery.parseJSON(result_met);
 //            markers_array = []
 //            for(i=0; i<devices_set_met.length;i++){
 //                var fault = devices_set_met[i].online;
 //                if(fault === "1"){
 //                    //var myIcon_met = L.icon({iconUrl: '../images/metOn.png',iconSize:[25,30],iconAnchor:[12.5,30]});
 //                    var myIcon_met = L.icon({iconUrl: '../images/metOn.png',iconSize:[50,33],iconAnchor:[25,16.5]});
 //                } else if(fault === "0"){
 //                    //var myIcon_met = L.icon({iconUrl: '../images/metOff.png',iconSize:[25,30],iconAnchor:[12.5,30]});
 //                    var myIcon_met = L.icon({iconUrl: '../images/metOff.png',iconSize:[50,33],iconAnchor:[25,16.5]});
 //                }
 //                markers_array.push(new L.marker([devices_set_met[i].Northing,devices_set_met[i].Easting]))
 //                marker = new L.marker([devices_set_met[i].Northing,devices_set_met[i].Easting],{icon: myIcon_met}).bindPopup('<a href="../html/met_live.html">'+devices_set_met[i].SystemCodeNumber+'</a>')
 //                marker.addTo(markers_group);
 //                markers_group.addTo(map);
 //                //if you want you can edit the bindPopup() to show what ever data you want on popup.
 //            }
 //            // var markers_group_met = new L.featureGroup(markers_array);
 //            map.fitBounds(markers_group.getBounds().pad(0.05));
 //        }
 //    });


 //    $.ajax({
 //        url: '../utils/atcc_map.php',
 //        success: function(result_atcc){
 //            var devices_set_atcc = jQuery.parseJSON(result_atcc);
 //            markers_array = []
 //            for(i=0; i<devices_set_atcc.length;i++){
 //                var fault = devices_set_atcc[i].online;
 //                if(fault === "1"){
 //                    var myIcon_atcc = L.icon({iconUrl: '../images/atccOn.png',iconSize:[50,40],iconAnchor:[12.5,30]});
 //                } else if(fault === "0"){
 //                    var myIcon_atcc = L.icon({iconUrl: '../images/atccOff.png',iconSize:[50,40],iconAnchor:[12.5,30]});
 //                }
 //                markers_array.push(new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting]))
 //                marker = new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting],{icon: myIcon_atcc}).bindPopup('<a href="../html/atcc_live.html">'+devices_set_atcc[i].SystemCodeNumber+'</a>')
 //                marker.addTo(markers_group);
 //                markers_group.addTo(map);
 //                //if you want you can edit the bindPopup() to show what ever data you want on popup.
 //            }
 //            // var markers_group_atcc = new L.featureGroup(markers_array);
 //            map.fitBounds(markers_group.getBounds().pad(0.05));
 //        }
 //    });


    $.ajax({
        url: '../utils/detector_devices.php',
        method:'POST',
        success: function(result_atcc){
            var devices_set_atcc = jQuery.parseJSON(result_atcc);
            markers_array = []
            
            for(i=0; i<devices_set_atcc.length;i++){
                var fault = devices_set_atcc[i].online;
                if(fault === "1"){
                    var myIcon_det = L.icon({iconUrl: '../images/detectorcameraOn.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});;
                } else if(fault === "0"){
                    var myIcon_det = L.icon({iconUrl: '../images/detectorcameraOff.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
                }
                markers_array.push(new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting]))
                marker = new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting],{icon: myIcon_det}).bindPopup('<span>'+devices_set_atcc[i].SystemCodeNumber+' '+(devices_set_atcc[i].ShortDescription == null ? '' : devices_set_atcc[i].ShortDescription)+'</span>')
                marker.addTo(markers_group);
                markers_group.addTo(map);
                //if you want you can edit the bindPopup() to show what ever data you want on popup.
            }
            // var markers_group_atcc = new L.featureGroup(markers_array);
            map.fitBounds(markers_group.getBounds().pad(0.05));
        }
    });

     $.ajax({
      url: '../utils/signal_map.php',
      method:'POST',
      data:{
          group_scn:''
      },
      success: function(result_sig){
          offctr=0, onctr=0, totalctr=0
          var devices_set_sig = jQuery.parseJSON(result_sig);
          markers_array = []
          for(i=0; i<devices_set_sig.length;i++){
              var fault = devices_set_sig[i].online;
              if(fault === "1"){
                  var myIcon_signal = L.icon({iconUrl: '../images/trafficSignalOn.png',iconSize:[25,25],iconAnchor:[12.5,30]});
                  onctr = onctr + 1
              } else if(fault === "0"){
                  var myIcon_signal = L.icon({iconUrl: '../images/trafficSignalOff.png',iconSize:[25,25],iconAnchor:[12.5,30]});
                  offctr = offctr + 1
              }
              totalctr = totalctr + 1
              markers_array.push(new L.marker([devices_set_sig[i].Latitude,devices_set_sig[i].Longitude]))
              marker = new L.marker([devices_set_sig[i].Latitude,devices_set_sig[i].Longitude],{icon: myIcon_signal}).bindPopup('<a href="../html/traffic_signal/live_signal_individual.html">'+devices_set_sig[i].ShortDescription+'</a>')
              marker.addTo(markers_group);
              markers_group.addTo(map);
              //if you want you can edit the bindPopup() to show what ever data you want on popup.
          }
          // var markers_group_atcc = new L.featureGroup(markers_array);
          map.fitBounds(markers_group.getBounds().pad(0.05));

          $('#i1 span').html(totalctr)
          $('#i3 span').html(offctr)
          $('#i2 span').html(onctr)
      }
  });

     $.ajax({
         url: '../utils/getEvents.php',
         success: function(result){
            if(result!='F')
            {
             var res = jQuery.parseJSON(result);
             markers_array = [];
             for(i=0; i<res.length;i++){
                 var myIcon = L.icon({iconUrl: '../images/event.png',iconSize:[25,25],iconAnchor:[18,5]});
                 markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                 marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                    marker.addTo(markers_group);
                    markers_group.addTo(map);
                 //if you want you can edit the bindPopup() to show what ever data you want on popup.
                 markers.push(marker);
             }
             // markers_group = new L.featureGroup(markers_array);
             map.fitBounds(markers_group.getBounds().pad(0.05));
            }

         }
        });
     $.ajax({
         url: '../utils/getCrime.php',
         success: function(result){
            if(result!='F')
            {
             var res = jQuery.parseJSON(result);
             for(i=0; i<res.length;i++){
                 var myIcon = L.icon({iconUrl: '../images/crime.png',iconSize:[25,25],iconAnchor:[18,5]});
                 markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                 marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                    marker.addTo(markers_group);
                    markers_group.addTo(map);
                 //if you want you can edit the bindPopup() to show what ever data you want on popup.
                 markers.push(marker);
             }
             // markers_group = new L.featureGroup(markers_array);
             map.fitBounds(markers_group.getBounds().pad(0.05));
         }
         }
        });

     $.ajax({
         url: '../utils/getIncidents.php',
         success: function(result){
            if(result!='F')
            {
             var res = jQuery.parseJSON(result);
             for(i=0; i<res.length;i++){
                 var myIcon = L.icon({iconUrl: '../images/incident.png',iconSize:[25,25],iconAnchor:[18,5]});
                 markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                 marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                    marker.addTo(markers_group);
                    markers_group.addTo(map);
                 //if you want you can edit the bindPopup() to show what ever data you want on popup.
                 markers.push(marker);
             }
             // markers_group = new L.featureGroup(markers_array);
             map.fitBounds(markers_group.getBounds().pad(0.05));
         }

         }
        });

      $.ajax({
         url: '../utils/getRoadWorks.php',
         success: function(result){
            if(result!='F')
            {
             var res = jQuery.parseJSON(result);
             for(i=0; i<res.length;i++){
                 var myIcon = L.icon({iconUrl: '../images/roadwork.png',iconSize:[25,25],iconAnchor:[18,5]});
                 markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                 marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                    marker.addTo(markers_group);
                    markers_group.addTo(map);
                 //if you want you can edit the bindPopup() to show what ever data you want on popup.
                 markers.push(marker);
             }
             // markers_group = new L.featureGroup(markers_array);
             map.fitBounds(markers_group.getBounds().pad(0.05));
         }

         }
        });

      $.ajax({
         url: '../utils/getAccidents.php',
         success: function(result){
            if(result!='F')
            {
             var res = JSON.parse(result);
             for(i=0; i<res.length;i++){
                 var myIcon = L.icon({iconUrl: '../images/accident.png',iconSize:[25,25],iconAnchor:[18,5]});
                 markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                 marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                    marker.addTo(markers_group);
                    markers_group.addTo(map);
                 //if you want you can edit the bindPopup() to show what ever data you want on popup.
                 markers.push(marker);
             }
             // markers_group = new L.featureGroup(markers_array);
             map.fitBounds(markers_group.getBounds().pad(0.05));
         }

         }
        });

    
    mapLink = 
    '<a href="http://openstreetmap.org">OpenStreetMap</a>';
    L.tileLayer(
            'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; ' + mapLink + ' Contributors',
            maxZoom: 18,
    }).addTo(map);

    // $.ajax({
    //     type: 'GET',
    //     url: '../utils/get_zones.php',
    //     dataType: 'json', 
    //     success: function (data) {
    //         for(var i=0;i<data.length;i++) {
    //             var siteId = data[i].SiteId;
    //             var SiteName = data[i].SiteName;
    //             var centroid_lat = data[i].centroid.split(",")[0];
    //             var centroid_lng = data[i].centroid.split(",")[1];
    //             var boundaries = JSON.parse(data[i].collection).features[0];
    //             var outColor = data[i].actualColor;
    //             var inColor = data[i].hoverColor;
    //             boundaries.lat = data[i].centroid.split(",")[0];
    //             boundaries.lng = data[i].centroid.split(",")[1];

    //             map.setView([10.512289, 76.220281], 11);
    //             L.geoJson(boundaries, {
    //                 style: function(feature) {
    //                     for(var j=0;j<data.length;j++) {
    //                         switch (feature.properties.party) {
    //                             case data[j].SiteId: return {color: outColor,weight: 2};break;
    //                         }
    //                     }
    //                 },onEachFeature: function(feature,layer) {
    //                 var label = L.marker(layer.getBounds().getCenter(), {
    //                     icon: L.divIcon({
    //                     className: '',
    //                     html: "<font size='5px'>"+SiteName+"</font>",
    //                     iconSize: [100, 40]
    //                   })
    //                 });
    //                 var boldLabel = L.marker(layer.getBounds().getCenter(), {
    //                     icon: L.divIcon({
    //                     className: '',
    //                     html: "<font size='5px'><b>"+SiteName+"</b></font>",
    //                     iconSize: [100, 40]
    //                   })
    //                 });
    //                 var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                 if(zoomFlag=="false"){
    //                     label.addTo(map);
    //                 }
    //                 layer.on("click",function (e) {
    //                     //onRouteClick(e)
    //                     // var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // // Toggle zoom
    //                     // if(zoomFlag=="false") document.getElementsByName('zoom_view')[0].setAttribute("value", "true");
    //                     // else document.getElementsByName('zoom_view')[0].setAttribute("value", "false");

    //                     // zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // if(zoomFlag=="true"){
    //                     //     map.removeLayer(boldLabel);
    //                     //     map.removeLayer(label);
    //                     //     map.setView([feature.lat,feature.lng], 12);
    //                     //     for(var j=0;j<data.length;j++) {
    //                     //         switch (feature.properties.party) {
    //                     //             case data[j].SiteId: 
    //                     //             showCCTV(data[j].SiteId);
    //                     //             break;
    //                     //         }
    //                     //     }
    //                     // }
    //                     // else {
    //                     //     map.setView([10.512289,76.220281], 11);
    //                     //     label.addTo(map);
    //                     //     removeAllMarkers();
    //                     // }
                        
                        
    //                 });
    //                 layer.on("mouseover",function(e){
    //                     // var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // if(zoomFlag=="false"){
    //                     //     map.removeLayer(label);
    //                     //     boldLabel.addTo(map);
    //                     // }else {
    //                     //     map.removeLayer(label);
    //                     //     map.removeLayer(boldLabel);
    //                     // }
    //                     // for(var j=0;j<data.length;j++) {
    //                     //     switch (feature.properties.party) {
    //                     //         case data[j].SiteId:
    //                     //         this.setStyle({
    //                     //             color: outColor,   //or whatever style you wish to use;
    //                     //             weight: 5

    //                     //         });
    //                     //         break;
    //                     //     }
    //                     // }
                        
    //                 });
    //                 layer.on("mouseout",function(e){
    //                     // var zoomFlag = document.getElementsByName('zoom_view')[0].value;
    //                     // if(zoomFlag=="false"){
    //                     //     map.removeLayer(boldLabel);
    //                     //     label.addTo(map);
    //                     // }else {
    //                     //     map.removeLayer(label);
    //                     //     map.removeLayer(boldLabel);
    //                     // }
    //                     // for(var j=0;j<data.length;j++) {
    //                     //     switch (feature.properties.party) {
    //                     //         case data[j].SiteId:
    //                     //         this.setStyle({
    //                     //             color: outColor,   //or whatever style you wish to use;
    //                     //             weight: 2
    //                     //         });
    //                     //         break;
    //                     //     } 
    //                     // }
    //                 });
    //                 }
    //             }).addTo(map);
    //             //map.fitBounds(group.getBounds().pad(0.1));
    //         }
    //     }
    // });

    setTimeout(function(){
        map.fitBounds(markers_group.getBounds());    
    },500)

    

    $('input[name=mapmarker]').change(function(){
        if($('input[name=mapmarker][value=detector]').prop('checked') == true)
        {
            $('.det-img').attr('src','../images/detectorcamera.png');
            $('.det-txt').css({"color" : "#000"});
        }else{
            $('.det-img').attr('src','../images/detectorcamera-grey.png');
            $('.det-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=cctv]').prop('checked') == true)
        {
            $('.cctv-img').attr('src','../images/cctv.png');
            $('.cctv-txt').css({"color" : "#000"});
        }else{
            $('.cctv-img').attr('src','../images/cctv-grey.png');
            $('.cctv-txt').css({"color" : "#5c5c5c"});
        }

         if($('input[name=mapmarker][value=signal]').prop('checked') == true)
        {
            $('.signal-img').attr('src','../images/trafficSignal.png');
            $('.signal-txt').css({"color" : "#000"});
        }else{
            $('.signal-img').attr('src','../images/trafficSignal-grey.png');
            $('.signal-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=anpr]').prop('checked') == true)
        {
            $('.anpr-img').attr('src','../images/anprcamera.png');
            $('.anpr-txt').css({"color" : "#000"});
        }else{
            $('.anpr-img').attr('src','../images/anprcamera-grey.png');
            $('.anpr-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=events]').prop('checked') == true)
        {
            $('.events-img').attr('src','../images/event-black.png');
            $('.events-txt').css({"color" : "#000"});
        }else{
            $('.events-img').attr('src','../images/event-grey.png');
            $('.events-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=crime]').prop('checked') == true)
        {
            $('.crime-img').attr('src','../images/crime-black.png');
            $('.crime-txt').css({"color" : "#000"});
        }else{
            $('.crime-img').attr('src','../images/crime-grey.png');
            $('.crime-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=incident]').prop('checked') == true)
        {
            $('.incident-img').attr('src','../images/incident-black.png');
            $('.incident-txt').css({"color" : "#000"});
        }else{
            $('.incident-img').attr('src','../images/incident-grey.png');
            $('.incident-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=roadwork]').prop('checked') == true)
        {
            $('.roadwork-img').attr('src','../images/roadwork-black.png');
            $('.roadwork-txt').css({"color" : "#000"});
        }else{
            $('.roadwork-img').attr('src','../images/roadwork-grey.png');
            $('.roadwork-txt').css({"color" : "#5c5c5c"});
        }

        if($('input[name=mapmarker][value=accident]').prop('checked') == true)
        {
            $('.accident-img').attr('src','../images/accident.png');
            $('.accident-txt').css({"color" : "red"});
        }else{
            $('.accident-img').attr('src','../images/accident-grey.png');
            $('.accident-txt').css({"color" : "#e06467"});
        }

        if (markers) { 
            map.removeLayer(markers_group);
            markers=[],markers_array=[],markers_group = L.featureGroup()
        }

        if($('input[name=mapmarker][value=anpr]').prop('checked') == true || $('input[name=mapmarker][value=detector]').prop('checked') == true || $('input[name=mapmarker][value=cctv]').prop('checked') == true){
            $.ajax({
                url: '../utils/cctv_map.php',
                type: 'POST',
                // data: {siteId:zones[j].SiteId},
                success: function(result_cctv) {
                    var devices_set_cctv = jQuery.parseJSON(result_cctv);
                    for(i=0; i<devices_set_cctv.length;i++){
                        var fault = devices_set_cctv[i].online;
                        var icon = myIcon_cctvOn
                        if(fault === "1"){
                            if(devices_set_cctv[i].type == "cctv")
                                icon = myIcon_cctvOn
                            else if(devices_set_cctv[i].type == "anpr")
                                icon = myIcon_anprOn
                            else if(devices_set_cctv[i].type == "detector")
                                icon = myIcon_detectorOn
                        } else if(fault === "0"){
                            if(devices_set_cctv[i].type == "cctv")
                                icon = myIcon_cctvOff
                            else if(devices_set_cctv[i].type == "anpr")
                                icon = myIcon_anprOff
                            else if(devices_set_cctv[i].type == "detector")
                                icon = myIcon_detectorOff
                        }
                        markers_array.push(new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting]))

                        if(devices_set_cctv[i].type == "cctv" && $('input[name=mapmarker][value=cctv]').prop('checked') == true){
                            marker = new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting],{icon: icon}).bindPopup('<div class="tets"><div class="tets2">'+devices_set_cctv[i].SystemCodeNumber+'</div><br><div><table><tbody><tr><td><button class="btn btn-danger" data-toggle="modal" data-target="#liveModal" onClick=setLiveLink("'+devices_set_cctv[i].SystemCodeNumber+'");><span class="glyphicon glyphicon-picture"></span>&nbsp;Live View</button></td><td><button class="btn btn-primary playbackbtn" onclick=goToPlayback("'+devices_set_cctv[i].SystemCodeNumber+'","'+devices_set_cctv[i].NVRIPAddress+'","'+devices_set_cctv[i].Channel+'")><span class="glyphicon glyphicon-film"></span>&nbsp;Playback</button></td></tr></tbody></table></div>')
                            marker.addTo(markers_group);
                            markers_group.addTo(map);
                        }
                        else if(devices_set_cctv[i].type == "anpr" && $('input[name=mapmarker][value=anpr]').prop('checked') == true){
                            marker = new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting],{icon: icon})
                            marker.addTo(markers_group);
                            markers_group.addTo(map);
                            marker.bindPopup('<div class="tets anprpopup"><div class="tets2">'+devices_set_cctv[i].SystemCodeNumber+'</div><br><div><table><tbody><tr><td><button class="btn btn-danger" data-toggle="modal" data-target="#liveModal" onClick=setLiveLink("'+devices_set_cctv[i].SystemCodeNumber+'");><span class="glyphicon glyphicon-picture"></span>&nbsp;Live View</button></td></tr></tbody></table></div><br><table class="table table-bordered livedatatable"><thead><tr><th>SystemCodeNumber</th><th>Place</th><th>VRN</th><th>TimeStamp</th></tr></thead><tbody></tbody></table></div>',{maxWidth:'auto'})
                            $(marker._icon).addClass('anprmarker');
                            $(marker._icon).attr('scn',devices_set_cctv[i].SystemCodeNumber)
                        }
                        else if(devices_set_cctv[i].type == "detector" && $('input[name=mapmarker][value=detector]').prop('checked') == true){
                            marker = new L.marker([devices_set_cctv[i].Northing,devices_set_cctv[i].Easting],{icon: icon}).bindPopup('<div class="tets"><div class="tets2">'+devices_set_cctv[i].SystemCodeNumber+'</div><div><table><tbody><tr><td><button class="btn btn-info" data-toggle="modal" data-target="#detectorReportModal" onClick=getDetectorReport("'+devices_set_cctv[i].SystemCodeNumber+'");><span class="glyphicon glyphicon-file"></span>&nbsp;Detector Reports</button></td></tr></tbody></table></div><table class="table table-bordered detectortable"><thead><tr><strong>Traffic Count</strong></tr></thead><tbody><tr class="warning"><td>Last 5 minutes</td><td id="last5min"></td></tr><tr class="info"><td>Last 15 minutes</td><td id="last15min"></td></tr><tr class="success"><td>Last 30 min</td><td id="last30min"></td></tr></tbody></table></div>')
                            marker.addTo(markers_group);
                            markers_group.addTo(map);
                            $(marker._icon).addClass('detectormarker');
                            $(marker._icon).attr('scn',devices_set_cctv[i].SystemCodeNumber)
                        }

                        markers.push(marker);
                    }
                    // markers_group = new L.featureGroup(markers_array);
                    map.fitBounds(markers_group.getBounds());

                    $('.leaflet-marker-pane .anprmarker').click(function(){
                        // $('.leaflet-popup-pane .leaflet-popup-content-wrapper .leaflet-popup-content').css('width','auto')
                        // $('.leaflet-popup-pane .leaflet-popup-tip-container').css('left','-85px')
                        // $('.leaflet-popup-pane .leaflet-popup-tip-container').css('margin-bottom','15px')
                        setTimeout(function(){$('.leaflet-popup').css('left',-($('.leaflet-popup').width()/2))},50)

                        var scn = $(this).attr('scn')
                        $.ajax({
                            url:'../utils/get_anpr_livedata.php',
                            method:'POST',
                            data:{
                                scn:scn
                            },
                            success:function(res){
                                res = JSON.parse(res)
                                $('.livedatatable tbody tr').remove()
                                for(var i=0;i<res.length;i++){
                                    $('.livedatatable tbody').append('<tr><td>'+res[i].SystemCodeNumber+'</td><td>'+res[i].Place+'</td><td>'+res[i].VRN+'</td><td>'+res[i].TimeStamp+'</td></tr>')
                                }
                            }
                        });
                    })

                    $('.leaflet-marker-pane .detectormarker').click(function(){
                
                        var scn = $(this).attr('scn')
                        $.ajax({
                            url:'../utils/get_last_detector_data.php',
                            method:'POST',
                            data:{
                                scn:scn
                            },
                            success:function(res){
                                res = JSON.parse(res)
                                $('#last5min').html(res.data5minute.length == 0 ? "0" : res.data5minute[0]['count'])
                                $('#last15min').html(res.data15minute.length == 0 ? "0" : res.data15minute[0]['count'])
                                $('#last30min').html(res.data30minute.length == 0 ? "0" : res.data30minute[0]['count'])
                            }
                        });
                    })
                }
            });
        }

        if($('input[name=mapmarker][value=vms]').prop('checked') == true){
            $.ajax({
                url: '../utils/vms_map.php',
                success: function(result_vms){
                    var devices_set_vms = jQuery.parseJSON(result_vms);
                    for(i=0; i<devices_set_vms.length;i++){
                        var fault = devices_set_vms[i].online;
                        if(fault === "1"){
                            //var myIcon_vms = L.icon({iconUrl: '../images/vmsOn.png',iconSize:[25,30],iconAnchor:[12.5,30]});
                            var myIcon_vms = L.icon({iconUrl: '../images/vmsOn.png',iconSize:[37,11],iconAnchor:[18,5]});
                        } else if(fault === "0"){
                            //var myIcon_vms = L.icon({iconUrl: '../images/vmsOff.png',iconSize:[25,30],iconAnchor:[12.5,30]});
                            var myIcon_vms = L.icon({iconUrl: '../images/vmsOff.png',iconSize:[37,11],iconAnchor:[18,5]});
                        }
                        markers_array.push(new L.marker([devices_set_vms[i].Northing,devices_set_vms[i].Easting]))
                        marker = new L.marker([devices_set_vms[i].Northing,devices_set_vms[i].Easting],{icon:myIcon_vms}).bindPopup('<a href="../html/vms_live.html">'+devices_set_vms[i].SystemCodeNumber+'</a>')
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                        //if you want you can edit the bindPopup() to show what ever data you want on popup.
                        markers.push(marker);
                    }
                    // markers_group = new L.featureGroup(markers_array);
                    map.fitBounds(markers_group.getBounds());

                }
            });
        }

        if($('input[name=mapmarker][value=livelocation]').prop('checked') == true){
            $.ajax({
                url:'../utils/get_live_location.php',
                method:'POST',
                success:function(res){
                    res = JSON.parse(res)
                    for(var i =0;i<res.length;i++){
                        markers_array.push(new L.marker([res[i].latitude,res[i].longitude]))
                        marker = new L.marker([res[i].latitude,res[i].longitude],{icon: myIcon_patrol}).bindPopup('<span style="font-size:14px;"><b>Username:</b> '+res[i].username+'</span><br><span style="font-size:14px;"><b>Last Seen:</b> '+res[i].time+'</span>');
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                        markers.push(marker);
                    }

                    // markers_group = new L.featureGroup(markers_array);
                    map.fitBounds(markers_group.getBounds());
                }
            })
        }

        if($('input[name=mapmarker][value=atcc]').prop('checked') == true){
            $.ajax({
                url: '../utils/atcc_map.php',
                success: function(result_atcc){
                    var devices_set_atcc = jQuery.parseJSON(result_atcc);
                    markers_array = []
                    for(i=0; i<devices_set_atcc.length;i++){
                        var fault = devices_set_atcc[i].online;
                        if(fault === "1"){
                            var myIcon_atcc = L.icon({iconUrl: '../images/atccOn.png',iconSize:[50,40],iconAnchor:[12.5,30]});
                        } else if(fault === "0"){
                            var myIcon_atcc = L.icon({iconUrl: '../images/atccOff.png',iconSize:[50,40],iconAnchor:[12.5,30]});
                        }
                        markers_array.push(new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting]))
                        marker = new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting],{icon: myIcon_atcc}).bindPopup('<a href="../html/atcc_live.html">'+devices_set_atcc[i].SystemCodeNumber+'</a>').addTo(map);
                        //if you want you can edit the bindPopup() to show what ever data you want on popup.
                    }
                    var markers_group_atcc = new L.featureGroup(markers_array);
                    map.fitBounds(markers_group_atcc.getBounds().pad(0.05));
                }
            });
        }

        if($('input[name=mapmarker][value=met]').prop('checked') == true){
            $.ajax({
                url: '../utils/met_map.php',
                success: function(result_met){
                    var devices_set_met = jQuery.parseJSON(result_met);
                    markers_array = []
                    for(i=0; i<devices_set_met.length;i++){
                        var fault = devices_set_met[i].online;
                        if(fault === "1"){
                            //var myIcon_met = L.icon({iconUrl: '../images/metOn.png',iconSize:[25,30],iconAnchor:[12.5,30]});
                            var myIcon_met = L.icon({iconUrl: '../images/metOn.png',iconSize:[50,33],iconAnchor:[25,16.5]});
                        } else if(fault === "0"){
                            //var myIcon_met = L.icon({iconUrl: '../images/metOff.png',iconSize:[25,30],iconAnchor:[12.5,30]});
                            var myIcon_met = L.icon({iconUrl: '../images/metOff.png',iconSize:[50,33],iconAnchor:[25,16.5]});
                        }
                        markers_array.push(new L.marker([devices_set_met[i].Northing,devices_set_met[i].Easting]))
                        marker = new L.marker([devices_set_met[i].Northing,devices_set_met[i].Easting],{icon: myIcon_met}).bindPopup('<a href="../html/met_live.html">'+devices_set_met[i].SystemCodeNumber+'</a>').addTo(map);
                        //if you want you can edit the bindPopup() to show what ever data you want on popup.
                    }
                    var markers_group_met = new L.featureGroup(markers_array);
                    map.fitBounds(markers_group_met.getBounds().pad(0.05));
                }
            });
        }

        if($('input[name=mapmarker][value=detector]').prop('checked') == true){
            $.ajax({
                url: '../utils/detector_devices.php',
                method:'POST',
                success: function(result_atcc){
                    var devices_set_atcc = jQuery.parseJSON(result_atcc);
                    markers_array = []
                    for(i=0; i<devices_set_atcc.length;i++){
                        var fault = devices_set_atcc[i].online;
                        if(fault === "1"){
                            var myIcon_det = L.icon({iconUrl: '../images/detectorcameraOn.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});;
                        } else if(fault === "0"){
                            var myIcon_det = L.icon({iconUrl: '../images/detectorcameraOff.png',iconSize:[25,25],iconAnchor:[12.5,12.5]});
                        }
                        markers_array.push(new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting]))
                        marker = new L.marker([devices_set_atcc[i].Northing,devices_set_atcc[i].Easting],{icon: myIcon_det}).bindPopup('<span>'+devices_set_atcc[i].SystemCodeNumber+' '+(devices_set_atcc[i].ShortDescription == null ? '' : devices_set_atcc[i].ShortDescription)+'</span>')
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                        //if you want you can edit the bindPopup() to show what ever data you want on popup.
                    }
                    // var markers_group_atcc = new L.featureGroup(markers_array);
                    map.fitBounds(markers_group.getBounds().pad(0.05));
                }
            });
        }
        if($('input[name=mapmarker][value=signal]').prop('checked') == true){
          $.ajax({
              url: '../utils/signal_map.php',
              method:'POST',
              data:{
                  group_scn:''
              },
              success: function(result_sig){
                  offctr=0, onctr=0, totalctr=0
                  var devices_set_sig = jQuery.parseJSON(result_sig);
                  markers_array = []
                  for(i=0; i<devices_set_sig.length;i++){
                      var fault = devices_set_sig[i].online;
                      if(fault === "1"){
                          var myIcon_signal = L.icon({iconUrl: '../images/trafficSignalOn.png',iconSize:[25,25],iconAnchor:[12.5,30]});
                          onctr = onctr + 1
                      } else if(fault === "0"){
                          var myIcon_signal = L.icon({iconUrl: '../images/trafficSignalOff.png',iconSize:[25,25],iconAnchor:[12.5,30]});
                          offctr = offctr + 1
                      }
                      totalctr = totalctr + 1
                      markers_array.push(new L.marker([devices_set_sig[i].Latitude,devices_set_sig[i].Longitude]))
                      marker = new L.marker([devices_set_sig[i].Latitude,devices_set_sig[i].Longitude],{icon: myIcon_signal}).bindPopup('<a href="../html/traffic_signal/live_signal_individual.html">'+devices_set_sig[i].ShortDescription+'</a>')
                      marker.addTo(markers_group);
                      markers_group.addTo(map);
                      //if you want you can edit the bindPopup() to show what ever data you want on popup.
                  }
                  // var markers_group_atcc = new L.featureGroup(markers_array);
                  map.fitBounds(markers_group.getBounds().pad(0.05));
+
                  $('#i1 span').html(totalctr)
                  $('#i3 span').html(offctr)
                  $('#i2 span').html(onctr)
              }
          });
      }

        if($('input[name=mapmarker][value=events]').prop('checked') == true)
        {
            $.ajax({
             url: '../utils/getEvents.php',
             success: function(result){
                 var res = jQuery.parseJSON(result);
                 for(i=0; i<res.length;i++){
                     var myIcon = L.icon({iconUrl: '../images/event.png',iconSize:[25,25],iconAnchor:[18,5]});
                     markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                     marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                     //if you want you can edit the bindPopup() to show what ever data you want on popup.
                     markers.push(marker);
                 }
                 // markers_group = new L.featureGroup(markers_array);
                 map.fitBounds(markers_group.getBounds().pad(0.05));

             }
            });
        }

        if($('input[name=mapmarker][value=crime]').prop('checked') == true)
        {
            $.ajax({
             url: '../utils/getCrime.php',
             success: function(result){
                 var res = jQuery.parseJSON(result);
                 for(i=0; i<res.length;i++){
                     var myIcon = L.icon({iconUrl: '../images/crime.png',iconSize:[25,25],iconAnchor:[18,5]});
                     markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                     marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                     //if you want you can edit the bindPopup() to show what ever data you want on popup.
                     markers.push(marker);
                 }
                 // markers_group = new L.featureGroup(markers_array);
                 map.fitBounds(markers_group.getBounds().pad(0.05));

             }
            });
        }

        if($('input[name=mapmarker][value=incident]').prop('checked') == true)
        {
            $.ajax({
             url: '../utils/getIncidents.php',
             success: function(result){
                 var res = jQuery.parseJSON(result);
                 for(i=0; i<res.length;i++){
                     var myIcon = L.icon({iconUrl: '../images/incident.png',iconSize:[25,25],iconAnchor:[18,5]});
                     markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                     marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                     //if you want you can edit the bindPopup() to show what ever data you want on popup.
                     markers.push(marker);
                 }
                 // markers_group = new L.featureGroup(markers_array);
                 map.fitBounds(markers_group.getBounds().pad(0.05));

             }
            });
        }

        if($('input[name=mapmarker][value=roadwork]').prop('checked') == true)
        {
          $.ajax({
             url: '../utils/getRoadWorks.php',
             success: function(result){
                 var res = jQuery.parseJSON(result);
                 for(i=0; i<res.length;i++){
                     var myIcon = L.icon({iconUrl: '../images/roadwork.png',iconSize:[25,25],iconAnchor:[18,5]});
                     markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                     marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                        marker.addTo(markers_group);
                        markers_group.addTo(map);
                     //if you want you can edit the bindPopup() to show what ever data you want on popup.
                     markers.push(marker);
                 }
                 // markers_group = new L.featureGroup(markers_array);
                 map.fitBounds(markers_group.getBounds().pad(0.05));

             }
            });
      }

      if($('input[name=mapmarker][value=accident]').prop('checked') == true)
        {
      $.ajax({
         url: '../utils/getAccidents.php',
         success: function(result){
             var res = jQuery.parseJSON(result);
             for(i=0; i<res.length;i++){
                 var myIcon = L.icon({iconUrl: '../images/accident.png',iconSize:[25,25],iconAnchor:[18,5]});
                 markers_array.push(new L.marker([res[i].Northing,res[i].Easting]))
                 marker = new L.marker([res[i].Northing,res[i].Easting],{icon:myIcon}).bindPopup(res[i].ShortDescription)
                    marker.addTo(markers_group);
                    markers_group.addTo(map);
                 //if you want you can edit the bindPopup() to show what ever data you want on popup.
                 markers.push(marker);
             }
             // markers_group = new L.featureGroup(markers_array);
             map.fitBounds(markers_group.getBounds().pad(0.05));

         }
        });
  }


        console.log(markers_group)
        setTimeout(function(){
            map.fitBounds(markers_group.getBounds());    
        },500)
        
        // console.log(markers_group)
    })

});
