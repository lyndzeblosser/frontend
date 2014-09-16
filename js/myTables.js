

var tables,tags=[],userid;
$(document).ready(function()
{
    userid=$.session.get('userid')
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
    user['image']="images/pic2.png"
    user['name']="Abhishek"
    user['actvity']=table['activity']
    user['time']=table['invite_time'].slice(0,table['invite_time'].indexOf(":00 "))+" "+table['invite_time'].slice(table['invite_time'].indexOf(":00 ")+4)
    user['date']=table['invite_date']
    user['location']=table['invite_location']
    user['tags']=getTagsDiv(table['matching_tags'])
    user['accepts']=getAccepts(table)
    user['rejects']=getRejects(table)
    
    var html="<div class=\"ui-grid-b\" style=\"padding:0px; margin:0px; border: solid 1px #cc0000; height:140px\" > <div class=\"ui-block-a\" style=\"width:30%; margin:0px; padding:0px\" id=\"pendingimg\"><div class=\"ui-bar ui-bar-a\" style=\"height:140px; margin:0px; padding:none;\"><img src=\""+user['image']+"\" class=\"pendimg\" ></div></div> <div class=\"ui-block-b\" style=\"width:50%;\"><div class=\"ui-bar ui-bar-a text\" style=\"height:140px\"><p style=\"font-size:12px\">Location: "+user['location']+"<a href=\"view.html?tableid="+table['tableid']+"&user_from="+userid+"\" style=\"display: block; color:#cc0000; font-size:9px;\">Click to read more...</a></p>"+user['tags']+"</div></div> <div class=\"ui-block-c\" style=\"width:20%;\"><div class=\"ui-bar ui-bar-a\" style=\"height:140px; border:1px dotted #cc0000;\"><ul data-role=\"listview\" data-inset=\"true\"> <li style=\"height:20px;\"><img src=\"images/mycheck.png\" class=\"ui-li-icon ui-icon-check\"><span class=\"ui-li-count\">"+user['accepts']+"</span></li> <li style=\"height:20px;\"><img src=\"images/mycross.png\" class=\"ui-li-icon ui-icon-check\"><span class=\"ui-li-count\">"+user['rejects']+"</span></li> </ul></div></div> </div><div class=\"ui-grid-a\" style=\"border: solid 1px #cc0000;  height:20px\"> <div class=\"ui-block-a\" style=\"width:30%;\"><div class=\"ui-bar ui-bar-a namebar\" style=\" background-color:#ffbb00; color:#ffffff; text-shadow:none;\">"+user['name']+"</div></div> <div class=\"ui-block-b\" style=\"width:70%;\"><div class=\"ui-bar ui-bar-a\" style=\"height:30px; background-color:#88ccc1; color:#ffffff; text-shadow:none;\"><div align=\"center\" class=\"float-left\">"+user['actvity']+"</div><div align=\"center\" class=\"float-left\">"+user['time']+"</div><div align=\"center\" class=\"float-left\">"+user['date']+"</div></div></div> </div> "
    
    return html;
    
}

function getAccepts(table){
    return table['user_to_1_status']=="Accepted"?1:0+table['user_to_2_status']=="Accepted"?1:0+table['user_to_3_status']=="Accepted"?1:0
}

function getRejects(table){
    return table['user_to_1_status']=="Rejected"?1:0+table['user_to_2_status']=="Rejected"?1:0+table['user_to_3_status']=="Rejected"?1:0
}

function getTagsDiv(tags1){
    var tagList=tags1.split(",")
    var html="<p style=\"font-size:12px\">";
    for(var i=0;i<tagList.length;i++){
        html+="&#8226 "+tags[tagList[i]]
    }
    html+="</p>"
    return html
}

function getTableData(){
    console.log("http://evening-thicket-5124.herokuapp.com/credentialService/getUserTables?userid="+$.session.get('userid'))
    $.ajax(
    {
        url: "http://evening-thicket-5124.herokuapp.com/credentialService/getUserTables?userid="+userid,
        async: false,
        dataType: "json",
        success: function(data)
        {
            tables=data;
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

function getTags(){
    $.ajax(
    {
        url: "http://evening-thicket-5124.herokuapp.com/credentialService/tags",
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