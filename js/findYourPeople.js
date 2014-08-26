$(document).ready(function () 
                {
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('userid'));
                   
                });
    
function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getResult(latitude, longitude, selectedTopics, radius, activity, userid)
{
    var generalInterests;
    var professionalInterests;
    var selectedUsers = [];

    $.ajax(
        {
            
            //we will have to change the signature of this service and include tagName instead of sortId for tags because we will be increasing the number of tags in the future and to hard code the sortId with each tag in the frontend will be cumbersome.
            
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + selectedTopics + "&radius=" + radius,
            async: true,
            dataType: "json",
            success: function (data) 
            {
                if(data != "undefined")
                {    
                    for(var i=0;i<data.length;i++)
                    {
                            console.log('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].firstname + '<button data-theme = "a" data-inline = "true" class=" ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all>INVITE</button><br>' + data[i].bio + '</p>');
     -                    $('#searchResults').append('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].firstname + ' <button id = "user' + i + '" data-theme = "a" data-inline = "true" class="ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all" value='+ data[i].userid +'> + </button><br>' + data[i].bio + '</p>');

                    }
                    $("button[id^='user']").click(function()
                    {

                        if(selectedUsers === [])
                        {
                            selectedUsers[0] = $(this).val();   
                        }
                        else
                        {
                            selectedUsers.push($(this).val());
                        }

                        console.log('selectedUsers: ' + selectedUsers);
                        $("#sendInvitesButton").removeClass('ui-disabled');

                        $(this).addClass('ui-disabled');	
                      });

                     $("#sendInvitesButton").click(function()
                     {
                         window.location.href = "confirmInvitations.html?latitude="+ latitude +"&longitude=" + longitude  + "&activity=" + activity + "&selectedUsers=" + selectedUsers + "&loggedInUserId=" + userid;
                     });
    //                $("#searchResults").addClass("slides");
    //                $("p[name^='sliderCaption']").addClass('flex-caption');
                }
                $("#sendInvitesButton").addClass('ui-disabled');
                $("#main").append('<i class="fa fa-quote-left fa-3x pull-left fa-border">Sorry, no one found. Please search again!</i><br>');
                $("#main").append('<br><br><br><br><i id="backToMood" class="fa fa-2x fa-long-arrow-left">Go Back</i>');
                
                $("backToMood").css("color", "red");
                $("#backToMood").click(function()
                                       {
                                           window.location.href="mood.html";
                                       });
            },
            error: function (error, message) 
            {
                $("#sendInvitesButton").addClass('ui-disabled');
                console.log("Failure: " + message);        
            },
            complete: function()
            {
                $('.flexslider').flexslider(
                    {
                        animation: "slide",
                        controlNav: "thumbnails"
                    });
            }
        });
    
}























//"<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + parameter + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + parameter + "</p>"