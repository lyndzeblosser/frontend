$(document).ready(function()
                  {
                              var lengthOfTopics = getTopics();
                                      var selectedTopic = [];
                                              var sortId = [];


        lengthOfTopics.success(function(data)
        {
            lengthOfTopicsArray = data.length;
            console.log("lengthOfTopicsArray: " + lengthOfTopicsArray);
            console.log("tags: " + data.length);
                                                
            //creating list for selection of discussion topics
            for(var i=0;i<lengthOfTopicsArray;i++)
            {
                $('#topic').append('<li>'+ data[i].tagName + '<br><br><br><button id = "topic' + i + '" data-theme="a" data-inline="true" value="'+ data[i].tagName +'">SELECT</button></li>').trigger('create');

            }
            $("#topic").addClass("overview"); 

            $('#slider1').tinycarousel(
            {
                infinite:"true"
            });
                                                
            //obtaining selected topics and disabling selection of any topic multiple times
            $("button[id^='topic']").click(function()
            {
                                                                                   
                if(selectedTopic === [])
                {
                    selectedTopic[0] = $(this).val();   
                }
                else
                {
                    selectedTopic.push($(this).val());
                }
                                                                                   
                for(var i = 0;i<lengthOfTopicsArray;i++)
                {
                    if($(this).val().indexOf(data[i].tagName)>-1)
                    {
                        sortId.push(data[i].sortId);
                    }
                }
                $(this).addClass('ui-disabled');	
            });
                                                
                                                
        });
        lengthOfTopics.error(function(error, message)
        {
            console.log("FAILURE " + message);
        });
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
                                                       
function getTopics()
    {
    var lengthOfTopicsArray;
    return $.ajax({
        url: "http://vast-scrubland-7419.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json"
    });
    
    }
    
    
});