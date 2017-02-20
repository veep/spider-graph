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
        $("#graph_canvas").removeLayers();
      if (corners.length < 3) {
          return;
      }

      $("#graph_canvas").drawPolygon({
        fillStyle: "#fff",
        layer: true,
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
        + '<span class="edit_control"><i class="fa fa-pencil"></i></span>'
        + '<span class="delete_control"><i class="fa fa-trash-o"></i></span>'
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



      $("#graph_canvas").drawLine({
        layer: true,
        name: 'triangle' + curr_corner + '_' + next_corner,
        strokeWidth: 1,
        strokeStyle: '#ccc',
        fillStyle: '#69f',
        x1: x1, y1: y1,
        x2: x2, y2: y2,
        x3: CENTER_X, y3: CENTER_Y,
        closed:true,
        
      })
      


      var cos_value = Math.cos(adjust+curr_corner*Math.PI*2/corners.length);
      var sin_value = Math.sin(adjust+curr_corner*Math.PI*2/corners.length);

      $("#graph_canvas").drawLine({
          strokeStyle: "#ccc",
          strokeWidth: 1,
          layer: true,
          name: 'spoke' + curr_corner,
          x1: CENTER_X, y1: CENTER_Y,
          x2: Math.round(CENTER_X + (200*cos_value)),
          y2: Math.round(CENTER_Y + (200*sin_value))
      });

      var label_x = Math.round(CENTER_X + (220*cos_value));
      var label_y = Math.round(CENTER_Y + (220*sin_value));
      var align;
      var font_size = 14;
      if (cos_value < -0.6) {
        align = "right";
      } else if (cos_value > 0.6) {
        align = "left";
      } else {
        align = "center";
      }
      $("#graph_canvas").drawText({
            fillStyle: '#36c',
            fontSize: font_size + 'pt',
            fontFamily: 'Trebuchet MS, sans-serif',
            align: align,
            respectAlign: true,
            layer: true,
            name: 'corner_label' + curr_corner,
            text: corner1.name,
            x: label_x,
            y: label_y
    })
      do {
       
        var margin_ok = false;
        font_size--;
        if (align == 'center') {
          margin_ok = true;
        } else if (align == 'right') {
          console.log('rt',label_x,$('#graph_canvas').measureText('corner_label' + curr_corner).width);
          if (label_x - $('#graph_canvas').measureText('corner_label' + curr_corner).width >= 1) {
            margin_ok = true;
          }
        } else if (align == 'left') {
          console.log('lf',label_x,$('#graph_canvas').measureText('corner_label' + curr_corner).width);
          if (label_x + $('#graph_canvas').measureText('corner_label' + curr_corner).width <= CENTER_X*2-1) {
            margin_ok = true;
          }
        }
        if (!margin_ok) {
          $('#graph_canvas').setLayer('corner_label' + curr_corner, { fontSize: font_size + 'pt'}).drawLayers();
        }
      } while (!margin_ok  && font_size > 0 );
  }




   //handle making things editable
    $('#all_sliders' ).on('click','.edit_control', function(){

       //get the previous sib
      // var selected_label = $(this).prev();
      var selected_label = $(this).siblings(".label");
       //make it editable
      if ($(selected_label).html() === 'Rename Me') {
        $(selected_label).html('');
      }
      $(selected_label).attr('contentEditable',true);
      $(selected_label).focus();

      //show save button
    //	$(selected_label).siblings(".save").show();

    });
    $('#all_sliders' ).on('click',".delete_control",function(){
      var index = ($(this).parents(".slider_container").data('index'));
      corners.splice(index,1);
      $('canvas').trigger('updateCorners');
    })

    $('#all_sliders' ).on('click',".save",function(){
      //get corresponding label
      var index = $(this).parents(".slider_container").data('index');
      var new_html = $(this).siblings(".label").html();
      //set corner label

      corners[index].name=new_html;
      drawTriangles();

      //set uneditable
      $(this).siblings(".label").blur();
      $(this).siblings(".label").attr('contentEditable', false);	
    //	$(this).hide();
      });

    $('#all_sliders' ).on('keydown',".label", function(e) {

        if (e.keyCode == 13 || e.keyCode == 9) {   

        e.preventDefault();
      $(this).siblings(".save").click();
        return false;
      }
  });

    $("#new_strength").click(
       function()  {
         addCorner("Rename Me");
         return false;
       }
      );
  $("#rotate").click(
       function()  {
         if (corners.length) {
           corners.unshift(corners.pop());
            $('canvas').trigger('updateCorners');
         }
       }
      );

});

