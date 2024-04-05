const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const StoreInstanceSchema = new Schema({
  address: { type: String, required: true, maxLength: 100, minLength: 3 },
  city: { type: String, required: true, maxLength: 60, minLength: 3 },
  state: { type: String, required: true, maxLength: 50, minLength: 3 },
  item: [
    {
      type: Schema.Types.ObjectId,
      ref: "Item",
      required: true,
    },
  ],
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
});
StoreInstanceSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("StoreInstance", StoreInstanceSchema);
