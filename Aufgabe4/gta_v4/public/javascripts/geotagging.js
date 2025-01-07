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
        updateMap(
            document.getElementById("latitude").value,
            document.getElementById("longitude").value
        )
    } else {
        LocationHelper.findLocation((helper) => {
            console.log(
                "Location found: " + helper.latitude + ", " + helper.longitude
            )
            document.getElementById("latitude").value = helper.latitude
            document.getElementById("longitude").value = helper.longitude

            document.getElementById("latitudeDiscovery").value = helper.latitude
            document.getElementById("longitudeDiscovery").value =
                helper.longitude

            updateMap(helper.latitude, helper.longitude)
        })
    }
}

let manager

function updateMap(latitude, longitude) {
    let mapContainer = document.getElementById("mapContainer")
    mapContainer.childNodes.forEach((child) => {
        child.hidden = child.id !== "map"
    })

    let taglist_json = document.getElementById("map").dataset.tags
    let tags = taglist_json ? JSON.parse(taglist_json) : []

    manager = new MapManager()
    manager.initMap(latitude, longitude)
    manager.updateMarkers(latitude, longitude, tags)
}

// Wait for the page to fully load its DOM content, then call updateLocation
document.addEventListener("DOMContentLoaded", () => {
    updateLocation()
    // alert("This isnt quite working");
})

document.getElementById("tag-form").addEventListener("submit", (event) => {
    event.preventDefault()

    let latitude = document.getElementById("latitude").value
    let longitude = document.getElementById("longitude").value
    let name = document.getElementById("name").value
    let hashtag = document.getElementById("hashtag").value

    let newGeoTag = { latitude, longitude, name, hashtag }

    fetch("/api/geotags", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newGeoTag),
    }).then(() => {
        let queryParams = new URLSearchParams({
            latitude,
            longitude,
        }).toString
        fetch(`/api/geotags/?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            response.json().then((tags) => {  
                updateDiscovery(latitude, longitude, tags)
            })
        })
    })
})

document
    .getElementById("discoveryFilterForm")
    .addEventListener("submit", (event) => {
        event.preventDefault()

        let latitude = document.getElementById("latitudeDiscovery").value
        let longitude = document.getElementById("longitudeDiscovery").value
        let searchterm = document.getElementById("searchterm").value

        let queryParams = new URLSearchParams({
            latitude,
            longitude,
            searchterm,
        }).toString()

        fetch(`/api/geotags/?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            response.json().then((tags) => {
                updateDiscovery(latitude, longitude, tags)
            })
        })
    })

function updateDiscovery(latitude, longitude, tags) {
    let taglist = document.getElementById("discoveryResults")
    taglist.innerHTML = ""
    tags.forEach((tag) => {
        let tagElement = document.createElement("li")
        tagElement.textContent = `${tag.name} (${tag.latitude}, ${tag.longitude}) ${tag.hashtag}`
        taglist.appendChild(tagElement)
    })
    manager?.updateMarkers(latitude, longitude, tags)
}