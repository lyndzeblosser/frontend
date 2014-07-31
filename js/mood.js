$(document).ready(function()
                  {
                      var selectedTopic = [];
                      var selectedTime;
                      var selectedLocation;
                      var lengthOfTopics = getTopics();

                      lengthOfTopics.success(function(data)
                                            {
                                                lengthOfTopicsArray = data.length;
                                                console.log("lengthOfTopicsArray: " + lengthOfTopicsArray);
                                                console.log("tags: " + data.length);
                                                for(var i=0;i<data.length;i++)
                                                {
                                                    $('#topic').append('<li>'+ data[i].tagName + '<br><br><br><button id = "topic' + i + '" data-theme="a" data-inline="true" value='+ data[i].tagName +'>SELECT</button></li>').trigger('create');

                                                }
                                                $("#topic").addClass("overview"); 

                                                $('#slider1').tinycarousel(
                                                {
                                                    infinite:"true"
                                                });

                                                for(var i = 0; i<lengthOfTopicsArray; i++)
                                                {
                                                    $('#topic' + i +'').click(function()
                                                                               {
                                                                                   if(selectedTopic === [])
                                                                                   {
                                                                                        selectedTopic[0] = $(this).val();   
                                                                                   }
                                                                                   else
                                                                                   {
                                                                                       selectedTopic.push($(this).val());
                                                                                   }
                                                                                   alert(selectedTopic);
                                                                                   $(this).addClass('ui-disabled');	
                                                                               });
                                                }   
                                            });
                      lengthOfTopics.error(function(error, message)
                                           {
                                               console.log("FAILURE " + message);
                                           });
                      lengthOfTopics.done(function()
                                          {
                                              $('#findMyPeopleButton').click(function()
                                                     {
                                                         alert("when, where, topic: " + selectedTime + "" + selectedLocation + "" + selectedTopic);
                                                         
                                                         window.location.href = "findYourPeople.html?when="+ selectedTime +"&where=" + selectedLocation + "&topic=" + selectedTopic;
                                                         
                                                     });
                                                    
                                              for(var i = 0; i<4; i++)
                                              {
                                                  $('#when' + i + '').click(function()
                                                                           {
                                                                                selectedTime = $(this).text();
                                                                               console.log("selectedTime" + selectedTime);
                                                                           });
                                                  $('#where' + i + '').click(function()
                                                                           {
                                                                                selectedLocation = $(this).text();
                                                                               console.log("selectedLocation" + selectedLocation);
                                                                           });
                                              }
                                          });
                      //getLocation();
                        if (navigator.geolocation) 
                        {
                            navigator.geolocation.getCurrentPosition(function(position)
                                                                     {
                                                                        alert("In function getCurrentPosition.....................Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
                                                                        getResult(position, selectedTopic);
                                                                     });
                        } 
                        else 
                        {
                            alert("Geolocation is not supported by this browser.");
                        }
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

function getResult(position, selectedTopic)
{
    var generalInterests;
    var professionalInterests;
    $.ajax(
        {
            
            //we will have to change the signature of this service and include tagName instead of sortId for tags because we will be increasing the number of tags in the future and to hard code the sortId with each tag in the frontend will be cumbersome.
            
            
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=" + position.coords.latitude + "&searchLng=" + position.coords.longitude + "&searchTags=" + selectedTopic,
            async: true,
            dataType: "json",
            success: function (data) 
            {
                alert("In function getResult................ Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
                
                for(var i=0;i<data.length;i++)
                {
                    if(data[i].userid === "vaibhav")
                    {
                        generalInterests = data[i].general_interests.toString().split(",");
                        for(var j=0; j<generalInterests.length; j++)
                        {
                            $('#generalInterestsList').append('<li><a href="#">'+ generalInterests[j] + '</a></li>').trigger('create');
                        }
                        
                        professionalInterests = data[i].professional_interests.toString().split(",");
                        console.log("professional Interests" + professionalInterests);
                        for(var k=0; k<professionalInterests.length; k++)
                        {
                            $('#professionalInterestsList').append('<li><a href="#">'+ professionalInterests[k] + '</a></li>').trigger('create');
                        }
                    }
                    $('#generalInterestsList').listview('refresh');
                    $('#professionalInterestsList').listview('refresh');
                }
                
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            }
        });
    
}
