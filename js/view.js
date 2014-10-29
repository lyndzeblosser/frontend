var table,tags=[],userid,inviteUsers=[],users=[];
$(document).ready(function()
{
//    userid=$.session.get('userHash')
    userid = getParameterByName('user_from');

    getTableData(getParameterByName('tableid'))
    getTags();
    getResult();
    loggedInLoggedOutBehavior();
   // $("#main").html(prepareTablesDiv())

});

function getUserData() {
    var userIDs=[];
    for(var j=1;j<4;j++){
        if(table['user_to_'+j]!=="null" && table['user_to_'+j]!==""){
            userIDs.push(table['user_to_'+j]);
        }
    }
    console.log("uid"+userIDs)
    for (var i = 0; i < userIDs.length; i++) {
        inviteUsers.push(userIDs[i])
        users[i] = [];
        console.log("http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i])
        $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userIDs[i],
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0]
                        console.log(data)

                        users[i]["id"] = data["userid"];
                        users[i]["first_name"] = data["firstname"];
                        users[i]["last_name"] = data["lastname"];
                        users[i]["bio"] = data["bio"];
                        users[i]["image"] = data["imageMasterLocation"];
                        if(table['user_to_'+(i+1)+'_status']!=="Pending")
                        {console.log(table['user_to_'+(i+1)+'_status'],table['user_to_'+j+'_status']!=="Pending")
                            users[i]["status"]=table['user_to_'+(i+1)+'_status']==="Accepted"?"images/mycheck.png":"images/mycross.png"}
                        else
                          users[i]["status"]=""  

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
}

function getTags(){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/tags",
        async: false,
        dataType: "json",
        success: function(data)
        {
            for(var i=0;i<data.length;i++){
                tags[data[i]["tagId"]]=data[i]["tagName"];
            }

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

function getParameterByName(name) 
{
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
    results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function getTableData(tableid){
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/getTable?user_from="+userid+"&tableid="+tableid,
        async: false,
        dataType: "json",
        success: function(data)
        {   console.log(data)
            table=data[0];
            console.log(data)
                      

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

function getResult()
{
    $("#actpic").attr("src","images/"+table['activity']+"invert.png")
    $("#address").attr("value",table['invite_location'])
    $("#dateString").html(table['invite_date'])
    getUserData();
    $("#basicExample1").attr("value",table['invite_time'].slice(0,table['invite_time'].indexOf(":00 "))+" "+table['invite_time'].slice(table['invite_time'].indexOf(":00 ")+4))
    prepareTagsDiv(table['matching_tags'])
    var noEmptyDivs = 3 - users.length;
    var userDivDataTop = "";
    var userDivDataBottom = "";
    var count = 0, letter = '';


    for (var i = 0; i < noEmptyDivs; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataTop += prepareEmptyDivTop(letter);
    }
    for (i = 0; i < users.length; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataTop += prepareUserDivTop(i, letter)
    }

    count = 0;

    for (i = 0; i < noEmptyDivs; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataBottom += prepareEmptyDivBottom(letter);
    }
    for (i = 0; i < users.length; i++) {
        letter = String.fromCharCode(97 + count)
        count++;
        userDivDataBottom += prepareUserDivBottom(i, letter)
    }

    $("#userTop").html(userDivDataTop)
    $("#confirmImg").html(userDivDataBottom)


   

}


function prepareEmptyDivTop(letter) {
    return "<div class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:95px; border:none;\"></div></div>"

}

function prepareEmptyDivBottom(letter) {
    return "<div class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"\" class=\"imagesize\"></div></div>"

}

function prepareUserDivTop(userID, letter) {
    return "<div id=\"top-block-" + letter + "\" class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:95px; background-color:transparent; border:none; color:#ffffff; text-shadow:none;\">" + users[userID]["first_name"] + "</div></div>"
}

function prepareUserDivBottom(userID, letter) {
    return " <div id=\"bottom-block-" + letter + "\" class=\"ui-block-"+letter+"\"><div class=\"ui-bar ui-bar-a\" id=\"confirmprofileImg\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\""+users[userID]["image"]+"\"  class=\"imagesize\"><img class=\"close\" src=\""+users[userID]["status"]+"\" onclick=\"removeUser(\'"+users[userID]["id"]+"\',\'"+letter+"\')\" /></div></div>"
    
    //return " <div id=\"bottom-block-" + letter + "\" class=\"ui-block-" + letter + "\"><div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"" + users[userID]["image"] + "\"  class=\"imagesize\"><img class=\"close\" src=\"images/smallcloseicon.png\" onclick=\"removeUser(\'"+users[userID]["id"]+"\',\'"+letter+"\')\" /></div></div>"
}

function prepareEmptyInnerBlockTop() {
    return "<div class=\"ui-bar ui-bar-a\" style=\"height:95px; border:none;\"></div>"
}

function prepareEmptyInnerBlockBottom() {
    return "<div class=\"ui-bar ui-bar-a\" style=\"height:90px; text-align:center; padding:0px;\"><img src=\"images/findpplicon.svg\" class=\"imagesize\"></div>";
}

function prepareTagsDiv(inviteTags){
   
    inviteTags=inviteTags.split(",")
    var html="";
    for(var i=0;i<inviteTags.length;i++){
        console.log(i,inviteTags[i])
        html+="<label style=\"background-color:#333333; color:#ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;\">"+tags[inviteTags[i]]+"<input type=\"checkbox\"></label>"
    }
    $("#tags").html(html);
}