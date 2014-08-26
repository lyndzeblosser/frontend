$(document).ready(function()
{       var postData = null;
      var formURL = "http://vast-scrubland-7419.herokuapp.com/credentialService/registerUser?key=dmFpYmhhdmJzaGFoQGdtYWlsLmNvbQ== ";
      $.ajax(
                                                    {
                                                        url : formURL,
                                                        type: "POST",
                                                        data : postData,
                                                        success:function(data, textStatus, jqXHR) 
                                                        {
                                                            console.log("Registration Validated Successfully!");
                                                            var userid = document.getElementById("email");
                                                            $( "#successfulRegistrationPopup" ).popup( "open" );
                                                            
                                                        },
                                                        error: function(jqXHR, textStatus, errorThrown) 
                                                        {
                                                            console.log("Registration Form was not Submitted!");
                                                        },
                                                        done: function()
                                                        {
                                                        }
                                                        
                                                    });
}
);

