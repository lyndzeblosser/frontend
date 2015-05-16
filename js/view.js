var table,tags=[],userid,inviteUsers=[],users=[],lat,long;
$(document).ready(function()
{
//    userid=$.session.get('userHash')
   
    $("#InvitesSentId").hide();
    $("#preConvoPopupButton").hide();
    userid = getParameterByName('user_from');

    getTableData(getParameterByName('tableid'))
    getTags();
    getResult();
    loggedInLoggedOutBehavior();
    autoCompleteLocation();
    getTableMessages(getParameterByName('tableid'));
   // $("#main").html(prepareTablesDiv())

});

function getUserData() {
    var userIDs=[];
    var confirmCount = 0;
    console.log(table);
    console.log();
//    if(table["table_confirmed"]=="YES")
    if(table['user_from_status']==="Confirmed") {
     confirmCount++;  
     if($.session.get('userHash') == table['user_from'])
       {
        console.log("Lock for this user");
        document.getElementById('confirmInvitesButtonId').innerHTML = "CONFIRMED!";
        document.getElementById('confirmInvitesButtonId').onclick = function(){return false};
        $("#preConvoPopupButton").show();
        document.getElementById('confirmInvitesButtonId').className="sendNoteButton";
        }

     
     
    }
    if(table['user_to_1_status']==="Confirmed") {
        confirmCount++;
    }
    if(table['user_to_2_status']==="Confirmed") {
        confirmCount++;
    }
    if(table['user_to_3_status']==="Confirmed") {
        confirmCount++;
    }
    console.log("ConfirmCount: " + confirmCount);
    if (confirmCount > 1) {
        document.getElementById("inviteTimePicker").disabled = true;
        document.getElementById("address").disabled = true;
    }
    for(var j=1;j<4;j++){
        if(table['user_to_'+j]!=null && table['user_to_'+j]!=""){
            userIDs.push(table['user_to_'+j]);
        }
    }
        console.log(userIDs.length);
    console.log("uid"+userIDs);
    
    for (var i = 0; i < userIDs.length; i++) {
        inviteUsers.push(userIDs[i])
        users[i] = [];
        console.log("http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i])
        $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i],
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0];
                        console.log("DATA - "+data);

                        users[i]["id"] = data["userid"];
                        users[i]["first_name"] = data["firstname"];
                        users[i]["last_name"] = data["lastname"];
                        users[i]["bio"] = data["bio"];
                        users[i]["image"] = data["imageMasterLocation"];
                        if(table['user_to_'+(i+1)+'_status']!=="Pending")
                        {
                          console.log(table['user_to_'+(i+1)+'_status'],table['user_to_'+j+'_status']!=="Pending")
                          users[i]["status"]=table['user_to_'+(i+1)+'_status']==="Confirmed"?"images/mycheck.png":(table['user_to_'+(i+1)+'_status']==="Accepted"?"images/unconfirmed.png":"images/mycross.png")
                        }                        
                        else
                          users[i]["status"]="";
                      if($.session.get('userHash') == userIDs[i] && table['user_to_'+(i+1)+'_status']=="Confirmed")
                      {
                          console.log("Lock for this user");
                          document.getElementById('confirmInvitesButtonId').innerHTML = "CONFIRMED!";
                          document.getElementById('confirmInvitesButtonId').onclick = function(){return false};
                          $("#preConvoPopupButton").show();
                          document.getElementById('confirmInvitesButtonId').className="sendNoteButton";

                      }
                    
                    

                    //  timepicker.get_dateInput().disable();
                    //  document.getElementById("inviteTimePicker").disabled = false;  
                      
                    },
                    error: function(error, message)
                    {
                        console.log("Failure: " + message);
                    },
                    complete: function(data)
                    {


                    }
                });
    }
}

