const mongoose = require("mongoose");
const connection = require("../Database/db");
const Menu = require("../model/menuSchema");
const { favorites, featured, quickbites } = require("../model/LandingSchema");
const catalog = require("../../frontend/kfc-app/src/SliderData.json");

const upsertRecords = (model, records) => model.bulkWrite(
  records.map(({ title, ...record }) => ({
    updateOne: {
      filter: { title },
      update: { $set: { title, ...record } },
      upsert: true,
    },
  }))
);

const seed = async () => {
  await connection;
  const menuItems = [...new Map(
    Object.values(catalog).flat().map((item) => [item.title, item])
  ).values()];

  await Promise.all([
    upsertRecords(Menu, menuItems),
    upsertRecords(favorites, catalog.favorites),
    upsertRecords(featured, catalog.featured),
    upsertRecords(quickbites, catalog.quickbites),
  ]);

  console.log(`Seeded ${menuItems.length} menu items and ${catalog.favorites.length} favorites, ${catalog.featured.length} featured items, and ${catalog.quickbites.length} quick bites.`);
};

seed()
  .catch((error) => {
    console.error("Could not seed MongoDB:", error);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
