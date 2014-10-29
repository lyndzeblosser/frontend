
var users = [], inviteUsers = [], tags=[],autocomplete,lat,lng;
$(document).ready(function()
{
    $("#InvitesSentId").hide();
    $("#address").hide();

 //   $("#loadingImage").hide();

    var parameters = location.search;
    var parameter = parameters.split("?");
    getTags();
    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('activity'), getParameterByName('selectedUsers'), getParameterByName('selectedUserNames'), getParameterByName('commonTags'), getParameterByName('inviteTime'));
    loggedInLoggedOutBehavior();
});

function getParameterByName(name)
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getResult(lat, lng, activity, selectedUsers, selectedUserNames, inviteTags, inviteTime)
{
    $("#actpic").attr("src","images/"+activity+"invert.svg")
    codeLatLng(lat,lng)
    var userIDs = selectedUsers.split(",")
    getUserData(userIDs)
    prepareTagsDiv(inviteTags)
    var noEmptyDivs = 3 - users.length;
    var userDivDataTop = "";
    var userDivDataBottom = "";
    var count = 0, letter = '';


    for (var i = 0; i < noEmptyDivs; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataTop += prepareEmptyDivTop(letter);
    }
    for (i = 0; i < users.length; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataTop += prepareUserDivTop(i, letter)
    }

    count = 0;

    for (i = 0; i < noEmptyDivs; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataBottom += prepareEmptyDivBottom(letter);
    }
    for (i = 0; i < users.length; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataBottom += prepareUserDivBottom(i, letter)
    }

    $("#userTop").html(userDivDataTop)
    $("#confirmImg").html(userDivDataBottom)


    $("#confirmInvitesButton").click(function()
    {
        //assuming this page would always have userid logged in session
        sendInvitations(latitude, longitude, selectedUsers, activity, $.session.get('userHash'), inviteTime);
    });

}


function prepareEmptyDivTop(letter) {
    return "<div class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:95px; border:none;\"></div></div>"

}

function prepareEmptyDivBottom(letter) {
    return "<div class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"images/findpplicon.svg\" class=\"imagesize\"></div></div>"

}

function prepareUserDivTop(userID, letter) {
    return "<div id=\"top-block-" + letter + "\" class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:95px; background-color:transparent; border:none; color:#ffffff; text-shadow:none;\">" + users[userID]["first_name"] + "</div></div>"
}

function prepareUserDivBottom(userID, letter) {
    return " <div id=\"bottom-block-" + letter + "\" class=\"ui-block-"+letter+"\"><div class=\"ui-bar ui-bar-a\" id=\"confirmprofileImg\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\""+users[userID]["image"]+"\"  class=\"imagesize\"><img class=\"close\" src=\"images/smallcloseicon.png\" onclick=\"removeUser(\'"+users[userID]["id"]+"\',\'"+letter+"\')\" /></div></div>"
    
    //return " <div id=\"bottom-block-" + letter + "\" class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"" + users[userID]["image"] + "\"  class=\"imagesize\"><img class=\"close\" src=\"images/smallcloseicon.png\" onclick=\"removeUser(\'"+users[userID]["id"]+"\',\'"+letter+"\')\" /></div></div>"
}

function prepareEmptyInnerBlockTop() {
    return "<div class=\"ui-bar ui-bar-a\" style=\"height:95px; border:none;\"></div>"
}

function prepareEmptyInnerBlockBottom() {
    return "<div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"\" class=\"imagesize\"></div>";
}

function getUserData(userIDs) {
    for (var i = 0; i < userIDs.length; i++) {
        inviteUsers.push(userIDs[i])
        users[i] = [];
        console.log("http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i])
        $("#loadingImage").show();
        $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i],
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0]
                        console.log(data)

                        users[i]["id"] = data["userid"];
                        users[i]["first_name"] = data["firstname"];
                        users[i]["last_name"] = data["lastname"];
                        users[i]["bio"] = data["bio"];
                        users[i]["image"] = data["imageMasterLocation"];
                        $("#loadingImage").hide();

                    },
                    error: function(error, message)
                    {
                        console.log("Failure: " + message);
                        $("#loadingImage").hide();
                    },
                    complete: function(data)
                    {
                        
                    
                    }
                });
    }
}

function removeUser(userID, letter) {
    if(inviteUsers.length!=1){
    findAndRemove(userID);
    $("#top-block-" + letter).html(prepareEmptyInnerBlockTop());
    $("#bottom-block-" + letter).html(prepareEmptyInnerBlockBottom());
    }else{
        alert("At least 1 person is need to send an invite!")
    }

}

function findAndRemove(id) {
    var index = inviteUsers.indexOf(id);
    inviteUsers.splice(index, 1);

}

