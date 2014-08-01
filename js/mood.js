$(document).ready(function()
                  {
                      var selectedTopic = [];
                      var selectedTime;
                      var selectedLocation;
                      var currentLat, currentLng;
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
                                                         
                                                         window.location.href = "findYourPeople.html?latitude="+ currentLat +"&longitude=" + currentLng  + "&topics=" + selectedTopic;
                                                         
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
//                                                                        getResult(position, selectedTopic);
                                                                        currentLat = position.coords.latitude;
                                                                        currentLng = position.coords.longitude;
                                                                        
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


