const express = require("express");
const router = express.Router();

const category_controller = require("../controllers/categoryController.js");
const item_controller = require("../controllers/itemController.js");
const store_instance_controller = require("../controllers/storeinstanceController.js");

router.get("/", item_controller.index);

router.get("/item/create", item_controller.item_create_get);

router.post("/item/create", item_controller.item_create_post);

router.get("/item/:id/delete", item_controller.item_delete_get);

router.post("/item/:id/delete", item_controller.item_delete_post);

router.get("/item/:id/update", item_controller.item_update_get);

router.post("/item/:id/update", item_controller.item_update_post);

router.get("/items", item_controller.item_list);

router.get("/item/:id", item_controller.item_detail);

// category routes

router.get("/categories", category_controller.category_list);

router.get("/category/create", category_controller.category_create_get);

router.post("/category/create", category_controller.category_create_post);

router.get("/category/:id/delete", category_controller.category_delete_get);

router.post("/category/:id/delete", category_controller.category_delete_post);

router.get("/category/:id/update", category_controller.category_update_get);

router.post("/category/:id/update", category_controller.category_update_post);

router.get("/category/:id", category_controller.category_detail);

// store instance routes

router.get("/storeinstances", store_instance_controller.store_instance_list);

router.get(
  "/storeinstance/create",
  store_instance_controller.store_instance_create_get
);

router.post(
  "/storeinstance/create",
  store_instance_controller.store_instance_create_post
);

router.get(
  "/storeinstance/:id/delete",
  store_instance_controller.store_instance_delete_get
);

router.post(
  "/storeinstance/:id/delete",
  store_instance_controller.store_instance_delete_post
);

router.get(
  "/storeinstance/:id/update",
  store_instance_controller.store_instance_update_get
);

router.post(
  "/storeinstance/:id/update",
  store_instance_controller.store_instance_update_post
);

router.get(
  "/storeinstance/:id",
  store_instance_controller.store_instance_detail
);

module.exports = router;
