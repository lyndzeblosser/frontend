var isLoggedIn,userId;
$(document).ready(function(){
    isLoggedIn=typeof $.session.get('userHash')!="undefined";
    userId=$.session.get('userHash');
    getUserProfile ();
});

function updateUserProfile (){
     $.post("http://ancient-falls-9049.herokuapp.com/credentialService/updateUser",
    {
        userHash:userId,
        bio:"test BIO update"
    },
    function(data,status){
        console.log("update user Profile \nStatus: " + status);
        
//        console.log(userid+lat+lng);
        
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
