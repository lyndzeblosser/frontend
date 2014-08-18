$(document).ready(function()
                  {
                      $( "#submitRegistrationButton" ).click(function( event ) 
                                                {
 
                                                  // Stop form from submitting normally
                                                  event.preventDefault();

                                                  // Get some values from elements on the page:
                                                    var postData = $("#registerForm").serializeArray();
                                                  var formURL = "http://vast-scrubland-7419.herokuapp.com/credentialService/tempRegisterUser";
                                                    $.ajax(
                                                    {
                                                        url : formURL,
                                                        type: "POST",
                                                        data : postData,
                                                        success:function(data, textStatus, jqXHR) 
                                                        {
                                                            console.log("Registration Form Submitted Successfully!");
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
                                                });
                      $("#redirectButton").click(function()
                                                 {
                                                     window.location.href = "mood.html";
                                                 });
                  });