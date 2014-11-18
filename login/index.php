<?php

session_start();
require('twitteroauth/twitteroauth.php');
require('config.php');

if (empty($_SESSION['access_token']) || empty($_SESSION['access_token']['oauth_token']) || empty($_SESSION['access_token']['oauth_token_secret'])) {
    header('Location: ./clearsessions.php');
}
$access_token = $_SESSION['access_token'];

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, $access_token['oauth_token'], $access_token['oauth_token_secret']);

$content = $connection->get('account/verify_credentials');

$username = "b394f448a31f35";
$password = "b2a617ae";
$hostname = "us-cdbr-east-06.cleardb.net"; 

//connection to the database
$dbhandle = mysql_connect($hostname, $username, $password) 
 or die("Unable to connect to MySQL");
echo "Connected to MySQL<br>";

//select a database to work with
$selected = mysql_select_db("heroku_87af94efd632cd6",$dbhandle) 
  or die("Could not select examples");
echo "Connected to MySQL1<br>";
//
//execute the SQL query and return records
$result = mysql_query("Select md5UserIdHash from registration where email in (SELECT ttid FROM outside_app_logins where platform='Twitter' and platformid='".$content->id_str."')");

$row = mysql_fetch_array($result);
echo $row[0];

if(isset($row[0])){
    header('Location: /mood.html?loggedinuser='.$row[0]);
    
}else{
    header('Location: /register.html?platform=twitter&platformId='. $content->id_str.'&name='.  urlencode($content->name).'&image_url='.  urlencode($content->profile_image_url));
    
}
//echo "<pre>", print_r($content, true), "</pre>";

echo "<b>Hi </b>" . $content->id_str . "<br>";
echo "<b>Your Current Status </b>" . $content->status->text . "<br>";
echo "<b>You posted this on : </b>" . $content->status->created_at . "<br>";
echo "<b>Is this you ?</b><br>";
echo "<img src = " . $content->profile_image_url . ">";

echo "<br><a href = 'clearsessions.php'>Logout</a>";