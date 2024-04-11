const Item = require("../models/item");
const StoreInstance = require("../models/storeinstance");
// const Category = require("./models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numItems] = await Promise.all([Item.countDocuments({}).exec()]);

  res.render("index", {
    title: "Local GroceryStore",
    item_count: numItems,
  });
});
