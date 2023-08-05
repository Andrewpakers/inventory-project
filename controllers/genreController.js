const Genre = require("../models/genre");
const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");

// Display list of all Genre.
exports.genre_list = asyncHandler(async (req, res, next) => {
    const allGenres = await Genre.find().sort({ name: 1 }).exec();
    res.render("genre_list", {
      title: "Genre List",
      genre_list: allGenres,
    });
});

// Display detail page for a specific Genre.
exports.genre_detail = asyncHandler(async (req, res, next) => {
    const genre = await Genre.findOne({ _id: req.params.id }).exec();
    const allItems = await Item
        .find({ genre: req.params.id})
        .sort({ name: 1 })
        .populate("artist")
        .populate("genre")
        .exec();
    const allArtists = await Artist.find({genre: req.params.id}).sort({name: 1}).exec();
    res.render("genre_detail", { title: genre.name, artist_list: allArtists, item_list: allItems, genre: genre });
});

// Display Genre create form on GET.
exports.genre_create_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    res.render("genre_form", { title: "Create Genre" });
});

// Handle Genre create on POST.
exports.genre_create_post = [
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.redirect("/login");
        }
        next();
    }),
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Genre name must be specified."),
    body("description")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Genre description must be specified."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({
            name: req.body.name,
            description: req.body.description,
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
    
            // Save author.
        await genre.save();
            // Redirect to new author record.
        res.redirect(genre.url);
    }}),
];

// Display Genre delete form on GET.
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const genre = await Genre.findOne({ _id: req.params.id }).exec();
    const genre_items = await Item.find({ genre: req.params.id }).populate("genre").populate("artist").exec();
    const genre_artists = await Artist.find({ genre: req.params.id }).populate("genre").exec();
    if (genre === null) {
        res.redirect("/genres");
    }
    res.render("genre_delete", { title: "Delete Genre", genre: genre, genre_items: genre_items, genre_artists: genre_artists });
});

// Handle Genre delete on POST.
exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const [genre, allItemsByGenre, allArtistsByGenre] = await Promise.all([
        Genre.findById(req.params.id).exec(),
        Item.find({ genre: req.params.id }).populate("genre").populate("artist").exec(),
        Artist.find({ genre: req.params.id }).populate("genre").exec(),
    ]);
    if (allItemsByGenre.length > 0 || allArtistsByGenre.length > 0) {
        res.render("genre_delete", { title: "Delete Genre", genre: genre, genre_items: allItemsByGenre, genre_artists: allArtistsByGenre });
        return;
    }
    await Genre.findByIdAndRemove(req.body.genreid);
    res.redirect("/genres");
});

// Display Genre update form on GET.
exports.genre_update_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const genre = await Genre.findOne({ _id: req.params.id }).exec();
    res.render("genre_form", { title: "Update Genre", genre: genre });
});

// Handle Genre update on POST.
exports.genre_update_post = [
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.redirect("/login");
        }
        next();
    }),
    body("name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Genre name must be specified."),
    body("description")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Genre description must be specified."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const genre = new Genre({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            res.render("genre_form", {
                title: "Create Genre",
                genre: genre,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
    
            // Save author.
        const thegenre = await Genre.findByIdAndUpdate(req.params.id, genre, {});
            // Redirect to new author record.
        res.redirect(genre.url);
    }}),
];
