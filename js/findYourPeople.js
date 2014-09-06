
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
	var useridArray = useridArrayInitial[useridArrayInitial.length - 1].split(".jpeg");
	var userid = useridArray[0];
    
    console.log("userid from img---------" + userid);
	
    for(var i=0;i<data.length;i++)
    {
        if(JSON.parse(JSON.stringify(data[i])).userid.toString() == userid)
        {   
            //JSON.parse(JSON.stringify(data[i])).firstname.toString()
            $("#name").text(JSON.parse(JSON.stringify(data[i])).firstname.toString() + " " + JSON.parse(JSON.stringify(data[i])).lastname.toString());
            $("#age").text(JSON.parse(JSON.stringify(data[i])).date_of_birth.toString());  
            $("#bio").text(JSON.parse(JSON.stringify(data[i])).bio.toString());  
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
                console.log("success data-------" + JSON.stringify(data));
                
                if(data == "undefined")
                {
                    console.log("no data found..");
                }
                
                if(data != "undefined")
                {    
                    for(var i=0;i<data.length;i++)
                    {
                        var imgItem = {};
                        imgItem["image"] = '../img/' + JSON.parse(JSON.stringify(data[i])).userid.toString() + '.jpeg';
                        imgItem["title"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                        
                        jsonImgObj.push(imgItem);
                    }
                    console.log("json img object: " + jsonImgObj);
                    /*function to change images and toggle information about user*/
                    var imgList = jsonImgObj;
                    var clickCount = 0;
                    console.log("img list: " + imgList);
                    
                    var showInfo = document.getElementById( 'showInfo' ),
                    menuBottom = document.getElementById( 'cbp-spmenu-s4' ),
                    changeSlide = document.getElementById( 'MoveOnButton' ),
                    body = $("#ImageDiv");
                    var initialImg = JSON.parse(JSON.stringify(imgList[clickCount])).image.toString();
                    console.log("src-----" + initialImg);

                    /*Setting initial image*/
                    body.css({"backgroundImage": "url("+initialImg+")"});
                    console.log("clickCount: " + clickCount);
                    console.log("image being set as background: " + initialImg);
                    fillImgDetails(data, initialImg);

                    showInfo.onclick = function() {
                        classie.toggle( this, 'active' );
                        classie.toggle( menuBottom, 'cbp-spmenu-open' );
                    };

                    changeSlide.onclick = function() {

                        console.log("length of imgJSON : " + imgList.length);
                        console.log("clickCount--------" + clickCount);

                        if(clickCount >= imgList.length)
                        {
                            clickCount = 0;
                        }

                        var img = JSON.parse(JSON.stringify(imgList[clickCount])).image.toString();

                        console.log("clickCount: " + clickCount);
                        console.log("image being set as background: " + img[clickCount]);
                        body.css({"backgroundImage": "url(" + img + ")"});
                        clickCount++;
                        fillImgDetails(data, img);
                    };
                    
                }
              
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            },
            complete: function(data)
            {
                
				
            }
        });
    
}























//"<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + parameter + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + parameter + "</p>"