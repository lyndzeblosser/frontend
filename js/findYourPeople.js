
var jsonImgObj = [];
var users=[];
var loadedUser;
var totalSelected=0;
var selectedUsers=[];


$(document).ready(function () 
{
    			
    var parameters = location.search;
    var parameter = parameters.split("?");
    loggedInLoggedOutBehavior();
    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('time'));
});

function fillImgDetails(id){
    $("#userName").text(users[id]["name"]);
      
    $("#bioText").text(users[id]["bio"]);

    
    
}

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// this function returns radius to show to user in bottom bar
function getRadius(miles)
{
    //    console.log("getParameterByName: " + name);        
    if (miles === '402') {
        radius = 5;
    }
    else if (miles === '805') {
        radius = 10;
    }
    else if (miles === '1610') {
        radius = 20;
    }
    else if (miles === '80467') {
        radius = 1000;
    }
    return radius;
}

function getResult(latitude, longitude, selectedTopics, radius, activity, selectedTime)
{
    console.log(latitude,longitude,radius,activity,selectedTime)
    fillBaseDetails(latitude,longitude,radius,activity,selectedTime)
    $.ajax(
    {
            
        url: "http://evening-thicket-5124.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + selectedTopics + "&radius=" + getRadius(radius) + "&userid=" + $.session.get('userid'),
        async: true,
        dataType: "json",
        success: function (data) 
        {
            console.log("success data-------" + JSON.stringify(data));
                
            if(data.length == 0)
            {
                alert("Oops, we could not find anyone that matched your search criteria! Please try again");
             //   window.location.href = "mood.html";
            }
                
            else(data != "undefined")
            {    
                for(var i=0;i<data.length;i++)
                {
                        
                    users[i]=[];    
                    users[i]["image"] = '../img/' + JSON.parse(JSON.stringify(data[i])).userid.toString() + '.jpeg';
                    users[i]["title"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                    users[i]["userName"] = JSON.parse(JSON.stringify(data[i])).firstname.toString();
                    users[i]["userId"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                    users[i]["name"] = JSON.parse(JSON.stringify(data[i])).firstname.toString() + " " + JSON.parse(JSON.stringify(data[i])).lastname.toString();
                    users[i]["bio"] = JSON.parse(JSON.stringify(data[i])).bio.toString();
                    users[i]["birthDay"] = JSON.parse(JSON.stringify(data[i])).date_of_birth.toString();
                    users[i]["selected"] = 0;
                    
                    console.log(users[i])
               
                }
                
                loadUser(0);
                    
                var AddPeople = document.getElementById( 'addButton' ),
                MoveOnButton = document.getElementById( 'moveOnButton' ),
                confirmInvitation=document.getElementById( 'confirmButton' );
        
                AddPeople.onclick = function() {
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                    addDeleteUser()
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                
                };

                MoveOnButton.onclick = function() {
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                    var nextUser=(loadedUser+1)%(users.length);
                    loadUser(nextUser);
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                
                };
                    
                confirmInvitation.onclick = function() {
                    console.log('confirmInvitation clicked ');
                    var selectedUsersString= getSUS();
                    var selectedUsersNameString= getSUSN();
                    window.location.href = "confirmInvitations.html?latitude="+ latitude +"&longitude=" + longitude  + "&activity=" + activity + "&selectedUsers=" + selectedUsersString + "&selectedUserNames=" + selectedUsersNameString + "&commonTags=FIFA,STARTUPS" + "&inviteTime=" + selectedTime;

                };

                    
            }
              
        },
        error: function (error, message) 
        {
            console.log("Failure: " + message);        
        },
        complete: function(data)
        {
                
				
        }
    });
    
}



function loadUser(id){
    loadedUser=id;
    body = $("#imageDiv");
    var initialImg = users[id]["image"];
    body.css("background-image","url("+initialImg+")");
    var addButtonImg=users[id]["selected"]==0?"images/addprofile.png":"images/removeprofile.png";
    $("#addButton").attr("src",addButtonImg)
    fillImgDetails(id)
    //
}

function addDeleteUser(){
    if(users[loadedUser]["selected"]==0 ){
        if(selectedUsers.length==3){
            alert("Max limit reached, canot add more users")
        }else{
            users[loadedUser]["selected"]=1;
            selectedUsers.push(loadedUser);
            loadUser(loadedUser);
        }
    }else{
        users[loadedUser]["selected"]=0;
        findAndRemove(loadedUser)
        loadUser(loadedUser);
    }
}

function findAndRemove(id){
  var index = selectedUsers.indexOf(id); 
  selectedUsers.splice(index, 1);
}

function getSUSN(){
    var str=[];
    for(var i=0;i<selectedUsers.length;i++){
        str[i]=users[selectedUsers[i]]["userName"]
    }
    return str.join();
}

function getSUS(){
     var str=[];
    for(var i=0;i<selectedUsers.length;i++){
        str[i]=users[selectedUsers[i]]["userId"]
    }
    return str.join();
}

function fillBaseDetails(lat,lng,radius,activity,time){
    codeLatLng(parseFloat(lat),parseFloat(lng));
    $("#activity").text(activity);
    $("#time").text(getTimeStringFromValue(parseInt(time)))
    $("#radius").text(getRadiusStringFromValue(parseInt(radius)))
    
}

function getTimeStringFromValue(time){
    switch(time){
        case 0:
            return "I\'m Flexible";
            break;
        case 20:
            return "In 20 minutes";
            break;
        case 60:
            return "In an hour";
        case 120:
            return "In +2 hours";
        default:
            return "N/A"
    }
}

function getRadiusStringFromValue(radius){
    switch(radius){
        case 5:
            return "Less than 250 ft (1 block)";
            break;
        case 10:
            return "Up to 0.5 miles (10 blocks)";
            break;
        case 20:
            return "Up to 1 mile (20 blocks)";
        case 1000:
            return "I\'m Flexible";
        default:
            return "N/A"
    }
}

function codeLatLng(lat,lng) {
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $("#location").text(results[1].formatted_address);
        
      } else {
        $("#location").text("Location Unresolved")
      }
    } else {
      $("#location").text("Location Unresolved")
    }
  });
  
  return 1;
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




