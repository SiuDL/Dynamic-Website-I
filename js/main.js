(function ($) {
    $(document).ready(function(){
        let spin = $("#loading-screen");
        let up = $("#up");

        // hides both loading spin wheel and loading message
        spin.hide();
        $('#message').hide();

        // if scroll wheel has reached a certain point in the page
        // the scroll to top button will appear
        $(window).scroll(function() {
            if ($(this).scrollTop() > 20) {
                up.show();
            } else {
                up.hide();
            }
        });

        // function for scroll to top button
        up.click(function() {
            $('html, body').animate({scrollTop: 0}, 'slow');
        });

        // hides the table upon landing on the page
        $('#table1').hide();

        // reusable function to extract data from the server
        let load = function (data, i) {
            var row = $("<tr>");
            row.append($("<td>").text(data[i].country));
            row.append($("<td>").text(data[i].continent));
            row.append($("<td>").text(data[i].currency_name));
            row.append($("<td>").text(data[i].tld));
            var flagImg = $("<img alt=\"\" src=\"\">");
            flagImg.attr("src", data[i].flag_base64);
            row.append($("<td>").append(flagImg));
            $("#table1").append(row);
        }

        // function to show the 5 sec load message
        let show = function () {
            $('#message').fadeIn(2000,function() {
                $('#message').fadeOut(2000);
            });
        }

        // function to show and hide the loading spinner and calls the show() function
        let unlock = function (lock) {
            if (lock === false) {
                setTimeout(function(){
                    $('html, body').css('overflow', 'auto');
                    show();
                }, 5000);
            }else{
                $('html, body').css('overflow', 'hidden');
            }
        }

        // when button is clicked, it will send a get request to the server
        // this will retrieve the json data from the server
        // the data is then displayed onto the webpage
        $("#btn1").click(function(){
            $.getJSON("/get-countries", function(data){
                spin.fadeIn();
                // used to debug json data
                //console.log(data)
                for(var i = 0; i < 20 && i < data.length; i++){
                    load(data, i);
                }
                spin.fadeOut(5000);
                unlock(false);
            }).fail(function(textStatus, error) {
                // This code executes if there is an error retrieving the data
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
            $('#table1').show().slideDown("slow");
        }).on('click', function(){
            // when the button is clicked, it will disable so that it won't
            // extract the json data again (avoiding duplicate json data)
            $('#btn1').attr("disabled", true).fadeOut("slow");
            $('#btn2').attr("disabled", false).fadeIn("slow");
        });

        // this button will send a request to the server to just pull the existing json data
        // to then load in all the data instead
        $('#btn2').attr('disabled', false).hide().click(function (){
            $.getJSON("/get-all-countries", function(data){
                unlock(true);
                spin.fadeIn();
                for(var i = 0; i < data.length; i++){
                    load(data, i);
                }
                spin.fadeOut(5000);
                unlock(false);
            }).fail(function(textStatus, error) {
                // this code executes if there is an error retrieving the data
                var err = textStatus + ", " + error;
                console.log("Request Failed: " + err);
            });
        }).on('click', function (){
            $('#btn2').attr("disabled", true).fadeOut("slow");
        });

        // add click event listener to all cells in the table
        $('#table1').on("click", "td", function(){
            // remove any existing selected class
            $('td.selected').removeClass('selected');
            // add selected class to clicked cell
            $(this).addClass('selected');
        });

        // hide and show Effect
        $("#toggleButton").click(function(){
            $("#elementToToggle").toggle();
        });

        // slide effect
        $("#slideToggleButton").click(function(){
            $("#elementToSlide").slideToggle();
        });

        // color effect
        $("#colorButton").click(function(){
            // change the color of all paragraphs to red
            $("#elementToColor").css("color", "red");
            // change the color of a specific element with the ID "specialText" to blue
            $("#specialText").css("color", "blue");
        });

        // reset button
        $("#resetButton").click(function(){
            $("#elementToToggle").show();
            $("#elementToFade").css("display", "none");
            $("#elementToSlide").css("display", "none");
            $("#elementToAnimate").css({
                left: 'default',
                opacity: 'default',
                height: 'default',
                width: 'default'
            });
            $("#elementToColor").css("color", "#666");
            $('html, body').animate({
                scrollTop: $("body").offset().top
            }, 1000);
        });
    });
})(jQuery);

