var autoComplete,currentLat,currentLng;
var sortId = [];

$(document).ready(function(){
   
    preloadIrrepectiveOfLoggedInOut();
    
    $("#loadingImage").hide();
    
    if(!(getParameterByName('loggedinuser')=="")){
        isLoggedIn=true;
        $.session.set('userHash', getParameterByName('loggedinuser'));
        
    }
    if(!(getParameterByName('deviceToken')=="")){
        $.session.set('deviceToken', getParameterByName('deviceToken'));
    }
    if(!(getParameterByName('iOSversion')=="")){
        $.session.set('iOSversion', getParameterByName('iOSversion'));
    }
        loggedInLoggedOutBehavior();

    
     if(!isLoggedIn){
        var url = "login.html?";
    window.location.href = url; 
    }
    
  
})

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

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
                this.firstChild.setAttribute("src","images/"+this.getAttribute("activity")+".svg")
                $(this).css("background","#ffffff")
            })
            this.firstChild.setAttribute("src","images/"+this.getAttribute("activity")+"select.svg") 
            $(this).css("background","#cc0000")
            this.setAttribute("selected", 1)
        }else{
            this.setAttribute("selected",0);
            this.firstChild.setAttribute("src","images/"+this.getAttribute("activity")+".svg")
            $(this).css("background","#ffffff")
        }
        
        
    })
}

function getTopics()
{
    $.ajax({
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json",
        success: function (data){
            for(var i=0;i<data.length;i++){
                $("#topicsList").append("<label id=\"tag"+data[i]["tagId"]+"label\" style=\"color:#B3AFA5;\">"+data[i]["tagName"]+"<input id=\"tag"+data[i]["tagId"]+"\" value=\""+data[i]["tagId"]+"\"  type=\"checkbox\"></label>");
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
            if (typeof $.session.get('userHash') != "undefined")
            {
                console.log("Update live location for user:" + $.session.get('userHash'));
                updateUserLiveLocation($.session.get('userHash'), currentLat, currentLng);
            }
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
             // service call to add user tags
            //           addUserTags($.session.get('userHash'), sortId);
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
    }
    else{
    if($("input[data-cacheval=\"false\"]").length>3)
    {
       alert("Sorry but only 3 topics can be selected");
        return null; 
    }
        else{
        sortId = [];
        $("input[data-cacheval=\"false\"]").each(function(){
            sortId.push(this.value)
        })
        url+="&topics="+sortId.join();
    }
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
        url+="&userid="+$.session.get('userHash')
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

function updateUserLiveLocation(userid, lat, lng)
{

    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/updateLiveLocation",
    {
        userID:userid,
        latitude:lat,
        longitude:lng
    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}

    function addUserTags(userid, tagsList)
    {
        console.log('tagsList: ' + tagsList);
        //    var tags = tagsList.split(",");
        //    console.log('tags: ' + tags);
        for (i = 0; i < tagsList.length; i++) {
            addUserTag(userid, tagsList[i]);
        }
        
    }

    function addUserTag(userid, tag)
    {
        $.post("http://ancient-falls-9049.herokuapp.com/credentialService/addUserTag",
                {
                    userid: userid,
                    tag: tag,
                },
                function(data, status) {
                    console.log("Tags Data: " + data + "\nStatus: " + status);
                    
                });
    }