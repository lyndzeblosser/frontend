$(document).ready(function () 
                {
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('activity'), getParameterByName('selectedUsers'), getParameterByName('selectedUserNames'), getParameterByName('commonTags'), getParameterByName('inviteTime'));
                   
                });
    
function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getResult(latitude, longitude, activity, selectedUsers, selectedUserNames, commonTags, inviteTime)
{
    //$('#mainUI').append('<div class="ui-grid-b"><div class="ui-block-a">' + getActivityImage(activity) + '</div>' + getUserImages(selectedUsers) + '<div class="ui-block-d"><label for="location">Select a location to meet</label><select name="location" id="location"></select></div><br></div><div class="ui-grid-b"><div class="ui-block-a">Selected Date/Time:</div></div><div class="ui-block-a"></div>');
    $('#mainUI').append(
           // '<div class="ui-grid-b">'+  
            '<div style ="height:screen.height">'+
            '<table width = "100%" height = "100%" id="user-activity" style=" border-collapse: collapse; text-align:center ">'+
            '<tr height= "50px" bgcolor="orange" style="color:white" id="user-name">'+getUserNames(selectedUserNames)+'</tr>'+
            '<tr height= "100%"; id="user-images" >'+getUserImages(selectedUsers)+'</tr>'+
            '<tr height= "50px" bgcolor="#424242" style="color:white" id="activity-tags">'+getUserTags(commonTags)+'</tr>'+    
            '</table>'+
            '</div>'+
            '<table id="DateTime" width = "100%" style=" border-collapse: collapse">'+
            '<tr  height= "75px" width = "100%" bgcolor="#89ccc0" style="color:red" >'+getTimeDate(inviteTime)+'</tr>'+
             '</table>' +      
            '<table id="DateTime" width = "100%" style=" border-collapse: collapse">'+
           '<tr  height= "35px" width = "100%" bgcolor="#89ccc0" style="color:red" >'+'<span id="location"></span>'+'</tr>'+
             '</table>' +      
             '</table>' +      
            '<table height= "125px" id="ActivityButton" width = "100%" >'+
           '<tr  width = "100%" >'+
            '<td  style=" border-style: dotted ; border-color:#c42a27; border-right : none" >'+
           '<div class="ui-block-a" style ="border-color:#c42a27; color:#c42a27" >' + getActivityImage(activity) + '</div>'+
           '</td>'+
           '<td align="center" style="border-style: dotted ; border-color:#c42a27">'+
           '<button id=confirmInvitesButton data-inline=true style ="color:white; background:#c42a27; width: 65% ; height: 100%">Send Invites</button>'+
             '</td>'+
            '</tr>'+
             '</table>' 

            );

    console.log("test1");
    getReverseGeocodingData(latitude, longitude, function(addr)
    {
    console.log("addr: "+addr);

        console.log(($("<option />").val(addr).text(addr)));
        $("#location").val(addr).text(addr);
    });
        console.log("test2");

    $("#confirmInvitesButton").click(function()
                {
                    //assuming this page would always have userid logged in session
                    sendInvitations(latitude, longitude, selectedUsers, activity, $.session.get('userid'), inviteTime);
                 });
 
}

function getReverseGeocodingData(lat, lng, callback) 
{
    var address;
    var latlng = new google.maps.LatLng(lat, lng);
    // This is making the Geocode request
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(
        {
            'latLng': latlng
        }, function (results, status) 
        {
            if (status !== google.maps.GeocoderStatus.OK) 
            {
                alert(status);
                    console.log("test4");

            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status == google.maps.GeocoderStatus.OK) 
            {
                console.log(results);
                callback(results[0].formatted_address);
                    console.log(results[0].formatted_address);

                //return address;
            }
        });
        
}

function getActivityImage(activity)
{
    if (activity === 'coffee')   //check this, actvity doesn't work
    {
        return '<i class="fa fa-coffee fa-3x"></i>';
    }
    else if (activity === 'food')   //check this, actvity doesn't work
    {
        return '<i class="fa fa-spoon fa-3x"></i>';
    }
    if (activity === 'drinks')   //check this, actvity doesn't work
    {
        return '<i class="fa fa-glass fa-3x"></i>';
    }
    return '<i class="fa fa-coffee fa-3x"></i>'; 
}

