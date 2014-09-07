
var p;
$(document).ready(function()
{

    var selectedTopic = [];
    var selectedTime;
    var selectedLocation;
    var currentLat, currentLng;
    var sortId = [];
    var lengthOfTopics = getTopics();
    var activity;
    var userid = $.session.get('userid');
    ;
    var url;

    uiChanges(userid);



    var autocomplete = new google.maps.places.Autocomplete($("#address")[0], {});
    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
        var place = autocomplete.getPlace();
        currentLat = place.geometry.location.lat();
        currentLng = place.geometry.location.lng();
        console.log(currentLat, currentLng)
    });


    $(".activitiesButton").click(function()
    {
        activity = $(this).attr("value");
        $(".activitiesButton").css("background-color", "#b54037")
        $(this).css("background-color", "#fc5b3f")

    }) 

    if(typeof userid!="undefined"){}
    lengthOfTopics.success(function(data)
    {
        lengthOfTopicsArray = data.length;
        console.log("lengthOfTopicsArray: " + lengthOfTopicsArray);
        console.log("tags: " + data.length);

        //creating list for selection of discussion topics
        for (var i = 0; i < lengthOfTopicsArray; i++)
        {
            $('#topic').append('<li><button id = "topic' + i + '" data-theme="a"  value="' + data[i].tagName + '">' + data[i].tagName + '</button></li>').trigger('create');

        }
        $("#topic").addClass("overview");

      

        //obtaining selected topics and disabling selection of any topic multiple times
        $("button[id^='topic']").click(function()
        {

            if (selectedTopic === [])
            {
                selectedTopic[0] = $(this).val();
            }
            else
            {
                selectedTopic.push($(this).val());
            }

            for (var i = 0; i < lengthOfTopicsArray; i++)
            {
                if ($(this).val().indexOf(data[i].tagName) > -1)
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


        alert('user in session: ' + $.session.get('userid'));
        var userInvitations = getInvitations();
        var userTable = getUserTable();

        //append invitations of user in session
        if (userInvitations !== null) {
            userInvitations.success(function(data) {
              

                console.log('userInvitations count: ' + data.length);
                $.session.set('userInvitesCount', data.length);
                $('#invitationsTag').append('[' + getUserInvitesCount() + ']');
                for (var i = 0; i < data.length; i++) {
                    //                                                      console.log('invitationsList html: ' + );
                    $('#invitationsList').append('<li><img src="img/' + data[i].username_from + '.jpeg" draggable="false""/><p>' + data[i].username_from + ' <button id = "user' + i + '" data-theme = "a" data-inline = "true" class="ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all" value=' + data[i].username_from + '> Accept </button><br>' + data[i].time + '</p>');

                }
                if (data.length > 0) {
                    $("#invitationsList").addClass("overview");

                    //                    $('#sliderPendingInvites').tinycarousel(
                    //                            {
                    //                                infinite: "true"
                    //                            });
                    $("button[id^='user']").click(function()
                    {


                        acceptInvite($(this).val(), $.session.get('userid'))

                        console.log('accepted invite from: ' + $(this).val());
                        $(this).addClass('ui-disabled');
                    });
                }
            }
            );
        }
     
        //append accepted invites of user in session
        if (userTable !== null) {
            userTable.success(function(data) {
           

                console.log('userTable count: ' + data.length);
                $.session.set('userTableCount', data.length);
                $('#myTableTag').append('[' + getUserTablesCount() + ']');
                for (var i = 0; i < data.length; i++) {
                    //                                                      console.log('invitationsList html: ' + );
                    $('#userTableList').append('<li><img src="img/' + data[i].username_from + '.jpeg" draggable="false""/><p>' + data[i].username_from + '<br>' + data[i].username_to + '<br>'+ data[i].time + '</p>');

                }
                if (data.length > 0) {
                    $("#userTableList").addClass("overview");

                //                  
                }
            
            });
        }
        $('#findMyPeopleButton').click(function()
        {
            if (validate(currentLat, currentLng, sortId, activity, getRadius(selectedLocation)))
            {
                if (typeof $.session.get('userid') != "undefined")
                {
                    //                    updateUserLiveLocation($.session.get('userid'), currentLat, currentLng);
                    url = "findYourPeople.html?latitude=" + currentLat + "&longitude=" + currentLng + "&topics=" + sortId + "&activity=" + activity + "&radius=" + getRadius(selectedLocation) + "&userid=" + userid + "&selectedTime=" + selectedTime;
                    window.location.href = url;
                }
                $('#findMyPeopleButton').css("display", "none")
                $("#loginButtons").css("display", "block");

            }
            else
            {
                alert("Please fill all fields");
            }
        });

        $("#loginButton").click(function()
        {
            window.location.href = "login.html?latitude=" + currentLat + "&longitude=" + currentLng + "&topics=" + sortId + "&activity=" + activity + "&radius=" + getRadius(selectedLocation);
        });

        $("#registerButton").click(function()
        {
            window.location.href = "register.html";
        });


        for (var i = 1; i < 5; i++)
        {
            $('#when' + i + '').click(function()
            {
                selectedTime = $(this).val();
                console.log("selectedTime" + selectedTime);
            });
            $('#where' + i + '').click(function()
            {
                selectedLocation = $(this).val();
                console.log("selectedLocation" + selectedLocation);
                console.log("radius" + getRadius(selectedLocation));
            });
        }
    });

    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position)
        {
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            $("#address").attr("placeholder", "Value set to your current location")
            
            if (typeof $.session.get('userid') != "undefined")
            {
                updateUserLiveLocation($.session.get('userid'), currentLat, currentLng);
            }
        });
    }
    else
    {
        $("#address").attr("placeholder", "Enter Location")
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

function getUserTable()
{
    if ($.session.get('userid') === undefined) {
        return null;
    }
    else {
        return $.ajax({
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/getUserTable?userid=" + $.session.get('userid'),
            async: false,
            dataType: "json"
        });
    }


}

function getUserTablesCount() {
    return $.session.get('userTableCount');
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


function uiChanges(userid) {
    $(".activities").css("width", "33%")
    $(".activities").css("float", "left")
    $("#loginButtons").css("display", "none")

    if (typeof userid == "undefined") {
        $(".loggedInFields").css("display", "none")
    } else {
        $(".loggedOutFields").css("display", "none")
    }
}

function validate() {
    for (var i = 0, j = arguments.length; i < j; i++) {
        console.log(arguments[i], typeof arguments[i])
        if (typeof arguments[i] == "object")
            if (arguments[i].length == 0)
                return false;

        if (typeof arguments[i] == "undefined")
            return false;
    }
    return true;
}

function logout() {
    $.session.clear();
    window.location.href = "mood.html";
}

function login() {
    window.location.href = "login.html";
}

function acceptInvite(username_from, username_to)
{

    $("#username_from").val(username_from);
    $("#username_to").val(username_to);

    document.forms["acceptInviteForm"].submit(function(e)
    {
        e.preventDefault();
    });
}

function updateUserLiveLocation(userid, lat, lng)
{

    $.post("http://vast-scrubland-7419.herokuapp.com/credentialService/updateLiveLocation",
    {
        userID:userid,
        latitude:lat,
        longitude:lng
    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}