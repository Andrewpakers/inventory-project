const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    stage_name: { type: String, required: true, maxLength: 100 },
    first_name: { type: String, required: false, maxLength: 100 },
    family_name: { type: String, required: false, maxLength: 100 },
    active: { type: Boolean, required: true, default: true },
    genre: [{ type: Schema.Types.ObjectId, ref: "Genre" }],
});

// Virtual for artist's URL
ArtistSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/artist/${this._id}`;
});

// Export model
module.exports = mongoose.model("Artist", ArtistSchema);