function getTags(){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json",
        success: function(data)
        {
            for(var i=0;i<data.length;i++){
                tags[data[i]["tagId"]]=data[i]["tagName"];
            }

        },
        error: function(error, message)
        {
            console.log("Failure: " + message);
        },
        complete: function(data)
        {


        }
    });
    
}

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getTableData(tableid){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/getTable?user_from="+userid+"&tableid="+tableid,
        async: false,
        dataType: "json",
        success: function(data)
        {   console.log(data)
            table=data[0];
            console.log(data)
                      

        },
        error: function(error, message)
        {
            console.log("Failure: " + message);
        },
        complete: function(data)
        {


        }
    });
}
function getTableMessages(tableid){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/getTableMessages?tableid=" + tableid,
        async: false,
        dataType: "json",
        success: function(data)
        {
         var MessageSender;
            
         
            var html="";
            for(var i=0;i<data.length;i++){
                for(j=0;j<users.length;j++)
//             if(data[i]["user_from"] == users[j]["id"])
//         { MessageSender = users[j]["first_name"];
         console.log(data[i]);
  //              }
                html += data[i]["user_from"];
                html += " on ";
                html += data[i]["message_date"];
                html += " at ";
                html += data[i]["message_time"];
                html += " wrote : ";
                html += data[i]["message"];
                html += "\n\n";
            }
            $("#tableMessages").text(html);
        },
        error: function(error, message)
        {
            console.log("Failure: " + message);
        },
        complete: function(data)
        {


        }
    });
    
}

function getResult()
{
    $("#actpic").attr("src","images/"+table['activity']+"invert.png")
    $("#address").attr("value",table['invite_location'])
    $("#dateString").html(table['invite_date'])
    getUserData();
    if (table['invite_time'] != null) {
        $("#inviteTimePicker").attr("value",table['invite_time'].slice(0,table['invite_time'].indexOf(":00 "))+" "+table['invite_time'].slice(table['invite_time'].indexOf(":00 ")+4))
    }
    prepareTagsDiv(table['matching_tags'])
    var noEmptyDivs = 3 - users.length;
    var userDivDataTop = "";
    var userDivDataBottom = "";
    var count = 0, letter = '';

for (i = 0; i < users.length; i++) {
        console.log("users length: " + users.length)
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataTop += prepareUserDivTop(i, letter)
    }
 /*   for (var i = 0; i < noEmptyDivs; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataTop += prepareEmptyDivTop(letter);
    }
   */ 

    count = 0;
for (i = 0; i < users.length; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataBottom += prepareUserDivBottom(i, letter)
    }
    /*for (i = 0; i < noEmptyDivs; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataBottom += prepareEmptyDivBottom(letter);
    }*/
    

    $("#userTop").html(userDivDataTop)
    $("#confirmImg").html(userDivDataBottom)
   autoCompleteLocation();
   var currentAddreess = $('#address').val();
   console.log("test123 "+currentAddreess);
   lat="42.345573";
   long="-71.098326";
   
   
  
   
        var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': currentAddreess }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    lat = results[0].geometry.location.lat();
                    long = results[0].geometry.location.lng();
                     currentAddreess = lat +"," +long;
     $('#map_canvas').gmap({'center': currentAddreess})
$('#map_canvas').gmap('option', 'zoom', 15);
$('#map_canvas').gmap('addMarker', {'position': currentAddreess }).click(function() {
    //$('#map_canvas').gmap('openInfoWindow', {'content': 'Hello World!'}, this);
});
     
                } else {
                    alert("Request failed.")
                }
            });

   console.log(users);

   
}


function prepareEmptyDivTop(letter) {
    return "<div class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:95px; border:none;\"></div></div>"

}

function prepareEmptyDivBottom(letter) {
    return "<div class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"\" class=\"imagesize\"></div></div>"

}

function prepareUserDivTop(userID, letter) {
    return "<div id=\"top-block-" + letter + "\" class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:95px; background-color:transparent; border:none; color:#ffffff; text-shadow:none;\">" + users[userID]["first_name"] + "</div></div>"
}

function prepareUserDivBottom(userID, letter) {
    return " <div id=\"bottom-block-" + letter + "\" class=\"ui-block-"+letter+"\"><div class=\"ui-bar ui-bar-a\" id=\"confirmprofileImg\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\""+users[userID]["image"]+"\"  class=\"imagesize\"><img class=\"close\" src=\""+users[userID]["status"]+"\" onclick=\"removeUser(\'"+users[userID]["id"]+"\',\'"+letter+"\')\" /></div></div>"
    
    //return " <div id=\"bottom-block-" + letter + "\" class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"" + users[userID]["image"] + "\"  class=\"imagesize\"><img class=\"close\" src=\"images/smallcloseicon.png\" onclick=\"removeUser(\'"+users[userID]["id"]+"\',\'"+letter+"\')\" /></div></div>"
}

