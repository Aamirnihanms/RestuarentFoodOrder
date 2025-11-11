import mongoose from "mongoose";
import dotenv from "dotenv";
import Food from "../models/food.js";

dotenv.config();

const foods = [
  {
    name: "Margherita Pizza",
    description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil on a perfectly crispy crust",
    longDescription:
      "Our Margherita Pizza is a timeless classic that celebrates the simplicity of Italian cuisine. Made with hand-tossed dough that's fermented for 24 hours, topped with imported San Marzano tomatoes, fresh buffalo mozzarella, extra virgin olive oil, and aromatic basil leaves. Each pizza is wood-fired at 900°F for that authentic Neapolitan char and flavor.",
    category: "Pizza",
    price: 12.99,
    prepTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1595854341625-f33ee10dbf94?w=800&h=600&fit=crop"
    ],
    nutritionInfo: {
      calories: 285,
      protein: "12g",
      carbs: "36g",
      fat: "9g"
    },
    ingredients: ["Flour", "Tomatoes", "Mozzarella", "Basil", "Olive Oil", "Salt", "Yeast"],
    sizes: ["Small", "Regular", "Large"],
    allergens: ["Gluten", "Dairy"]
  },
  {
    name: "Chicken Burger",
    description: "Juicy grilled chicken burger with lettuce, tomato, and our special house sauce",
    longDescription:
      "Our Chicken Burger features a tender grilled chicken breast marinated in herbs and spices, served on a toasted brioche bun with crisp lettuce, ripe tomatoes, and our signature house sauce. Perfectly balanced for flavor and juiciness.",
    category: "Burgers",
    price: 9.99,
    prepTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&h=600&fit=crop"
    ],
    nutritionInfo: {
      calories: 430,
      protein: "27g",
      carbs: "42g",
      fat: "18g"
    },
    ingredients: ["Chicken Breast", "Lettuce", "Tomato", "Bun", "Mayonnaise", "Mustard", "Cheese"],
    sizes: ["Single", "Double"],
    allergens: ["Gluten", "Dairy", "Eggs"]
  },
  {
    name: "Caesar Salad",
    description: "Crisp romaine lettuce with Caesar dressing, croutons, and parmesan cheese",
    longDescription:
      "Our Caesar Salad combines fresh romaine lettuce, crunchy croutons, and shaved parmesan tossed in our creamy homemade Caesar dressing. Add grilled chicken or shrimp for extra protein and flavor.",
    category: "Salads",
    price: 8.99,
    prepTime: "10-15 min",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800&h=600&fit=crop"
    ],
    nutritionInfo: {
      calories: 180,
      protein: "6g",
      carbs: "9g",
      fat: "13g"
    },
    ingredients: ["Romaine Lettuce", "Croutons", "Parmesan", "Caesar Dressing", "Garlic", "Lemon Juice"],
    sizes: ["Regular", "Large"],
    allergens: ["Dairy", "Eggs"]
  },
  {
    name: "Grilled Salmon",
    description: "Perfectly grilled salmon served with lemon butter sauce and herbs",
    longDescription:
      "Fresh Atlantic salmon grilled to perfection, topped with a zesty lemon butter sauce and fresh herbs. Served with seasonal vegetables for a wholesome and flavorful experience.",
    category: "Seafood",
    price: 18.99,
    prepTime: "20-25 min",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1562967916-eb82221dfb36?w=800&h=600&fit=crop"
    ],
    nutritionInfo: {
      calories: 420,
      protein: "38g",
      carbs: "0g",
      fat: "28g"
    },
    ingredients: ["Salmon", "Butter", "Garlic", "Lemon", "Salt", "Black Pepper", "Herbs"],
    sizes: ["Regular", "Large"],
    allergens: ["Fish", "Dairy"]
  },
  {
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center and vanilla ice cream",
    longDescription:
      "Our Chocolate Lava Cake is a dessert lover’s dream — a moist chocolate cake with a gooey molten center, served warm with a scoop of vanilla ice cream and a drizzle of chocolate sauce.",
    category: "Desserts",
    price: 6.99,
    prepTime: "15-20 min",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
    images: [
      "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800&h=600&fit=crop",
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop"
    ],
    nutritionInfo: {
      calories: 350,
      protein: "6g",
      carbs: "42g",
      fat: "18g"
    },
    ingredients: ["Flour", "Chocolate", "Butter", "Sugar", "Eggs", "Vanilla", "Salt"],
    sizes: ["Single"],
    allergens: ["Gluten", "Dairy", "Eggs"]
  }
];

const seedFoods = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Food.deleteMany();
    await Food.insertMany(foods);
    console.log("✅ Foods added successfully!");
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding foods:", error);
    process.exit(1);
  }
};

seedFoods();
