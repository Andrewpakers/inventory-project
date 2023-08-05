const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require("luxon");
const path = require("path");

const UserSchema = new Schema({
    username: { type: String, required: true, maxLength: 100 },
    password: { type: String, required: true},
    join_date: { type: Date, required: true },
});

// Virtual for the item's URL
UserSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/user/${this._id}`;
});

// Virtual for a formatted release date
UserSchema.virtual("formatted_join_date").get(function () {
    return DateTime.fromJSDate(this.join_date).toLocaleString(DateTime.DATE_MED);
});

UserSchema.virtual("join_date_mmddyyyy").get(function () {
    return this.join_date ? DateTime.fromJSDate(this.join_date).toISODate() : '';
})

// Export model
module.exports = mongoose.model("User", UserSchema);
