$(document).ready(function()
                  {
                      var selectedTopic = [];
                      var selectedTime;
                      var selectedLocation;
                      var currentLat, currentLng;
                      var sortId = [];
                      var lengthOfTopics = getTopics();
                      var activity;
                      var userid;
                      var url;
                      
                      $("#loginButtons").addClass("ui-disabled");
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
                                              var parameters = location.search;
                                              var parameter = parameters.split("=");
                                              userid = parameter[1];
                                                                               
                                              alert('user in session: ' + $.session.get('userid'));
                                              var userInvitations = getInvitations();
                                              //append invitations of user in session
                                              userInvitations.success(function(data) {
                                                  console.log('userInvitations count: ' + data.length);
                                                  $.session.set('userInvitesCount', data.length);
                                                  $('#invitationsTag').append('[' + getUserInvitesCount() + ']');
                                                  for(var i=0;i<data.length;i++) {
//                                                      console.log('invitationsList html: ' + );
                                                      $('#invitationsList').append('<li data-thumb="img/' + data[i].username_from + '.jpeg"> <img src="img/' + data[i].username_from + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].username_from + ' <button id = "user' + i + '" data-theme = "a" data-inline = "true" class="ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all" value='+ data[i].username_from +'> Accept </button><br>' + data[i].time + '</p>');

                                                  }
                                              });
                                              
                                              
                                              $('#findMyPeopleButton').click(function()
                                                     {
//                                                         alert("when, where, topic: " + selectedTime + "" + selectedLocation + "" + selectedTopic);
                                                         $('#findMyPeopleButton').addClass('ui-disabled');
                                                         url = "findYourPeople.html?latitude="+ currentLat +"&longitude=" + currentLng  + "&topics=" + sortId + "&activity=" + activity + "&radius=" + getRadius(selectedLocation) + "&userid=" + userid;
                                                         
                                                         $("#loginButtons").removeClass("ui-disabled");
//                                                         window.location.href = "findYourPeople.html?latitude="+ currentLat +"&longitude=" + currentLng  + "&topics=" + sortId + "&activity=" + activity + "&radius=" + getRadius(selectedLocation) + "&userid=" + userid;
                                                         
                                                     });
                                              $("#loginButton").click(function()
                                                                      {
                                                                          window.location.href = "login.html?latitude="+ currentLat +"&longitude=" + currentLng  + "&topics=" + sortId + "&activity=" + activity + "&radius=" + getRadius(selectedLocation);
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

function getInvitations()
{
    var invitationsArray;
    if ($.session.get('userid') === undefined) {
        return null;
    }
    else {
        return $.ajax({
        url: "http://vast-scrubland-7419.herokuapp.com/credentialService/getInvitations?userid=" + $.session.get('userid'),
        async: false,
        dataType: "json"
         });
    }
    
    
}

function getUserInvitesCount() {
    return $.session.get('userInvitesCount');
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


