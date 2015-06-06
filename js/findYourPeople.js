
var jsonImgObj = [];
var users=[];
var loadedUser;
var totalSelected=0;
var selectedUsers=[];
var tableid=0;
var usersSentInvite = 0;
var AddingtoCurrentTable = "No";
var table;
var alreadyInvitedUsers=[];
$(document).ready(function () 
{
    			
    var parameters = location.search;
    var parameter = parameters.split("?");
    loggedInLoggedOutBehavior();
    console.log("getParameterByName: AddingtoCurrentTable: " + getParameterByName('AddingtoCurrentTable')); 
    if(getParameterByName('AddingtoCurrentTable')=="Yes")
    {   AddingtoCurrentTable = "Yes";
        tableid=getParameterByName('TableId');
        getTableData(tableid);
        selectedUsers.push(tableid);
          
        if(table['user_to_1_status']==="Rejected")
        usersSentInvite = 0;
        else if(isNaN(table['user_to_2_status']) || table['user_to_2_status']==="Rejected")
                 usersSentInvite = 1;
            else usersSentInvite = 2;
                                   
        if(table['user_to_1_status']==="Rejected" || table['user_to_1_status']==="Pending")
            alreadyInvitedUsers.push(table['user_to_1']);
        if( table['user_to_2_status']==="Rejected" || table['user_to_2_status']==="Pending")
                alreadyInvitedUsers.push(table['user_to_2']);
        if( table['user_to_3_status']==="Rejected" || table['user_to_3_status']==="Pending")
                alreadyInvitedUsers.push(table['user_to_2']);
    
                
        console.log("Rejected Users "+alreadyInvitedUsers);
    }
    
//    getTopicNames(getParameterByName('topics'));
    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('time'));
    google.maps.event.addDomListener(window, 'load', initialize);
//    $( "#dialog-confirm" ).dialog("close");
//    $( "#dialog-confirm" ).dialog({
//                  autoOpen : false,
//                  resizable: false,
//                  height:140,
//                  modal: true,
//                  buttons: {
//                    "Add more people": function() {
//                      $( this ).dialog( "close" );
//                      $("#moveOnButton").click();
//                    },
//                    "Confirm Table": function() {
//                      $( this ).dialog( "close" );
//                    }
//                  }
//                });
});

function redirectToMoodScreen()
{
    
   var urlParams=getUrlParams();
    var url = "mood.html?"+urlParams;
    window.location.href = url; 
        console.log("constructed url test - "+url);
    
 
}
     function popTryAgain() {
//$( "#noUserFoundPopup" ).popup("close");
window.location.reload(true);
     }
         function popupGoBack(){
         
                    if(AddingtoCurrentTable === "Yes")
                window.location.href = "view.html?tableid="+tableid+"&user_from="+$.session.get('userHash');
                else
                redirectToMoodScreen();
        }

    function getUrlParams(){
    var url="";
    
        url+="activity="+getParameterByName('activity');
        var tags = getParameterByName('topics')
            tags = tags.replace('#', '');
        url+="&topics="+tags;
        url+="&radius="+getParameterByName('radius');
        url+="&latitude="+getParameterByName('latitude')+"&longitude="+getParameterByName('longitude');
    
    if(isLoggedIn){
        url+="&userid="+$.session.get('userHash')
    }
    url+="&redirectedFromSearchScreen=Yes";
    
    return url;
}

