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

var perPage = 5
var page = 1
var pages = 1
var total = 0

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

let manager // Initialized on load, reused for updates

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
    let searchterm = document.getElementById("searchterm").value

    let newGeoTag = { latitude, longitude, name, hashtag }

    fetch("/api/geotags", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(newGeoTag),
    }).then(() => {
        page = 1
        let queryParams = new URLSearchParams({
            latitude,
            longitude,
            searchterm,
            perPage,
            page,
        }).toString()
        fetch(`/api/geotags/?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            response.json().then((data) => {  
                updateDiscovery(latitude, longitude, data.tags)
                total = data.total
                pages = data.pages
                updatePagination()
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
        page = 1
        let queryParams = new URLSearchParams({
            latitude,
            longitude,
            searchterm,
            perPage,
            page,
        }).toString()

        fetch(`/api/geotags/?${queryParams}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            response.json().then((data) => {  
                updateDiscovery(latitude, longitude, data.tags)
                total = data.total
                pages = data.pages
                updatePagination()
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

function updatePagination() {
    document.getElementById("discoveryPrev").disabled = page === 1
    document.getElementById("discoveryNext").disabled = page === pages
    document.getElementById("paginationText").textContent = `${page} / ${pages} (${total})`
}

function updateDiscoveryPage() {
    let latitude = document.getElementById("latitudeDiscovery").value
    let longitude = document.getElementById("longitudeDiscovery").value
    let searchterm = document.getElementById("searchterm").value

    let queryParams = new URLSearchParams({
        latitude,
        longitude,
        searchterm,
        perPage,
        page,
    }).toString()

    fetch(`/api/geotags/?${queryParams}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    }).then((response) => {
        response.json().then((tags) => {
            pages = tags.pages
            total = tags.total
            updateDiscovery(latitude, longitude, tags.tags)
            updatePagination()
        })
    })
}

document.getElementById("discoveryPrev").addEventListener("click", (event) => {
    if (page > 1) {
        page--
        updateDiscoveryPage()
    }
    event.target.disabled = page === 1
})

document.getElementById("discoveryNext").addEventListener("click", (event) => {
    if (page < pages) {
        page++
        updateDiscoveryPage()
    }
    event.target.disabled = page === pages
})