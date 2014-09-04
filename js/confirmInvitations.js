$(document).ready(function () 
                {
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('activity'), getParameterByName('selectedUsers'), getParameterByName('loggedInUserId'));
                   
                });
    
function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getResult(latitude, longitude, activity, selectedUsers, loggedInUserId)
{
    //$('#mainUI').append('<div class="ui-grid-b"><div class="ui-block-a">' + getActivityImage(activity) + '</div>' + getUserImages(selectedUsers) + '<div class="ui-block-d"><label for="location">Select a location to meet</label><select name="location" id="location"></select></div><br></div><div class="ui-grid-b"><div class="ui-block-a">Selected Date/Time:</div></div><div class="ui-block-a"></div>');
    $('#mainUI').append(
           // '<div class="ui-grid-b">'+  
            '<div style ="height:screen.height">'+
            '<table width = "100%" height = "100%" id="user-activity" style=" border-collapse: collapse; text-align:center ">'+
            '<tr height= "50px" bgcolor="orange" style="color:white" id="user-name">'+getUserNames(selectedUsers)+'</tr>'+
            '<tr height= "100%"; id="user-images" >'+getUserImages(selectedUsers)+'</tr>'+
            '<tr height= "50px" bgcolor="#424242" style="color:white" id="activity-tags">'+getUserTags(selectedUsers)+'</tr>'+    
            '</table>'+
            '</div>'+
            '<table id="DateTime" width = "100%" style=" border-collapse: collapse">'+
            '<tr  height= "75px" width = "100%" bgcolor="#89ccc0" style="color:red" >'+getTimeDate(selectedUsers)+'</tr>'+
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
                    sendInvitations(latitude, longitude, selectedUsers, activity, loggedInUserId);
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
    return '<i class="fa fa-coffee fa-3x"></i>'; 
}

function getUserImages(selectedUsers)
{
    returnHTML = '';
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    
    returnHTML+='<td stlye="border-style: dotted; border-color: red"><img WIDTH=100% src="img/rohit.jpeg"></td>';
    returnHTML+='<td ><img WIDTH=100% src="img/rohit.jpeg"></td>';
    returnHTML+='<td ><img WIDTH=100% src="img/rohit.jpeg"></td>';
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function getUserTags(selectedUsers)
{
    returnHTML = '';
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    
    returnHTML+='<td style="align:right">"Tag 1"</td>';
    returnHTML+='<td style="align:right">"Tag 2"</td>';
    returnHTML+='<td style="align:right">"Tag 3"</td>';
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function getTimeDate(selectedUsers)
{
    returnHTML = '';
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    
    returnHTML+='<td width = "33%" align="center">Time / Date </td>';
    returnHTML+='<td width = "33%" align="center">"Time"</td>';
    returnHTML+='<td width = "33%" align="center">"Date"</td>';
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function getUserNames(selectedUsers)
{
    returnHTML = '';
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    
    returnHTML+='<td>"Name 1"</td>';
    returnHTML+='<td style="align:right" >"Name 2"</td>';
    returnHTML+='<td style="align:right" >"Name 3"</td>';
    /*  for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }*/
    console.log('returnHTML: ' + returnHTML);
return returnHTML;
}

function sendInvitations(latitude, longitude, selectedUsers, activity, loggedInUserId)
{
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    for (i=0; i<users.length; i++){
        sendInvite(latitude, longitude, '12:00:00', users[i], activity, loggedInUserId)
    }
}

function sendInvite(latitude, longitude, time, username_to, activity, loggedInUserId)
{
 
    $("#username_from").val(loggedInUserId);
    $("#latitude_invite").val(latitude);
    $("#longitude_invite").val(longitude);
    $("#time_invite").val(time);
    $("#username_to").val(username_to);
    $("#activity").val(activity);

    document.forms["confirmInviteForm"].submit(function(e) 
                                 {
                                    e.preventDefault();
                                  });
}