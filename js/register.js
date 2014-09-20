var selectedTopic = [];

var uploadInitCount = 0;
var sortId = [];
var userType = null;
var homeLat, homeLng;

function tagsValidation ()
{
    sortId = [];
    
            $("input[data-cacheval=\"false\"]").each(function(){
            if(this.type == "checkbox")
            {
            sortId.push(this.value);
        }
        });
console.log(sortId);
if(sortId < 3)
{
    alert("Please select at least 2 topic tags");
    return false;
}

if(($('input:radio[name=userType]:checked').length)==0)
{
    alert("Please select who you are");
    return false;
}

    setupFormValidation ();
    return true;
}
function submitForm()
{
    //event.preventDefault();
    console.log("validate function1");
    // Get some values from elements on the page:
    $("#submitRegistrationButton").hide();
    $("#sendingRegistrationId").show();
    var postData = $("#registerForm").serializeArray();
    var formURL = "http://evening-thicket-5124.herokuapp.com/credentialService/tempRegisterUser";
    console.log(postData);
    
    $.ajax(
            {
                url: formURL,
                type: "POST",
                data: postData,
                success: function(data, textStatus, jqXHR)
                {
                    console.log("Registration Form Submitted Successfully!");
                    var userid = $("#email").val();
                    console.log(selectedTopic);
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
function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function getUrlParams(){
    var url="";
    var parameters = location.search;
     var parameter = parameters.split("?");
     console.log(parameter);
     console.log(getParameterByName('topics'));
    if($("input[data-cacheval=\"false\"]").length==0){
        
        return null;
    }
    else{
    
        var topics=[]
        $("input[data-cacheval=\"false\"]").each(function(){
            topics.push(this.value)
        })
        url+="&topics="+topics.join();
    }
    
    }
$(document).ready(function()
{
    $("#loadingImage").hide();
    $(".loggedInFields").css("display", "none")
    $("#closeleftPanel").css("display", "none")
    $("#sendingRegistrationId").hide();
    
    getUrlParams ();
    getTopics();
    var autocomplete = new google.maps.places.Autocomplete($("#homeTown")[0], {});
    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
        var place = autocomplete.getPlace();
        homeLat = place.geometry.location.lat();
        homeLng = place.geometry.location.lng();
        console.log(homeLat, homeLng)
    });
    
    $("label[id^='tag']").click(function()
        { console.log("tag selected: tag" + $(this).val());

            if (selectedTopic === [])
            {
                selectedTopic[0] = $(this).val();
            }
            else
            {
                selectedTopic.push($(this).val());
            }

            for (var i = 0; i < data.length; i++)
            {
                if ($(this).val().indexOf(data[i].tagName) > -1)
                {
                    sortId.push(data[i].sortId);
                }
            }
            $(this).addClass('ui-disabled');
        });
    
$( "#submitRegistrationButton" ).click(function( event ) 
    {
        
        return tagsValidation();
    }); 
startUploadImage();
});

function startUploadImage()
{
$(function() {
  widget = uploadcare.Widget('input');
  widget.openDialog(null, {
        systemDialog: false,
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
            $("#imageMasterLocation").attr("value",info.cdnUrl);
            });
  });    
}
function getTopics()
{
    $.ajax({
        url: "http://evening-thicket-5124.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json",
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                $("#topicsList").append("<label id=\"tag" + data[i]["tagId"] + "\" style=\"background-color:#b42723; color:#ffffff;\">" + data[i]["tagName"] + "<input id=\"tag" + data[i]["tagId"] + "\" value=\"" + data[i]["tagId"] + "\"  type=\"checkbox\"></label>");
                //obtaining selected topics and disabling selection of any topic multiple times
        
                
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