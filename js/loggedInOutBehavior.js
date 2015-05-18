var userPanelNotifications,isLoggedIn,userId, notficationNo;

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
       window.location.href = "profile.html";
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

function getInvitations()
{
    $.ajax({
            url: "http://ancient-falls-9049.herokuapp.com/credentialService/getPendingInvitations?userid=" + userId,
            async: false,
            dataType: "json",
            success: function(data){
                $("#inviteNo").text(data.length);
                notficationNo=data.length;
            }
        });
    


}

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
        getInvitations()
        getMyTablesToBeConfirmed();
        getMyUpcomingTables();
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
    console.log("http://ancient-falls-9049.herokuapp.com/credentialService/getUserPanelNotifications?userid=" + $.session.get('userHash'))
    $.ajax(
            {
                url: "http://ancient-falls-9049.herokuapp.com/credentialService/getUserPanelNotifications?userid=" + $.session.get('userHash'),
                async: false,
                dataType: "json",
                success: function(data)
                {
                    userPanelNotifications = data;
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

function prepareRightPanelDiv() {
    var html="";
    if (userPanelNotifications != null) {
        for (var i = 0; i < userPanelNotifications.length; i++) {
        html += prepareNotificationDiv(userPanelNotifications[i]);
    }
    $('#panelMain').html(html);
    }
    
    
}
    
function prepareNotificationDiv(userPanelNotification) {
    
//    var ul = document.getElementById("rightpanellist");
//    var li = document.createElement("li");
    var notification_read_icon = '';
    if (userPanelNotification['acted_upon'] === 'NO'){
        notification_read_icon = 'ui-icon-red-dot';
    }
    else {
        notification_read_icon = 'ui-icon-red-ring-dot';
    } 
        
    var notification = "<li><a href=\"view.html?tableid=" + userPanelNotification['tableid'] + "\" target=_self class=\"ui-btn ui-btn-icon-right " + notification_read_icon + " ui-mini\" style=\"white-space:normal\"><p>" + userPanelNotification['message'] + "</p></a></li>";
    return notification;
//    li.appendChild(document.createTextNode(notification));
//    li.setAttribute("notification_id",userPanelNotification['notification_id']);
//    li.setAttribute("class","loggedInFields");
//    ul.appendChild(li); 


}  
