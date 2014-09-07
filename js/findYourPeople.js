
var jsonImgObj = [];
var users=[];
var loadedUser;
var totalSelected=0;
var selectedUsers=[];

$(document).ready(function () 
{
    				
    var parameters = location.search;
    var parameter = parameters.split("?");
    console.log("getParameterByName: radius: " + getParameterByName('radius')); 
    getResult(getParameterByName('latitude'), getParameterByName('longitude'), getParameterByName('topics'), getParameterByName('radius'), getParameterByName('activity'), getParameterByName('selectedTime'));
});

function fillImgDetails(id){
    $("#name").text(users[id]["name"]);
    $("#age").text(users[id]["birthDay"]);  
    $("#bio").text(users[id]["bio"]);

    
    
}

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
// this function returns radius to show to user in bottom bar
function getRadius(miles)
{
    //    console.log("getParameterByName: " + name);        
    if (miles === '402') {
        radius = 5;
    }
    else if (miles === '805') {
        radius = 10;
    }
    else if (miles === '1610') {
        radius = 20;
    }
    else if (miles === '80467') {
        radius = 1000;
    }
    return radius;
}

function getResult(latitude, longitude, selectedTopics, radius, activity, selectedTime)
{
   
    $.ajax(
    {
            
        url: "http://vast-scrubland-7419.herokuapp.com/credentialService/whosAround?searchLat=" + latitude + "&searchLng=" + longitude + "&searchTags=" + selectedTopics + "&radius=" + radius,
        async: true,
        dataType: "json",
        success: function (data) 
        {
            console.log("success data-------" + JSON.stringify(data));
                
            if(data == "undefined")
            {
                console.log("no data found..");
            }
                
            if(data != "undefined")
            {    
                for(var i=0;i<data.length;i++)
                {
                        
                    users[i]=[];    
                    users[i]["image"] = '../img/' + JSON.parse(JSON.stringify(data[i])).userid.toString() + '.jpeg';
                    users[i]["title"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                    users[i]["userName"] = JSON.parse(JSON.stringify(data[i])).firstname.toString();
                    users[i]["userId"] = JSON.parse(JSON.stringify(data[i])).userid.toString();
                    users[i]["name"] = JSON.parse(JSON.stringify(data[i])).firstname.toString() + " " + JSON.parse(JSON.stringify(data[i])).lastname.toString();
                    users[i]["bio"] = JSON.parse(JSON.stringify(data[i])).bio.toString();
                    users[i]["birthDay"] = JSON.parse(JSON.stringify(data[i])).date_of_birth.toString();
                    users[i]["selected"] = 0;
                    
                    console.log(users[i])
               
                }
                
                loadUser(0);
                    
                var AddPeople = document.getElementById( 'AddPeople' ),
                menuBottom = document.getElementById( 'cbp-spmenu-s4' ),
                MoveOnButton = document.getElementById( 'changeSlide' );
        
                AddPeople.onclick = function() {
                    classie.toggle( this, 'active' );
                    classie.toggle( menuBottom, 'cbp-spmenu-open' );
                    addDeleteUser()
                
                };

                MoveOnButton.onclick = function() {
                    
                    var nextUser=(loadedUser+1)%(users.length);
                    loadUser(nextUser);
                
                };
                    
                confirmInvitation.onclick = function() {
                    console.log('confirmInvitation clicked ');
                    var selectedUsersString= getSUS();
                    var selectedUsersNameString= getSUSN();
                    window.location.href = "confirmInvitations.html?latitude="+ latitude +"&longitude=" + longitude  + "&activity=" + activity + "&selectedUsers=" + selectedUsersString + "&selectedUserNames=" + selectedUsersNameString + "&commonTags=FIFA,STARTUPS" + "&inviteTime=" + selectedTime;

                };

                    
            }
              
        },
        error: function (error, message) 
        {
            console.log("Failure: " + message);        
        },
        complete: function(data)
        {
                
				
        }
    });
    
}



function loadUser(id){
    loadedUser=id;
    body = $("#ImageDiv");
    var initialImg = users[id]["image"];
    body.css({
        "backgroundImage": "url("+initialImg+")"
    });
    var addButtonImg=users[id]["selected"]==0?"img/AddIcon.png":"img/MoveOnIcon.png";
    $("#AddButtonImgId").attr("src",addButtonImg)
    fillImgDetails(id)
    
}

function addDeleteUser(){
    if(users[loadedUser]["selected"]==0 ){
        if(selectedUsers.length==3){
            alert("Max limit reached, canot add more users")
        }else{
            users[loadedUser]["selected"]=1;
            selectedUsers.push(loadedUser);
            loadUser(loadedUser);
        }
    }else{
        users[loadedUser]["selected"]=0;
        findAndRemove(loadedUser)
        loadUser(loadedUser);
    }
}

function findAndRemove(id){
  var index = selectedUsers.indexOf(id); 
  selectedUsers.splice(index, 1);
}

function getSUSN(){
    var str=[];
    for(var i=0;i<selectedUsers.length;i++){
        str[i]=users[selectedUsers[i]]["userName"]
    }
    return str.join();
}

function getSUS(){
     var str=[];
    for(var i=0;i<selectedUsers.length;i++){
        str[i]=users[selectedUsers[i]]["userId"]
    }
    return str.join();
}














//"<li data-thumb='img/rohit.jpeg'><img src='img/rohit.jpeg' /><p name='sliderCaption'" + i + " class='flex-caption'>" + parameter + "<button data-theme = 'a' data-inline = 'true'>INVITE</button><br>" + parameter + "</p>"