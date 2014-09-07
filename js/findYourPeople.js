
var jsonImgObj = [];

$(document).ready(function () 
                {
    				
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
                    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('selectedTime'));
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
// this function returns radius to show to user in bottom bar
function getRadius(miles)
{
    //    console.log("getParameterByName: " + name);        
    if (miles === '402') {
        radius = 5;
    }
    else if (miles === '805') {
        radius = 10;
    }
    else if (miles === '1610') {
        radius = 20;
    }
    else if (miles === '80467') {
        radius = 1000;
    }
    return radius;
}

function getResult(latitude, longitude, selectedTopics, radius, activity, selectedTime)
{
    var selectedUsers = [];
    var selectedUserNames = [];


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
                        imgItem["userName"] = JSON.parse(JSON.stringify(data[i])).firstname.toString();

                        
                        jsonImgObj.push(imgItem);
                    }
                    console.log("json img object: " + jsonImgObj);
                    /*function to change images and toggle information about user*/
                    var imgList = jsonImgObj;
                    var clickCount = 0;
                    console.log("img list: " + imgList);
                    
                    var AddPeople = document.getElementById( 'AddPeople' ),
                    menuBottom = document.getElementById( 'cbp-spmenu-s4' ),
                    MoveOnButton = document.getElementById( 'changeSlide' ),
                    body = $("#ImageDiv");
                    var initialImg = JSON.parse(JSON.stringify(imgList[clickCount])).image.toString();
                    console.log("src-----" + initialImg);

                    /*Setting initial image*/
                    body.css({"backgroundImage": "url("+initialImg+")"});
                    console.log("clickCount: " + clickCount);
                    console.log("image being set as background: " + initialImg);
                    fillImgDetails(data, initialImg);

                    AddPeople.onclick = function() {
                        classie.toggle( this, 'active' );
                        classie.toggle( menuBottom, 'cbp-spmenu-open' );
                        console.log("clickCount on addpeople: " + clickCount);

  //                      $("#AddButtonImgId").attr("src", "img/MoveOnIcon.png");
                        if(selectedUsers === [])
                        {
                            selectedUsers[0] = JSON.parse(JSON.stringify(imgList[clickCount])).title.toString();
                            selectedUserNames[0] = JSON.parse(JSON.stringify(imgList[clickCount])).userName.toString();   

                        }
                        else
                        {
                            selectedUsers.push(JSON.parse(JSON.stringify(imgList[clickCount])).title.toString());
                            selectedUserNames.push(JSON.parse(JSON.stringify(imgList[clickCount])).userName.toString());

                        }

                        console.log('selectedUsers: ' + selectedUsers);
                        console.log('selectedUserNames: ' + selectedUserNames);
                        console.log('selectedTime: ' + selectedTime);


                    };

                    MoveOnButton.onclick = function() {

                        console.log("length of imgJSON : " + imgList.length);
                        console.log("clickCount on moveon--------" + clickCount);

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
                    
                    confirmInvitation.onclick = function() {
                        console.log('confirmInvitation clicked ');
                        window.location.href = "confirmInvitations.html?latitude="+ latitude +"&longitude=" + longitude  + "&activity=" + activity + "&selectedUsers=" + selectedUsers + "&selectedUserNames=" + selectedUserNames + "&commonTags=FIFA,STARTUPS" + "&inviteTime=" + selectedTime;

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