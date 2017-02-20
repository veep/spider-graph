// JavaScript Document
var corners = [  ];
function addCorner(name) {
    corners.push( { name: name, score: 1});
    $('canvas').trigger('updateCorners');
}

$(document).ready(function(){
	
	
  var CENTER_X=300;
	var CENTER_Y=300;
	 
	
  $( "canvas" ).on( "updateCorners",
                   function() {
    drawTriangles();
    updateSliders();
  });
  
	function drawTriangles(){
      $("#graph_canvas").clearCanvas();

    if (corners.length < 3) {
        return;
    }
    
		$("#graph_canvas").drawPolygon({
		  fillStyle: "#fff",
		  name:"polygon",
		  strokeStyle: "#000",
		  x:CENTER_X, y:CENTER_Y,
		  radius: 200,
      rotate: (corners.length % 2 ? 360/corners.length/2 : 0),  // always have a flat top
		  sides: corners.length
		});
		
 
    for (var i = 0; i < corners.length-1; i++) {
      drawTriangle(corners[i],corners[i+1],i+1,i+2);
    }
    drawTriangle(corners[corners.length-1],corners[0],corners.length,1);
}
	
  function updateSliders() {
    var sliders = $('#all_sliders' );
    sliders.html('');
    corners.forEach(function(item, index){
      sliders.append('<div class="slider_container">'
      + '<div class="slider_label">' 
      + '<span class="label">' + item.name + '</span>'
      + '<span class="save"><input type="button" class="button" value="save" /></span>' 
      + '<span class="icon_font">a</span>'
      + '</div><div  class="slider"></div></div>');
      var just_attached= sliders.children().last();
      just_attached.data("index",index);
      just_attached.children(".slider").slider({
      range: "max",
      min: 1,
      max: 10,
      value: item.score,
      slide: function( event, ui ) {
        var corner_index = $(event.target).parent().data('index');
		    corners[corner_index].score = parseInt(ui.value);
        drawTriangles();	
      }
   });
    })
  }
   $('canvas').trigger('updateCorners');

	function drawTriangle(corner1,corner2,curr_corner, next_corner) {    

		var curr_score = corner1.score
		var next_score = corner2.score		
	  var adjust = -Math.PI/2-3*Math.PI/corners.length;
	//draw new triangle
		var x1 = Math.round(CENTER_X + (20*curr_score*Math.cos(adjust+curr_corner*Math.PI*2/corners.length)));
		var y1 = Math.round(CENTER_Y + (20*curr_score*Math.sin(adjust+curr_corner*Math.PI*2/corners.length)));
		var x2 = Math.round(CENTER_X + (20*next_score*Math.cos(adjust+next_corner*Math.PI*2/corners.length)));
		var y2 = Math.round(CENTER_Y + (20*next_score*Math.sin(adjust+next_corner*Math.PI*2/corners.length)));
	
		
		
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
			  x2: Math.round(CENTER_X + (200*Math.cos(adjust+curr_corner*Math.PI*2/corners.length))),
        y2: Math.round(CENTER_Y + (200*Math.sin(adjust+curr_corner*Math.PI*2/corners.length)))
		});
	
		

}

  
 
 
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
 	$("#new_strength").click(
     function()  {
       addCorner("Rename Me");
       return false;
     }
    );
});

