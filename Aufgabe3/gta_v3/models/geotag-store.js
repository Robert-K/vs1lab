// File origin: VS1LAB A3

const { get } = require("../routes");
const GeoTag = require('../models/geotag');
const GeoTagExamples = require("./geotag-examples");

/**
 * This script is a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * A class for in-memory-storage of geotags
 * 
 * Use an array to store a multiset of geotags.
 * - The array must not be accessible from outside the store.
 * 
 * Provide a method 'addGeoTag' to add a geotag to the store.
 * 
 * Provide a method 'removeGeoTag' to delete geo-tags from the store by name.
 * 
 * Provide a method 'getNearbyGeoTags' that returns all geotags in the proximity of a location.
 * - The location is given as a parameter.
 * - The proximity is computed by means of a radius around the location.
 * 
 * Provide a method 'searchNearbyGeoTags' that returns all geotags in the proximity of a location that match a keyword.
 * - The proximity constrained is the same as for 'getNearbyGeoTags'.
 * - Keyword matching should include partial matches from name or hashtag fields. 
 */
class InMemoryGeoTagStore{

    #geoTags = [];

    addGeoTag(geoTag){
        this.#geoTags.push(geoTag);
    }

    removeGeoTag(name){
        this.#geoTags = this.#geoTags.filter(geoTag => geoTag.name !== name);
    }

    distance(longitude1, latitude1, longitude2, latitude2){
        var lon1 = parseFloat(longitude1);
        var lat1 = parseFloat(latitude1);
        var lon2 = parseFloat(longitude2);
        var lat2 = parseFloat(latitude2);
        return Math.sqrt(Math.pow(lon1 - lon2, 2) + Math.pow(lat1 - lat2, 2));
    }

    getNearbyGeoTags(longitude, latitude, radius){
        return this.#geoTags.filter(geoTag => {
            console.log(geoTag)
            var dist = this.distance(geoTag.longitude, geoTag.latitude, longitude, latitude);
            console.log(dist);
            return dist <= radius;
        });
    }

    searchNearbyGeoTags(longitude, latitude, radius, keyword){
        return this.getNearbyGeoTags(longitude, latitude, radius).filter(geoTag => geoTag.name.includes(keyword) || geoTag.hashtag.includes(keyword));
    }

    populateWithExamples() {
        GeoTagExamples.tagList.forEach(tag => {
            var newTag = new GeoTag()
            newTag.latitude = tag[1]
            newTag.longitude = tag[2]
            newTag.name = tag[0]
            newTag.hashtag = tag[3]
            this.addGeoTag(newTag)
        });
    }
}

module.exports = InMemoryGeoTagStore
