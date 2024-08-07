import {cookieParse, getCookie, setCookie} from './cookieManagement.js'; // Import functionality for reading and writing cookies.

var idleTimeout; // A timeout that will reset the buttons if the user fails to make a selection within the specified time.
var index = 0; // Stores how many choices the user has been presented with.
var timeoutLength = getCookie("timeout")*1000; // How long to wait before skipping to the next pair of options, in ms.
var playtimeLength = getCookie("playtime")*1000; // How long to play a user's selection, in ms.

/*
    Input: Either 0 or 1, indicating which option the user selected.

    Output: Stores the user's selection as a cookie based on the option they selected.

    Remarks: optionIndex == 0 corresponds to left/top and optionIndex == 1 corresponds to right/bottom.
*/
window.selectOption = function selectOption(optionIndex){
    // please remove this if issue is fixed
    //alert('Inside Select Option');
    //alert(optionIndex);
    //if (optionIndex === null || optionIndex === undefined || optionIndex === '') {
    //   alert("Value not passed");
    //}

    clearTimeout(idleTimeout); // Stop the timeout.

    // Read the user's cookies.
    let option = cookieParse("option");
    // please remove this if issue is fixed
    //alert(option.toString());

    option[cookieParse("combination")[index][optionIndex]]++; // Increment the appropriate selection.
    setCookie("option",JSON.stringify(option),5); // Store the user's selections again. 5 days until expiry.
    
    if (optionIndex == 0) {
        let count = parseInt(getCookie("option1")) + 1;
        // please remove this if issue is fixed
        //alert('option 1 selected');
        //alert(count);
        setCookie("option1", count, 5);
        modalEnable(optionIndex); // Display pop-up with the user's selected video.
    } else if (optionIndex == 1) {
        let count = parseInt(getCookie("option2")) + 1;
        // please remove this if issue is fixed
        //alert('option 2 selected');
        //alert(count);
        setCookie("option2", count, 5);
        modalEnable(optionIndex); // Display pop-up with the user's selected video.
        
    }

    //modalEnable(optionIndex); // Display pop-up with the user's selected video.

    idleTimeout = setTimeout(resetButtons,playtimeLength); // Calls resetButtons after an amount of time determined by playtimeLength.
}

/*
    Input: None.

    Output: Thumbnails for the user to click on and a timeout to reset them.

    Remarks: When the page first loads, display options for the user to pick from and begin a timeout.
*/
window.initializeButtons = function initializeButtons(){
    fillButtons();

    // Add appropriate classes depending on the user's choice or orientation.
    if(getCookie("orientation") == "vertical"){
        $(".outer").addClass("video-column-outer")
        $(".inner").addClass("video-row-inner")
    }
    else {
        $(".outer").addClass("video-row-outer")
        $(".inner").addClass("video-column-inner")
    }

    idleTimeout = setTimeout(resetButtons,timeoutLength); // Calls resetButtons after an amount of time determined by timeoutLength.
}

/*
    Input: None

    Output: Thumbnails for the user to click on and a timeout to reset them. Old timeout is cleared.

    Remarks: Stops the prior timeout, increments the index, and displays a new set of options for the user to pick from.
*/
window.resetButtons = function resetButtons(){
    clearTimeout(idleTimeout); // Stop the timeout.
    modalDisable();
    index++; // Increment the index.
    fillButtons(); // Display a new set of options for the user to pick from.
    idleTimeout = setTimeout(resetButtons,timeoutLength); // Calls resetButtons after an amount of time determined by timeoutLength.
}