function getTags(){
    $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/tags",
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        for(var i=0;i<data.length;i++){
                            tags[data[i]["tagId"]]=data[i]["tagName"];
                        }

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

function prepareTagsDiv(inviteTags){
    console.log(inviteTags.split(","))
    inviteTags=inviteTags.split(",")
    var html="";
    for(var i=0;i<inviteTags.length;i++){
        console.log(i,inviteTags.length)
        html+="<label style=\"background-color:#333333; color:#ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">"+tags[inviteTags[i]]+"<input type=\"checkbox\"></label>"
    }
    $("#tags").html(html);
}

function codeLatLng(lat1,lng1) {
    lat=lat1;
    lng=lng1;
    autoCompleteLocation()
  var geocoder = new google.maps.Geocoder();
  var latlng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({'latLng': latlng}, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        $("#address").attr("value",results[1].formatted_address);
        
      } else {
        $("#address").attr("value","Location Unresolved")
      }
    } else {
      $("#address").attr("value","Location Unresolved")
    }
  });
  
  return 1;
}

function autoCompleteLocation(){
    autoComplete = new google.maps.places.Autocomplete($("#address")[0], {});
    
    
    google.maps.event.addListener(autoComplete, 'place_changed', function()
    {
        var place = autoComplete.getPlace();
        lat = place.geometry.location.lat();
        lng = place.geometry.location.lng();
        console.log(lat,lng)
    });
}

function confirmInvite(){
    var time=getTimeData();
    console.log("length = "+$('#whereText').attr("value").length);
    if($('#whereText').attr("value").length < 1)
    {
        alert("Please selecte from the various Table Tribes Zone Areas to meet!");
        return false;
    }
    var alertConfirmation = confirm("Everything looks good? Should we send out the invitations?");
    if (alertConfirmation)
    {  $("#confirmInvitesButtonId").hide();
    $("#InvitesSentId").show();
        $.post("http://ancient-falls-9049.herokuapp.com/credentialService/addInviteTable",
    {
        user_from:$.session.get('userHash'),
        user_to_1:typeof users[0]=="undefined"?"":users[0]['id'],
        user_to_2:typeof users[1]=="undefined"?"":users[1]['id'],
        user_to_3:typeof users[2]=="undefined"?"":users[2]['id'],
        activity:getParameterByName('activity'),
        invite_date:time['date'],
        invite_time:time['time'],
        matching_tags:getParameterByName('commonTags'),
        invite_location:$('#whereText').attr("value")

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success")
            alert ("Success! - Invitations sent out!");
        else
            alert(data);
        window.location.href = "mood.html"
    });
    $("#confirmInvitesButtonId").hide();
    $("#InvitesSentId").show();
}

}

function getTimeData(){
   var date= $('#basicExample').timepicker('getTime',[ new Date()]);
   var time=[]
   time['date']=date.getUTCFullYear()+'-'+((date.getUTCMonth()+1)<10?'0'+(date.getUTCMonth()+1):(date.getUTCMonth()+1))+'-'+(date.getUTCDate()<10?'0'+date.getUTCDate():date.getUTCDate())
   time['time']=date.getHours()+":"+date.getMinutes()+":00"
   return time;
}

