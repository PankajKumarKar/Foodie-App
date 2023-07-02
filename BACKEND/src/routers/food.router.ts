import { Router } from "express";
import { sample_foods, sample_tags } from "../data";
import expressAsyncHandler from "express-async-handler";
import { foodModel } from "../models/food.model";

const router = Router();

router.get(
  "/seed",
  expressAsyncHandler(async (req, res) => {
    const foodCount = await foodModel.countDocuments();
    if (foodCount > 0) {
      res.send("Seed is already done!");
      return;
    }

    await foodModel.create(sample_foods);
    res.send("Seed is Done !");
  })
);

router.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const foods = await foodModel.find();
    res.send(foods);
  })
);

router.get(
  "/search/:searchTerm",
  expressAsyncHandler(async (req, res) => {
    const searchRegex = new RegExp(req.params.searchTerm, "i");
    const foods = await foodModel.find({ name: { $regex: searchRegex } });
    res.send(foods);
  })
);

router.get(
  "/tags",
  expressAsyncHandler(async (req, res) => {
    const tags = await foodModel
      .aggregate([
        {
          $unwind: "$tags",
        },
        {
          $group: {
            _id: "$tags",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id",
            count: "$count",
          },
        },
      ])
      .sort({ count: -1 });

    const all = {
      name: "All",
      count: await foodModel.countDocuments(),
    };

    tags.unshift(all);
    res.send(tags);
  })
);

router.get(
  "/tag/:tagName",
  expressAsyncHandler(async (req, res) => {
    const foods = await foodModel.find({ tags: req.params.tagName });
    res.send(foods);
  })
);

router.get(
  "/:foodId",
  expressAsyncHandler(async (req, res) => {
    const food = await foodModel.findById(req.params.foodId);
    res.send(food);
  })
);

export default router;
