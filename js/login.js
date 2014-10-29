$(document).ready(function()
{

    loggedInLoggedOutBehavior();
    $("#continueButton").click(function()
    {
        //alert("clicked");
        var userid = $("#userid").val();
        var password = $("#password").val();
        validate(userid, password);
    });
    $("#registerButton").click(function()
    {
        window.location.href = "register.html";

    });
    $("#forgotPwdButton").click(function()
    {
        validateForgotPwd(userid);
    });
});

function getParameterByName(name)
{
//    console.log("getParameterByName: " + name);        
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");

    //alert("naem: " + name);

    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    //alert("regex: " + regex);

    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function validateForgotPwd(userid)
{
    if (userid === 'NULL' || userid.length === 0)
        {
            alert("Please enter email");
        }        
    else {
         $.post("http://ancient-falls-9049.herokuapp.com/credentialService/forgotPwd",
        {
            userid:userid
        },
        function(data,status){
            console.log("Data: " + data + "\nStatus: " + status);
            alert(data);
            var url = "mood.html";
             window.location.href = url;
        });
    }
   
}

function validate(userid, password)
{
//    $.ajax({
////  url: "http://localhost:8080/de.vogella.jersey.first/rest/credentialService/matchCredentials?{userid:" + userid + ",password:" + password + "}",
//        url: "http://ancient-falls-9049.herokuapp.com/credentialService/matchCredentials?userid=" + userid + "&password=" + password + "",
//        context: document.body
//    }).done(function(data, status)
//    {
//        alert("inside funtion response!");
//        if (userid === 'NULL' || userid.length === 0)
//        {
//            alert("userid can't be blank!");
//        }
//        else if (password === 'NULL' || password.length === 0)
//        {
//            alert("password can't be blank!");
//        }
//        else
//        {
//            if (status === '200')
//            {
//                alert("Welcome " + userid);
////                $.session.set('userid', userid);
//                $.session.set('userHash', data);
//                if (getParameterByName("activity") != "")
//                    window.location.href = "findYourPeople.html?latitude=" + getParameterByName('latitude') + "&longitude=" + getParameterByName('longitude') + "&topics=" + getParameterByName('topics') + "&activity=" + getParameterByName('activity') + "&radius=" + getParameterByName('radius') + "&userid=" + data.toString() + "&time=" + getParameterByName('time');
//                else
//                    window.location.href = "mood.html"
//            }
//            else
//            {
//                alert(data);
//            }
//
//        }
//
//    });

    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/matchCredentials",
    {
        userid:userid,
        password:password
    },
    function(data,status){
//         var url = "view.html?tableid="+tableid+"&user_from="+tableIdToUser[tableid];
        console.log("Data: " + data + "\nStatus: " + status);
        if (userid === 'NULL' || userid.length === 0)
        {
            alert("userid can't be blank!");
        }
        else if (password === 'NULL' || password.length === 0)
        {
            alert("password can't be blank!");
        }
        else
        {
            if (status === 'success')
            {
                alert("Welcome " + userid);
//                $.session.set('userid', userid);
                $.session.set('userHash', data);
                if (getParameterByName("activity") != "")
                    window.location.href = "findYourPeople.html?latitude=" + getParameterByName('latitude') + "&longitude=" + getParameterByName('longitude') + "&topics=" + getParameterByName('topics') + "&activity=" + getParameterByName('activity') + "&radius=" + getParameterByName('radius') + "&userid=" + data.toString() + "&time=" + getParameterByName('time');
                else
                    window.location.href = "mood.html"
            }
            else
            {
                alert(status);
            }

        }

    });
}