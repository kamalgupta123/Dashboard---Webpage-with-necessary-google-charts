

$(document).ready(function(){
google.charts.load("current", {'packages':["corechart"]});
google.charts.load('current', {'packages':['gauge']});
google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(drawChartDonut);
google.charts.setOnLoadCallback(drawChartGauge);
google.charts.setOnLoadCallback(drawBarChart);
google.charts.setOnLoadCallback(drawBarChart1);
google.charts.setOnLoadCallback(drawChartDonut1);

var online=null;
var offline=null;
var congestion_percent=null;
var rlvd=null;
var speed=null;
var helmet=null;
var accident=null;
var incident=null;
var road_list=null;
var event=null;
var fault=null;
var FaultDescription=null;
var fault_count=null;
var fault_res=null;
function drawOnline(){

    $.ajax({
      url:"../utils/get_status.php", 
      type: "post", 
      success:function(result){
        var res = jQuery.parseJSON(result);
          online=res["online"];
          offline=res["offline"];
          var data = google.visualization.arrayToDataTable([
            ['Task', 'Hours per Day'],
            ['Online',online],
            ['Offline',offline],
          ]);
          var options = {
            tooltip: {isHtml: true,text:'value'},
            pieHole: 0.4,
            width:355.8,
            pieSliceText:'value',
            chartArea:{
                left:50,
                top:26
            }
          };
          var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
          chart.draw(data, options);
      
      }
    });
}

function drawChartDonut() {
  var data = google.visualization.arrayToDataTable([
    ['Task', 'Hours per Day'],
    ['Online',1],
    ['Offline',0]
  ]);

  var options = {
    tooltip: {isHtml: true,text:'value'},
    pieHole: 0.4,
    width:355.8,
    pieSliceText:'value',
    chartArea:{
        left:50,
        top:26
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
  chart.draw(data, options);
  

  setInterval(drawOnline,1000*60*1);
  drawOnline();
}

function drawCongestion(){
    $.ajax({
      url:"../utils/get_traffic_congestion.php", 
      type: "post", 
      success:function(result){
        var res = jQuery.parseJSON(result);
        // var congestion=0;
        // var num_of_entries=0;
        // for(var i=0;i<res.length;i++){
        //   num_of_entries=res.length;
        //   congestion+=Number(res[i]["CongestionPercent"]);
        // }
        congestion_percent=parseFloat(res["CongestionPercent"]) * 100;
  //      console.log(congestion_percent);
        var data = google.visualization.arrayToDataTable([
          ['Label', 'Value'],
          ['cong.', congestion_percent],
          ]);
      
          var options = {
            width: 120, height: 420,
            redFrom: 90, redTo: 100,
            yellowFrom:75, yellowTo: 90,
            minorTicks: 5
        };
        
        var chart = new google.visualization.Gauge(document.getElementById('gaugechart'));
      
          chart.draw(data, options);
      }
    });
}

function drawChartGauge() {

var data = google.visualization.arrayToDataTable([
    ['Label', 'Value'],
    ['cong.', 0],
]);

var options = {
    width: 120, height: 420,
    redFrom: 90, redTo: 100,
    yellowFrom:75, yellowTo: 90,
    minorTicks: 5
};

var chart = new google.visualization.Gauge(document.getElementById('gaugechart'));

chart.draw(data, options);

setInterval(drawCongestion,60 * 1000);
drawCongestion();
}

function drawEnforcements(){
    $.ajax({
      url:"../utils/get_enforcement_hourly.php", 
      type: "post", 
      success:function(result){
        var res = jQuery.parseJSON(result);
	var rlvd = 0;
	var helmet = 0;
	var slv = 0;
	var wrongWay = 0;
        for(var i=0;i<res.length;i++){
          if(res[i]["EventType"]=="Red Light Violation"){
              rlvd = res[i]["count"];
          }
          if(res[i]["EventType"]=="No Helmet Violation"){
              helmet = res[i]["count"];
          }
          if(res[i]["EventType"]=="Stop Line Violation"){
              slv = res[i]["count"];
          }
          if(res[i]["EventType"]=="Wrong Way Violation"){
              wrongWay = res[i]["count"];
          }
        }
        var data = google.visualization.arrayToDataTable([
          ['Type', 'Number',{ role: 'style' }],
          ['RLVD', Number(rlvd),"#0080ff"],            
          ['SLV', Number(slv),"#0080ff"],            
          ['WrongWay', Number(wrongWay),"#0080ff"],            
          ['Helmet', Number(helmet),"#0080ff"]
        ]);
        var max =  Number(rlvd)>Number(speed)?(Number(rlvd)>Number(helmet)?Number(rlvd):Number(helmet)):(Number(speed)>Number(helmet)?Number(speed):Number(helmet));
        if(max<6)
          max=6;
//        console.log(max);
	var options = {tooltip: {isHtml: true},title: 'Number',  hAxis: {
          minorGridlines: {
              count: 0
            },
           viewWindowMode:'explicit',
            viewWindow: {
              max:max,
              min:0
            }
         }}; 
         var chart = new google.visualization.BarChart(document.getElementById("barChart"));
        chart.draw(data, options);
      }
      
    });
}

function drawBarChart() {
    var data = google.visualization.arrayToDataTable([
        ['Type', 'Number' ,{ role: 'style' }],
        ['RLVD', 3,"#0080ff"],            
        ['Speed', 1,"#0080ff"],            
        ['Helmet', 2,"#0080ff"]
    ]);
     var options = {tooltip: {isHtml: true},title: 'Number',  hAxis: {
      minorGridlines: {
        count: 0
      },
      viewWindowMode:'explicit',
            viewWindow: {
              max:1 ,
              min:0
            }
    }}; 
     var chart = new google.visualization.BarChart(document.getElementById("barChart"));
     chart.draw(data, options);


setInterval(drawEnforcements, 1000*60*1);
drawEnforcements();
};

function drawAccidents(){
    $.ajax({
      url:"../utils/get_accident_live.php", 
      type: "post", 
      success:function(result){
        var res = jQuery.parseJSON(result);
          event=res["event"];
          accident=res["accident"];
          incident = res["incident"];
          road_list = res["roadwork"];
          var data = google.visualization.arrayToDataTable([
            ['Type', 'Number'],
            ['Accident', Number(accident)],            
            ['Incident', Number(incident)],           
            ['Road Works', Number(road_list)],
            ['Event', Number(event)]
          ]);
          var options = {
            tooltip: {isHtml: true},
            title: 'Number',
            hAxis: {
              viewWindow:{
                max:4,
                min:0
              },
              minorGridlines: {
                count: 0
              }
            }
          }; 
          var chart = new google.visualization.BarChart(document.getElementById("barChart1"));
          chart.draw(data, options);
        }
    });
}

function drawBarChart1() {
var data = google.visualization.arrayToDataTable([
 ['Type', 'Number',{ role: 'style' }],
 ['Accident', 4,'#0080ff'],            
 ['Incident', 1,'#0080ff'],           
 ['Road List', 2,'#0080ff'],
 ['Event', 3,'#0080ff']
]);

var options = {
  tooltip: {isHtml: true},
  title: 'Number',
  hAxis: {
    viewWindow:{
      max:4,
      min:0
    },
    minorGridlines: {
      count: 0
    }
  }
}; 
var chart = new google.visualization.BarChart(document.getElementById("barChart1"));
chart.draw(data, options);
setInterval(drawAccidents,60 * 1000);
drawAccidents();
};


function UpdateFault(){
    $.ajax({
      url:"../utils/get_fault_count.php", 
      type: "post", 
      success:function(result){
        var res = jQuery.parseJSON(result);
//        console.log(res);
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Fault Description');
          data.addColumn('number', 'Fault Count');
          for(var i=0;i<res.length;i++){
            var count=Number(res[i].fault_count);
            data.addRow([res[i].FaultDescription, count]);
          }
          var options = {
            tooltip: {isHtml: true,text:'value'},
            pieHole: 0.4,
            width:555.8,
            pieSliceText:'value'
          };
          var chart = new google.visualization.PieChart(document.getElementById('gaugechart1'));
          chart.draw(data, options);
      }
    });
}

function drawChartDonut1() {
  var data = google.visualization.arrayToDataTable([
    ['FaultDescription', 'fault_count'],
    ['NMS Fault',3],
    ['Traffic Signal Fault',3]
  ]);

  var options = {
    tooltip: {isHtml: true,text:'value'},
    pieHole: 0.4,
    width:355.8,
    pieSliceText:'value',
    legend: {
      maxLines: 1,
      textStyle: {
        fontSize: 15
      }
    }
  };

  var chart = new google.visualization.PieChart(document.getElementById('gaugechart1'));
  chart.draw(data, options);
  

  setInterval(UpdateFault,60 * 1000);
  UpdateFault();
}
});
