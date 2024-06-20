const Item = require("../models/item");
const StoreInstance = require("../models/storeinstance");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req, res, next) => {
  const [numItems, numStoreInstances, numCategories] = await Promise.all([
    Item.countDocuments({}).exec(),
    StoreInstance.countDocuments({}).exec(),
    Category.countDocuments({}).exec(),
  ]);

  res.render("index", {
    title: "Local GroceryStore",
    item_count: numItems,
    store_instance_count: numStoreInstances,
    category_count: numCategories,
  });
});

exports.item_list = asyncHandler(async (req, res, next) => {
  const allItems = await Item.find({}, "name description category")
    .sort()
    .populate("category")
    .exec();

  res.render("item_list", { title: "Item List", item_list: allItems });
});

exports.item_detail = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).populate("category");

  if (item === null) {
    const err = new Error("Item not found");
    return next(err);
  }

  res.render("item_detail", { title: "Item Detail", item: item });
});

exports.item_create_get = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 });
  res.render("item_form", {
    title: "Create Item",
    categories: allCategories,
  });
});

exports.item_create_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("size_value", "Invalid size value").escape(),
  body("size_unit", "Invalid size unit").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      size_value: req.body.size_value,
      size_unit: req.body.size_unit,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
    });
    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 });

      res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
        error: errors.array(),
      });
    } else {
      await item.save();
      res.redirect(item.url);
    }
  }),
];

exports.item_delete_get = asyncHandler(async (req, res, next) => {
  const item = await Item.findById(req.params.id).exec();
  if (item === null) res.redirect("/catalog/items");

  res.render("item_delete", {
    title: "Delete Item",
    item: item,
  });
});

exports.item_delete_post = asyncHandler(async (req, res, next) => {
  await Item.findByIdAndDelete(req.body.itemid);
  res.redirect("/catalog/items");
});

exports.item_update_get = asyncHandler(async (req, res, next) => {
  const [item, allCategories] = await Promise.all([
    Item.findById(req.params.id).populate("category").exec(),
    Category.find().sort({ name: 1 }).exec(),
  ]);

  if (item === null) {
    const err = new Error("Item not found");
    err.status = 404;
    return next(err);
  }

  res.render("item_form", {
    title: "Update Item",
    item: item,
    categories: allCategories,
  });
});

exports.item_update_post = [
  body("name", "Name must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("category", "Category must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("size_value", "Invalid size value").escape(),
  body("size_unit", "Invalid size unit").escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const item = new Item({
      name: req.body.name,
      description: req.body.description,
      size_value: req.body.size_value,
      size_unit: req.body.size_unit,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      const allCategories = await Category.find().sort({ name: 1 }).exec();

      res.render("item_form", {
        title: "Update Item",
        item: item,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedItem = await Item.findByIdAndUpdate(req.params.id, item, {});
      res.redirect(updatedItem.url);
    }
  }),
];
