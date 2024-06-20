const Item = require("../models/item");
const StoreInstance = require("../models/storeinstance");
const Category = require("../models/category");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.store_instance_list = asyncHandler(async (req, res, next) => {
  const allStoreInstances = await StoreInstance.find(
    {},
    "address city state item"
  )
    .sort()
    .populate("item")
    .populate("category")
    .exec();

  res.render("storeinstance_list", {
    title: "Store Instance List",
    storeinstance_list: allStoreInstances,
  });
});

exports.store_instance_detail = asyncHandler(async (req, res, next) => {
  // const [storeInstance, storeItems, storeCategory] = await Promise.all
  const storeInstance = await StoreInstance.findById(req.params.id)
    .populate("item")
    .populate("category")
    .exec();
  if (storeInstance === null) {
    const err = new Error("Store Instance not found");
    return next(err);
  }

  res.render("storeinstance_detail", {
    title: "Store Instance",
    storeinstance: storeInstance,
    items: storeInstance.item,
  });
});

exports.store_instance_create_get = asyncHandler(async (req, res, next) => {
  const [allCategories, allItems] = await Promise.all([
    Category.find().sort({ name: 1 }),
    Item.find().sort({ name: 1 }),
  ]);
  res.render("storeinstance_form", {
    title: "Create Store Instance",
    categories: allCategories,
    items: allItems,
  });
});

exports.store_instance_create_post = [
  body("address", "Address must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("city", "City must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("state", "State must not be empty").trim().isLength({ min: 1 }).escape(),
  body("item"),
  body("category"),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const storeInstance = new StoreInstance({
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      category: req.body.category,
      item: req.body.item,
    });
    if (!errors.isEmpty()) {
      const [allCategories, allItems] = await Promise.all([
        Category.find().sort({ name: 1 }),
        Item.find().sort({ name: 1 }),
      ]);

      res.render("storeisntance_form", {
        title: "Create Store Instance",
        categories: allCategories,
        items: allItems,
        error: errors.array(),
      });
    } else {
      await storeInstance.save();
      res.redirect(storeInstance.url);
    }
  }),
];

exports.store_instance_delete_get = asyncHandler(async (req, res, next) => {
  const storeInstance = await StoreInstance.findById(req.params.id)
    .populate("item")
    .populate("category")
    .exec();

  if (storeInstance === null) res.redirect("/catalog/storeinstances");

  res.render("storeinstance_delete", {
    title: "Delete Store Instance",
    storeinstance: storeInstance,
    items: storeInstance.item,
  });
});

exports.store_instance_delete_post = asyncHandler(async (req, res, next) => {
  await StoreInstance.findByIdAndDelete(req.params.id);
  res.redirect("/catalog/stores");
});

exports.store_instance_update_get = asyncHandler(async (req, res, next) => {
  const [storeInstance, allCategories, allItems] = await Promise.all([
    StoreInstance.findById(req.params.id)
      .populate("item")
      .populate("category")
      .exec(),
    Category.find().sort({ name: 1 }),
    Item.find().sort({ name: 1 }),
  ]);

  if (storeInstance === null) {
    const err = new Error("Store not found");
    err.status = 404;
    return next(err);
  }

  const storeItemIds = storeInstance.item.map((item) => item._id.toString());

  allItems.forEach((item) => {
    if (storeItemIds.includes(item._id.toString())) {
      item.checked = "true";
    }
  });

  const categoryIds = storeInstance.category.map((cat) => cat._id.toString());

  allCategories.forEach((category) => {
    if (categoryIds.includes(category._id.toString())) {
      category.checked = "true";
    }
  });

  res.render("storeinstance_form", {
    title: "Update Store",
    storeinstance: storeInstance,
    items: allItems,
    categories: allCategories,
  });
});

exports.store_instance_update_post = [
  (req, res, next) => {
    if (!Array.isArray(req.body.category)) {
      req.body.category =
        typeof req.body.category === "undefined" ? [] : [req.body.category];
    }
    if (!Array.isArray(req.body.item)) {
      req.body.item =
        typeof req.body.item === "undefined" ? [] : [req.body.item];
    }
    next();
  },

  body("address", "Address must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("city", "City must not be empty.").trim().isLength({ min: 1 }).escape(),
  body("state", "State must not be empty").trim().isLength({ min: 1 }).escape(),
  body("item"),
  body("category"),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const storeInstance = new StoreInstance({
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      category: req.body.category,
      item: req.body.item,
      _id: req.params.id,
    });
    if (!errors.isEmpty()) {
      const [allCategories, allItems] = await Promise.all([
        Category.find().sort({ name: 1 }),
        Item.find().sort({ name: 1 }),
      ]);
      res.render("storeinstance_form", {
        title: "Update Store",
        storeinstance: storeInstance,
        items: allItems,
        categories: allCategories,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedStoreInstance = await StoreInstance.findByIdAndUpdate(
        req.params.id,
        storeInstance,
        {}
      );
      res.redirect(updatedStoreInstance.url);
    }
  }),
];