function changeWhereHeading(value,text){
       
    $("#whereText>a").text(text)
    $("#whereText").attr("value",value)
    
}
//function getReverseGeocodingData(lat, lng) 
//{
//    var address;
//    var latlng = new google.maps.LatLng(lat, lng);
//    // This is making the Geocode request
//    var geocoder = new google.maps.Geocoder();
//    geocoder.geocode(
//        {
//            'latLng': latlng
//        }, function (results, status) 
//        {
//            if (status !== google.maps.GeocoderStatus.OK) 
//            {
//                alert(status);
//                    console.log("test4");
//
//            }
//            // This is checking to see if the Geoeode Status is OK before proceeding
//            if (status == google.maps.GeocoderStatus.OK) 
//            {
//                console.log(results);
//                callback(results[0].formatted_address);
//                    console.log(results[0].formatted_address);
//
//                //return address;
//            }
//        });
//        
//}
//
//function getActivityImage(activity)
//{
//    if (activity === 'coffee')   //check this, actvity doesn't work
//    {
//        return '<i class="fa fa-coffee fa-3x"></i>';
//    }
//    else if (activity === 'food')   //check this, actvity doesn't work
//    {
//        return '<i class="fa fa-spoon fa-3x"></i>';
//    }
//    if (activity === 'drinks')   //check this, actvity doesn't work
//    {
//        return '<i class="fa fa-glass fa-3x"></i>';
//    }
//    return '<i class="fa fa-coffee fa-3x"></i>'; 
//}
//
//function getUserImages(selectedUsers)
//{
//    returnHTML = '';
//    var users = selectedUsers.split(",");
//    console.log('users: ' + users);
//    
//    returnHTML+='<td stlye="border-style: dotted; border-color: red"><img WIDTH=100% src="img/' + users[0] + '.jpeg"></td>';
//    if (users.length>1) {
//       returnHTML+='<td ><img WIDTH=100% src="img/' + users[1] + '.jpeg"></td>';
//    }
//    if (users.length>2)
//    returnHTML+='<td ><img WIDTH=100% src="img/' + users[2] + '.jpeg"></td>';
//    /*  for (i=0; i<users.length; i++){
//        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
//    }*/
//    console.log('returnHTML: ' + returnHTML);
//return returnHTML;
//}
//
//function getUserTags(matchingTags)
//{
//    returnHTML = '';
//    var matchingTagsArray = matchingTags.split(",");
//    console.log('matchingTags: ' + matchingTagsArray);
//    console.log('matchingTagsLength: ' + matchingTagsArray.length);
//
//    
//    returnHTML+='<td style="align:right">' + matchingTagsArray[0] + '</td>';
//    if (matchingTagsArray.length>1) {
//        returnHTML+='<td style="align:right">' + matchingTagsArray[1] + '</td>';
//    }
//    if (matchingTagsArray.length>2) {
//        returnHTML+='<td style="align:right">' + matchingTagsArray[2] + '</td>';
//    }
//    /*  for (i=0; i<users.length; i++){
//        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
//    }*/
//    console.log('returnHTML: ' + returnHTML);
//return returnHTML;
//}
//
//function getTimeDate(inviteTime)
//{
//    returnHTML = '';
//    var invitationTime;
//    var month = new Array();
//    month[0] = "January";
//    month[1] = "February";
//    month[2] = "March";
//    month[3] = "April";
//    month[4] = "May";
//    month[5] = "June";
//    month[6] = "July";
//    month[7] = "August";
//    month[8] = "September";
//    month[9] = "October";
//    month[10] = "November";
//    month[11] = "December";
////    console.log('users: ' + users);
//    if (inviteTime === '20') {
//       invitationTime = addMinutes(new Date(), 20)  
//    }
//    else if (inviteTime === '60') {
//        invitationTime = addMinutes(new Date(), 60)  
//
//    }
//    else if (inviteTime === '120') {
//         invitationTime = addMinutes(new Date(), 120)  
//
//    }
//        console.log('invitationTime: ' + invitationTime);
//
//    returnHTML+='<td width = "33%" align="center">Time / Date </td>';
//    if (inviteTime === '0') {
//        returnHTML+='<td width = "33%" align="center">I\'m flexible</td>';
//        returnHTML+='<td width = "33%" align="center">I\'m flexible</td>';
//    }
//    else {
//        returnHTML+='<td width = "33%" align="center">' + invitationTime.getHours()+":"+invitationTime.getMinutes() + '</td>';
//        returnHTML+='<td width = "33%" align="center">' + new Date().getDate() + '-' + month[new Date().getMonth()] + '</td>';
//    }
//    
//    /*  for (i=0; i<users.length; i++){
//        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
//    }*/
//    console.log('returnHTML: ' + returnHTML);
//return returnHTML;
//}
//
//function addMinutes(date, minutes) {
//    return new Date(date.getTime() + minutes*60000);
//}
//
//
//function getUserNames(selectedUserNames)
//{
//    returnHTML = '';
//    var users = selectedUserNames.split(",");
//    console.log('users: ' + users);
//    
//    returnHTML+='<td>' + users[0] + '</td>';
//    if (users.length>1) {
//        returnHTML+='<td style="align:right" >' + users[1] + '</td>';
//    }
//    if (users.length>2) {
//        returnHTML+='<td style="align:right" >' + users[2] + '</td>';
//
//    }
//    /*  for (i=0; i<users.length; i++){
//        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
//    }*/
//    console.log('returnHTML: ' + returnHTML);
//return returnHTML;
//}
//
//function sendInvitations(latitude, longitude, selectedUsers, activity, loggedInUserId, inviteTime)
//{
//    var users = selectedUsers.split(",");
//    var invitationTime;
////    console.log('users: ' + users);
//    if (inviteTime === '20') {
//       invitationTime = addMinutes(new Date(), 20)  
//    }
//    else if (inviteTime === '60') {
//        invitationTime = addMinutes(new Date(), 60)  
//
//    }
//    else if (inviteTime === '120') {
//         invitationTime = addMinutes(new Date(), 120)  
//
//    }
//    else
//    {
//        invitationTime = 'flexible';
//    }
//    console.log('users: ' + users);
//    for (i=0; i<users.length; i++){
//        sendInvite(latitude, longitude, invitationTime, users[i], activity, loggedInUserId)
//    }
//}
//
//function sendInvite(latitude, longitude, invitationTime, username_to, activity, loggedInUserId)
//{
// 
////    $("#username_from").val(loggedInUserId);
////    $("#latitude_invite").val(latitude);
////    $("#longitude_invite").val(longitude);
////    $("#time_invite").val(invitationTime);
////    $("#username_to").val(username_to);
////    $("#activity").val(activity);
////
////    document.forms["confirmInviteForm"].submit(function(e) 
////                                 {
////                                    e.preventDefault();
////                                  });
//
//    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/updateInvitation",
//    {
//        username_from:loggedInUserId,
//        latitude_invite:latitude,
//        longitude_invite:longitude,
//        time_invite:invitationTime,
//        username_to:username_to,
//        activity:activity
//
//    },
//    function(data,status){
//        console.log("Data: " + data + "\nStatus: " + status);
//    });
//}
