var userPanelNotifications, lastTableName, imageStringHtml, isLoggedIn,userId, notficationNo, panelTable, panelUsers=[];

$(document).ready(function(){
    $(document).ajaxStart(function () {
  //  $loading.show();
    $.mobile.loading( 'show');
  })
  .ajaxStop(function () {
  //  $loading.hide();
    $.mobile.loading( "hide" );
  });
    $("#myTablesToBeConfirmed").click(function()
    {
       window.location.href = "myTablesToBeConfirmed.html";
    });
    
    $("#invites").click(function()
    {
       window.location.href = "pendingInvitations.html";
    });
    
    $("#home").click(function()
    {
       window.location.href = "mood.html";
    });
    $("#myUpcomingTables").click(function()
    {
       window.location.href = "myUpcomingTables.html";
    });
    $("#myPastTables").click(function()
    {
       window.location.href = "myPastTables.html";
    });
    $("#LeftPanelProfile").click(function()
    {
       userId=$.session.get('userHash');
       window.location.href = "profile.html?userId="+userId;
    });
    $("#LeftPanelTopicTags").click(function()
    {
 //      window.location.href = "mood.html";
    });
    $("#LeftPanelConnectMeTo").click(function()
    {
  //     window.location.href = "mood.html";
    });
    $("#LeftPanelLinkAccounts").click(function()
    {
//       window.location.href = "mood.html";
    });
//    loggedInLoggedOutBehavior();

});

//function getInvitations()
//{
//    $.ajax({
//            url: "http://ancient-falls-9049.herokuapp.com/credentialService/getPendingInvitations?userid=" + userId,
//            async: false,
//            dataType: "json",
//            success: function(data){
//                $("#inviteNo").text(data.length);
//                notficationNo=data.length;
//            }
//        });
//    
//
//
//}

function getMyTablesToBeConfirmed()
{
    $.ajax({
            url: "http://ancient-falls-9049.herokuapp.com/credentialService/getMyTablesToBeConfirmed?userid=" +userId,
            async: false,
            dataType: "json",
            success: function (data){
                 $("#tableNo").text(data.length);
                 notficationNo+=data.length;
                 
            }
        });
 


}

function getMyUpcomingTables()
{
    $.ajax({
            url: "http://ancient-falls-9049.herokuapp.com/credentialService/getMyUpcomingTables?userid=" +userId,
            async: false,
            dataType: "json",
            success: function (data){
                 $("#upComingTableNo").text(data.length)
            }
        });
 


}

function logout() {
    $.session.clear();
    window.location.href = "mood.html";
}

function login() {
    window.location.href = "login.html";
}

function loggedInLoggedOutBehavior(){
    isLoggedIn=typeof $.session.get('userHash')!="undefined";
    hasDeviceInfo=typeof $.session.get('deviceToken')!="undefined";
    console.log("hasDeviceInfo:" + hasDeviceInfo);
    if(isLoggedIn){
        $(".loggedOutFields").css("display","none")    
        userId=$.session.get('userHash');
//        getInvitations()
//        getMyTablesToBeConfirmed();
//        getMyUpcomingTables();
        getUserPanelNotifications();
        prepareRightPanelDiv();
        $("#notificationNo").text(notficationNo);
        if(notficationNo == 0)
            $("#notificationNo").hide();
        else
            $("#notificationNo").show();
//        getUserProfile ();

        if(hasDeviceInfo){
            console.log("Updating device info for user:" + userId + "with deviceToken:" + $.session.get('deviceToken') + "and iOSVersion:" + $.session.get('iOSversion'))
            updateUserDeviceInfo($.session.get('userHash'), $.session.get('deviceToken'), $.session.get('iOSversion'));
        }
    }else{
        $(".loggedInFields").css("display","none")
        $("#closeleftPanel").css("display","none")
        
    }
    
}
function updateUserDeviceInfo(userid, deviceToken, deviceVersion)
{

    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/updateUserDeviceInfo",
    {
        userID:userid,
        deviceToken:deviceToken,
        deviceVersion:deviceVersion
    },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}
