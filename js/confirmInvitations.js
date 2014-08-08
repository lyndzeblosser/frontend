$(document).ready(function () 
                {
                    var parameters = location.search;
                    var parameter = parameters.split("?");
//                    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('activity'), getParameterByName('selectedUsers'), getParameterByName('loggedInUserId'));
                   
                


                });
    
function getParameterByName(name) 
{
//    console.log("getParameterByName: " + name);        
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    
    //alert("naem: " + name);
    
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    //alert("regex: " + regex);
    
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getResult(latitude, longitude, activity, selectedUsers, loggedInUserId)
{
//     console.log('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].name + '<button data-theme = "a" data-inline = "true" class=" ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all>INVITE</button><br>' + data[i].information + '</p>');
    $('#mainUI').append('<div class="ui-grid-b"><div class="ui-block-a">' + getActivityImage(activity) + '</div>' + getUserImages(selectedUsers) + '<div class="ui-block-d"><label for="location">Select a location to meet</label><select name="location" id="location"><option>aaa</option><option>bbb</option><option>ccc</option></select></div><br></div><div class="ui-grid-b"><div class="ui-block-a">Selected Date/Time:</div></div><div class="ui-block-a"></div>');
    $("#confirmInvitesButton").click(function()
                 {
                    sendInvitations(latitude, longitude, selectedUsers, activity, loggedInUserId);
                 });
 
}

function getActivityImage(activity)
{
    if (activity === 'coffee')
    {
        return '<i class="fa fa-coffee fa-3x"></i>';
    }
}

function getUserImages(selectedUsers)
{
    returnHTML = '';
    var users = selectedUsers.split(",");
    console.log('users: ' + users);
    for (i=0; i<users.length; i++){
        returnHTML += '<div class="ui-block-b"><img src="img/' + users[i] + '.jpeg"></div>';
    }
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