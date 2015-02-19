
var tables,tags=[],userid,tableIdToUser=[];
$(document).ready(function()
{
    userid = $.session.get('userHash')
    getTableData()
    getTags();
    loggedInLoggedOutBehavior();
    $("#main").html(prepareTablesDiv())

});

function prepareTablesDiv(){
    var html=""
    for(var i=0;i<tables.length;i++){
        html+=prepareTableDiv(tables[i]);
    }
    return html
}

function prepareTableDiv(table){
    var user=[];
    var userInfo=getUserNameImage(table['user_from'])
    user['image'] = userInfo['image']
    user['name'] = userInfo['name']
    user['activity']=table['activity']
    if (table['invite_time'] != null ) {
        user['time']=table['invite_time'].slice(0,table['invite_time'].indexOf(":00 "))+" "+table['invite_time'].slice(table['invite_time'].indexOf(":00 ")+4)
    }
    user['tags']=(table['matching_tags']);
    
    
    var html="<div class=\"ui-grid-b\" style=\"padding:0px; margin:0px; border: solid 1px #cc0000;\" ><div class=\"ui-block-a imgblock\" style=\"width:30%; margin:0px; padding:0px\" id=\"pendingimg\"><div class=\"ui-bar ui-bar-a\" style=\"margin:0px; padding:none;\"><img src=\""+user['image']+"\" class=\"pendimg\"></div></div><div class=\"ui-block-b\" style=\"width:50%;\"><div class=\"ui-bar ui-bar-a text\"><p>Location: "+table["invite_location"]+"<a href=\"view.html?tableid="+table['tableid']+"&user_from="+table['user_from']+"\" target=_self class\"clickmore\" style=\"display: block; color:#cc0000;\">Click to read more...</a></p>"+user['tags']+"</div></div><div class=\"ui-block-c\" style=\"width:20%;\"><div class=\"ui-bar ui-bar-a addbtn\"><ul data-role=\"listview\" data-inset=\"true\" style=\"padding:0px;\"> <a onclick=\"accept(\'"+table['tableid']+"\')\" href=\"#\"><li><img  src=\"images/acceptprofile.svg\" class=\"addimg\"></li></a><hr> <a href=\"#\" onclick=\"reject(\'"+table['tableid']+"\')\"><li><img src=\"images/rejectprofile.svg\" class=\"rejectimg\"></li></a> </ul><!-- <img src=\"images/acceptprofile.svg\" class\"addimg\">--> </div></div> </div> <div class=\"ui-grid-a\"> <div class=\"ui-block-a\" style=\"width:30%;\"><div class=\"ui-bar ui-bar-a namebar\" style=\"background-color:#ffbb00; color:#ffffff; text-shadow:none;\">"+user['name']+"</div></div> <div class=\"ui-block-b\" style=\"width:70%;\"><div class=\"ui-bar ui-bar-a infobar\" style=\"background-color:#88ccc1; color:#ffffff; text-shadow:none;\"><div align=\"center\" class=\"float-left\">"+user['activity']+"</div> <div align=\"center\" class=\"float-left\">"+user['time']+"</div> <div align=\"center\" class=\"float-left\">"+"</div>  </div></div> </div>"
    
    return html;
    
}



function getTagsDiv(tags1){
    var tagList=tags1.split(",")
    var html="<p>";
    for(var i=0;i<tagList.length;i++){
        html+="&#8226 "+tags[tagList[i]]
    }
    html+="</p>"
    return html
}

function getTableData(){
    console.log("http://ancient-falls-9049.herokuapp.com/credentialService/getUserTables?userid="+$.session.get('userHash'))
    $.ajax(
    {
        url: "http://ancient-falls-9049.herokuapp.com/credentialService/getPendingInvitations?userid="+$.session.get('userHash'),
        async: false,
        dataType: "json",
        success: function(data)
        {
            tables=data;
            console.log(data)
            for(var i=0;i<tables.length;i++){
                tableIdToUser[tables[i]["tableid"]]=tables[i]["user_from"]
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

function getUserNameImage(userId){
    var a=[];
    $.ajax(
                {
                    url: "http://ancient-falls-9049.herokuapp.com/credentialService/userInformation?userid=" + userId,
                    async: false,
                    dataType: "json",
                    success: function(data)
                    {
                        data = data[0]
                        console.log(data)

                        a["image"] = data["imageMasterLocation"];
                        a["name"]=data["firstname"]  

                    },
                    error: function(error, message)
                    {
                        console.log("Failure: " + message);
                    },
                    complete: function(data)
                    {


                    }
                });
                
                return a;
    
}

function accept(tableid){
  var alertConfirmation = confirm("Are you sure you want to accept this invitation?");
    if (alertConfirmation)
    {
    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/acceptTableInvitation",
    {
        tableid:tableid,
        user_from:tableIdToUser[tableid],
        user_to:userid
    },
    function(data,status){
//         var url = "view.html?tableid="+tableid+"&user_from="+tableIdToUser[tableid];
        console.log("Data: " + data + "\nStatus: " + status);
        alert(data); 
        window.location.href = "mood.html";
    });
}}

function reject(tableid){
 var alertConfirmation = confirm("Are you sure, you want to reject this Table?");
    if (alertConfirmation)
    {
    $.post("http://ancient-falls-9049.herokuapp.com/credentialService/rejectTableInvitation",
    {
        tableid:tableid,
        user_from:tableIdToUser[tableid],
        user_to:userid
    },
    function(data,status){
//         var url = "view.html?tableid="+tableid+"&user_from="+tableIdToUser[tableid];
        console.log("Data: " + data + "\nStatus: " + status);
        alert(data);
        window.location.href = "mood.html";
        
    });
}
}