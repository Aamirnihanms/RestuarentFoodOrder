import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    longDescription: {
      type: String,
    },

    category: {
      type: String,
      required: true,
      index: true, // helps with filtering/search
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    prepTime: {
      type: String,
    },

    available: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: [
      {
        type: String,
      },
    ],

    nutritionInfo: {
      calories: { type: Number },
      protein: { type: String },
      carbs: { type: String },
      fat: { type: String },
    },

    ingredients: [
      {
        type: String,
      },
    ],

    sizes: [
      {
        type: String,
        enum: ["Small", "Regular", "Large", "Single", "Double"],
      },
    ],

    allergens: [
      {
        type: String,
      },
    ],

    reviewsList: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        name: String,
        rating: { type: Number, min: 0, max: 5 },
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

const Food = mongoose.model("Food", foodSchema);

export default Food;
