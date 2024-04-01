const mongoose = require("moongoose");

const Schema = mongoose.schema;

const DepartmentSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
});

DepartmentSchema.virtual("url").get(function () {
  return `/${this._id}`;
});

module.exports = mongoose.model("Department", DepartmentSchema);
