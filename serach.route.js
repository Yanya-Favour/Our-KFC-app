const { Router } = require("express");
const Menu = require("../model/menuSchema");
const asyncHandler = require("../asyncHandler");
const searchRouter = Router();

searchRouter.get("/item", asyncHandler(async (req, res) => {
  const search = String(req.query.search || "").trim();
  if (!search) return res.json([]);

  const searchPattern = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let items = await Menu.find({
    $or: [
      { title: { $regex: searchPattern, $options: "i" } },
      { desc: { $regex: searchPattern, $options: "i" } },
    ],
  });
  res.json(items);
}));
module.exports = searchRouter;
