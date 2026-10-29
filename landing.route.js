const { Router } = require("express");
const { favorites, featured, quickbites } = require("../model/LandingSchema");
const asyncHandler = require("../asyncHandler");
const landingRouter = Router();

landingRouter.get("/favorites", asyncHandler(async (req, res) => {
  const fav = await favorites.find();
  res.status(200).send(fav);
}));

landingRouter.get("/featured", asyncHandler(async (req, res) => {
  const feature = await featured.find();
  res.status(200).send(feature);
}));

landingRouter.get("/quickbites", asyncHandler(async (req, res) => {
  const quickbite = await quickbites.find();
  res.status(200).send(quickbite);
}));
module.exports = landingRouter;
