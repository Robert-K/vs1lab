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

var latitude = null;
var longitude = null;

function updateLocation() {
    if (document.getElementById("latitude").value === latitude) return
    if (document.getElementById("longitude").value === longitude) return
    LocationHelper.findLocation((helper) => {
        document.getElementById("latitude").value = helper.latitude
        document.getElementById("longitude").value = helper.longitude

        document.getElementById("latitudeDiscovery").value = helper.latitude
        document.getElementById("longitudeDiscovery").value = helper.longitude

        let mapContainer = document.getElementById("mapContainer")
        mapContainer.innerHTML = ""
        mapContainer
            .appendChild(document.createElement("div"))
            .setAttribute("id", "map")

        let manager = new MapManager()
        manager.initMap(helper.latitude, helper.longitude)
        manager.updateMarkers(helper.latitude, helper.longitude)

        latitude = helper.latitude
        longitude = helper.longitude
    })
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation()
    // alert("This isnt quite working");
})
