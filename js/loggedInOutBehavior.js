var isLoggedIn,userId;

$(document).ready(function(){
    $("#myTable").click(function()
    {
       window.location.href = "myTables.html";
    });
    
    $("#invites").click(function()
    {
       window.location.href = "pendingInvitations.html";
    });
    
    $("#home").click(function()
    {
       window.location.href = "mood.html";
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
    loggedInLoggedOutBehavior();
});

function getInvitations()
{
    $.ajax({
            url: "http://ancient-falls-9049.herokuapp.com/credentialService/getPendingInvitations?userid=" + userId,
            async: false,
            dataType: "json",
            success: function(data){
                $("#inviteNo").text(data.length)
            }
        });
    


}

function getMyTable()
{
    $.ajax({
            url: "http://ancient-falls-9049.herokuapp.com/credentialService/getUserTables?userid=" +userId,
            async: false,
            dataType: "json",
            success: function (data){
                 $("#tableNo").text(data.length)
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
        getMyTable();
        getUserProfile ();

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