const mongoose = require("moongoose");

const Schema = mongoose.schema;

const ItemSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
  description: { type: String, required: true, maxLength: 200 },
  price: { type: Number },
  in_stock_count: { type: Number },
  department: {
    type: Schema.Types.ObjectId,
    ref: "Department",
    required: true,
  },
  aisle: { type: Number },
});

ItemSchema.virtual("url").get(function () {
  return `/department/${this._id}`;
});

module.exports = mongoose.model("Item", ItemSchema);