function prepareEmptyInnerBlockTop() {
    return "<div class=\"ui-bar ui-bar-a\" style=\"height:95px; border:none;\"></div>"
}

function prepareEmptyInnerBlockBottom() {
    return "<div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"images/findpplicon.svg\" class=\"imagesize\"></div>";
}

function prepareTagsDiv(inviteTags){
    
    inviteTags=inviteTags.split(",");
    var html="";
    var lableSize = (screen.width/inviteTags.length)-26.5;
    console.log("tag lenght -"+inviteTags.length+"Screen width - "+lableSize);
    
    for(var i=0;i<inviteTags.length;i++){
        html+="<label style=\"background-color:#333333; text-align:center; color:#ffffff; width:"+lableSize+"px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">"+[inviteTags[i]]+"<input type=\"checkbox\"></label>";
    }
    $("#tags").html(html);
}

function getTimeData(){
   var date= $('#inviteTimePicker').timepicker('getTime',[ new Date()]);
   var time=[]
   time['date']=date.getUTCFullYear()+'-'+((date.getUTCMonth()+1)<10?'0'+(date.getUTCMonth()+1):(date.getUTCMonth()+1))+'-'+(date.getUTCDate()<10?'0'+date.getUTCDate():date.getUTCDate())
   time['time']=date.getHours()+":"+date.getMinutes()+":00"
   return time;
}

function confirmTable(){
    var time=getTimeData();
//    console.log("length = "+$('#whereText').attr("value").length);
//    if($('#whereText').attr("value").length < 1)
//    {
//        alert("Please selecte from the various Table Tribes Zone Areas to meet!");
//        return false;
//    }
    $("#confirmInvitesButtonId").hide();
    $("#InvitesSentId").show();
        $.post("http://ancient-falls-9049.herokuapp.com/credentialService/confirmTable",
    {
        user_from:$.session.get('userHash'),
        user_to_1:typeof users[0]=="undefined"?"":users[0]['id'],
        user_to_2:typeof users[1]=="undefined"?"":users[1]['id'],
        user_to_3:typeof users[2]=="undefined"?"":users[2]['id'],
        tableid:getParameterByName('tableid'),
        invite_date:time['date'],
        invite_time:time['time'],
//        matching_tags:getParameterByName('commonTags'),
        invite_location:$('#address').attr("value")

    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success") {
           
            document.getElementById("InvitesSentId").innerHTML="CONFIRMED";
            
//             $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
//                window.location.href = "mood.html";
//                alert ("Table updated!");
        $( "#preConversationPopup" ).popup( "open" );
        }
        else {
            alert(data);
            sendToMoodPage();
        }
    });
    $("#confirmInvitesButtonId").hide();
    $("#InvitesSentId").show();
}

function sendTableMessage() {
    var time=getTimeData();
//    console.log("length = "+$('#whereText').attr("value").length);
//    if($('#whereText').attr("value").length < 1)
//    {
//        alert("Please selecte from the various Table Tribes Zone Areas to meet!");
//        return false;
//    }
    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/sendTableMessage",
    {
        user_from:$.session.get('userHash'),
        user_to_1:typeof users[0]=="undefined"?"":users[0]['id'],
        user_to_2:typeof users[1]=="undefined"?"":users[1]['id'],
        user_to_3:typeof users[2]=="undefined"?"":users[2]['id'],
        tableid:getParameterByName('tableid'),
        invite_date:time['date'],
        invite_time:time['time'],
//        matching_tags:getParameterByName('commonTags'),
        invite_location:$('#address').attr("value"),
        table_message:$('#table_message').val(),
        message_date:getDate(),
        message_time:getTime()
    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
        if(status  == "success") {
            alert ("Message Sent!");
//            $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
//            sendToMoodPage();
        }
        else {
            alert(data);
            sendToMoodPage();
        }
    });
}

function sendToMoodPage()
{
    //window.location.href = "mood.html";
//    window.location.href = "myTablesToBeConfirmed.html";
    $( "#preConversationPopup" ).popup( "close" );
}

