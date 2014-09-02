var imgItem = {};
var jsonImgObj = [];

$(document).ready(function () 
                {
    				
					var parameters = location.search;
                    var parameter = parameters.split("?");
                    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('userid'));
                   
                });

function fillImgDetails(data, img)
{
    var useridArrayInitial = img.split("/");
	var useridArray = useridArrayInitial[useridArrayInitial-1].split(".jpeg");
	var userid = useridArray[0];
	
	for(var i=0;i<data.length;i++)
    {
        if(data[i].userid === userid)
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
                console.log("success data-------" + data);
              
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            },
            complete: function(data)
            {
                console.log("data: " + data);
                if(data != "undefined")
                {    
                    for(var i=0;i<data.length;i++)
                    {
                        imgItem["image"] = '../img/' + data[i].userid + '.jpeg';
                        imgItem["title"] = data[i].userid;
                        
                        jsonImgObj.push(imgItem);
                        
                    }
                    
                }
				console.log("json img object: " + jsonImgObj);
				/*function to change images and toggle information about user*/
                var imgList = jsonImgObj;
				//var imgJSON = JSON.parse(imgList[0]);
				var clickCount = 0;
				
				var showInfo = document.getElementById( 'showInfo' ),
				menuBottom = document.getElementById( 'cbp-spmenu-s4' ),
				changeSlide = document.getElementById( 'changeSlide' ),
				body = $("#body");
                
                console.log("imgList[clickCount]-----" + JSON.stringify(imgList[clickCount]));
			
				var initialImg = JSON.parse(JSON.stringify(imgList[clickCount])).image.toString();
				console.log("src-----" + initialImg);
				
				/*Setting initial image*/
				body.css({"backgroundImage": "url("+initialImg+")"});
				console.log("clickCount: " + clickCount);
				console.log("image being set as background: " + initialImg);

				showInfo.onclick = function() {
					classie.toggle( this, 'active' );
					classie.toggle( menuBottom, 'cbp-spmenu-open' );
				};
				
				changeSlide.onclick = function() {
				
					console.log("length of imgJSON : " + imgList.length);
					
					if(clickCount == 0)
					{
						clickCount = 1;
					}
					if(clickCount >= imgList.length)
					{
						clickCount = 0;
					}
					
					var img = JSON.parse(JSON.stringify(imgList[clickCount])).src.toString();
					
					console.log("clickCount: " + clickCount);
					console.log("image being set as background: " + img);
					body.css({"backgroundImage": "url(" + img + ")"});
					clickCount++;
					fillImgDetails(data, img);
				};
            }
        });
    
}























//"<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + parameter + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + parameter + "</p>"