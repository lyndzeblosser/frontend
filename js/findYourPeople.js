$(document).ready(function () 
                {

                    $('.flexslider').flexslider(
                                        {
                                            animation: "slide",
                                            controlNav: "thumbnails"  
                                        });
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    console.log(parameter);
                    console.log("getParameterByName: topics: " + getParameterByName('topics')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'));



                });
    
function getParameterByName(name) {
//    console.log("getParameterByName: " + name);        
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getResult(latitude, longitude, selectedTopics)
{
//    var generalInterests;
//    var professionalInterests;
    $.ajax(
        {
            
            //we will have to change the signature of this service and include tagName instead of sortId for tags because we will be increasing the number of tags in the future and to hard code the sortId with each tag in the frontend will be cumbersome.
            
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + selectedTopics,
            async: true,
            dataType: "json",
            success: function (data) 
            {
                alert("In function getResult................ data: " + data);
                for(var i=0;i<data.length;i++)
                {
                    console.log('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">' + data[i].name + '<button data-theme = "a" data-inline = "true" class=" ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all>INVITE</button><br>' + data[i].information + '</p>');
                    $('#searchResults').append('<li data-thumb="img/' + data[i].userid + '.jpeg" class="flex-active-slide" style="float: left; display: block; width: 312px;"> <img src="img/' + data[i].userid + '.jpeg" draggable="false""/><p class="flex-caption">"' + data[i].name + '"<button data-theme = "a" data-inline = "true" class=" ui-btn ui-btn-a ui-btn-inline ui-shadow ui-corner-all>INVITE</button><br>' + data[i].information + '</p>');
                }

//                for(var i=0;i<data.length;i++)
//                {
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
//                    $('#generalInterestsList').listview('refresh');
//                    $('#professionalInterestsList').listview('refresh');
//                }
                
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            }
        });
    
}