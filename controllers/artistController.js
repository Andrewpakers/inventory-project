const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Item = require("../models/item");
const Genre = require("../models/genre");

// Display list of all Artists.
exports.artist_list = asyncHandler(async (req, res, next) => {
  const allArtists = await Artist.find().sort({ stage_name: 1 }).exec();
  res.render("artist_list", {
    title: "Artist List",
    artist_list: allArtists,
  });
});

// Display detail page for a specific Artist.
exports.artist_detail = asyncHandler(async (req, res, next) => {
    const artist = await Artist.findOne({ _id: req.params.id }).exec();
    const allItems = await Item
        .find({ artist: req.params.id})
        .sort({ name: 1 })
        .populate("genre")
        .exec();
    res.render("artist_detail", { title: artist.stage_name, item_list: allItems, artist: artist });
});

// Display Artist create form on GET.
exports.artist_create_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const genres = await Genre.find().exec();
    res.render("artist_form", { title: "Create Artist", genres: genres });
});

// Handle Artist create on POST.
exports.artist_create_post = [
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.redirect("/login");
        }
        next();
    }),
    body("stage_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Stage name must be specified."),
    body("first_name")
        .trim()
        .escape(),
    body("family_name")
        .trim()
        .escape(),
    body('genre')
        .exists()
        .escape(),
    body("active")
        .isBoolean()
        .escape(),
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Artist object with escaped and trimmed data
        const artist = new Artist({
        stage_name: req.body.stage_name,
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        genre: [req.body.genre],
        active: req.body.active,
        });

        if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("artist_form", {
            title: "Create Artist",
            artist: artist,
            errors: errors.array(),
        });
        return;
        } else {
        // Data from form is valid.

        // Save artist.
        await artist.save();
        // Redirect to new artist record.
        res.redirect(artist.url);
        }
    }),
];

// Display Artist delete form on GET.
exports.artist_delete_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const artist = await Artist.findOne({ _id: req.params.id }).exec();
    const artist_items = await Item.find({ artist: req.params.id }).populate("artist").populate("genre").exec();
    if (artist === null) {
        res.redirect("/artists");
    }
    res.render("artist_delete", { title: "Delete Artist", artist_items: artist_items, artist: artist });
});

// Handle Artist delete on POST.
exports.artist_delete_post = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const [artist, allItemsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Item.find({ artist: req.params.id }).populate("artist").populate("genre").exec(),
      ]);
    if (allItemsByArtist.length > 0) {
        res.render("artist_delete", { title: "Delete Artist", artist_items: allItemsByArtist, artist: artist });
        return;
    }
    await Artist.findByIdAndRemove(req.body.artistid);
    res.redirect("/artists");
});

// Display Artist update form on GET.
exports.artist_update_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const artist = await Artist.findOne({ _id: req.params.id }).exec();
    const genres = await Genre.find().exec();
    res.render("artist_form", { title: "Update Artist", artist: artist, genres: genres });
});

// Handle Artist update on POST.
exports.artist_update_post = [
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.redirect("/login");
        }
        next();
    }),
    body("stage_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Stage name must be specified."),
    body("first_name")
        .trim()
        .escape(),
    body("family_name")
        .trim()
        .escape(),
    body('genre')
        .exists()
        .escape(),
    body("active")
        .isBoolean()
        .escape(),
    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);

        // Create Artist object with escaped and trimmed data
        const artist = new Artist({
        stage_name: req.body.stage_name,
        first_name: req.body.first_name,
        family_name: req.body.family_name,
        genre: [req.body.genre],
        active: req.body.active,
        _id: req.params.id,
        });

        if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/errors messages.
        res.render("artist_form", {
            title: "Create Artist",
            artist: artist,
            errors: errors.array(),
        });
        return;
        } else {
        // Data from form is valid.

        // Save artist.
        const theartist = await Artist.findByIdAndUpdate(req.params.id, artist, {});
        // Redirect to new artist record.
        res.redirect(artist.url);
        }
    }),
];
