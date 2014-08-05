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

function validate(userid, password)
{
    $.ajax({
  url: "http://vast-scrubland-7419.herokuapp.com/credentialService",
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
            for(var i=0;i<data.length;i++)
                {
                    if(userid === data[i].userid && password === data[i].password)
                        {
                            alert("Welcome " + userid);
                            window.location.href = "mood.html?userid=" + userid;   
                        }
                    
                }
        }
        
    });
    
}