function getDate() {
    var now     = new Date(); 
    var year    = now.getFullYear();
    var month   = now.getMonth()+1; 
    var day     = now.getDate();
    
    if(month.toString().length == 1) {
        var month = '0'+month;
    }
    if(day.toString().length == 1) {
        var day = '0'+day;
    }   
    
    var dateTime = year+'-'+month+'-'+day;   
     return dateTime;
}


function getTime() {
    var now     = new Date(); 
   
    var hour    = now.getHours();
    var minute  = now.getMinutes();
    var second  = now.getSeconds();

    if(hour.toString().length == 1) {
        var hour = '0'+hour;
    }
    if(minute.toString().length == 1) {
        var minute = '0'+minute;
    }
    if(second.toString().length == 1) {
        var second = '0'+second;
    }   
    var dateTime = hour+':'+minute+':'+second;   
     return dateTime;
}

function showPreConvPopup()
{
//    document.getElementById('preConvoText').innerHTML = "What does progress mean to me? What kind of awareness helps me broaden my perspective about my place in the world?";
    var randomId = Math.floor((Math.random() * 10)); 
    randomId = randomId % 8;
        
    var randomLink=new Array(2)
for (i=0; i <8; i++)
    randomLink[i]=new Array(2)
 //   var randomLinkTopic = [];
    
    randomLink[0][0] = "Why saying is believing the science of self talk?"; 
    randomLink[0][1] = "http://www.npr.org/blogs/health/2014/10/07/353292408/why-saying-is-believing-the-science-of-self-talk"; 

    randomLink[1][0] = "Can a computer change the essence of who you are?"; 
    randomLink[1][1] = "http://www.npr.org/blogs/health/2015/02/13/385205570/can-a-computer-change-the-essence-of-who-you-are";

    randomLink[2][0] = "Maybe isolation and not loneliness shortens life"; 
    randomLink[2][1] = "http://www.npr.org/blogs/health/2013/03/26/175283008/maybe-isolation-not-loneliness-shortens-life";

    randomLink[3][0] = "Society's fear of black men and it's consequences"; 
    randomLink[3][1] = "http://www.npr.org/2015/03/31/396415737/societys-fear-of-black-men-and-its-consequences";

    randomLink[4][0] = "Is conflict good for progress?"; 
    randomLink[4][1] = "http://www.npr.org/2013/08/23/174037793/is-conflict-good-for-progress";

    randomLink[5][0] = "Uncomfortable Conversations: Talking About Race In The Classroom"; 
    randomLink[5][1] = "http://www.npr.org/blogs/ed/2015/04/24/401214280/uncomfortable-conversations-talking-about-race-in-the-classroom";

    randomLink[6][0] = "'Sliver Of Hope' In Freddie Gray Case, Former Baltimore Police Chief Says"; 
    randomLink[6][1] = "http://www.npr.org/blogs/thetwo-way/2015/04/22/401436003/former-baltimore-police-head-sees-sliver-of-hope-in-freddie-gray-case";

    randomLink[7][0] = "In San Jose, The Public Has An Eye On Police Conduct"; 
    randomLink[7][1] = "http://www.npr.org/2015/04/26/402353848/in-san-jose-the-public-has-an-eye-on-police-conduct";


   document.getElementById("preConvoLink1").innerHTML=randomLink[randomId][0];
   document.getElementById("preConvoLink1").href=randomLink[randomId][1];
   
    randomId = randomId % 7;

    randomLink[0][0] = "When life overwhelms this group lends a healthy hand"; 
    randomLink[0][1] = "http://www.npr.org/blogs/health/2015/03/12/391872813/when-life-overwhelms-this-group-lends-a-healthy-hand"; 

    randomLink[1][0] = "Gentrification progress or destruction?"; 
    randomLink[1][1] = "http://www.npr.org/2014/03/13/289798823/gentrification-progress-or-destruction";

    randomLink[2][0] = "First book gets reading material into the hands of low income students"; 
    randomLink[2][1] = "http://www.npr.org/2014/12/29/373729964/first-book-gets-reading-material-into-the-hands-of-low-income-students";

    randomLink[3][0] = "DC's mayor for life ends his reign"; 
    randomLink[3][1] = "http://www.npr.org/2014/11/24/366259632/d-c-s-mayor-for-life-ends-his-reign-marion-barry-dies-at-78";

    randomLink[4][0] = "Gentrification May Actually Be Boon To Longtime Residents"; 
    randomLink[4][1] = "http://www.npr.org/2014/01/22/264528139/long-a-dirty-word-gentrification-may-be-losing-its-stigma";

    randomLink[5][0] = "Addiction Battled Ambition For Reporter Caught In D.C.'s Crack Epidemic"; 
    randomLink[5][1] = "http://www.npr.org/2014/07/03/327824529/addiction-battled-ambition-for-reporter-caught-in-d-c-s-crack-epidemic";

    randomLink[6][0] = "What Does Martin Luther King Jr.'s Legacy Look Like To A 5-Year-Old?"; 
    randomLink[6][1] = "http://www.npr.org/2015/01/19/377794772/what-does-martin-luther-kings-legacy-look-like-to-a-5-year-old";

   
   document.getElementById("preConvoLink2").innerHTML=randomLink[randomId][0];
   document.getElementById("preConvoLink2").href=randomLink[randomId][1];

    randomLink[0][0] = "Homeless man encourages others on the streets to get up"; 
    randomLink[0][1] = "http://www.npr.org/2015/01/28/377473153/homeless-man-encourages-others-on-the-streets-to-get-up"; 

    randomLink[1][0] = "In Berlin, Grassroots Efforts Work To Integrate Inner-City Schools"; 
    randomLink[1][1] = "http://www.npr.org/blogs/parallels/2015/03/05/390753243/in-berlin-integration-is-child-s-play";

    randomLink[2][0] = "A Texas Community Takes On Racial Tensions Once Hidden Under The Surface"; 
    randomLink[2][1] = "http://www.npr.org/2015/02/13/385495327/a-community-takes-on-racial-tensions-once-hidden-under-the-surface";

    randomLink[3][0] = "From Skid Row To Rome: The Story Of An Unusual Running Club"; 
    randomLink[3][1] = "http://www.npr.org/2015/03/20/394035236/from-skid-row-to-rome-the-story-of-an-unusual-running-club";

    randomLink[4][0] = "New Orleans Educator Dreams Of Teaching Tech To Beat The Streets"; 
    randomLink[4][1] = "http://www.npr.org/2015/04/07/397044111/new-orleans-educator-dreams-of-teaching-tech-to-beat-the-streets";
   
    randomLink[5][0] = "Ferguson Activists Hope That Momentum Sparks A National Movement"; 
    randomLink[5][1] = "http://www.npr.org/2015/04/06/396780902/ferguson-activists-hope-that-momentum-sparks-a-national-movement";

    randomLink[6][0] = "For Students In Ohio, A Crib Sheet For Interacting With Police"; 
    randomLink[6][1] = "http://www.npr.org/2015/02/20/387535400/for-students-in-ohio-a-crib-sheet-for-interacting-with-police";
   
      
   document.getElementById("preConvoLink3").innerHTML=randomLink[randomId][0];
   document.getElementById("preConvoLink3").href=randomLink[randomId][1];
   console.log("random id "+randomId);
   
    $( "#preConversationPopup" ).popup( "open" );
}
function autoCompleteLocation(){
    autoComplete = new google.maps.places.Autocomplete($("#address")[0], {});
//    if (navigator.geolocation)
//    {
//        navigator.geolocation.getCurrentPosition(function(position){
//            currentLat = position.coords.latitude;
//            currentLng = position.coords.longitude;
//            $("#address").attr("placeholder", "Value set to your current location")
//            if (typeof $.session.get('userHash') != "undefined")
//            {
//                console.log("Update live location for user:" + $.session.get('userHash'));
//                updateUserLiveLocation($.session.get('userHash'), currentLat, currentLng);
//            }
//        })
//    }
    
    google.maps.event.addListener(autoComplete, 'place_changed', function()
    {
        var place = autoComplete.getPlace();
        currentLat = place.geometry.location.lat();
        currentLng = place.geometry.location.lng();
        lat=currentLat;
        long=currentLng;
        console.log("finally "+lat, long);
        console.log(place.formatted_address);

        $("#address").attr("value",place.formatted_address);
    });
}