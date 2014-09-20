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
});

function getInvitations()
{
    $.ajax({
            url: "http://evening-thicket-5124.herokuapp.com/credentialService/getPendingInvitations?userid=" + userId,
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
            url: "http://evening-thicket-5124.herokuapp.com/credentialService/getUserTables?userid=" +userId,
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
    isLoggedIn=typeof $.session.get('userid')!="undefined";

    if(isLoggedIn){
    $(".loggedOutFields").css("display","none")    
    userId=$.session.get('userid');
    getInvitations()
    getMyTable();
    getUserProfile ();
    
    }else{
        $(".loggedInFields").css("display","none")
        $("#closeleftPanel").css("display","none")
        
    }
    
}

function getUserProfile () {
    
    console.log("http://evening-thicket-5124.herokuapp.com/credentialService/userInformation?userid=" + userId)
        $.ajax(
                {
                    url: "http://evening-thicket-5124.herokuapp.com/credentialService/userInformation?userid=" + userId,
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0]
                        console.log(data)
                        document.getElementById("LeftPanelFirstName").value = data["firstname"];
                        document.getElementById("LeftPanelLastName").value = data["lastname"];
                        document.getElementById("LeftPanelEmailAddress").value = data["userid"];
                        document.getElementById("LeftPanelBio").value = data["bio"];
                        console.log(data["imageMasterLocation"]);
                        console.log(data["userType"]);
                        $.session.set('userType', data["userType"]);

                        document.getElementById("LeftPanelProfileImage").src = data["imageMasterLocation"];
//                        document.getElementById("test111").css('background-image',data["imageMasterLocation"]);
//                        body.css("a.ui-btn ui-btn-inline ui-icon-imageicon ui-btn-icon-bottom",data["imageMasterLocation"]);
                                              
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