$(document).ready(function()
                  {
                      var selectedTopic = [];
                      var selectedTime;
                      var selectedLocation;
                      var currentLat, currentLng;
                      var sortId = [];
                      var lengthOfTopics = getTopics();
                      var activity;
                      
                      $("#coffeeActivity").click(function()
                                                 {
                                                    activity = "coffee";                  
                                                     $("#drinksActivity").addClass("ui-disabled");
                                                     $("#foodActivity").addClass("ui-disabled");
                                                 });
                      $("#drinksActivity").click(function()
                                                 {
                                                    activity = "drinks";                  
                                                     $("#coffeeActivity").addClass("ui-disabled");
                                                     $("#foodActivity").addClass("ui-disabled");
                                                 });
                      $("#foodActivity").click(function()
                                                 {
                                                    activity = "food";                  
                                                     $("#coffeeActivity").addClass("ui-disabled");
                                                     $("#drinksActivity").addClass("ui-disabled");
                                                 });

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
                      lengthOfTopics.done(function()
                                          {
                                              $('#findMyPeopleButton').click(function()
                                                     {
//                                                         alert("when, where, topic: " + selectedTime + "" + selectedLocation + "" + selectedTopic);
                                                         
                                                         window.location.href = "findYourPeople.html?latitude="+ currentLat +"&longitude=" + currentLng  + "&topics=" + sortId + "&activity=" + activity + "&radius=" + getRadius(selectedLocation);
                                                         
                                                     });
                                                    
                                              for(var i = 1; i<5; i++)
                                              {
                                                  $('#when' + i + '').click(function()
                                                                           {
                                                                                selectedTime = $(this).text();
                                                                               console.log("selectedTime" + selectedTime);
                                                                           });
                                                  $('#where' + i + '').click(function()
                                                                           {
//                                                                                selectedLocation = $(this).val();
                                                                               selectedLocation = $(this).val(); 
                                                                               console.log("selectedLocation" + selectedLocation);
                                                                               console.log("radius" + getRadius(selectedLocation));
                                                                           });
                                              }
                                          });
                      //getLocation();
                        if (navigator.geolocation) 
                        {
                            navigator.geolocation.getCurrentPosition(function(position)
                                                                     {
//                                                                        alert("In function getCurrentPosition.....................Latitude: " + position.coords.latitude + ", Longitude: " + position.coords.longitude);
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

function getRadius(selectedLocation) 
{
//    console.log("getParameterByName: " + name);        
    radius = 0.724638;
    if (selectedLocation == '5') {
        radius = 402;
    }
    else if (selectedLocation == '10') {
        radius = 805;
    }
    else if (selectedLocation == '20') {
        radius = 1610;
    }
    else if (selectedLocation == '1000') {
        radius = 80467;
    }
    return radius;
}


