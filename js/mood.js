var autoComplete,currentLat,currentLng;
var sortId = [];
var NoRepeatTTTags = [];
var redirectedFromSearchScreen = false;
var topicCount=1;
var topicsFromURL =[];
var radiusId, radiusValue, loadInitialLocation;
var nativeLocationSet = false;

$(document).ready(function(){
   if(getParameterByName('redirectedFromSearchScreen') === "Yes")
   {
       redirectedFromSearchScreen = true;
       topicCount=getTopicCount(getParameterByName('topics'));
    getTagsFromURL(getParameterByName('topics'));
    loadInitialLocation = true;
    }
    preloadIrrepectiveOfLoggedInOut();
//    google.maps.event.addDomListener(window, 'load', initialize);

    if(redirectedFromSearchScreen === true)
    {
    var radius = getParameterByName('radius');
    var radiusText ;
    if(radius == 10)
    {   radiusValue = 10; 
        radiusText= 'NEIGHBORHOOD < 1/2 MILE'; 
        radiusId= "#radius1";
    }
    else if(radius == 100)
    {   radiusValue = 100; 
        radiusText= 'EXPLORE A LITTLE < 5 MILES'; 
        radiusId= "#radius2";
    }    else
    {   radiusValue = 300; 
        radiusText= 'FLEXIBLE < 15 MILES'; 
        radiusId= "#radius3";
    }
        
      changeWhereHeading(radiusValue,radiusText);
      $(radiusId).attr("style","background-color:#424A49;");
      $("#whereText").text(radiusText);
      
       for(var i=0; i<5;i++)
    $( "input[type='checkbox']" ).prop( "checked", function( i, val ) {
        if (i<topicCount)
        { $(this).attr("data-cacheval", false);
        return !val;
    }
});
    } 
      
    
     
   
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
        var url = "initial.html?";
    window.location.href = url; 
    }
    
       
    $('#topicsForm :checkbox').click(function() {
        if (checkUserTagsCap()) {
     $(this).prop('checked', false);
    };
    });
   

})


function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getTopicCount(topic)
{
     var count = topic.split(",");
     return count.length;
    }

function getTagsFromURL(topic)
{var sub;
    for(i=1;i<topicCount;i++)
    {
       sub = topic.split(',')[0];
        topicsFromURL.push(sub); 
        topic = topic.slice(sub.length+1);
   }
   topicsFromURL.push(topic); 
  
}

function preloadIrrepectiveOfLoggedInOut(){
    activitiesImages();
    getTopics();
    autoCompleteLocation();
  
}

function activitiesImages(){
    $(".activitiesImages").click(function(){
alert("Sorry only Coffee is available right now - We are working on expanding it :)");
/*
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
        
   */     
    })
}
//    
//function prepareNotificationDiv(userPanelNotification) {
//    
//    var ul = document.getElementById("rightpanellist");
//    var li = document.createElement("li");
//    li.appendChild(document.createTextNode(userPanelNotification['message']));
//    li.setAttribute("notification_id",userPanelNotification['notification_id']);
//    ul.appendChild(li); 
//
//
//}    
function getTopics()
{
/*    $.ajax({
        url: "login/getTrends.php",
        async: false,
        dataType: "json",
        success: function (trends){
            data = trends[0]["trends"];
            for(var i=0;i<2;i++){
                $("#topicsList").append("<label id=\"tag"+i+"label\" style=\"color:#B3AFA5;\">"+data[i]["name"]+"<input id=\"tag"+i+"\" value=\""+$('<div/>').text(data[i]["name"]).html()+"\"  type=\"checkbox\"></label>");
            }
          
        }
    });
*/
  var TTtags = ["Participation","Progress","Protest","Commitment","Justice","Tolerance","Urban Planning","Education","Economics","Family"];
            
            var TTtagdId = Math.floor((Math.random() * 10));
            var k=0;
//                TTtagdId = TTtagdId % 6;
            if(getParameterByName('redirectedFromSearchScreen') === "Yes")            
            {
             for(var i=0; i<10;i++)
                for(var j=0; j<topicCount;j++) 
                if(TTtags[i]===topicsFromURL[j])
                {
                   NoRepeatTTTags[k]=i;
                   k++;
                }
           }
            else NoRepeatTTTags [0]=TTtagdId;
            console.log()    
                
                
                
            for(var i=topicCount; i<5;i++)
                {   
                NoRepeatTTTags [i] = Math.floor((Math.random() * 10));
//                NoRepeatTTTags [i] =NoRepeatTTTags [i]%6;
                  for(var j=0;j<i; j++)
                    if(NoRepeatTTTags [i] == NoRepeatTTTags[j])
                {
                NoRepeatTTTags[i] = Math.floor((Math.random() * 10));
 //               NoRepeatTTTags[i] = NoRepeatTTTags[i]%6;
                    j=0;
                }}
              
            for(var i=0;i<5;i++){
                  console.log(NoRepeatTTTags[i]);
                $("#topicsList").append("<label id=\"tag"+i+"label\" style=\"color:#B3AFA5;\">"+TTtags[NoRepeatTTTags[i]]+"<input id=\"tag"+i+"\" value=\""+$('<div/>').text(TTtags[NoRepeatTTTags[i]]).html()+"\"  type=\"checkbox\"></label>");
            }


}

