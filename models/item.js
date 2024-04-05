const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 200 },
  price: { type: Number },
  number_in_stock: { type: Number },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  aisle: { type: Number },
});

ItemSchema.virtual("url").get(function () {
  return `/category/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
