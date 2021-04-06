// Read store data in from Firestore based on a parsed URL, and display store details on the screen
function getStoreDetails(store, headcount, lastUpdate) {
    db.collection("Stores").doc("Costco_" + store)
        .onSnapshot((doc) => {
            // Store name, headcount and last update information
            jQuery('<p/>', {
                id: "store-name",
                html: "Costco " + store + "<br/>" + headcount + "<br/>" + lastUpdate
            }).prependTo('.store-name-container');
            // Embedded map
            jQuery('<iframe/>', {
                src: "https://www.google.com/maps?q=" + doc.data().Address + "&output=embed",
                width: "300",
                height: "300",
                allowfullscreen: "",
                loading: "lazy"
            }).prependTo('.content-container');
            // Store address, hours and phone number
            jQuery('<p/>', {
                id: "store-address",
                html: doc.data().Address + "<br/>" + doc.data().Hours + "<br/>" + doc.data().Phone_Number
            }).appendTo('.store-info-container');
        });
}

// Display buttons for reviews and historical statistics with appropriate links attached (based on store location)
function displayButtons(store) {
    // "View Reviews" button
    jQuery('<a/>', {
        class: "btn btn-primary button-main",
        id: "view-reviews-button",
        href: "reviews.html?store=" + store,
        role: "button",
        html: "View Reviews"
    }).appendTo('.button-container');
    // "View Historical Statistics" button
    jQuery('<a/>', {
        class: "btn btn-primary button-main",
        id: "view-stats-button",
        href: "stats.html?store=" + store,
        role: "button",
        html: "View Historical Statistics"
    }).appendTo('.button-container');
}

// Get, update and post average ratings for all stores
function updateRating(store) {
    db.collection("Stores").doc("Costco_" + store).collection("Reviews")
        .onSnapshot((querySnapshot) => {
            store = store.toLowerCase();
            var ratings = [];
            querySnapshot.forEach((doc) => {
                ratings.push(doc.data().Reviewer_Rating);
            });
            var sum = 0;
            for (var j = 0; j < ratings.length; j++) {
                sum += ratings[j];
            }
            var avgRating = sum / ratings.length;
            document.getElementById("stars").setAttribute("style", "--rating: " + avgRating
                .toFixed(1).toString() + ";");
            document.getElementById("current-rating").innerHTML = "Current rating: " + avgRating
                .toFixed(1);
        });
}

// Call functions
$(document).ready(function () {
    const parsedUrl = new URL(window.location.href);
    var store = parsedUrl.searchParams.get("store");
    var headcount = "Current Occupancy: " + parsedUrl.searchParams.get("headcount") + "/300";
    var lastUpdate = "Updated " + parsedUrl.searchParams.get("updated") + " "
        + parsedUrl.searchParams.get("updateunit") + " ago";
    getStoreDetails(store, headcount, lastUpdate);
    displayButtons(store);
    updateRating(store);
});