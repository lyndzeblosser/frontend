$(document).ready(function()
                  {
                      getTopics();
                      getResult();
//                      $('#findMyPeopleButton').click(function()
//                                                     {
//                                                         $.mobile.changePage( "findYourPeople.html", { transition: "slideup", changeHash: false });
//                                                     });
                    });


function getTopics()
{
    $.ajax({
        url: "http://vast-scrubland-7419.herokuapp.com/credentialService/tags",
        async: true,
        dataType: "json",
        success: function (data) 
        {
            console.log("tags: " + data.length);
            for(var i=0;i<data.length;i++)
            {
                $('#topic').append('<li>'+ data[i].tagName + '</li>').trigger('create');
                
            }
            $("#topic").addClass("overview"); 
            
            $('#slider1').tinycarousel(
                {
                    infinite:"true"
                });
        },
        error: function (error, message) 
        {
            console.log("Failure: " + message);    
        }
    });
    
}

function getResult()
{
    var generalInterests;
    var professionalInterests;
    $.ajax(
        {
            url: "http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=41.8781136&searchLng=-87.62979819999998&searchTags=1,2",
            async: true,
            dataType: "json",
            success: function (data) 
            {
                console.log(JSON.stringify(data));
                
                for(var i=0;i<data.length;i++)
                {
                    if(data[i].userid === "vaibhav")
                    {
                        generalInterests = data[i].general_interests.toString().split(",");
                        for(var j=0; j<generalInterests.length; j++)
                        {
                            $('#generalInterestsList').append('<li><a href="#">'+ generalInterests[j] + '</a></li>').trigger('create');
                        }
                        
                        professionalInterests = data[i].professional_interests.toString().split(",");
                        console.log("professional Interests" + professionalInterests);
                        for(var k=0; k<professionalInterests.length; k++)
                        {
                            $('#professionalInterestsList').append('<li><a href="#">'+ professionalInterests[k] + '</a></li>').trigger('create');
                        }
                    }
                    $('#generalInterestsList').listview('refresh');
                    $('#professionalInterestsList').listview('refresh');
                }
                
            },
            error: function (error, message) 
            {
                console.log("Failure: " + message);        
            }
        });
    
}


//PROFILE HTML CODE
//            <ul data-role="listview">
//                <li style="background-color:#808080;"><h4 style="color:#ffffff">&nbsp; &nbsp; MY PROFILE</h4></li>
//            </ul>
//            <br>
//            <div id="activity" class="ui-grid-b ui-responsive">
//                <div class="ui-block-a"><button data-theme="a"><i class='fa fa-file-image-o fa-3x'></i></button></div>
//                <div class="ui-block-b"><button data-theme="d"><i class='fa fa-twitter fa-3x'></i></button></div>
//                <div class="ui-block-c"><button data-theme="c"><i class='fa fa-facebook fa-3x'></i></button></div>     
//            </div>
//            <br>
//            <div data-role="collapsible-set" data-inset="true" data-mini="true" data-theme="e">
//
//                <div data-role="collapsible">
//                <h2>FIRST NAME</h2>
//                    <input type="text" name="FirstName" id="FirstName" value="" style="border:1px solid #b54037;"/>
//                </div>
//
//                <div data-role="collapsible">
//                <h2>LAST NAME</h2>
//                    <input type="text" name="LastName" id="LastName" value="" style="border:1px solid #b54037;"/>
//                </div>
//
//                <div data-role="collapsible">
//                <h2>LOCATION</h2>
//                    <input type="text" name="location" id="location" value="" style="border:1px solid #b54037;"/>
//                </div>
//
//                <div data-role="collapsible">
//                <h2>DATE OF BIRTH (must be 18+)</h2>
//                    <input type="date" name="dob" id="dob" value="" style="border:1px solid #b54037;" />
//                </div>
//
//                <div data-role="collapsible">
//                <h2>EMAIL</h2>
//                    <input type="text" name="email" id="email" value="" style="border:1px solid #b54037;"/>
//                </div>
//
//                <div data-role="collapsible">
//                <h2>PASSWORD</h2>
//                    <input type="password" name="password" id="password" value="" style="border:1px solid #b54037;"/>
//                </div>
//
//                <div data-role="collapsible">
//                <h2>BIO</h2>
//                    <textarea cols="40" rows="8" name="textarea-2" id="textarea-2" style="border:1px solid #b54037;"></textarea>
//                </div>
//            </div>


//PREFERENCES HTML CODE
//            <ul data-role="listview">
//                <li style="background-color:#808080;"><h4 style="color:#ffffff">&nbsp; &nbsp; PREFERENCES</h4></li>
//            </ul>
//            <div id="activity" class="ui-grid-solo ui-responsive">
//                <div class="ui-block-a"><button><i class="fa fa-file-image-o fa-3x"></i> MY NAME</button></div>
//            </div>
//            <br>
//            <div id="slider1">
//                <a class="buttons prev" href="#">&#60;</a>
//                <div class="viewport">
//                    <ul class="overview">
//                        <li>MALE</li>
//                        <li>FEMALE</li>
//                        <li>ANYONE</li>
//                    </ul>
//                </div>
//                <a class="buttons next" href="#">&#62;</a>
//            </div>

            