/*
    Input: The user's cookies.

    Output: Adding thumbnails for the user to click on.

    Remarks: Get the videos that are for the current assessment and populate the buttons with appropriate options.
*/
window.fillButtons = function fillButtons(){

    // Read the user's cookies.
    let combination = cookieParse("combination");
    let selection = cookieParse("selection");
    let videos = cookieParse("videos2");

    // If the assessment has completed, move on to the next page.
    if(index >= combination.length){
        setCookie("end", (new Date().getTime() / 1000), 5) // Saves the epoch timestamp in seconds when the assessment reaches the end.
        window.location.href = "./decision.html";
        return;
    }

    // Remove previous selection options.
    $("#option1").empty();
    $("#option2").empty();

    // Reset visibility to show options correctly.
    $(".outer").css("display","block")

    // Remove previous event listeners to avoid multiple calls -- fix for still images
    $("#option1").off('click');
    $("#option2").off('click');

    // Check whether the user wants still images or videos.
    if (getCookie("presentation") == "video") {
        // Create two wrappers to hold the iframes and detectors.
        let wrapper1 = $("<div></div>").addClass("wrapper");
        let wrapper2 = $("<div></div>").addClass("wrapper");

        // Create two iframes to hold YouTube embeds.
        let iframe1 = $("<iframe></iframe>").attr({
            class: "frame",
            src: "https://www.youtube.com/embed/" + videos[selection[combination[index][0]]] + "?autoplay=1&mute=1&controls=0&disablekb=1",
            allow: "autoplay",
            width: "560",  // Set width attribute
            height: "315"  // Set height attribute
        });
        let iframe2 = $("<iframe></iframe>").attr({
            class: "frame",
            src: "https://www.youtube.com/embed/" + videos[selection[combination[index][1]]] + "?autoplay=1&mute=1&controls=0&disablekb=1",
            allow: "autoplay",
            width: "560",  // Set width attribute
            height: "315"  // Set height attribute
        });

        // Create two detectors to overlay the iframes.
        let detector1 = $("<div></div>").addClass("bar").css("background-color", "rgba(255, 0, 0, 0.5)");
        let detector2 = $("<div></div>").addClass("bar").css("background-color", "rgba(0, 255, 0, 0.5)");

        // Add the iframes and detectors to the wrappers.
        wrapper1.append(iframe1, detector1);
        wrapper2.append(iframe2, detector2);

        // Add the wrappers to the options.
        $("#option1").append(wrapper1);
        $("#option2").append(wrapper2);

        // Prevent iframes from being paused by setting pointer-events to none.
        $("iframe").css("pointer-events", "none");

        // Add listeners to the detectors to check for when the user selects a video.
        $(".bar").click(function () {
            selectOption($(this).parent().index() == 0 ? 0 : 1);
        });
    }
    else {

        // Create two images with thumbnails from YouTube.
        // Image presentation mode
        let image1 = $("<img>").attr({
        src: "https://i.ytimg.com/vi/" + videos[selection[combination[index][0]]] + "/hqdefault.jpg",
        width: "560",  // Set width attribute for image
        height: "315"  // Set height attribute for image
        });
        let image2 = $("<img>").attr({
        src: "https://i.ytimg.com/vi/" + videos[selection[combination[index][1]]] + "/hqdefault.jpg",
        width: "560",  // Set width attribute for image
        height: "315"  // Set height attribute for image
        });


        // Add the images.
        $("#option1").append(image1);
        $("#option2").append(image2);

        // Add listeners to the images to check for when the user selects an image.
        // please remove this if issue is fixed
        // alert('still images calling select Option --1');
        $("#option1").click(function(){selectOption(0)});
        // please remove this if issue is fixed
        // alert('still images calling select Option --2');
        $("#option2").click(function(){selectOption(1)});
    }
}

/*
    Input: Either 0 or 1, indicating which option the user selected.

    Output: Displays a modal with a video embed that plays the user's selection.

    Remarks: optionIndex == 0 corresponds to left/top and optionIndex == 1 corresponds to right/bottom.
*/
window.modalEnable = function modalEnable(optionIndex){

    // Read the user's cookies.
    let combination = cookieParse("combination");
    let selection = cookieParse("selection");
    let videos = cookieParse("videos2");

    $(".modal-content").empty() // Empties the modal's content.

    // Create a new iframe with a YouTube embed showing the user's selection.
    let iframeSelection = $("<iframe></iframe>").attr({
                width: "560",
                height: "315",
                src: "https://www.youtube.com/embed/" + videos[selection[combination[index][optionIndex]]] + "?autoplay=1&controls=0&disablekb=1",
                allow: "autoplay"
                                                  })

    // Stop the options from displaying in the background.
    $(".outer").css("display","none")

    // Checks to make sure that the modal has been emptied before appending
    if ($("#selection-player .modal-content").is(':empty')) {
        // Add and show the iframe, but disable pausing.
        $("#selection-player .modal-content").append(iframeSelection);
        $("iframe").css("pointer-events","none");
        $("#selection-player").css("display","block");
    }

}

/*
    Input: None

    Output: Hides and empties the modal playing the user's selection.

    Remarks: This should be called after a delay in concert with modalEnable() to show and hide the modal.
*/
window.modalDisable = function modalDisable(){
    $(".modal-content").empty() // Empties the modal's content.
    $("#selection-player").css("display","none") // Hides the modal.
}

// When the page loads, initialize the "buttons" for the user to select from.
$(document).ready(function(){
        initializeButtons()
})
