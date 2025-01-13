// File origin: VS1LAB A3

/**
 * This script defines the main router of the GeoTag server.
 * It's a template for exercise VS1lab/Aufgabe3
 * Complete all TODOs in the code documentation.
 */

/**
 * Define module dependencies.
 */

const express = require('express');
const router = express.Router();

/**
 * The module "geotag" exports a class GeoTagStore. 
 * It represents geotags.
 * 
 * TODO: implement the module in the file "../models/geotag.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTag = require('../models/geotag');

/**
 * The module "geotag-store" exports a class GeoTagStore. 
 * It provides an in-memory store for geotag objects.
 * 
 * TODO: implement the module in the file "../models/geotag-store.js"
 */
// eslint-disable-next-line no-unused-vars
const GeoTagStore = require('../models/geotag-store');

const tagStore = new GeoTagStore()
tagStore.populateWithExamples()

const NEARBY_RADIUS = 1 // 0.004

/**
 * Route '/' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests cary no parameters
 *
 * As response, the ejs-template is rendered without geotag objects.
 */

// TODO: extend the following route example if necessary
router.get('/', (req, res) => {
  res.render('index', { taglist: [] })
});

/**
 * Route '/tagging' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the tagging form in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * Based on the form data, a new geotag is created and stored.
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the new geotag.
 * To this end, "GeoTagStore" provides a method to search geotags 
 * by radius around a given location.
 */

// TODO: ... your code here ...
router.post('/tagging', (req, res) => {
  var newTag = new GeoTag()
  newTag.latitude = req.body.latitude
  newTag.longitude = req.body.longitude
  newTag.name = req.body.name
  newTag.hashtag = req.body.hashtag
  tagStore.addGeoTag(newTag)
  res.render('index', { 
    taglist: tagStore.getNearbyGeoTags(newTag.longitude, newTag.latitude, NEARBY_RADIUS),
    longitude: newTag.longitude,
    latitude: newTag.latitude
   })
});

/**
 * Route '/discovery' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests cary the fields of the discovery form in the body.
 * This includes coordinates and an optional search term.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * As response, the ejs-template is rendered with geotag objects.
 * All result objects are located in the proximity of the given coordinates.
 * If a search term is given, the results are further filtered to contain 
 * the term as a part of their names or hashtags. 
 * To this end, "GeoTagStore" provides methods to search geotags 
 * by radius and keyword.
 */

router.post('/discovery', (req, res) => {
  var longitude = req.body.longitude
  var latitude = req.body.latitude
  var searchterm = req.body.searchterm
  if (searchterm) {
    res.render('index', { 
      taglist: tagStore.searchNearbyGeoTags(longitude, latitude, NEARBY_RADIUS, searchterm),
      longitude: longitude,
      latitude: latitude,
     })
  } else {
    res.render('index', { 
      taglist: tagStore.getNearbyGeoTags(longitude, latitude, NEARBY_RADIUS)
    })
  }
});

// API routes (A4)

/**
 * Route '/api/geotags' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the fields of the Discovery form as query.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * As a response, an array with Geo Tag objects is rendered as JSON.
 * If 'searchterm' is present, it will be filtered by search term.
 * If 'latitude' and 'longitude' are available, it will be further filtered based on radius.
 */

router.get('/api/geotags', (req, res) => {
  var perPage = req.query.perPage
  var page = req.query.page

  var longitude = req.query.longitude
  var latitude = req.query.latitude
  var searchterm = req.query.searchterm
  var response = []
  if (searchterm) {
    if (latitude && longitude) {
      response = tagStore.searchNearbyGeoTags(longitude, latitude, NEARBY_RADIUS, searchterm)
    } else {
      response = tagStore.searchGeoTags(searchterm)
    }
  } else {
    response = tagStore.getGeoTags()
  }
  if (perPage && page) {
    response = {tags: response.slice(perPage * (page - 1), perPage * page), pages: Math.ceil(response.length / perPage), total: response.length}
  }
  res.json(response)
});


/**
 * Route '/api/geotags' for HTTP 'POST' requests.
 * (http://expressjs.com/de/4x/api.html#app.post.method)
 *
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.body)
 *
 * The URL of the new resource is returned in the header as a response.
 * The new resource is rendered as JSON in the response.
 */

router.post('/api/geotags', (req, res) => {
  var newTag = new GeoTag()
  newTag.latitude = req.body.latitude
  newTag.longitude = req.body.longitude
  newTag.name = req.body.name
  newTag.hashtag = req.body.hashtag
  var newId = tagStore.getNewId()
  tagStore.addGeoTag(newTag, newId)
  res.location('/api/geotags/' + newId)
  res.status(201).json(newTag)
});


/**
 * Route '/api/geotags/:id' for HTTP 'GET' requests.
 * (http://expressjs.com/de/4x/api.html#app.get.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * The requested tag is rendered as JSON in the response.
 */

router.get('/api/geotags/:id', (req, res) => {
  var id = req.params.id
  res.json(tagStore.getGeoTagById(id))
});


/**
 * Route '/api/geotags/:id' for HTTP 'PUT' requests.
 * (http://expressjs.com/de/4x/api.html#app.put.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 * 
 * Requests contain a GeoTag as JSON in the body.
 * (http://expressjs.com/de/4x/api.html#req.query)
 *
 * Changes the tag with the corresponding ID to the sent value.
 * The updated resource is rendered as JSON in the response. 
 */

router.put('/api/geotags/:id', (req, res) => {
  var id = req.params.id
  var newTag = new GeoTag()
  newTag.latitude = req.body.latitude
  newTag.longitude = req.body.longitude
  newTag.name = req.body.name
  newTag.hashtag = req.body.hashtag
  tagStore.setGeoTag(id, newTag)
  res.json(newTag)
});


/**
 * Route '/api/geotags/:id' for HTTP 'DELETE' requests.
 * (http://expressjs.com/de/4x/api.html#app.delete.method)
 *
 * Requests contain the ID of a tag in the path.
 * (http://expressjs.com/de/4x/api.html#req.params)
 *
 * Deletes the tag with the corresponding ID.
 * The deleted resource is rendered as JSON in the response.
 */

router.delete('/api/geotags/:id', (req, res) => {
  var id = req.params.id
  var tag = tagStore.getGeoTagById(id)
  if (!tag) {
    return res.status(400).json({ error: 'Tag not found' })
  }
  tagStore.removeGeoTagById(id)
  res.json(tag)
});

module.exports = router;
