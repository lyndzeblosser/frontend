<?php
session_start();
require('twitteroauth/twitteroauth.php');
require('config.php');

function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
$connection = getConnectionWithAccessToken(CONSUMER_KEY, CONSUMER_SECRET, "", "");

$tweets = $connection->get("https://api.twitter.com/1.1/trends/place.json?id=2514815"); 
echo json_encode($tweets);

?>
