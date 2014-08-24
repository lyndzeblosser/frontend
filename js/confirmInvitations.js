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
    $('#mainUI').append('<div class="ui-grid-b"><div class="ui-block-a">' + getActivityImage(activity) + '</div>' + getUserImages(selectedUsers) + '<div class="ui-block-d"><label for="location">Select a location to meet</label><select name="location" id="location"></select></div><br></div><div class="ui-grid-b"><div class="ui-block-a">Selected Date/Time:</div></div><div class="ui-block-a"></div>');
    
    
    getReverseGeocodingData(latitude, longitude, function(addr)
    {
        $("#location").append($("<option />").val(addr).text(addr));
    });
    
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
            }
            // This is checking to see if the Geoeode Status is OK before proceeding
            if (status == google.maps.GeocoderStatus.OK) 
            {
                console.log(results);
                callback(results[0].formatted_address);
                //return address;
            }
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