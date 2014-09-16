var selectedTopic = [];

var uploadInitCount = 0;
var sortId = [];
var homeLat, homeLng;


function submitForm()
{
    //event.preventDefault();
    console.log("validate function1");
    // Get some values from elements on the page:
    var postData = $("#registerForm").serializeArray();
    var formURL = "http://evening-thicket-5124.herokuapp.com/credentialService/tempRegisterUser";
    $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function(data, textStatus, jqXHR)
                {
                    console.log("Registration Form Submitted Successfully!");
                    var userid = $("#email").val();
                    console.log(sortId);
                    addUserTags(userid, sortId);
                    addUserHomeLocation(userid, homeLat, homeLng);
                    $("#successfulRegistrationPopup").popup("open");
                    alert("Registration Successfull!");
                    window.location.href = "mood.html";
                },
                error: function(jqXHR, textStatus, errorThrown)
                {
                    console.log("Registration Form was not Submitted!");
                },
                done: function()
                {
                }

            });
    function addUserTags(userid, tagsList)
    {
        console.log('tagsList: ' + tagsList);
        //    var tags = tagsList.split(",");
        //    console.log('tags: ' + tags);
        for (i = 0; i < tagsList.length; i++) {
            addUserTag(userid, tagsList[i]);
        }
    }

    function addUserTag(userid, tag)
    {
        $.post("http://evening-thicket-5124.herokuapp.com/credentialService/addUserTag",
                {
                    userid: userid,
                    tag: tag,
                },
                function(data, status) {
                    console.log("Data: " + data + "\nStatus: " + status);
                });
    }

    function addUserHomeLocation(userid, homeLat, homeLng)
    {
        $.post("http://evening-thicket-5124.herokuapp.com/credentialService/addUserHomeLocation",
                {
                    userid: userid,
                    homeLat: homeLat,
                    homeLng: homeLng
                },
        function(data, status) {
            console.log("Data: " + data + "\nStatus: " + status);
        });
    }

    $("#redirectButton").click(function()
    {
        window.location.href = "mood.html";
    });
}
function setupFormValidation()
{

    $("#registerForm").validate(
            {
                rules: {
                    firstName: "required",
                    lastName: "required",
                    homeTown: "required",
                    email: {
                        required: true,
                        email: true
                    },
                    password: {
                        required: true,
                        minlength: 5
                    },
                    ConfirmPassword: {
                        equalTo: "#password"
                    },
                    bio: {
                        required: true
                    }
                },
                messages: {
                    firstName: "Please enter your First Name",
                    lastName: "Please enter your Last Name",
                    homeTown: "Please enter your Home Town",
                    password: {
                        required: "Please provide a Password",
                        minlength: "Your password must be at least 5 characters long"
                    },
                    ConfirmPassword: {
                        equalTo: "Your passwords don't match"
                    },
                    bio: "Please tell us something about you"
                    ,
                    email: "Please enter a valid email address"
                },
                submitHandler: function(form) {
                    submitForm();
                }
            });
}
$(document).ready(function()
{
    //loggedInLoggedOutBehavior();
    $(".loggedInFields").css("display", "none")
    $("#closeleftPanel").css("display", "none")

    getTopics();
    var autocomplete = new google.maps.places.Autocomplete($("#homeTown")[0], {});
    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
        var place = autocomplete.getPlace();
        homeLat = place.geometry.location.lat();
        homeLng = place.geometry.location.lng();
        console.log(homeLat, homeLng)
    });
$( "#submitRegistrationButton" ).click(function( event ) 
    {
        setupFormValidation();
    });  
//       $ = uploadcare.jQuery;
$(function() {
  widget = uploadcare.Widget('input');
  widget.openDialog(null, {
        systemDialog: true,
        imagesOnly: true
    });  
    widget.validators.push(imagesOnly);
    function imagesOnly(fileInfo) {
  if (fileInfo.size > 5242880) {
    throw new Error('size');
  }
}
  widget.onUploadComplete(function(info) {
    // Handle uploaded file info.
    console.log(widget.value());
            console.log("CDN Image URL for USers"+info.cdnUrl);
            });
  });


});

function getTopics()
{
    $.ajax({
        url: "http://evening-thicket-5124.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                $("#topicsList").append("<label id=\"tag" + data[i]["tagId"] + "label\" style=\"background-color:#b42723; color:#ffffff;\">" + data[i]["tagName"] + "<input id=\"tag" + data[i]["tagId"] + "\" value=\"" + data[i]["tagId"] + "\"  type=\"checkbox\"></label>");
            }
        }
    });

}

function getTopicsString() {
    if ($("input[data-cacheval=\"false\"]").length == 0) {
        alert("No topics selected")
        return null;
    } else {
        var topics = []
        $("input[data-cacheval=\"false\"]").each(function() {
            topics.push(this.value)
        })
        return topics.join();
    }
}