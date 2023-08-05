const Item = require("../models/item");
const Genre = require("../models/genre");
const Artist = require("../models/artist");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: 'public/images/albums/',
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const extension = '.' + file.originalname.split('.').pop();
      cb(null, file.fieldname + '-' + uniqueSuffix + extension)
    }
})

const upload = multer({ storage: storage })

exports.index = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Site Home Page");
});

// Display list of all items.
exports.item_list = asyncHandler(async (req, res, next) => {
    const allItems = await Item
        .find()
        .sort({ name: 1 })
        .populate("artist")
        .populate("genre")
        .exec();
    res.render("item_list", { title: "Andrew's Record Shop", item_list: allItems });
});

// Display detail page for a specific item.
exports.item_detail = asyncHandler(async (req, res, next) => {
    const item = await Item
        .findOne({ _id: req.params.id})
        .populate("artist")
        .populate("genre")
        .exec();
    res.render("item_detail", { title: `${item.name} by ${item.artist[0].stage_name}`, item: item });
});

// Display item create form on GET.
exports.item_create_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const genres = await Genre.find().exec();
    const artists = await Artist.find().exec();
    res.render("item_form", { title: "Create Item", genres: genres, artists: artists });
});

// Handle item create on POST.
exports.item_create_post = [
    asyncHandler(async (req, res, next) => {
        if (!req.user) {
            res.redirect("/login");
        }
        next();
    }),
    upload.single('cover'),
    asyncHandler(async (req, res, next) => {
        console.log(req.file);
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
    body("artist")
        .exists()
        .escape()
        .withMessage("Artist must be specified."),
    body("genre")
        .exists()
        .escape()
        .withMessage("Genre must be specified."),
    body("price")
        .isCurrency()
        .escape()
        .withMessage("Price must be specified."),
    body("release_date")
        .isISO8601()
        .toDate()
        .withMessage("Release date must be specified."),
    body("quantity")
        .isInt({ min: 0 })
        .escape()
        .withMessage("Quantity must be specified."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            artist: [req.body.artist],
            genre: [req.body.genre],
            price: req.body.price,
            release_date: req.body.release_date,
            quantity: req.body.quantity,
        });
        if (req.file) {
            item.image = "images/albums/" + req.file.filename;
        }
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            const genres = await Genre.find().exec();
            const artists = await Artist.find().exec();
            res.render("item_form", {
                title: "Create Album",
                item: item,
                genres: genres,
                artists: artists,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
    
            // Save author.
        await item.save();
            // Redirect to new author record.
        res.redirect(item.url);
    }}),
];

// Display item delete form on GET.
exports.item_delete_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const item = await Item.findOne({ _id: req.params.id }).exec();
    if (item === null) {
        res.redirect("/items");
    }
    res.render("item_delete", { title: "Delete Album", item: item });
});

// Handle item delete on POST.
exports.item_delete_post = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    await Item.findByIdAndRemove(req.body.itemid);
    res.redirect("/items");
});

// Display item update form on GET.
exports.item_update_get = asyncHandler(async (req, res, next) => {
    if (!req.user) {
        res.redirect("/login");
    }
    const item = await Item.findOne({ _id: req.params.id }).exec();
    const genres = await Genre.find().exec();
    const artists = await Artist.find().exec();
    res.render("item_form", { title: "Update Item", item: item, genres: genres, artists: artists});
});

// Handle item update on POST.
exports.item_update_post = [
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
    body("artist")
        .exists()
        .escape()
        .withMessage("Artist must be specified."),
    body("genre")
        .exists()
        .escape()
        .withMessage("Genre must be specified."),
    body("price")
        .isCurrency()
        .escape()
        .withMessage("Price must be specified."),
    body("release_date")
        .isISO8601()
        .toDate()
        .withMessage("Release date must be specified."),
    body("quantity")
        .isInt({ min: 0 })
        .escape()
        .withMessage("Quantity must be specified."),
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        const item = new Item({
            name: req.body.name,
            description: req.body.description,
            artist: [req.body.artist],
            genre: [req.body.genre],
            price: req.body.price,
            release_date: req.body.release_date,
            quantity: req.body.quantity,
            _id: req.params.id,
        });
        if (!errors.isEmpty()) {
            // There are errors. Render form again with sanitized values/errors messages.
            const genres = await Genre.find().exec();
            const artists = await Artist.find().exec();
            res.render("item_form", {
                title: "Create Album",
                item: item,
                genres: genres,
                artists: artists,
                errors: errors.array(),
            });
            return;
        } else {
            // Data from form is valid.
    
            // Save author.
        const theitem = await Item.findByIdAndUpdate(req.params.id, item, {});
            // Redirect to new author record.
        res.redirect(item.url);
    }}),
];
