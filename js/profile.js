var isLoggedIn,userId;
$(document).ready(function(){
    loggedInLoggedOutBehavior();
    var parameters = location.search;
    var parameter = parameters.split("?");
    console.log(parameter);
    console.log(getParameterByName('userId'));
    userId=getParameterByName('userId');
    isLoggedIn=typeof $.session.get('userHash')!="undefined";
//    userId=$.session.get('userHash');
    autoCompleteLocation();
    getUserProfile ();
  
//    var $loading = $('#loadingDiv').hide();
/*$(document)
  .ajaxStart(function () {
  //  $loading.show();
    $.mobile.loading( 'show');
  })
  .ajaxStop(function () {
  //  $loading.hide();
    $.mobile.loading( "hide" );
  });
  
$(document).on( "click", ".show-page-loading-msg", function() {
  var $this = $( this ),
    html = $this.jqmData( "html" ) || "";
$.mobile.loading( 'show', {
  html: html
  });
})
.on( "click", ".hide-page-loading-msg", function() {
  $.mobile.loading( "hide" );
}); */
  
  
});

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function updateUserProfile (){
    if(document.getElementById("LeftPanelChangePassword").value == "")
    {
        console.log("Null");
    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/updateUser",
    {
        userHash:userId,
        bio:document.getElementById("LeftPanelBio").value,
        firstName:document.getElementById("LeftPanelFirstName").value,
        lastName:document.getElementById("LeftPanelLastName").value
       // password:document.getElementById("LeftPanelChangePassword").value
       
    },
    function(data,status){
        console.log("update user Profile \nStatus: " + status);
        if(status=="nocontent")
            alert("Success! Your information was successfully updated");
        else
            alert("Oops, something went wrong. Please try again.");
 
    });        
    }
    else
    {
        console.log("Not Null");
            $.post("http://ancient-falls-9049.herokuapp.com/credentialService/updateUser",
    {
        userHash:userId,
        bio:document.getElementById("LeftPanelBio").value,
        firstName:document.getElementById("LeftPanelFirstName").value,
        lastName:document.getElementById("LeftPanelLastName").value,
        password:document.getElementById("LeftPanelChangePassword").value
       
    },
    function(data,status){
        console.log("update user Profile \nStatus: " + status);
        if(status=="nocontent")
            alert("Success! Your information was successfully updated");
        else
            alert("Oops, something went wrong. Please try again.");
 
    });
    }
        

}

function getUserProfile () {
    
    console.log("http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userId)
        $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userId,
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0]
                        console.log(data)
                        document.getElementById("LeftPanelFirstName").value = data["firstname"]; 
                        document.getElementById("LeftPanelLastName").value = data["lastname"];
                        document.getElementById("LeftPanelBio").value = data["bio"];
                        document.getElementById("LeftPanelBirthday").value = data["date_of_birth"];
                        document.getElementById("LeftPanelCity").value = data["hometown"];
                      //  console.log("Password: "+document.getElementById("LeftPanelChangePassword").value);
                        console.log(data["imageMasterLocation"]);
                        $.session.set('userType', data["userType"]);
                        document.getElementById("LeftPanelProfileImage").src = data["imageMasterLocation"];
                                              
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

function autoCompleteLocation(){
    autoComplete = new google.maps.places.Autocomplete($("#LeftPanelCity")[0], {});  
    google.maps.event.addListener(autoComplete, 'place_changed', function()
    {
        var place = autoComplete.getPlace();
        currentLat = place.geometry.location.lat();
        currentLng = place.geometry.location.lng();
        console.log(currentLat, currentLng)
    });
}