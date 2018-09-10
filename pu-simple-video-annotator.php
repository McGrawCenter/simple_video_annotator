<?php 
    /*
    Plugin Name: PU Simple Video Annotator
    Plugin URI: http://www.princeton.edu
    Description: Plugin for commenting on video embedded in Wordpress
    Author: Ben Johnston - benj@princeton.edu
    Version: 1.0
    */




/**************** REGISTER AND ENQUEUE SCRIPTS AND CSS ***************/

function princetonvidcom_scripts()
{
  global $post;
  wp_register_script('puvidcom', plugins_url('/js/princetonvidcom.js', __FILE__), array('jquery'),'1.1', true);
  wp_enqueue_script('puvidcom');
  $d = array('post_id'=> $post->ID, 'plugin_url' => plugin_dir_url( __FILE__ ));
  wp_localize_script( 'puvidcom', 'vars', $d);

}
add_action( 'wp_enqueue_scripts', 'princetonvidcom_scripts' );



/**************** PROCESS POSTED FORM SUBMISSION ***************/

add_action( 'init', 'process_post' );


function process_post() {
     if( isset( $_POST['action'] )  && $_POST['action'] == 'annotatevideo' ) {
	$user = wp_get_current_user();

	$annotationObj = new StdClass();
	$annotationObj->username = $user->user_login;
	$annotationObj->userid = $user->ID;
	$rand = mt_rand(100000,999999);
	$annotationObj->id = $rand;
	$annotationObj->date = date('m/d/Y h:i:s a', time());
	$annotationObj->start = $_POST['start'];
	$annotationObj->text = $_POST['annotation'];
	add_post_meta($_POST['postid'], 'annotation', json_encode($annotationObj), false);

        die(json_encode($annotationObj));
     }
}

/**************** JSON ***************/
add_action( 'init', 'princetonvidcom_json' );

function princetonvidcom_json() {
     if( isset( $_GET['a'] )  && $_GET['a'] == 'json' ) {
	$postid = $_GET['post'];
	$annotations = get_post_meta($postid, 'annotation');
	$result = array();
	foreach($annotations as $annotation) {
	  $obj = json_decode($annotation);
	  $result[] = $obj;
	}
	header('Content-Type: application/json');
        die(json_encode($result));
     }
}




/**************** EXCHANGE THE THEME'S COMMENT TEMPLATE FOR OUR OWN ***************/

/*

function princetonvidcom_comment_template( $comment_template ) {

        return dirname(__FILE__) . "/comments.php";
}

add_filter( "comments_template", "princetonvidcom_comment_template" );
*/


/********************** SAVE META WHEN COMMENT SAVED ******************************/
/*
function add_ktimecode_meta( $comment_id ) {
   if(isset($_POST['ktimecode']) && $_POST['ktimecode'] != 0 ) { 
	add_comment_meta( $comment_id, 'ktimecode', $_POST['ktimecode'] );
   }
}

add_action( 'comment_post', 'add_ktimecode_meta', 10, 2  );
*/
/********************** ADD TIMECODE FIELD TO COMMENT FORM ******************************/


/*
function change_comment_form_defaults( $default ) {
    $commenter = wp_get_current_commenter();
    $default[ 'comment_field' ] .= '<input type="text" id="ktimecode" name="ktimecode"/>';
    return $default;
}

add_filter( 'comment_form_defaults', 'change_comment_form_defaults');


function puvc_alter_comment ($comment, $args, $depth) {
  //$GLOBALS['comment'] = $comment;

  if($meta = get_comment_meta( $comment->comment_ID, 'ktimecode', true )) {
    echo "<div>This is a comment with a timecode and the timecode is: <a href='?ktimecode={$meta}'>{$meta}</a></div>";
  }
  else {
    echo "<div>This is a comment without a timecode</div>";
  }
}
*/

?>
