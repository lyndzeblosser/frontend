var selectedTopic = [],additionalFields=[];

var uploadInitCount = 0;
var sortId = [];
var imgURL = null;
var img400x400URL = null;
var imgTNailURL = null;
//var userType = null;
var homeLat, homeLng;
var userid;

function login() {
    window.location.href = "login.html";
}
function form1Validated ()
{
    userid = $("#email").val();
    $("#registerPage2").show();
    $("#registerPage1").hide();
    $("#previewIMG").show();
     $(".imgUploadDIV").hide();
    $("#submitRegistrationButton").show(); 
//     form2Validation();
  //   return false;
    }
function tagsValidation ()
{
//    sortId = [];
//    
//    $("input[data-cacheval=\"false\"]").each(function(){
//        if(this.type == "checkbox")
//        {
//            sortId.push(this.value);
//        }
//    });
//    console.log(sortId);
//    if(sortId < 3)
//    {
//        alert("Please select at least 2 topic tags");
//        return false;
//    }

    /*if(($('input:radio[name=userType]:checked').length)==0)
{
    alert("Please select who you are");
    return false;
}
*/
//    setupFormValidation ();
    return true;
}
function submitForm()
{
    //event.preventDefault();
    // Get some values from elements on the page:
    $("#submitRegistrationButton").hide();
    $("#sendingRegistrationId").show();
    var postData = $("#registerForm,#registerForm2").serializeArray();
    if(additionalFields.length!=0){
        postData.push(additionalFields['platform'])
        postData.push(additionalFields['platformId'])
    }
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
            console.log(userid);
            console.log("userhash returned: " + data);
//            addUserTags(userid, sortId);
            addUserHomeLocation(userid, homeLat, homeLng);
//            $("#successfulRegistrationPopup").popup("open");
            alert("Registration Successfull!");
            window.location.href = "mood.html?loggedinuser=" + data;
        },
        error: function(jqXHR, textStatus, errorThrown)
        {
//            console.log("Registration Form was not Submitted!");
            alert("Registration Failed. " + jqXHR.responseText);   
            window.location.href = "login.html";
            
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
            tag: tag
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
function form1Validation()
{   
    $("#registerForm").validate(
    { 
        rules: {
            betaAccessCode: {
                required: true,
                equalTo: "#test"
            },
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
            }
        },
        messages: {
            betaAccessCode: {
                required: "We are performing a closed Beta testing. Please enter the access code",
                equalTo: "Sorry invalid access code"
            },
            homeTown: "Please enter your Home Town",
            password: {
                required: "Please provide a Password",
                minlength: "Your password must be at least 5 characters long"
            },
            ConfirmPassword: {
                equalTo: "Your passwords don't match"
            },
            email: "Please enter a valid email address"
        },
        submitHandler: function(form) {
            console.log("form1submitted");
            form1Validated();
 //           return false;
        }
    });
}
function form2Validation()
{   console.log("form2Validation");
    $("#registerForm2").validate(
    { 
        rules: {
            firstName: "required",
            lastName: "required",
            dateOfBirth: "required",            
            bio: {
                required: true
            }
        },
        messages: {
            firstName: "Please enter your First Name",
            lastName: "Please enter your Last Name",
            dateOfBirth: "How young do you feel?",
            bio: "Of course we realize you can always fall back on your good looks, but this bio is used to give people a sense of your personality."
            },
        submitHandler: function(form) {
            console.log("form2submitted");
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
    $("#test").hide();
    $(function() {
    $( "#dateOfBirth" ).datepicker(
            {maxDate: "-18y",
            yearRange: "-100:-18",
             changeMonth: true,
             changeYear: true,
            });
    $( "#dateOfBirth" ).datepicker("option", "dateFormat", "yy-mm-dd");
  });
    $("#loadingImage").hide();
    $(".loggedInFields").css("display", "none")
    $("#closeleftPanel").css("display", "none")
    $("#submitRegistrationButton").hide();
    $("#sendingRegistrationId").hide();
    $("#registerPage2").hide();
//    $("#imgValid").css("display", "none");
//    document.getElementById(imgValid).style.display = "hide";
    $("#previewIMG").hide();
    getUrlParams ();
//    getTopics();
    if((getParameterByName('platform')!="")){
        //alert(getParameterByName('platform'))
        additionalFields['platform']={name:"platform",value:getParameterByName('platform')}
        additionalFields['platformId']={name:"platform",value:getParameterByName('platformId')}
        var name=getParameterByName('name')
        var index=name.indexOf(" ");
        if(index==-1){
            $("#firstName").attr("value",name)            
        }else{
            $("#firstName").attr("value",name.substring(0,index))
            $("#lastName").attr("value",name.substring(index+1))
        }
        if((getParameterByName('image_url')!="")){
            img400x400URL = getParameterByName('image_url');
            img400x400URL = img400x400URL.replace("_normal", "_400x400");
            imgTNailURL = getParameterByName('image_url');
            imgTNailURL = imgTNailURL.replace("_normal", "_bigger");
            console.log("img400x400URL: " + img400x400URL);
            console.log("imgTNailURL: " + imgTNailURL);
            
           $("#imageMasterLocation").attr("value",img400x400URL);
           $("#imageThumbnailLocation").attr("value",imgTNailURL);
//            $.cloudinary.image(info.cdnUrl, { width: 100, height: 150, crop: 'fill' });
//            $(".imgUploadDIV").hide();
        imgURL = img400x400URL;
        
        $("#previewIMG").show();
            $("#previewIMG").attr("src",img400x400URL);
        }    
        $("#password").attr("value","dummy")
        $("#ConfirmPassword").attr("value","dummy")
        $("#password").prop('disabled', true);
        $("#ConfirmPassword").prop('disabled', true);
        $("#loginType").attr("value",getParameterByName('platform'));
        $("#platformId").attr("value",getParameterByName('platformId'));
        if((getParameterByName('location')!="")){
            $("#homeTown").attr("value",getParameterByName('location'));
            $("#homeTown").focus();
        }
        if((getParameterByName('bio')!="")){
            $("#bio").append(getParameterByName('bio'));
        }
        
        
    }
    var autocomplete = new google.maps.places.Autocomplete($("#homeTown")[0], {});
    google.maps.event.addListener(autocomplete, 'place_changed', function()
    {
        var place = autocomplete.getPlace();
        homeLat = place.geometry.location.lat();
        homeLng = place.geometry.location.lng();
        console.log(homeLat, homeLng)
    });
    
    $("label[id^='tag']").click(function()
    {
        console.log("tag selected: tag" + $(this).val());

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
        form2Validation();
 
    });
    $( "#nextPageButton" ).click(function() 
    {   
if(!imgURL)
{$(".imgNotUploadedDIV").show();
    return false;
 }
else
    form1Validation();
 return true;       
    });

    $( "#previousPageButton" ).click(function() 
    {
    $("#registerPage2").hide();
    $("#registerPage1").show();
    $("#previewIMG").show();
    $(".imgUploadDIV").hide();
    $("#submitRegistrationButton").hide();
//    page1Display = true;
    });

    startUploadImage();
    
    $("#twitterSignOn").click(function()
    {
        window.location.href = "login/redirect.php";

    });
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
            imgURL = info.cdnUrl;
            $("#imageMasterLocation").attr("value",info.cdnUrl);
//            $.cloudinary.image(info.cdnUrl, { width: 100, height: 150, crop: 'fill' });
            $(".imgNotUploadedDIV").hide();
            $(".imgUploadDIV").hide();
            $("#previewIMG").show();
            $("#previewIMG").attr("src",imgURL);
            
   
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

//function getTopicsString() {
//    if ($("input[data-cacheval=\"false\"]").length == 0) {
//        alert("No topics selected")
//        return null;
//    } else {
//        var topics = []
//        $("input[data-cacheval=\"false\"]").each(function() {
//            topics.push(this.value)
//        })
//        return topics.join();
//    }
//}