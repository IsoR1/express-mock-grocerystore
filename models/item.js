const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 200 },
  size: [
    { type: Number },
    {
      type: String,
      enum: ["Ounce", "Pound", "Gallon", "Pint", "Quart", "Piece", "Liter"],
    },
  ],
  price: { type: Number },
  number_in_stock: { type: Number, default: 0 },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  aisle: { type: Number },
});

ItemSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
