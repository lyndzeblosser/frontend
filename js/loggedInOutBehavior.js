var isLoggedIn,userId;

function getInvitations()
{
    $.ajax({
            url: "http://evening-thicket-5124.herokuapp.com/credentialService/getInvitations?userid=" + userId,
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
            url: "http://evening-thicket-5124.herokuapp.com/credentialService/getUserTable?userid=" +userId,
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
    
    
    }else{
        $(".loggedInFields").css("display","none")
        $("#closeleftPanel").css("display","none")
        
    }
    
}