$(document).ready(function () 
                {
                    
                    
                    $("#continueButton").click(function()
                                               {
                                                   //alert("clicked");
                                                   var userid = $("#userid").val();
                    var password = $("#password").val();
                                                   validate(userid, password);
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
function validate(userid, password)
{
    $.ajax({
//  url: "http://localhost:8080/de.vogella.jersey.first/rest/credentialService/matchCredentials?{userid:" + userid + ",password:" + password + "}",
        url: "http://vast-scrubland-7419.herokuapp.com/credentialService/matchCredentials?userid=" + userid + "&password=" + password + "",
  context: document.body
}).done(function(data) 
        {
        
            if(userid === 'NULL' || userid.length === 0)
            {
                alert("userid can't be blank!");
            }
            else if(password === 'NULL' || password.length === 0)
            {
                alert("password can't be blank!");
            }
            else
            {
                if(data.toString() === "true")
                {
                    alert("Welcome " + userid);
                    window.location.href = "findYourPeople.html?latitude="+ getParameterByName('latitude') +"&longitude=" + getParameterByName('longitude')  + "&topics=" + getParameterByName('topics') + "&activity=" + getParameterByName('activity') + "&radius=" + getParameterByName('radius') + "&userid=" + userid;
                }
                else
                {
                    alert("Invalid credentials entered. data obtained: " + data);
                }

            }
        
    });
    
function getRadius(selectedLocation) 
{
//    console.log("getParameterByName: " + name);        
    radius = 0.724638;
    if (selectedLocation == '5') {
        radius = 402;
    }
    else if (selectedLocation == '10') {
        radius = 805;
    }
    else if (selectedLocation == '20') {
        radius = 1610;
    }
    else if (selectedLocation == '1000') {
        radius = 80467;
    }
    return radius;
}    
    
}