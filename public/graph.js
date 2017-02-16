// JavaScript Document
$(document).ready(function(){
	
	
		
	var SCORES = new Object();
	SCORES["NE"] = 1;
	SCORES["NNE"]  = 1;
	SCORES["NNW"]  = 1;
	SCORES["NW"]  = 1;
	SCORES["SW"]  = 1;
	SCORES["SSW"]  = 1;
	SCORES["SSE"]  = 1;
	SCORES["SE"]  = 1;
	
	var CORNERS = new Object();
	CORNERS["1"] = "NE";
	CORNERS["3"] = "NNE";
	CORNERS["5"] = "NNW";
	CORNERS["7"] = "NW";
	CORNERS["9"] = "SW";
	CORNERS["11"] = "SSW";
	CORNERS["13"] = "SSE";
	CORNERS["15"] = "SE";
	
	
	var CENTER_X=300;
	var CENTER_Y=300;
	 
	
	var NNW_X=224;
	var NNW_Y=116;
	var NNE_X= 376;
	var NNE_Y= 116;
	var NW_X = 116;
	var NW_Y = 223;
	var SSE_X = 376;
	var SSE_Y = 484;
	var SSW_X = 223;
	var SSW_Y = 484;
	var NE_X = 484;
	var NE_Y = 223;
	var SE_X = 485;
	var SE_Y = 377;
	var SW_X = 116;
	var SW_Y = 377;
	
	




	drawAllTriangles();
	
	function drawAllTriangles(){
		//draw polygon
		$("#graph_canvas").drawPolygon({
		  fillStyle: "#fff",
		  layer:true,
		  name:"polygon",
		  strokeStyle: "#000",
		  x:300, y:300,
		  radius: 200,
		  sides: 8
		});
		
		for(var key in CORNERS){
			drawTriangle(CORNERS[key]);	
		}
	}
	
	function drawTriangle(corner){
		
		for (var key in CORNERS){
			if (CORNERS[key] == corner){
				var curr_corner = key;
				break;	
			}
		}
		var next_corner = parseInt(curr_corner)+2 + "";
		if (next_corner == 17){next_corner = 1;}
		curr_score = SCORES[corner];
		next_score = SCORES[CORNERS[next_corner]];
		
	//mask old triangle
		
	
	//draw new triangle
		var x1 = Math.round(CENTER_X + (20*curr_score*Math.cos(curr_corner*Math.PI/8)));
		var y1 = Math.round(CENTER_Y - (20*curr_score*Math.sin(curr_corner*Math.PI/8)));
		var x2 = Math.round(CENTER_X + (20*next_score*Math.cos(next_corner*Math.PI/8)));
		var y2 = Math.round(CENTER_Y - (20*next_score*Math.sin(next_corner*Math.PI/8)));
	
		
		
		var canvas=document.getElementById("graph_canvas");
		
		var c2 = canvas.getContext('2d');
		c2.lineWidth=1;
		c2.strokeStyle = '#ccc';
		c2.fillStyle = '#69f';
		c2.beginPath();
		c2.moveTo(300,300);
		c2.lineTo(x1,y1);
		c2.lineTo(x2, y2);
		c2.stroke();
		c2.closePath();
		c2.fill();
		
		
		$("#graph_canvas").drawLine({
			  strokeStyle: "#ccc",
			  strokeWidth: 1,
			  x1: CENTER_X, y1: CENTER_Y,
			  x2: NNE_X, y2: NNE_Y,
			  
			  x3: CENTER_X, y3:CENTER_Y,
			  x4:NNW_X, y4: NNW_Y,
			  
			  x5: CENTER_X, y5:CENTER_Y,
			  x6: SSE_X, y6:SSE_Y,	
			  
			  x7: CENTER_X, y7:CENTER_Y,
			  x8: NW_X, y8:NW_Y,	
			  
			  x9: CENTER_X, y9:CENTER_Y,
			  x10: NE_X, y10:NE_Y,
			  
			  x11: CENTER_X, y11:CENTER_Y,
			  x12: SW_X, y12:SW_Y,
				 
			  x13: CENTER_X, y13:CENTER_Y,
			  x14: SE_X, y14:SE_Y,
			  
			  x15: CENTER_X, y15:CENTER_Y,
			  x16: SSW_X, y16:SSW_Y,	
		});
	
		

}


 $( ".slider" ).slider({
      range: "max",
      min: 1,
      max: 10,
      value: 1,
      slide: function( event, ui ) {
        var slider_id = event.target.id;
		var slider_num = slider_id.substring(7,slider_id.length);
		var corner = CORNERS[slider_num];
		SCORES[corner] = parseInt(ui.value);
		drawAllTriangles();
		
      }
    });
 
 
 //handle making things editable
 	$(".icon_font").click(function(){
	 
		 //get the previous sib
		// var selected_label = $(this).prev();
		var selected_label = $(this).siblings(".label");
		 //make it editable
		$(selected_label).attr('contentEditable',true);
		$(selected_label).focus();
		
		//show save button
	//	$(selected_label).siblings(".save").show();
	
	});
	
	$(".save").click(function(){
		//get corresponding label
		var label_num = $(this).siblings(".label").attr("id").substring(6,$(this).siblings(".label").attr("id").length);
		var corner_id = "#corner_" + label_num;
		
		//get new text
		var new_html = $(this).siblings(".label").html();
		//set corner label
		
		$(corner_id).html(new_html);
	
	
		
		//set uneditable
		$(this).siblings(".label").blur();
		$(this).siblings(".label").attr('contentEditable', false);	
	//	$(this).hide();
		});
	
	$(".label").bind("keydown", function(e) {
 
  		if (e.keyCode == 13 || e.keyCode == 9) {   
		          
    	e.preventDefault();
		$(this).siblings(".save").click();
    	return false;
  	}
});
		
   $(".button").button();
 	
});

