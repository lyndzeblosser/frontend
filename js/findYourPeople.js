$(document).ready(function () 
                {

                    
                    
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                                        alert(parameter);
                    console.log("getParameterByName: topics: " + getParameterByName('topics')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('activity'));
                    
                    $('.flexslider').flexslider();


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

function getResult(latitude, longitude, selectedTopics, activity)
{
    var generalInterests;
    var professionalInterests;
    $.ajax(
        {
            
            //we will have to change the signature of this service and include tagName instead of sortId for tags because we will be increasing the number of tags in the future and to hard code the sortId with each tag in the frontend will be cumbersome.
            
            
            //searchLat=41.8781136&searchLng=-87.62979819999998
            //http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + selectedTopics
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + selectedTopics,
            async: true,
            dataType: "json",
            success: function (data) 
            {
                alert(this.url);
                for(var i=0;i<data.length;i++)
                {
                    
                    $('#searchResults').append("<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + data[i].userId + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + data[i].userInfo + "</p>").trigger('create');
                    
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

//                $("#searchResults").addClass("slides");
//                $("p[name^='sliderCaption']").addClass('flex-caption');
                
                
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            }
        });
    
}

























//"<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + parameter + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + parameter + "</p>"