function fillImgDetails(id){
    $("#userName").text(users[id]["name"]);
      
    $("#bioText").text(users[id]["bio"]);
    if (users[id]["commonTags"] != null) {
        commonTagsArray = users[id]["commonTags"].split(",")
        for (i=0; i < commonTagsArray.length; i++) {
            $("#tag"+i).text(commonTagsArray[i]);
        }
    }
    
 //   getTopicNames(users[id]["commonTags"]);

    
    
}

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// this function returns radius to show to user in bottom bar
//function getRadius(miles)
//{
//    //    console.log("getParameterByName: " + name);        
//    if (miles === '402') {
//        radius = 5;
//    }
//    else if (miles === '805') {
//        radius = 10;
//    }
//    else if (miles === '1610') {
//        radius = 20;
//    }
//    else if (miles === '80467') {
//        radius = 1000;
//    }
//    return radius;
//}
//
//function autoCompleteLocation(){
//    autoComplete = new google.maps.places.Autocomplete('Starbucks');
////    if (navigator.geolocation)
////    {
////        navigator.geolocation.getCurrentPosition(function(position){
////            currentLat = position.coords.latitude;
////            currentLng = position.coords.longitude;
////            $("#address").attr("placeholder", "Value set to nearest Starbucks");
////           
////        })
////    }
//    var place = autoComplete.getPlace();
//        currentLat = place.geometry.location.lat();
//        currentLng = place.geometry.location.lng();
//        console.log(currentLat, currentLng);
//
//         var address = '';
//    if (place.address_components) {
//      address = [
//        (place.address_components[0] && place.address_components[0].short_name || ''),
//        (place.address_components[1] && place.address_components[1].short_name || ''),
//        (place.address_components[2] && place.address_components[2].short_name || '')
//      ].join(' ');
//      }
//      var inviteLocation = place.name + ' ' + address;
//      $("#address").val(inviteLocation);
//      
//        
// 
//}
function initialize() {
//  var service = new google.maps.places.AutocompleteService();
//  service.getPlacePredictions({ input: 'Starbucks' }, callback);

var currentLoc = new google.maps.LatLng(getParameterByName('latitude'),getParameterByName('longitude'));

  map = new google.maps.Map(document.getElementById('map'), {
      center: currentLoc,
      zoom: 15
    });

  var request = {
    location: currentLoc,
//    radius: '11265',
    name: 'Starbucks',
    rankBy: google.maps.places.RankBy.DISTANCE
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(predictions, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  var place_id = predictions[0].place_id;
  console.log('place_id: ' + place_id);
  var placesService = new google.maps.places.PlacesService($('#address').get(0));
  placesService.getDetails({ placeId: place_id }, placeDetailsCallback);
  

}

function placeDetailsCallback(placeResult, status) {
    
        var place = placeResult;
        var address = '';
//    if (place.formatted_address) {
//      address = [
//        (place.address_components[0] && place.address_components[0].short_name || ''),
//        (place.address_components[1] && place.address_components[1].short_name || ''),
//        (place.address_components[2] && place.address_components[2].short_name || '')
//      ].join(' ');
        address = place.formatted_address;
//      }
      var inviteLocation = place.name + ' ' + address;
      console.log('Invite Location set:' + inviteLocation);
      $("#address").val(inviteLocation);
//    $("#address").val(predictions[0].description);
}
function sendToMoodPage ()
{
    window.location.href = "mood.html";
}
function getResult(latitude, longitude, topics, radius, activity, selectedTime)
{
    console.log(latitude,longitude,radius,activity,selectedTime)
    fillBaseDetails(latitude,longitude,radius,activity,selectedTime)
    $.ajax(
    {
            
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + topics + "&radius=" + getRadius(radius) + "&userid=" + $.session.get('userHash') + "&userType=" + $.session.get('userType'),
        async: true,
        dataType: "json",
        success: function (data) 
        {
            console.log("success data-------" + JSON.stringify(data));
                
            if(data.length == 0)
            {
//                alert("Oops, we could not find anyone that matched your search criteria! Please try again later");
//                $.mobile.changePage( "login.html", { role: "dialog" , transition:"slideup", reloadPage:"true" });
                $("#noUserFoundPopup").popup("open");
           
 }
                
            else(data != "undefined")
            {   
                //k is for users[] and i for data[]
                var k=0; 
                       for(var i=0;i<data.length;i++)
                { var alreadyInvitedUsersFound =0;
                    for(var j=0;j<alreadyInvitedUsers.length;j++)
                        if(JSON.parse(JSON.stringify(data[i])).userid.toString()==alreadyInvitedUsers[j])
                    alreadyInvitedUsersFound = 1;
                        
                    if(alreadyInvitedUsersFound == 0)
                    {
                    users[k]=[];    
//                    users[i]["image"] = '../img/' + JSON.parse(JSON.stringify(data[i])).userid.toString() + '.jpeg';
                    if (data[i].imageMasterLocation != null) {
                        users[k]["image"] = JSON.parse(JSON.stringify(data[i])).imageMasterLocation.toString();                    
                    }
                    else {
                       users[k]["image"] = '../img/' + JSON.parse(JSON.stringify(data[i])).userid.toString() + '.jpeg'; 
                    }
                    users[k]["title"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                    users[k]["userName"] = JSON.parse(JSON.stringify(data[i])).firstname.toString();
                    users[k]["userId"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                    users[k]["name"] = JSON.parse(JSON.stringify(data[i])).firstname.toString();
                    users[k]["bio"] = JSON.parse(JSON.stringify(data[i])).bio.toString();
                    if (data[i].date_of_birth != null) {
                         users[k]["birthDay"] = JSON.parse(JSON.stringify(data[i])).date_of_birth.toString();
                     }
                    if (data[k].commonTags != null) {
                        users[k] ["commonTags"] = JSON.parse(JSON.stringify(data[i])).commonTags.toString();
                    } 
                    users[k]["selected"] = 0;
                    console.log("User ID - "+users[k]["userId"]);
                    k++;
                }
            }
                
                 if(users.length == 0)
            {
//                alert("Oops, we could not find anyone that matched your search criteria! Please try again later");
//                $.mobile.changePage( "login.html", { role: "dialog" , transition:"slideup", reloadPage:"true" });
                 $( "#noUserFoundPopup" ).popup("open");
             
            }
                else {   loadUser(0);
                    
                var AddPeople = document.getElementById( 'addButton' ),
                MoveOnButton = document.getElementById( 'moveOnButton' ),
                confirmInvitation=document.getElementById( 'confirmButton' );
        
                AddPeople.onclick = function() {
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                    addDeleteUser()
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                
                };

                MoveOnButton.onclick = function() {
                    console.log("USER LENGHT"+users.length);
                    loggedInLoggedOutBehavior();
                    if(users.length === 1)
                        alert("Looks like we could only find " +users[0]["name"] +" right now. Please check back later to connect with more people");
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                    var nextUser=(loadedUser+1)%(users.length);
                    loadUser(nextUser);
                    $(".ui-fixed-hidden").removeClass("ui-fixed-hidden")
                };
            }   
//                confirmInvitation.onclick = function() {
//                    console.log('confirmInvitation clicked ');
//                    var selectedUsersString= getSUS();
//                    var selectedUsersNameString= getSUSN();
//                    if(selectedUsersString.length<1)
//                        alert ("Atleast 1 person has to be selected to send an invite. Please try again!"); 
//                    else
//                    window.location.href = "confirmInvitations.html?latitude="+ latitude +"&longitude=" + longitude  + "&activity=" + activity + "&selectedUsers=" + selectedUsersString + "&selectedUserNames=" + selectedUsersNameString + "&commonTags="+topics + "&inviteTime=" + selectedTime;
//
//                };

                    
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

function getTableData(tableid){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/getTable?user_from="+$.session.get('userHash')+"&tableid="+tableid,
        async: false,
        dataType: "json",
        success: function(data)
        {   
            table=data[0];
            console.log(data)
                      

        },
        error: function(error, message)
        {
            console.log("Failure: " + message);
        },
        complete: function(data)
        {


        }
    });
}

function getTopicNames(tags)
{
    $.ajax({
        url: "https://ancient-falls-9049.herokuapp.com/credentialService/getTagNames?tags=" + tags,
        async: false,
        dataType: "json",
        success: function (data){
            for(var i=0;i<data.length;i++){
                $("#tag"+i).text((JSON.parse(JSON.stringify(data[i])).tagName.toString()));
            }
        }
    });

}

function loadUser(id){
    loadedUser=id;
    body = $("#imageDiv");
    var initialImg = users[id]["image"];
    body.css("background-image","url("+initialImg+")");
    
    var addButtonImg=users[id]["selected"]==0?"images/confirm.jpg":"images/confirmed.jpg";
    if (users[id]["selected"]!=0) {
        $("#addButton").prop("disabled",true);
     /*   $('#imageDiv').block({
                message: 'Invite Sent! You should hear back soon. In the meantime, you can send invites to at max 3 people.',
                css: { border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#ffbb00' }
            });*/
        console.log("User invite on its way");
    }
    else {
        $("#addButton").removeAttr("disabled");
        $('#imageDiv').unblock();
    }
    $("#addButton").attr("src",addButtonImg)
    fillImgDetails(id)
    //
}

function addDeleteUser(){
    if(users[loadedUser]["selected"]==0 ){
        if(selectedUsers.length>1){
            alert("Sorry invites can be sent to only 2 other people!")
        }else{ 
                users[loadedUser]["selected"]=1;
                selectedUsers.push(loadedUser);
                loadUser(loadedUser);
            
            if(AddingtoCurrentTable === "Yes" ||selectedUsers.length >1)
                addUserToTable(loadedUser);
            else
                confirmInvite(loadedUser);
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
            return "FLEXIBLE";
            break;
        case 60:
            return "NOW";
        case 120:
            return "IN FEW HOURS";
        default:
            return "N/A"
    }
}

function getRadiusStringFromValue(radius){
    switch(radius){
        case 10:
            return "NEIGHBORHOOD";
            break;
        case 100:
            return "EXPLORE A LITTLE";
        case 300:
            return "FLEXIBLE";
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
    radius = 5000;
   if (selectedLocation == '10') {
        radius = 805;
    }
    else if (selectedLocation == '100') {
        radius = 8050;
    }
    else if (selectedLocation == '300') {
        radius = 24150;
    }
    return radius;
}

function confirmInvitation() {
//    $( "#inviteSentPopup" ).popup("close");
    window.location.href = "view.html?tableid="+tableid+"&user_from="+$.session.get('userHash');
}

function addMorePeople() {
    $("#moveOnButton").click();
    $( "#inviteSentPopup" ).popup("close");  
}

function confirmInvite(i){
    
    var userName = users[i]["name"];
    var oldDateObj = new Date();
    
    var d = new Date();
    var ud = new Date(d.getTime() + 30*60000)
    var month = d.getMonth()+1;
    var day = d.getDate();
    var h = ud.getHours();
    var m = ud.getMinutes();
    var s = ud.getSeconds();

    var inviteDate = d.getFullYear() + '-' +
    ((''+month).length<2 ? '0' : '') + month + '-' +
    ((''+day).length<2 ? '0' : '') + day;
    
    var inviteTime = h + ":" + m;
    
    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/addInviteTable",
    {
        user_from:$.session.get('userHash'),
        user_to_1:users[i]["userId"],
        activity:getParameterByName('activity'),
        invite_date:inviteDate,
        invite_time:inviteTime,
        matching_tags:getParameterByName('topics'),
        invite_location:$("#address").val()

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success") {
              usersSentInvite = 1;    
//            alert ("Invite sent to "+userName+"! You should hear back soon. In the meantime, you can invite upto 3 more people for this table or confirm this table");
            if(selectedUsers >1 || users.length == usersSentInvite)
            {
              $("#popupAddMoreButton").hide();
              if(AddingtoCurrentTable === "Yes")
                 $("#popUpText").text("Invite sent! You should hear back soon.");
              else
                  $("#popUpText").text("Invite sent! You should hear back soon. Please confirm this table");
            }
            $( "#inviteSentPopup" ).popup("open");
            
            
            tableid = data;
            
/*            $('#imageDiv').block({
                message: 'Invite Sent! You should hear back soon. In the meantime, you can send invites to at max 3 people.',
                css: { border: 'none', 
            padding: '15px', 
            backgroundColor: '#000', 
            '-webkit-border-radius': '10px', 
            '-moz-border-radius': '10px', 
            opacity: .5, 
            color: '#ffbb00' }
            });*/
//            $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
        }
        else {
            alert(data);
//            sendToMoodPage();
        }
    });
   


}

function addUserToTable(i){
    
    var userName = users[i]["name"];
    if (usersSentInvite == 0) {
        alert("Issue uncovered");
        $.post("http://ancient-falls-9049.herokuapp.com/credentialService/addUserToTable",
    {
        tableid:tableid,
        user_from:$.session.get('userHash'),
        user_to_1:users[i]["userId"],
        activity:getParameterByName('activity'),
//        invite_date:time['date'],
//        invite_time:time['time'],
        matching_tags:getParameterByName('topics'),
        invite_location:$("#address").val()

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success") {
//            alert ("Invite sent to " + userName);
            
            
            if(AddingtoCurrentTable === "Yes")
            { 
                if(isNaN(table['user_to_2_status']) || table['user_to_2_status']==="Rejected")
                usersSentInvite = 1;
                else 
                {usersSentInvite = 2;
                selectedUsers.push(tableid);
                }
            }
            else usersSentInvite=2;
            if(selectedUsers >1 || users.length == usersSentInvite)
            {
              $("#popupAddMoreButton").hide();
              if(AddingtoCurrentTable === "Yes")
                 $("#popUpText").text("Invite sent! You should hear back soon.");
              else
                  $("#popUpText").text("Invite sent! You should hear back soon. Please confirm this table");
            }
            $( "#inviteSentPopup" ).popup("open");
            
//            $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
 
        }
        else {
            alert(data);
//            sendToMoodPage();
        }
    });
        
    }
    else
    if (usersSentInvite == 1) {
        $.post("http://ancient-falls-9049.herokuapp.com/credentialService/addUserToTable",
    {
        tableid:tableid,
        user_from:$.session.get('userHash'),
        user_to_2:users[i]["userId"],
        activity:getParameterByName('activity'),
//        invite_date:time['date'],
//        invite_time:time['time'],
        matching_tags:getParameterByName('topics'),
        invite_location:$("#address").val()

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success") {
//            alert ("Invite sent to " + userName);
            
            usersSentInvite=2;
              if(selectedUsers >1 || users.length == usersSentInvite)
            {
              $("#popupAddMoreButton").hide();
              if(AddingtoCurrentTable === "Yes")
                 $("#popUpText").text("Invite sent! You should hear back soon.");
              else
                  $("#popUpText").text("Invite sent! You should hear back soon. Please confirm this table");
            }
            $( "#inviteSentPopup" ).popup("open");
            
//            $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
 
        }
        else {
            alert(data);
//            sendToMoodPage();
        }
    });
        
    }
    else if (usersSentInvite == 2) {
           $.post("http://ancient-falls-9049.herokuapp.com/credentialService/addUserToTable",
    {
        tableid:tableid,
        user_from:$.session.get('userHash'),
        user_to_3:users[i]["userId"],
        activity:getParameterByName('activity'),
//        invite_date:time['date'],
//        invite_time:time['time'],
        matching_tags:getParameterByName('topics'),
        invite_location:getRadiusStringFromValue(parseInt(getParameterByName('radius')))

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success") {
//            alert ("Invite sent to " + userName);
            
            usersSentInvite=3;
              if(selectedUsers >1 || users.length == usersSentInvite)
            {
              $("#popupAddMoreButton").hide();
              if(AddingtoCurrentTable === "Yes")
                 $("#popUpText").text("Invite sent! You should hear back soon.");
              else
                  $("#popUpText").text("Invite sent! You should hear back soon. Please confirm this table");
            }
            $( "#inviteSentPopup" ).popup("open");
//            $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
 
        }
        else {
            alert(data);
//            sendToMoodPage();
        }
    }); 
    }
    
   


}

