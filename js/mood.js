var autoComplete,currentLat,currentLng;

$(document).ready(function(){
    preloadIrrepectiveOfLoggedInOut();
    loggedInLoggedOutBehavior();
    


})


function preloadIrrepectiveOfLoggedInOut(){
    activitiesImages();
    getTopics();
    autoCompleteLocation();
  
    
    
}

function activitiesImages(){
    $(".activitiesImages").click(function(){
        if(this.getAttribute("selected")==0){
            $(".activitiesImages").each(function(){
                this.setAttribute("selected",0);
                this.firstChild.setAttribute("src","images/"+this.getAttribute("activity")+"invert.png")
                $(this).css("background","#ffffff")
            })
            this.firstChild.setAttribute("src","images/"+this.getAttribute("activity")+".png") 
            $(this).css("background","#cc0000")
            this.setAttribute("selected", 1)
        }else{
            this.setAttribute("selected",0);
            this.firstChild.setAttribute("src","images/"+this.getAttribute("activity")+"invert.png")
            $(this).css("background","#ffffff")
        }
        
        
    })
}

function getTopics()
{
    $.ajax({
        url: "http://evening-thicket-5124.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json",
        success: function (data){
            for(var i=0;i<data.length;i++){
                $("#topicsList").append("<label id=\"tag"+data[i]["tagId"]+"label\" style=\"background-color:#cc0000; color:#ffffff;\">"+data[i]["tagName"]+"<input id=\"tag"+data[i]["tagId"]+"\" value=\""+data[i]["tagId"]+"\"  type=\"checkbox\"></label>");
            }
        }
    });

}

function changeTimeHeading(value,text){
       
    $("#timeText>a").text(text)
    $("#timeText").attr("value",value)
    
}

function changeWhereHeading(value,text){
       
    $("#whereText>a").text(text)
    $("#whereText").attr("value",value)
    
}

function autoCompleteLocation(){
    autoComplete = new google.maps.places.Autocomplete($("#address")[0], {});
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position){
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            $("#address").attr("placeholder", "Value set to your current location")
        })
    }
    
    google.maps.event.addListener(autoComplete, 'place_changed', function()
    {
        var place = autoComplete.getPlace();
        currentLat = place.geometry.location.lat();
        currentLng = place.geometry.location.lng();
        console.log(currentLat, currentLng)
    });
}

function findMyPeople(){
    var urlParams=getUrlParams();
    
    if(urlParams!=null){
        if(!isLoggedIn){
            $("#findppl").css("display","none");
            $("#loginBtn").css("display","");
        }else{
            var url = "findYourPeople.html?"+urlParams;
            window.location.href = url;
        }
    }
}

function getUrlParams(){
    var url="";
    
    if(typeof $(".activitiesImages[selected=\"1\"]").attr("activity")=="undefined"){
        alert("No actvity selected")
        return null;
    }else{
        url+="activity="+$(".activitiesImages[selected=\"1\"]").attr("activity")
    }
    
    if($("input[data-cacheval=\"false\"]").length==0){
        alert("No topics selected")
        return null;
    }else{
        var topics=[]
        $("input[data-cacheval=\"false\"]").each(function(){
            topics.push(this.value)
        })
        url+="&topics="+topics.join();
    }
    
    if($("#timeText").attr("value")==""){
        alert("No time selected")
        return null;
    }else{       
        url+="&time="+$("#timeText").attr("value");
    }
    
    if($("#whereText").attr("value")==""){
        alert("No radius selected")
        return null;
    }else{       
        url+="&radius="+$("#whereText").attr("value");
    }
    
    if(typeof currentLat=="undefined" || typeof currentLng=="undefined"){
        alert("No current location selected")
        return null;
    }else{
        url+="&latitude="+currentLat+"&longitude="+currentLng
    }
    
    if(isLoggedIn){
        url+="&userid="+userId
    }
    
    return url;
}

function signIn(){
    var urlParams=getUrlParams();
    var url = "login.html?"+urlParams;
    window.location.href = url;
   
}

function register(){
    var urlParams=getUrlParams();
    var url = "register.html?"+urlParams;
    window.location.href = url; 
}

