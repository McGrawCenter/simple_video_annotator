

jQuery( document ).ready(function() {




var videos = $('video').mediaelementplayer({
   success: function(media) {


       var markers = [];
       var tags = [];
  
       function updateAnnotationList() {

	    $.ajax({
		url: "?a=json&post="+vars.post_id,
		async: false, 
		success: function(data){
		  jQuery("#annotation-list").empty();
		  if(data.annotations != null) { 
		      jQuery.each(data.annotations, function(i, v){
			    var anno = decodeURIComponent(v.text);
			    var html = "<div class='annotation-list-item'>\n";
			    var html = html + "  <div class='annotation-list-item-meta'>"+v.username+" "+v.date+"</div>\n";
			    var html = html + "  <div class='annotation-list-item-body'><a href='#' class='seek' rel='"+v.start+"'><img src='"+vars.plugin_url+"images/play-button.png' class='annotation-list-item-playbutton'/></a> "
			    var html = html + anno;
			    var html = html + "  </div>\n";
			    var html = html + "</div>\n";

			    jQuery("#annotation-list").append(html);

			    var percentage_from_zero =  (v.start / media.duration) * 100;
			    var m = { 'id':v.id, 'start':v.start, 'pct':percentage_from_zero }
			    markers.push(m);
		      });
		  } // end if not null

		  if(data.tags != null) { 
		      jQuery.each(data.tags, function(i, v){
			    var percentage_from_zero =  (v.start / media.duration) * 100;
			    var m = { 'id':v.id, 'start':v.start, 'pct':percentage_from_zero }
			    tags.push(m);
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

	   for(var x=0;x<=tags.length-1;x++) {
	     jQuery("#puvidcom-tagline").append("<span style='position:absolute;left:"+tags[x].pct+"%;'><a href='#' class='seek' rel='"+tags[x].start+"'><span style='font-size:18px;font-weight:bold;color:lightblue;' class='dashicons dashicons-arrow-down'></span></a></span>");
	   }

	}


	jQuery(".mejs-video").after('<div id="annotation-list" style=""></div>');
	updateAnnotationList();
	

	// generate html for the toolbar
	function toolbar() {
	 var h = "<div id='puvidcom-toolbar' style='margin-top:10px;'>";
	 h += "  <div id='puvidcom-toolbar-form'>";
	 h += "  <input id='puvidcom-toolbar-start' type='text' name='start' style='display:none;' />";
	 h += "  <textarea id='puvidcom-toolbar-text' placeholder='Add annotation here...'></textarea>";
	 h += "  <p style='margin-top:5px;'> <button class='annotag' rel='um'>Um..</button> <button class='annotag' rel='like'>Like..</button> <button id='puvidcom-toolbar-add' style='float:right;'>Annotate</button></p>";
	 h += "  </div>";
	 h += "</div>";
	  return h;
	}

	var toolbar = toolbar();
	jQuery(".mejs-video").after(toolbar);




	// generate the timeline
	function timeline() {
	   var h = "<div class='timeline'>";
           h += "<div id='puvidcom-timeline' style='margin-left:86px;margin-right:16.8%;position:relative;color:white;'></div>";
           h += "<div id='puvidcom-tagline' style='margin-left:86px;margin-right:16.8%;position:relative;color:white;'></div>";
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


      /** Press play button and jump to timecode **/

	jQuery(document).on("click", ".annotag" , function(e){
	  var postid = vars.post_id;
	  var tag = jQuery(this).attr('rel');
	  var start = media.getCurrentTime();
	  var payload = {'action':'tagvideo','postid':postid,'start':start,'annotation':tag};
	  jQuery.post( "index.php", payload, function( data ) { updateAnnotationList();updateTimeline(); });
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


