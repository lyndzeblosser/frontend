$(document).ready(function(){
    $(".topImg").click(function(){
        
            if($(this).attr("value")=="unselected"){
                $(this).attr("value","selected")
                $(this).css("opacity",0)
            }else{
                $(this).attr("value","unselected")
                $(this).css("opacity",1)
              
            }
    })
})
