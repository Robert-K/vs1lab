// File origin: VS1LAB A2

/* eslint-disable no-unused-vars */

// This script is executed when the browser loads index.html.

// "console.log" writes to the browser's console.
// The console window must be opened explicitly in the browser.
// Try to find this output in the browser...
console.log("The geoTagging script is going to start...")

/**
 * TODO: 'updateLocation'
 * A function to retrieve the current location and update the page.
 * It is called once the page has been fully loaded.
 */
// ... your code here ...

function updateLocation() {
    if (document.getElementById("latitude").value) {
        updateMap(document.getElementById("latitude").value, document.getElementById("longitude").value)
    } else {
        LocationHelper.findLocation((helper) => {
            console.log("Location found: " + helper.latitude + ", " + helper.longitude)
            document.getElementById("latitude").value = helper.latitude
            document.getElementById("longitude").value = helper.longitude

            document.getElementById("latitudeDiscovery").value = helper.latitude
            document.getElementById("longitudeDiscovery").value = helper.longitude

            updateMap(helper.latitude, helper.longitude)
        })
    }
}

function updateMap(latitude, longitude) {
    let mapContainer = document.getElementById("mapContainer")
    mapContainer.childNodes.forEach((child) => {
        child.hidden = child.id !== "map"
    })

    let taglist_json = document.getElementById("map").dataset.tags
    let tags = taglist_json ? JSON.parse(taglist_json) : []

    let manager = new MapManager()
    manager.initMap(latitude, longitude)
    manager.updateMarkers(latitude, longitude, tags)
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation()
    // alert("This isnt quite working");
})
