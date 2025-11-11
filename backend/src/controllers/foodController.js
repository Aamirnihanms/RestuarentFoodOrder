import Food from "../models/food.js";
import { createLog } from "../utils/logger.js"; // ✅ Import logging utility

/**
 * @desc Get all foods
 * @route GET /api/foods
 * @access Public
 */
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();

    // await createLog({
    //   user: req.user?._id,
    //   action: "View All Foods",
    //   description: `Fetched ${foods.length} food items`,
    //   ipAddress: req.ip,
    //   method: req.method,
    //   endpoint: req.originalUrl,
    // });

    res.json(foods);
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "Get Foods Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get single food by ID
 * @route GET /api/foods/:id
 * @access Public
 */
export const getFoodById = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);

    if (!food) {
      // await createLog({
      //   user: req.user?._id,
      //   action: "View Food Attempt",
      //   description: `Food not found (ID: ${id})`,
      //   ipAddress: req.ip,
      //   method: req.method,
      //   endpoint: req.originalUrl,
      //   status: "failed",
      // });
      return res.status(404).json({ message: "Food item not found" });
    }

    // await createLog({
    //   user: req.user?._id,
    //   action: "View Food Details",
    //   description: `Viewed details of food item: ${food.name}`,
    //   ipAddress: req.ip,
    //   method: req.method,
    //   endpoint: req.originalUrl,
    // });

    res.status(200).json(food);
  } catch (error) {
    console.error("Error fetching food:", error);
    await createLog({
      user: req.user?._id,
      action: "Get Food By ID Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid food ID" });
    }
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Add new food (Admin only)
 * @route POST /api/foods
 * @access Private/Admin
 */
export const addFood = async (req, res) => {
  try {
    const {
      name,
      description,
      longDescription,
      category,
      price,
      rating,
      reviews,
      prepTime,
      available,
      image,
      images,
      nutritionInfo,
      ingredients,
      sizes,
      allergens,
    } = req.body;

    if (!name || !category || !price || !description) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    const food = await Food.create({
      name,
      description,
      longDescription,
      category,
      price,
      rating,
      reviews,
      prepTime,
      available,
      image,
      images,
      nutritionInfo,
      ingredients,
      sizes,
      allergens,
    });

    await createLog({
      user: req.user?._id,
      action: "Add Food",
      description: `Added new food item: ${food.name}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(201).json({
      message: "Food item added successfully!",
      food,
    });
  } catch (error) {
    console.error("Error adding food:", error);
    await createLog({
      user: req.user?._id,
      action: "Add Food Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update food (Admin only)
 * @route PUT /api/foods/:id
 * @access Private/Admin
 */
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!food) {
      await createLog({
        user: req.user?._id,
        action: "Update Food Attempt",
        description: `Failed to update — Food not found (ID: ${req.params.id})`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "Food not found" });
    }

    await createLog({
      user: req.user?._id,
      action: "Update Food",
      description: `Updated food item: ${food.name}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.json(food);
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "Update Food Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Delete food (Admin only)
 * @route DELETE /api/foods/:id
 * @access Private/Admin
 */
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) {
      await createLog({
        user: req.user?._id,
        action: "Delete Food Attempt",
        description: `Failed — Food not found (ID: ${req.params.id})`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "Food not found" });
    }

    await food.deleteOne();

    await createLog({
      user: req.user?._id,
      action: "Delete Food",
      description: `Deleted food item: ${food.name}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "Delete Food Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Add Review to a Food
 * @route POST /api/foods/:id/reviews
 * @access Private
 */
export const addFoodReview = async (req, res) => {
  try {
    const foodId = req.params.id;
    const { rating, comment } = req.body;

    const userId = req.user?._id;
    const userName = req.user?.name;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Please log in." });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: "Food item not found" });
    }

    const alreadyReviewed = food.reviewsList.find(
      (r) => r.user.toString() === userId.toString()
    );

    if (alreadyReviewed) {
      return res.status(400).json({ message: "You have already reviewed this food." });
    }

    const review = {
      user: userId,
      name: userName,
      rating: Number(rating),
      comment,
    };

    food.reviewsList.push(review);
    food.reviews = food.reviewsList.length;
    food.rating =
      food.reviewsList.reduce((acc, item) => item.rating + acc, 0) /
      food.reviewsList.length;

    await food.save();

    await createLog({
      user: userId,
      action: "Add Food Review",
      description: `User ${userName} reviewed "${food.name}" with ${rating}⭐`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(201).json({
      message: "Review added successfully!",
      reviews: food.reviewsList,
      averageRating: food.rating,
    });
  } catch (error) {
    console.error("Error adding review:", error);
    await createLog({
      user: req.user?._id,
      action: "Add Food Review Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
