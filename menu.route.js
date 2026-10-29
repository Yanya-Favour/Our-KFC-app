const { Router } = require("express");
const Menu = require("../model/menuSchema");
const asyncHandler = require("../asyncHandler");
const menuRouter = Router();

menuRouter.get("/menu", asyncHandler(async (req, res) => {
  const { type } = req.query;
  const items = await Menu.find(type ? { type } : {});
  res.json(items);
}));

menuRouter.get("/menu/:id", asyncHandler(async (req, res) => {
  const item = await Menu.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Menu item not found" });
  return res.json(item);
}));
module.exports = menuRouter;