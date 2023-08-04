const express = require("express");
const router = express.Router();


// Require controller modules.
const item_controller = require("../controllers/itemController");
const artist_controller = require("../controllers/artistController");
const genre_controller = require("../controllers/genreController");

/// ITEM ROUTES ///

// GET catalog home page.
router.get("/", item_controller.item_list);

// GET request for creating a Item. NOTE This must come before routes that display Item (uses id).
router.get("/item/create", item_controller.item_create_get);

// POST request for creating Item.
router.post("/item/create", item_controller.item_create_post);

// GET request to delete Item.
router.get("/item/:id/delete", item_controller.item_delete_get);

// POST request to delete Item.
router.post("/item/:id/delete", item_controller.item_delete_post);

// GET request to update Item.
router.get("/item/:id/update", item_controller.item_update_get);

// POST request to update Item.
router.post("/item/:id/update", item_controller.item_update_post);

// GET request for one Item.
router.get("/item/:id", item_controller.item_detail);

// GET request for list of all Item items.
router.get("/items", item_controller.item_list);

/// AUTHOR ROUTES ///

// GET request for creating Artist. NOTE This must come before route for id (i.e. display artist).
router.get("/artist/create", artist_controller.artist_create_get);

// POST request for creating Artist.
router.post("/artist/create", artist_controller.artist_create_post);

// GET request to delete Artist.
router.get("/artist/:id/delete", artist_controller.artist_delete_get);

// POST request to delete Artist.
router.post("/artist/:id/delete", artist_controller.artist_delete_post);

// GET request to update Artist.
router.get("/artist/:id/update", artist_controller.artist_update_get);

// POST request to update Artist.
router.post("/artist/:id/update", artist_controller.artist_update_post);

// GET request for one Artist.
router.get("/artist/:id", artist_controller.artist_detail);

// GET request for list of all Artists.
router.get("/artists", artist_controller.artist_list);

/// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genre_controller.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genre_controller.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genre_controller.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genre_controller.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genre_controller.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genre_controller.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genre_controller.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genre_controller.genre_list);

module.exports = router;
