const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  name: { type: String, required: true, maxLength: 100, minLength: 3 },
  description: { type: String, required: true, minLength: 3 },
});

CategorySchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Category", CategorySchema);
