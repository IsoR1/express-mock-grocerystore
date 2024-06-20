#! /usr/bin/env node

console.log(
  'This script populates some test items and categories to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/grocery_store?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");
const StoreInstance = require("./models/storeinstance");

const items = [];
const categories = [];
const storeinstances = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createCategories();
  await createItems();
  await createStoreInstances();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function storeInstanceCreate(
  index,
  address,
  city,
  state,
  item,
  category
) {
  const storeInstanceDetail = {
    address: address,
    city: city,
    state: state,
    category: category,
  };
  if (item != false) storeInstanceDetail.item = item;
  const storeInstance = new StoreInstance(storeInstanceDetail);
  await storeInstance.save();
  storeinstances[index] = storeInstance;
  console.log(`Added store instance with street address of ${address}`);
}

async function categoryCreate(index, name, description) {
  const categoryDetail = {
    name: name,
    description: description,
  };

  const category = new Category(categoryDetail);
  await category.save();
  categories[index] = category;
  console.log(`Added category: ${name}`);
}

async function itemCreate(
  index,
  name,
  description,
  sizeValue,
  sizeUnit,
  price,
  number_in_stock,
  category,
  aisle
) {
  const itemDetail = {
    name: name,
    description: description,
    category: category,
  };

  if (sizeValue != false) itemDetail.sizeValue = sizeValue;
  if (sizeUnit != false) itemDetail.sizeUnit = sizeUnit;
  if (price != false) itemDetail.price = price;
  if (number_in_stock != false) itemDetail.number_in_stock = number_in_stock;
  if (aisle != false) itemDetail.aisle = aisle;

  const item = new Item(itemDetail);
  await item.save();
  items[index] = item;
  console.log(`added item: ${name}`);
}

async function createCategories() {
  console.log("Adding categories");
  await Promise.all([
    categoryCreate(0, "Produce"),
    categoryCreate(1, "Butcher"),
    categoryCreate(2, "Deli"),
    categoryCreate(3, "Frozen Foods"),
    categoryCreate(4, "Bakery"),
    categoryCreate(5, "Dairy"),
    categoryCreate(6, "Packaged Foods"),
    categoryCreate(7, "Personal Goods"),
    categoryCreate(8, "Cleaning Products"),
    categoryCreate(9, "Drinks"),
    categoryCreate(10, "Seafood"),
  ]);
}

async function createItems() {
  console.log("Adding items");
  await Promise.all([
    itemCreate(
      0,
      "Milk",
      "Pasteurized Milk",
      1,
      "Gallon",
      5.0,
      10,
      categories[5]
    ),
    itemCreate(
      1,
      "Milk",
      "Pasteurized Milk",
      0.5,
      "Gallon",
      3.0,
      10,
      categories[5]
    ),
    itemCreate(
      2,
      "Large Eggs",
      "Large Eggs",
      12,
      "Piece",
      5.0,
      10,
      categories[5]
    ),
    itemCreate(
      3,
      "Classic Coca Cola",
      "Nothing beats the taste of classic Coca‑Cola!",
      2,
      "Liter",
      4.0,
      14,
      categories[9]
    ),
    itemCreate(
      4,
      "Diet Coca Cola",
      "You can always count on having the crisp, refreshing taste you know and love",
      2,
      "Liter",
      4.0,
      20,
      categories[9]
    ),
    itemCreate(
      5,
      "Diet Coca Cola",
      "You can always count on having the crisp, refreshing taste you know and love",
      12,
      "Pack",
      6.0,
      20,
      categories[9]
    ),
    itemCreate(
      6,
      "Orange Juice",
      "Fresh orange juice",
      1,
      "Liter",
      3.5,
      15,
      categories[9]
    ),
    itemCreate(
      7,
      "Apple Juice",
      "Fresh apple juice",
      64,
      "Ounce",
      4.0,
      10,
      categories[9]
    ),
    itemCreate(
      8,
      "Sparkling Water",
      "Carbonated water",
      1,
      "Liter",
      1.5,
      20,
      categories[9]
    ),
    itemCreate(
      9,
      "Chocolate Milk",
      "Chocolate-flavored milk",
      1,
      "Quart",
      2.5,
      15,
      categories[5]
    ),
    itemCreate(
      10,
      "Yogurt",
      "Greek yogurt",
      32,
      "Ounce",
      3.0,
      20,
      categories[5]
    ),
    itemCreate(
      11,
      "Cottage Cheese",
      "Low-fat cottage cheese",
      16,
      "Ounce",
      2.0,
      25,
      categories[5]
    ),
    itemCreate(12, "Bagel", "Plain bagel", 1, "Piece", 1.0, 30, categories[4]),
    itemCreate(13, "Donut", "Glazed donut", 1, "Piece", 1.5, 25, categories[4]),
    itemCreate(
      14,
      "Frozen Vegetables",
      "Mixed vegetables",
      16,
      "Ounce",
      2.0,
      30,
      categories[3]
    ),
    itemCreate(
      15,
      "Frozen Pizza",
      "Cheese frozen pizza",
      12,
      "Inch",
      5.0,
      15,
      categories[3]
    ),
    itemCreate(
      16,
      "Granola Bar",
      "Oat and honey granola bar",
      6,
      "Piece",
      3.0,
      20,
      categories[6]
    ),
    itemCreate(
      17,
      "Potato Chips",
      "Barbecue potato chips",
      8,
      "Ounce",
      2.0,
      40,
      categories[6]
    ),
    itemCreate(
      18,
      "Peanuts",
      "Salted peanuts",
      16,
      "Ounce",
      4.0,
      25,
      categories[6]
    ),
    itemCreate(
      19,
      "Pasta",
      "Fettuccine pasta",
      1,
      "Pound",
      2.0,
      20,
      categories[6]
    ),
    itemCreate(20, "Rice", "White rice", 32, "Ounce", 1.5, 30, categories[6]),
  ]);
}

async function createStoreInstances() {
  console.log("Adding store instances");
  const promises = [];
  const evenItems = items.filter((_, index) => index % 2 === 0);
  promises.push(
    storeInstanceCreate(
      0,
      "1st Fake Street",
      "Fake City",
      "Fake State",
      items,
      categories
    )
  );
  promises.push(
    storeInstanceCreate(
      1,
      "1st Real Street",
      "Real City",
      "Fake State",
      items,
      categories
    )
  );
  promises.push(
    storeInstanceCreate(
      2,
      "The Stables",
      "Winterfell",
      "The North",
      evenItems,
      categories
    )
  );

  await Promise.all(promises);
}
