$(document).ready(function(){
   getTopics();
   
})

    


function getTopics(){
    $.ajax({
        url: "http://localhost:8080/de.vogella.jersey.first/rest/credentialService/tags",
        async: true,
        dataType: "json",
        success: function (data) {
            //console.log(data[0].tagName);
            for(var i=0;i<data.length;i++){
              $('#topic').append($('<option>', { value : data[i].tagId }).text(data[i].tagName))
                
            }
            
           $('#topic').selectmenu("refresh"); 
                      
               
        },
        error: function (error, message) {
            
        }
    });
    
}

function getResult(){
    $.ajax({
        url: "http://localhost:8080/de.vogella.jersey.first/rest/credentialService/whosAround?searchLat=41.8781136&searchLng=-87.62979819999998&searchTags="+$("#topic").find(":selected").attr("value"),
        async: true,
        dataType: "json",
        success: function (data) {
            
            console.log(data);
            
                      
               
        },
        error: function (error, message) {
            
        }
    });
    
}