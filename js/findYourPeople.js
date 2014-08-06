$(document).ready(function () 
                {
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'));
                   
                


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

function getResult(latitude, longitude, selectedTopics, radius)
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
                for(var i=0;i<data.length;i++)
                {
                        console.log('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].name + '<button data-theme = "a" data-inline = "true" class=" ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all>INVITE</button><br>' + data[i].information + '</p>');
 -                    $('#searchResults').append('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].name + ' <button id = "user' + i + '" data-theme = "a" data-inline = "true" class="ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all" value='+ i +'>INVITE</button><br>' + data[i].information + '</p>');

                    
//                    //Populating the users interests in the left panel
//                    if(data[i].userid === "vaibhav")
//                    {
//                        generalInterests = data[i].general_interests.toString().split(",");
//                        for(var j=0; j<generalInterests.length; j++)
//                        {
//                            $('#generalInterestsList').append('<li><a href="#">'+ generalInterests[j] + '</a></li>').trigger('create');
//                        }
//                        
//                        professionalInterests = data[i].professional_interests.toString().split(",");
//                        console.log("professional Interests" + professionalInterests);
//                        for(var k=0; k<professionalInterests.length; k++)
//                        {
//                            $('#professionalInterestsList').append('<li><a href="#">'+ professionalInterests[k] + '</a></li>').trigger('create');
//                        }
//                    }
//                    $("#searchResults").addClass("slides");
//                    $("p[name^='sliderCaption']").addClass('flex-caption');
                    
//                    $('#generalInterestsList').listview('refresh');
//                    $('#professionalInterestsList').listview('refresh');
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
                    $(this).addClass('ui-disabled');	
                  });

//                $("#searchResults").addClass("slides");
//                $("p[name^='sliderCaption']").addClass('flex-caption');
                
                
            },
            error: function (error, message) 
            {
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