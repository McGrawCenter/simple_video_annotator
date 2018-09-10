

jQuery( document ).ready(function() {




var videos = $('video').mediaelementplayer({
   success: function(media) {


       var markers = [];

  
       function updateAnnotationList() {

	    $.ajax({
		url: "?a=json&post="+vars.post_id,
		async: false, 
		success: function(data){
		  if(data[0] != null) { 

		  jQuery("#annotation-list").empty();

		  jQuery.each(data, function(i, v){
		    var anno = decodeURIComponent(v.text);
		    var html = "<div style='background:white;border:solid 1px grey;margin:5px 0px;padding:10px;border-radius:10px;'>\n";
		    var html = html + "  <div style='font-size:0.8em;'>"+v.username+" "+v.date+"</div>\n";
		    var html = html + "  <div><a href='#' class='seek' rel='"+v.start+"'><img src='"+vars.plugin_url+"images/play-button.png' style='float:left;margin:0px 10px 10px 0;'/></a> "
		    var html = html + anno;
		    var html = html + "  </div>\n";
		    var html = html + "</div>\n";

		    jQuery("#annotation-list").append(html);

		    var percentage_from_zero =  (v.start / media.duration) * 100;
		    var m = { 'id':v.id, 'start':v.start, 'pct':percentage_from_zero }
		    markers.push(m);

		  });
		  } // end if not null

	    	}
	    });

       }


	// insert timeline and update with markers
	function updateTimeline() {
	   for(var x=0;x<=markers.length-1;x++) {
	     jQuery("#puvidcom-timeline").append("<span style='position:absolute;left:"+markers[x].pct+"%;'><a href='#' class='seek' rel='"+markers[x].start+"'><span style='font-size:20px;color:white;' class='dashicons dashicons-arrow-down'></span></a></span>");
	   }
	}


	jQuery(".mejs-video").after('<div id="annotation-list" style=""></div>');
	updateAnnotationList();
	

	// generate html for the toolbar
	function toolbar() {
	 var h = "<div id='puvidcom-toolbar' style='margin-top:10px;'>";
	 h += "  <div id='puvidcom-toolbar-form'>";
	 h += "  <input id='puvidcom-toolbar-start' type='text' name='start' style='display:none;' />";
	 h += "  <textarea id='puvidcom-toolbar-text'></textarea>";
	 h += "  <p style='margin-top:5px;'><button id='puvidcom-toolbar-add'>Annotate</button> <button>Um..</button> <button>Like..</button></p>";
	 h += "  </div>";
	 h += "</div>";
	  return h;
	}

	var toolbar = toolbar();
	jQuery(".mejs-video").after(toolbar);




	// generate the timeline
	function timeline() {
	   var h = "<div id='puvidcom-timeline' style='height:28px;background:black; color:white;position:relative'>";
           h += "</div>";
	  return h;
	}
	jQuery(".mejs-video").after(timeline());
	updateTimeline();


      /** Press play button and jump to timecode **/

	jQuery(document).on("click", ".seek" , function(e){
	  var start = jQuery(this).attr('rel');
	  media.setCurrentTime(start);
	  media.play();
	  e.preventDefault();
	});

      /** Add annotation **/

	jQuery(document).on("click", "#puvidcom-toolbar-add" , function(){
	    var postid = vars.post_id;
	    var start = jQuery("#puvidcom-toolbar-start").val();
	    var text = jQuery("#puvidcom-toolbar-text").val();
	    if(text !='') {
	      var payload = {'action':'annotatevideo','postid':postid,'start':start,'annotation':encodeURIComponent(text)};
	      jQuery.post( "index.php", payload, function( data ) { updateAnnotationList();updateTimeline(); });
	    }
	    jQuery("#puvidcom-toolbar-start").val("");
	    jQuery("#puvidcom-toolbar-text").val("");
	});

      /** If user clicks in the annotation textarea, pause the video and set the timecode **/

	jQuery(document).on("click", "#puvidcom-toolbar-text" , function(){
	    jQuery("#puvidcom-toolbar-start").val(media.getCurrentTime());
	    jQuery("#puvidcom-toolbar-text").focus();  
	    media.pause(); 
	});




      /** When user pauses, populate the start field with the start time **/

       media.addEventListener('pause', function() {
	    jQuery("#puvidcom-toolbar-start").val(media.getCurrentTime());
	    jQuery("#puvidcom-toolbar-text").focus();          
        }, true);





    }
});






});


