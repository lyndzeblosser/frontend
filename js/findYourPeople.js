$(document).ready(function () 
                {

                    $('.flexslider').flexslider(
                                        {
                                            animation: "slide",
                                            controlNav: "thumbnails"  
                                        });
                    var parameters = location.search;
                    var parameter = parameters.split("?");
                    alert(parameter);



                });