function getUserImages(selectedUsers)
{
    returnHTML = '';
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    
    returnHTML+='<td stlye="border-style: dotted; border-color: red"><img WIDTH=100% src="img/' + users[0] + '.jpeg"></td>';
    if (users.length>1) {
       returnHTML+='<td ><img WIDTH=100% src="img/' + users[1] + '.jpeg"></td>';
    }
    if (users.length>2)
    returnHTML+='<td ><img WIDTH=100% src="img/' + users[2] + '.jpeg"></td>';
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function getUserTags(matchingTags)
{
    returnHTML = '';
    var matchingTagsArray = matchingTags.split(",");
    console.log('matchingTags: ' + matchingTagsArray);
    console.log('matchingTagsLength: ' + matchingTagsArray.length);

    
    returnHTML+='<td style="align:right">' + matchingTagsArray[0] + '</td>';
    if (matchingTagsArray.length>1) {
        returnHTML+='<td style="align:right">' + matchingTagsArray[1] + '</td>';
    }
    if (matchingTagsArray.length>2) {
        returnHTML+='<td style="align:right">' + matchingTagsArray[2] + '</td>';
    }
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function getTimeDate(inviteTime)
{
    returnHTML = '';
    var invitationTime;
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
//    console.log('users: ' + users);
    if (inviteTime === '20') {
       invitationTime = addMinutes(new Date(), 20)  
    }
    else if (inviteTime === '60') {
        invitationTime = addMinutes(new Date(), 60)  

    }
    else if (inviteTime === '120') {
         invitationTime = addMinutes(new Date(), 120)  

    }
        console.log('invitationTime: ' + invitationTime);

    returnHTML+='<td width = "33%" align="center">Time / Date </td>';
    if (inviteTime === '0') {
        returnHTML+='<td width = "33%" align="center">I\'m flexible</td>';
        returnHTML+='<td width = "33%" align="center">I\'m flexible</td>';
    }
    else {
        returnHTML+='<td width = "33%" align="center">' + invitationTime.getHours()+":"+invitationTime.getMinutes() + '</td>';
        returnHTML+='<td width = "33%" align="center">' + new Date().getDate() + '-' + month[new Date().getMonth()] + '</td>';
    }
    
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function addMinutes(date, minutes) {
    return new Date(date.getTime() + minutes*60000);
}


function getUserNames(selectedUserNames)
{
    returnHTML = '';
    var users = selectedUserNames.split(",");
    console.log('users: ' + users);
    
    returnHTML+='<td>' + users[0] + '</td>';
    if (users.length>1) {
        returnHTML+='<td style="align:right" >' + users[1] + '</td>';
    }
    if (users.length>2) {
        returnHTML+='<td style="align:right" >' + users[2] + '</td>';

    }
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function sendInvitations(latitude, longitude, selectedUsers, activity, loggedInUserId, inviteTime)
{
    var users = selectedUsers.split(",");
    var invitationTime;
//    console.log('users: ' + users);
    if (inviteTime === '20') {
       invitationTime = addMinutes(new Date(), 20)  
    }
    else if (inviteTime === '60') {
        invitationTime = addMinutes(new Date(), 60)  

    }
    else if (inviteTime === '120') {
         invitationTime = addMinutes(new Date(), 120)  

    }
    else
    {
        invitationTime = 'flexible';
    }
    console.log('users: ' + users);
    for (i=0; i<users.length; i++){
        sendInvite(latitude, longitude, invitationTime, users[i], activity, loggedInUserId)
    }
}

function sendInvite(latitude, longitude, invitationTime, username_to, activity, loggedInUserId)
{
 
//    $("#username_from").val(loggedInUserId);
//    $("#latitude_invite").val(latitude);
//    $("#longitude_invite").val(longitude);
//    $("#time_invite").val(invitationTime);
//    $("#username_to").val(username_to);
//    $("#activity").val(activity);
//
//    document.forms["confirmInviteForm"].submit(function(e) 
//                                 {
//                                    e.preventDefault();
//                                  });

    $.post("http://vast-scrubland-7419.herokuapp.com/credentialService/updateInvitation",
    {
        username_from:loggedInUserId,
        latitude_invite:latitude,
        longitude_invite:longitude,
        time_invite:invitationTime,
        username_to:username_to,
        activity:activity

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}