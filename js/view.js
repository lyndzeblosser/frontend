var table,tags=[],userid,inviteUsers=[],users=[];
$(document).ready(function()
{
//    userid=$.session.get('userHash')
    $("#InvitesSentId").hide();

    userid = getParameterByName('user_from');

    getTableData(getParameterByName('tableid'))
    getTags();
    getResult();
    loggedInLoggedOutBehavior();
    autoCompleteLocation();
   // $("#main").html(prepareTablesDiv())

});

function getUserData() {
    var userIDs=[];
    console.log(table);
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
                        {console.log(table['user_to_'+(i+1)+'_status'],table['user_to_'+j+'_status']!=="Pending")
                            users[i]["status"]=table['user_to_'+(i+1)+'_status']==="Accepted"?"images/mycheck.png":"images/mycross.png"}
                        else
                          users[i]["status"]="";
                      
                      if(users[i]["status"]=="images/mycheck.png")
                      document.getElementById("inviteTimePicker").disabled = true; ;
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
            alert ("Table updated!");
//            $.mobile.changePage( "preConversationLinks.html", { role: "dialog" , transition:"slideup" });
//            sendToMoodPage(); 
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
        table_message:$('#table_message').val()

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
    window.location.href = "myTablesToBeConfirmed.html";
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
        console.log(currentLat, currentLng);
        console.log(place.formatted_address);

        $("#address").attr("value",place.formatted_address);
    });
}