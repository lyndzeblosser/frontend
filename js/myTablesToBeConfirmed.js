

var tables, tags = [], userid;
$(document).ready(function()
{
    userid = $.session.get('userHash')
    getTableData()
    getTags();
    loggedInLoggedOutBehavior();
    $("#main").html(prepareTablesDiv())

});

function prepareTablesDiv() {
    var html = ""
    for (var i = 0; i < tables.length; i++) {
        html += prepareTableDiv(tables[i]);
    }
    return html
}

function prepareTableDiv(table) {
    var user = [];
    var userInfo=getUserNameImage(table['user_from'])
    user['image'] = userInfo['image']
    user['name'] = userInfo['name']
    user['actvity'] = table['activity']
    if (table['invite_time'] != null ) {
        user['time'] = table['invite_time'].slice(0, table['invite_time'].indexOf(":00 ")) + " " + table['invite_time'].slice(table['invite_time'].indexOf(":00 ") + 4)
    }
    user['date'] = table['invite_date'];
    var commaIndex = user['date'].indexOf(",");
    console.log("commaIndex - "+commaIndex+" date - " + user['date'].slice(0,commaIndex)); 
    user['location'] = table['invite_location'];
    user['tags'] = table['matching_tags'];
    user['confirms'] = getConfirms(table)
    user['accepts'] = getAccepts(table);
    user['rejects'] = getRejects(table);
    var html = "<div class=\"ui-grid-b\" style=\"padding:0px; margin:0px; border: solid 1px #cc0000\" > <div class=\"ui-block-a\" style=\"width:30%; margin:0px; padding:0px\" id=\"pendingimg\"><div class=\"ui-bar ui-bar-a\" style=\"margin:0px; padding:none;\"><img src=\"" + user['image'] + "\" class=\"pendimg\" ></div></div> <div class=\"ui-block-b\" style=\"width:50%;\"><div class=\"ui-bar ui-bar-a text\">Location: " + user['location'] + "<a href=\"view.html?tableid=" + table['tableid'] + "&user_from=" + table['user_from'] + "\" target=_self style=\"display: block; color:#cc0000; padding-right: 0em; padding-left: 0em; font-size: 11px;\">Go to confirmation screen</a></p>" + user['tags'] + "</div></div> <div class=\"ui-block-c\" style=\"width:20%;\"><div class=\"ui-bar ui-bar-a\" style=\"border:1px dotted #cc0000;\"><ul data-role=\"listview\" data-inset=\"true\"> <li style=\"height:20px;\"><img src=\"images/mycheck.png\" class=\"ui-li-icon ui-icon-check\"><span class=\"ui-li-count\">" + user['confirms'] + "</span></li> <li style=\"height:20px;\"><img src=\"images/unconfirmed.png\" class=\"ui-li-icon ui-icon-check\"><span class=\"ui-li-count\">" + user['accepts'] + "</span></li> <li style=\"height:20px;\"><img src=\"images/mycross.png\" class=\"ui-li-icon ui-icon-check\"><span class=\"ui-li-count\">" + user['rejects'] + "</span></li> </ul></div></div> </div><div class=\"ui-grid-a\" style=\"border: solid 1px #cc0000\"> <div class=\"ui-block-a\" style=\"width:30%;\"><div class=\"ui-bar ui-bar-a namebar\" style=\" background-color:#ffbb00; color:#ffffff; text-shadow:none;\">" + user['name'] + "</div></div> <div class=\"ui-block-b\" style=\"width:70%;\"><div class=\"ui-bar ui-bar-a info\" style=\"background-color:#88ccc1; color:#ffffff; text-shadow:none;\"><div align=\"center\" class=\"float-left\">" + user['actvity'] + "</div><div align=\"center\" class=\"float-left\">" + user['time'] + "</div><div align=\"center\" class=\"float-left\">"+user['date'].slice(0,commaIndex)+ "</div></div></div> </div> "

    return html;

}

function getConfirms(table) {
    var a = table['user_to_1_status'] === "Confirmed" ? 1 : 0;
    var b = table['user_to_2_status'] === "Confirmed" ? 1 : 0;
    var c = table['user_to_3_status'] === "Confirmed" ? 1 : 0;
    var d = table['user_from_status'] === "Confirmed" ? 1 : 0;

    return a + b + c + d;
}

function getAccepts(table) {
    var a = table['user_to_1_status'] === "Accepted" ? 1 : 0;
    var b = table['user_to_2_status'] === "Accepted" ? 1 : 0;
    var c = table['user_to_3_status'] === "Accepted" ? 1 : 0

    return a + b + c;
}

function getRejects(table) {
    var a = table['user_to_1_status'] === "Rejected" ? 1 : 0;
    var b = table['user_to_2_status'] === "Rejected" ? 1 : 0;
    var c = table['user_to_3_status'] === "Rejected" ? 1 : 0

    return a + b + c;
}

function getTagsDiv(tags1) {
    var tagList = tags1.split(",")
    var html = "<p>";
    for (var i = 0; i < tagList.length; i++) {
        html += "&#8226 " + tags[tagList[i]]
    }
    html += "</p>"
    return html
}

function getTableData() {
    console.log("http://ancient-falls-9049.herokuapp.com/credentialService/getMyTablesToBeConfirmed?userid=" + $.session.get('userHash'))
    $.ajax(
            {
                url: "http://ancient-falls-9049.herokuapp.com/credentialService/getMyTablesToBeConfirmed?userid=" + userid,
                async: false,
                dataType: "json",
                success: function(data)
                {
                    tables = data;
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

function getTags() {
    $.ajax(
            {
                url: "http://ancient-falls-9049.herokuapp.com/credentialService/tags",
                async: false,
                dataType: "json",
                success: function(data)
                {
                    for (var i = 0; i < data.length; i++) {
                        tags[data[i]["tagId"]] = data[i]["tagName"];
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