function changeTimeHeading(value,text){
       
    $("#timeText>a").text(text)
    $("#timeText").attr("value",value)
    
}

function changeWhereHeading(value,text){
       
    $("#whereText>a").text(text);
    $("#whereText").attr("value",value);
    if(value !==radiusValue)
    $(radiusId).attr("style","background-color:#999;");
    else
    $(radiusId).attr("style","background-color:#424A49;");
    
}

function checkUserTagsCap () {
    if(($('input[type=checkbox]:checked').length > 3))
    {
       alert("Sorry but only 3 topics can be selected");
        return true; 
    }
}

function sendNativeCurrentLocation (lat, lng) {
    currentLat = lat;
    currentLng = lng;
    $("#address").attr("placeholder", "Value set to your current location");
    nativeLocationSet = true;
}

function autoCompleteLocation(){
    if(redirectedFromSearchScreen === true && loadInitialLocation === true)
    {
        $("#address").attr("placeholder", "Value set to your previous location");
        currentLat = getParameterByName('latitude');
        currentLng = getParameterByName('longitude');
        console.log(currentLat, currentLng);
        loadInitialLocation = false;
    }
    else if (nativeLocationSet === true) {
        
    }
    else
    {
    autoComplete = new google.maps.places.Autocomplete($("#address")[0], {});
    if (navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(function(position){
            currentLat = position.coords.latitude;
            currentLng = position.coords.longitude;
            $("#address").attr("placeholder", "Value set to your current location");
           initialize();
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
//            var url = "findYourPeople.html?"+urlParams;
//            window.location.href = url;
            var activity = $(".activitiesImages[selected=\"1\"]").attr("activity");
            sortId = [];
            $("input[data-cacheval=\"false\"]").each(function(){
                var tagValue = this.value;
                tagValue = tagValue.replace('#', '');
                sortId.push(tagValue);
            })
            var topics = sortId.join();
            var selectedTime = $("#timeText").attr("value");
            //            var radius = $("#whereText").attr("value");
//          setting to 0.5 mile 
            var radius = 10;
            
            getResult(currentLat, currentLng, topics, radius, activity, selectedTime);
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
//       alert("Sorry but only 3 topics can be selected");
//        return null; 
    }
        else{
        sortId = [];
        $("input[data-cacheval=\"false\"]").each(function(){
            var tagValue = this.value;
            tagValue = tagValue.replace('#', '');
            sortId.push(tagValue);
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
        console.log("update user location - Data: " + data + "\nStatus: " + status);
        
        console.log(userid+lat+lng);
        
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
function initialize() {
//  var service = new google.maps.places.AutocompleteService();
//  service.getPlacePredictions({ input: 'Starbucks' }, callback);

var currentLoc = new google.maps.LatLng(currentLat,currentLng);

  map = new google.maps.Map(document.getElementById('map'), {
      center: currentLoc,
      zoom: 15
    });

  var request = {
    location: currentLoc,
//    radius: '11265',
    name: 'Starbucks',
    rankBy: google.maps.places.RankBy.DISTANCE
  };

  service = new google.maps.places.PlacesService(map);
  service.nearbySearch(request, callback);
}

function callback(predictions, status) {
  if (status != google.maps.places.PlacesServiceStatus.OK) {
    alert(status);
    return;
  }
  var place_id = predictions[0].place_id;
  console.log('place_id: ' + place_id);
  var placesService = new google.maps.places.PlacesService($('#address').get(0));
  placesService.getDetails({ placeId: place_id }, placeDetailsCallback);
  

}

function placeDetailsCallback(placeResult, status) {
    
        var place = placeResult;
        var address = '';
//    if (place.formatted_address) {
//      address = [
//        (place.address_components[0] && place.address_components[0].short_name || ''),
//        (place.address_components[1] && place.address_components[1].short_name || ''),
//        (place.address_components[2] && place.address_components[2].short_name || '')
//      ].join(' ');
        address = place.formatted_address;
//      }
      var inviteLocation = place.name + ' ' + address;
      console.log('Invite Location set:' + inviteLocation);
      $("#sbucksAddress").val(inviteLocation);
//    $("#address").val(predictions[0].description);
}  
function getRadius(selectedLocation) 
{
//    console.log("getParameterByName: " + name);        
    radius = 5000;
   if (selectedLocation == '10') {
        radius = 805;
    }
    else if (selectedLocation == '100') {
        radius = 8050;
    }
    else if (selectedLocation == '300') {
        radius = 24150;
    }
    return radius;
}

function getResult(latitude, longitude, topics, radius, activity, selectedTime)
{
    console.log(latitude,longitude,radius,activity,selectedTime);    
    var d = new Date();
    var ud = new Date(d.getTime() + 30*60000)
    var month = d.getMonth()+1;
    var day = d.getDate();
    var h = ud.getHours();
    var m = (ud.getMinutes()<10?'0':'') + ud.getMinutes();
    var s = ud.getSeconds();

    var inviteDate = d.getFullYear() + '-' +
    ((''+month).length<2 ? '0' : '') + month + '-' +
    ((''+day).length<2 ? '0' : '') + day;
    
    inviteTime = h + ":" + m;
    
    var tz = jstz.determine();// Determines the time zone of the browser client
    var tzName = tz.name();
    var tzOffset = new Date().getTimezoneOffset();
    var senderName = $.session.get('senderName');
    $.ajax(
    {
            
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/assignTable?searchLat="
        + latitude + "&searchLng=" + longitude + "&searchTags=" + topics + "&radius="
        + getRadius(radius) + "&userid=" + $.session.get('userHash') 
        + "&userType=" + $.session.get('userType')
        + "&userName=" + senderName
        + "&search_date=" + inviteDate
        + "&search_time=" + inviteTime
        + "&search_tz=" + tzName
        + "&search_tz_offset=" + tzOffset
        + "&inviteLocation=" + $("#sbucksAddress").val(),
        async: true,
        dataType: "json",
        success: function (data) 
        {
            console.log("success data-------" + JSON.stringify(data));
            var table=data;
            window.location.href="view.html?tableid="+table['tableid']+"&user_from="+table['user_from'];
                
//            if(data.length == 0)
//            {
////                alert("Oops, we could not find anyone that matched your search criteria! Please try again later");
////                $.mobile.changePage( "login.html", { role: "dialog" , transition:"slideup", reloadPage:"true" });
//                callTimer();
//                $("#noUserFoundPopup").popup("open");
//           
//            }
        }
    });
}