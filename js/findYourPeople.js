var imgItem = {};
var jsonImgObj = [];

$(document).ready(function () 
                {
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('userid'));
                   
                });

function fillImgDetails(data)
{
    for(var i=0;i<data.length;i++)
    {
        if(data[i].userid === api.getField("title"))
        {
            $("#name").val(data[i].name);
            $("#age").val(data[i].age);  
            $("#bio").val(data[i].bio);  
        }
    }
}

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
                console.log("data: " + data);
                if(data != "undefined")
                {    
                    for(var i=0;i<data.length;i++)
                    {
                        imgItem["image"] = 'img/' + data[i].userid + '.jpeg';
                        imgItem["title"] = data[i].userid;
                        
                        jsonImgObj.push(imgItem);
                        
                        //console.log("selected images json array: " + jsonImgObj);
                        
                    }
                    
                }
                
                
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            },
            complete: function(data)
            {
                
                $.supersized({
				
					// Functionality
					slideshow               :   1,			// Slideshow on/off
					autoplay				:	0,			// Slideshow starts playing automatically
					start_slide             :   1,			// Start slide (0 is random)
					stop_loop				:	0,			// Pauses slideshow on last slide
					random					: 	0,			// Randomize slide order (Ignores start slide)
					slide_interval          :   3000,		// Length between transitions
					transition              :   6, 			// 0-None, 1-Fade, 2-Slide Top, 3-Slide Right, 4-Slide Bottom, 5-Slide Left, 6-Carousel Right, 7-Carousel Left
					transition_speed		:	1000,		// Speed of transition
					new_window				:	1,			// Image links open in new window/tab
					pause_hover             :   0,			// Pause slideshow on hover
					keyboard_nav            :   1,			// Keyboard navigation on/off
					performance				:	1,			// 0-Normal, 1-Hybrid speed/quality, 2-Optimizes image quality, 3-Optimizes transition speed // (Only works for Firefox/IE, not Webkit)
					image_protect			:	1,			// Disables image dragging and right click with Javascript
															   
					// Size & Position						   
					min_width		        :   0,			// Min width allowed (in pixels)
					min_height		        :   0,			// Min height allowed (in pixels)
					vertical_center         :   1,			// Vertically center background
					horizontal_center       :   1,			// Horizontally center background
					fit_always				:	0,			// Image will never exceed browser width or height (Ignores min. dimensions)
					fit_portrait         	:   1,			// Portrait images will not exceed browser height
					fit_landscape			:   0,			// Landscape images will not exceed browser width
															   
					// Components							
					slide_links				:	'blank',	// Individual links for each slide (Options: false, 'num', 'name', 'blank')
					thumb_links				:	0,			// Individual thumb links for each slide
					thumbnail_navigation    :   0,			// Thumbnail navigation
					slides 					:  	jsonImgObj,
												
					// Theme Options			   
					progress_bar			:	1,			// Timer for each slide							
					mouse_scrub				:	0
					
				});
                
                fillImgDetails(data);
                
                $("#inviteButton").click(function()
                    {

                        var slideTitle = api.getField('title');
	                    console.log("slide title: " + slideTitle);
                        
                        if(selectedUsers === [])
                        {
                            selectedUsers[0] = slideTitle;   
                        }
                        else
                        {
                            selectedUsers.push(slideTitle);
                        }

                        console.log('selectedUsers: ' + selectedUsers);
                    });
                
                $("#prevslide").click(function(data)
                      {
                          var slideTitle = api.getField('title');
                          for(var i=0;i<data.length;i++)
                          {
                              if(data[i].userid === slideTitle)
                              {
                                $("#name").val(data[i].name);
                                $("#age").val(data[i].age);  
                                $("#bio").val(data[i].bio);  
                              }
                          }
                      });
                
                $("#nextslide").click(function(data)
                      {
                          var slideTitle = api.getField('title');
                          for(var i=0;i<data.length;i++)
                          {
                              if(data[i].userid === slideTitle)
                              {
                                $("#name").val(data[i].name);
                                $("#age").val(data[i].age);  
                                $("#bio").val(data[i].bio);  
                              }
                          }
                      });
            }
        });
    
}























//"<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + parameter + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + parameter + "</p>"