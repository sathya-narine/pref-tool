import {cookieParse} from './cookieManagement.js'; // Import functionality for reading JSON cookies.

/*
    Input: Cookies stored in the user's browser.

    Output: A table showing statistics based on the user's selections over the course of the assessment.

    Remarks: The result is as formatted HTML inside a pre-existing table. If the table does not already exist, this
        will not function correctly.
*/
window.fillTable = function fillTable() {

    let table = document.getElementById("video-table"); // Find the correct HTML element to modify.
    let selection = cookieParse("selection"); // Get all selected videos.
    let titles = cookieParse("titles2"); // Get titles for all videos.
    let options = cookieParse("option"); // Get counts for how many times each option has been chosen.
    let label = [];
    let percents = [];
    let total = options.reduce((i,j) => i+j, 0) // The total number of selections for all options.
    selection.forEach(element => label.push(titles[element])); // Put each selected title into a new array.
    // commenting prevoius code which was calculating wrong percentage
    //options.forEach(element => percents.push(Math.round(element*100/total))); // Put each percentage into a new array.
    // sathya testing
    // please remove this if issue is fixed
    //alert(options.toString());
    
    // code fix for calculating percentage
    var n = titles.length;
    var factor = n - 1;
    // please remove this if issue is fixed
    //alert(n);
    //alert(factor);
    // Calculate percents for each element in options array
    for (var i = 0; i < options.length; i++) {
        var percent = (options[i] / factor) * 100;
        percent = parseFloat(percent.toFixed(2));  // Round to two decimal places
        percents.push(percent);
    }

    
    table.innerHTML = ""; // Clear the table.

    // For each original selection...
    for (var i = 0; i < selection.length; i++) {

        // Get the respective title and percentage for the given selection.
        let title = titles[i];
        let percent = percents[i];

        // Create a row and two cells.
        let row = document.createElement("tr");
        let cell1 = document.createElement("td");
        let cell2 = document.createElement("td");

        // Add the title and percentage for the given selection to the two cells.
        cell1.innerHTML = title;
        cell2.innerHTML = percent + "%";

        // Add the cells to the row, then add the row to the table.
        row.appendChild(cell1);
        row.appendChild(cell2);
        table.appendChild(row);
    }
}
