<?php require 'Cloudinary.php';
require 'Uploader.php';
require 'Api.php';
require 'configuration.php';
?>

<!DOCTYPE HTML>
  <html>
    <head>
      <script src='https://ajax.googleapis.com/ajax/libs/jquery/1.9.0/jquery.min.js'></script>
      <script src='../js/cloudinary/jquery.ui.widget.js' type='text/javascript'></script>
      <script src='../js/cloudinary/jquery.iframe-transport.js' type='text/javascript'></script>
      <script src='../js/cloudinary/jquery.fileupload.js' type='text/javascript'></script>
      <script src='../js/cloudinary/jquery.cloudinary.js' type='text/javascript'></script>
        
  </head>
  
  <body>
    <?php echo cloudinary_js_config(); ?>
    <?php
      if (array_key_exists('REQUEST_SCHEME', $_SERVER)) {
        $cors_location = $_SERVER["REQUEST_SCHEME"] . "://" . $_SERVER["SERVER_NAME"] .
      dirname($_SERVER["SCRIPT_NAME"]) . "/cloudinary_cors.html";
      } else {
        $cors_location = "http://" . $_SERVER["HTTP_HOST"] . "/cloudinary_cors.html";
      }
  ?>

    <form action="uploaded.php" method="post">
      <?php echo cl_image_upload_tag('image_id', array("callback" => $cors_location)); ?>
    </form>
  </body>
</html>