function getUserProfile () {
    
    console.log("http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userId)
        $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userId,
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0]
                        console.log(data)
                        document.getElementById("LeftPanelFirstName").value = data["firstname"]+" " +data["lastname"]; 
                        //+ data["lastname"];
//                        document.getElementById("LeftPanelLastName").value = data["lastname"];
                    //    document.getElementById("LeftPanelEmailAddress").value = data["userid"];
                        document.getElementById("LeftPanelBio").value = data["bio"];
                        document.getElementById("LeftPanelBirthday").value = data["date_of_birth"];
                        document.getElementById("LeftPanelCity").value = data["hometown"];
                        console.log("image master location");
                        console.log(data["imageMasterLocation"]);
                        $.session.set('userType', data["userType"]);

                        document.getElementById("LeftPanelProfileImage").src = data["imageMasterLocation"];
                                              
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
function getUserPanelNotifications() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    var epochMs = new Date(yyyy, mm, dd).getTime()/1000;
    console.log("http://ancient-falls-9049.herokuapp.com/credentialService/getUserPanelNotifications?userid=" + $.session.get('userHash')) + "&epochMs=" + epochMs
    $.ajax(
            {
                url: "http://ancient-falls-9049.herokuapp.com/credentialService/getUserPanelNotifications?userid=" + $.session.get('userHash') + "&epochMs=" + epochMs,
                async: false,
                dataType: "json",
                success: function(data)
                {
                    userPanelNotifications = data;
                    
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

function prepareRightPanelDiv() {
    var html="";
    var pendingCount = 0;
    if (userPanelNotifications !== null) {
        for (var i = 0; i < userPanelNotifications.length; i++) {
            if (userPanelNotifications[i]['acted_upon'] === 'NO') {
                pendingCount++;
            }
        html += prepareNotificationDiv(userPanelNotifications[i]);
    }
    $('#panelMain').html(html);
    notficationNo = pendingCount;
    }
    
    
}
    
function prepareNotificationDiv(userPanelNotification) {
    
//    var ul = document.getElementById("rightpanellist");
//    var li = document.createElement("li");
    var notification_read_icon, notification = '';

    if (lastTableName !== userPanelNotification['table_name']){
        notification = "<li data-icon=\"delete\" style=\"background-color: #ffbb00;text-align: center; font-weight:700;\" id=\"panelTableHeader\"><p>" + userPanelNotification['table_name'] + "</p></li>";
    }

    if (userPanelNotification['acted_upon'] === 'NO'){
        notification_read_icon = 'ui-icon-red-dot';
    }
    else {
        notification_read_icon = 'ui-icon-red-ring-dot';
    } 
    if (userPanelNotification['message'] === 'Confirmed Table') {
        getPanelTableData(userPanelNotification['tableid']);
        
//        var imageStringHtml = getUserProfileData();
     
     
        notification += "<li><a href=\"view.html?user_from=" + $.session.get('userHash') + "&tableid=" + userPanelNotification['tableid'] + "\" target=_self class=\"ui-btn ui-btn-icon-right " + notification_read_icon + " ui-mini\" style=\"white-space:normal\"><p> Confirmed Table </p> " + imageStringHtml + " </a></li>";
    
    }   
    else {
        notification += "<li><a href=\"view.html?user_from=" + $.session.get('userHash') + "&tableid=" + userPanelNotification['tableid'] + "\" target=_self class=\"ui-btn ui-btn-icon-right " + notification_read_icon + " ui-mini\" style=\"white-space:normal\"><p>" + userPanelNotification['message'] + "</p></a></li>";   
    }
    lastTableName = userPanelNotification['table_name']
    return notification;
//    li.appendChild(document.createTextNode(notification));
//    li.setAttribute("notification_id",userPanelNotification['notification_id']);
//    li.setAttribute("class","loggedInFields");
//    ul.appendChild(li); 


}  

function getPanelTableData(tableid){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/getTable?tableid="+tableid,
        async: false,
        dataType: "json",
        success: function(data)
        {   //console.log(data)
            panelTable=data[0];
            imageStringHtml = getPanelUserProfileData();

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

function getPanelUserProfileData() {
    var userIDs=[];
    var imageStringHtml = "<div class=\"ui-grid-b\"> ";
 
//    if (confirmCount > 1) {
//        document.getElementById("inviteTimePicker").disabled = true;
//        document.getElementById("address").disabled = true;
//    }
    for(var j=1;j<4;j++){
        if(panelTable['user_to_'+j]!=null && panelTable['user_to_'+j]!=""){
            userIDs.push(panelTable['user_to_'+j]);
        }
    }
    userIDs.push(panelTable['user_from']);
        console.log(userIDs.length);
    console.log("uid"+userIDs);
    count = 0;
    for (var i = 0; i < userIDs.length; i++) {
//        inviteUsers.push(userIDs[i])
        letter = String.fromCharCode(97 + count)
        count++;
        panelUsers[i] = [];
        console.log("http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i])
        $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i],
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0];
//                        console.log("DATA - "+data);

                        panelUsers[i]["id"] = data["userid"];
                        panelUsers[i]["first_name"] = data["firstname"];
                        panelUsers[i]["last_name"] = data["lastname"];
                        panelUsers[i]["bio"] = data["bio"];
                        panelUsers[i]["image"] = data["imageMasterLocation"];
                        if (panelUsers[i]["image"] != null && panelUsers[i]["image"].length>0) { 
                            imageStringHtml += "<div id=\"bottom-block-" + letter + "\" class=\"ui-block-"+letter+"\"><img src=\""+panelUsers[i]["image"]+"\"  class=\"panelimagesize\"> </div>";
                        }
//                        if(table['user_to_'+(i+1)+'_status']!=="Pending")
//                        {
//                          console.log(table['user_to_'+(i+1)+'_status'],table['user_to_'+j+'_status']!=="Pending")
//                          users[i]["status"]=table['user_to_'+(i+1)+'_status']==="Confirmed"?"images/mycheck.png":(table['user_to_'+(i+1)+'_status']==="Accepted"?"images/unconfirmed.png":"images/mycross.png")
//                        }                        
//                        else
//                          users[i]["status"]="";
//                      if($.session.get('userHash') == userIDs[i] && table['user_to_'+(i+1)+'_status']=="Confirmed")
//                      {
//                          console.log("Lock for this user");
//                          document.getElementById('confirmInvitesButtonId').innerHTML = "CONFIRMED!";
//                          document.getElementById('confirmInvitesButtonId').onclick = function(){return false};
//                          $("#preConvoPopupButton").show();
//                          document.getElementById('confirmInvitesButtonId').className="sendNoteButton";
//
//                      }
                    
                    

                    //  timepicker.get_dateInput().disable();
                    //  document.getElementById("inviteTimePicker").disabled = false;  
                    console.log("imageStringHtml: " + imageStringHtml);
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
    imageStringHtml += "</div>";
return imageStringHtml;

}