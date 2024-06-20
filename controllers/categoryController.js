const StoreInstance = require("../models/storeinstance");
const Category = require("../models/category");
const Item = require("../models/item");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.category_list = asyncHandler(async (req, res, next) => {
  const allCategories = await Category.find().sort({ name: 1 }).exec();
  res.render("category_list", {
    title: "Category List",
    categories: allCategories,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Create Category",
  });
});

exports.category_detail = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id),
    Item.find({ category: req.params.id }, "name").exec(),
  ]);

  res.render("category_detail", {
    title: "Category Detail",
    category: category,
    categoryItems: categoryItems,
  });
});

exports.category_create_get = asyncHandler(async (req, res, next) => {
  res.render("category_form", {
    title: "Category Form",
  });
});

exports.category_create_post = [
  body("name", "Name must be not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Category Form",
        errors: errors.array(),
      });
      return;
    } else {
      await category.save();
      res.redirect(category.url);
    }
  }),
];

exports.category_delete_get = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id),
    Item.find({ category: req.params.id }).exec(),
  ]);
  if (category === null) res.redirect("/catalog/categories");

  res.render("category_delete", {
    title: "Delete Category",
    category: category,
    category_items: categoryItems,
  });
});

exports.category_delete_post = asyncHandler(async (req, res, next) => {
  const [category, categoryItems] = await Promise.all([
    Category.findById(req.params.id),
    Item.find({ category: req.params.id }).exec(),
  ]);

  if (categoryItems.length > 0) {
    res.render("category_delete", {
      title: "Delete Category",
      category: category,
      category_items: categoryItems,
    });
    return;
  } else {
    await Category.findByIdAndDelete(req.body.categoryid);
    res.redirect("/catalog/categories");
  }
});

exports.category_update_get = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  res.render("category_form", {
    title: "Update Category",
    category: category,
  });
});

exports.category_update_post = [
  body("name", "Name must be not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Name must be specified.")
    .isAlphanumeric()
    .withMessage("Name has non-alphanumeric characters."),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

    const category = new Category({
      name: req.body.name,
      _id: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("category_form", {
        title: "Update Category",
        category: category,
        errors: errors.array(),
      });
      return;
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.id,
        category,
        {}
      );
      res.redirect(updatedCategory.url);
    }
  }),
];
