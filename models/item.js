const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
const path = require("path");

const ItemSchema = new Schema({
    name: { type: String, required: true, maxLength: 100 },
    description: { type: String, required: true},
    artist: [{ type: Schema.Types.ObjectId, ref: "Artist" }],
    price: { type: Number, required: true, min: 0 },
    release_date: { type: Date, required: true },
    quantity: { type: Number, required: true, min: 0 },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
    image: { type: String, required: false },
});

// Virtual for the item's URL
ItemSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/item/${this._id}`;
});

// Virtual for the items's genre names
ItemSchema.virtual("genres").get(function () {
    return this.genre.map((genre) => genre.name).join(", ");
});

// Virutal for a truncated description
ItemSchema.virtual("truncated_description").get(function () {
    return this.description.substring(0, 200) + "...";
});

// Virtual for the item's thumbnail image
ItemSchema.virtual("thumbnail").get(function () {
    if (this.image) {
        return this.image;
    } else {
        return path.join('images','placeholder-image.png');
    }
});

// Virtual for a formatted release date
ItemSchema.virtual("formatted_release_date").get(function () {
    return DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED);
});

ItemSchema.virtual("release_date_mmddyyyy").get(function () {
    return this.release_date ? DateTime.fromJSDate(this.release_date).toISODate() : '';
})

// Export model
module.exports = mongoose.model("Item", ItemSchema);
