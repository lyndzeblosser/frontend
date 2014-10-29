$(document).ready(function()
{       var postData = null;
        var vars;
    //Extracting hash value
    var QueryString = function () {
  var query = window.location.search.substring(1);
  var vars = query.split("?");
  console.log("vars = "+vars);
        return vars;
} ();
    
      var formURL = "http://ancient-falls-9049.herokuapp.com/credentialService/registerUser?" + QueryString;
			  
    $.ajax(
                                                    {
                                                        url : formURL,
                                                        type: "POST",
                                                        data : postData,
                                                        success:function(data, textStatus, jqXHR) 
                                                        {
                                                            console.log("Registration Validated Successfully!");
                                                            var userid = document.getElementById("email");
                                                            window.location.href = "mood.html";
                                                        },
                                                        error: function(jqXHR, textStatus, errorThrown) 
                                                        {
                                                            console.log(errorThrown);
                                                        },
                                                        done: function()
                                                        {
                                                        }
                                                        
                                                    });
                                                    
}
);

