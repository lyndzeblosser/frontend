    var selectedTopic = [];

var uploadInitCount = 0;
var sortId = [];
var homeLat, homeLng;

function submitForm ()
{
    //event.preventDefault();
    console.log("validate function1");
    // Get some values from elements on the page:
    var postData = $("#registerForm").serializeArray();
    var formURL = "http://vast-scrubland-7419.herokuapp.com/credentialService/tempRegisterUser";
    $.ajax(
    {
        url : formURL,
        type: "POST",
        data : postData,
        success:function(data, textStatus, jqXHR) 
        {
            console.log("Registration Form Submitted Successfully!");
            var userid = $("#email").val();
            console.log(sortId);
            addUserTags(userid, sortId);
            addUserHomeLocation(userid, homeLat, homeLng);
            $( "#successfulRegistrationPopup" ).popup( "open" );
                                                            
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
        for (i=0; i<tagsList.length; i++){
            addUserTag(userid, tagsList[i]);
        }
    }    
    
function addUserTag(userid, tag)
{
    $.post("http://vast-scrubland-7419.herokuapp.com/credentialService/addUserTag",
     {
        userid:userid,
        tag:tag,
      },
    function(data,status){
        console.log("Data: " + data + "\nStatus: " + status);
    });
}

function addUserHomeLocation(userid, homeLat, homeLng)
{
    $.post("http://vast-scrubland-7419.herokuapp.com/credentialService/addUserHomeLocation",
     {
        userid:userid,
        homeLat:homeLat,
        homeLng:homeLng
      },
    function(data,status){
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
    //form validation rules
    console.log("validate function +" + $("#registerForm"));        
    $("#registerForm").validate(
    {     
        rules: {
            firstName: "required",
            lastName: "required",
            homeTown:"required",
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
            firstName: "Please enter your firstname",
            lastName: "Please enter your lastname",
            homeTown:"Please enter your hometown",
            password: {
                required: "Please provide a password",
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
    var lengthOfTopics = getTopics();

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
        setupFormValidation ();
                                                                                                           
    });                      
    $("#password").keydown(function()
    {
        uploadInitCount++;
        if(uploadInitCount<=1)
        {
            initializeFileUpload();                   
        }
    });
                      


    lengthOfTopics.success(function(data)
    {
        lengthOfTopicsArray = data.length;
        console.log("lengthOfTopicsArray: " + lengthOfTopicsArray);
        console.log("tags: " + data.length);
                                                
        //creating list for selection of discussion topics
        for(var i=0;i<lengthOfTopicsArray;i++)
        {
           $('#topic').append('<li><button id = "topic' + i + '" data-theme="a"  value="' + data[i].tagName + '">' + data[i].tagName + '</button></li>').trigger('create');


        }
        $("#topic").addClass("overview"); 

        //            $('#slider1').tinycarousel(
        //          {
        //            infinite:"true"
        //      });
                                                
        //obtaining selected topics and disabling selection of any topic multiple times
        $("button[id^='topic']").click(function()
        {
                                                                                   
            if(selectedTopic === [])
            {
                selectedTopic[0] = $(this).val();   
            }
            else
            {
                selectedTopic.push($(this).val());
            }
                                                                                   
            for(var i = 0;i<lengthOfTopicsArray;i++)
            {
                if($(this).val().indexOf(data[i].tagName)>-1)
                {
                    sortId.push(data[i].sortId);
                }
            }
            $(this).addClass('ui-disabled');	
        });
                                                
                                                
    });
    lengthOfTopics.error(function(error, message)
    {
        console.log("FAILURE " + message);
    });


    function getTopics()
    {
        var lengthOfTopicsArray;
        return $.ajax({
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/tags",
            async: false,
            dataType: "json"
        });
    
    }
                      
    function initializeFileUpload()
    {
        $("#fileuploader").uploadFile({
            url:"upload.php",
            allowedTypes:"jpg",
            fileName:"myfile",               
            dynamicFormData: function()
            {
                var data ={
                    email:$("#email").val()
                    };
                return data;
            }
        });
    }

});
