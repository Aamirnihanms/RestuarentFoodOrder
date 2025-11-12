import Food from "../models/food.js";

/**
 * @desc Get review analytics
 * @route GET /api/reviews/analytics
 * @access Private/Admin
 */
export const getReviewAnalytics = async (req, res) => {
  try {
    // ✅ 1. Most reviewed foods
    const mostReviewedFoods = await Food.aggregate([
      { $project: { name: 1, reviewsCount: { $size: "$reviewsList" }, averageRating: "$rating" } },
      { $sort: { reviewsCount: -1 } },
      { $limit: 10 },
    ]);

    // ✅ 2. Flatten reviews to get which users reviewed what
    const foodsWithReviews = await Food.find({ "reviewsList.0": { $exists: true } })
      .select("name reviewsList")
      .populate("reviewsList.user", "name email");

    const userReviewMap = {};

    foodsWithReviews.forEach((food) => {
      food.reviewsList.forEach((review) => {
        const userId = review.user?._id?.toString();
        if (!userId) return;

        if (!userReviewMap[userId]) {
          userReviewMap[userId] = {
            userId,
            userName: review.user.name,
            userEmail: review.user.email,
            reviews: [],
          };
        }

        userReviewMap[userId].reviews.push({
          foodId: food._id,
          foodName: food.name,
          _id:review._id,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
        });
      });
    });

    const userReviews = Object.values(userReviewMap);

    // ✅ Response
    res.status(200).json({
      mostReviewedFoods,
      userReviews,
    });
  } catch (error) {
    console.error("Error fetching review analytics:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// with log

// import Food from "../models/food.js";
// import { createLog } from "../utils/logger.js"; // ✅ Import the logger utility

// /**
//  * @desc Get review analytics
//  * @route GET /api/reviews/analytics
//  * @access Private/Admin
//  */
// export const getReviewAnalytics = async (req, res) => {
//   try {
//     // ✅ 1. Most reviewed foods
//     const mostReviewedFoods = await Food.aggregate([
//       { $project: { name: 1, reviewsCount: { $size: "$reviewsList" }, averageRating: "$rating" } },
//       { $sort: { reviewsCount: -1 } },
//       { $limit: 10 },
//     ]);

//     // ✅ 2. Flatten reviews to get which users reviewed what
//     const foodsWithReviews = await Food.find({ "reviewsList.0": { $exists: true } })
//       .select("name reviewsList")
//       .populate("reviewsList.user", "name email");

//     const userReviewMap = {};

//     foodsWithReviews.forEach((food) => {
//       food.reviewsList.forEach((review) => {
//         const userId = review.user?._id?.toString();
//         if (!userId) return;

//         if (!userReviewMap[userId]) {
//           userReviewMap[userId] = {
//             userId,
//             userName: review.user.name,
//             userEmail: review.user.email,
//             reviews: [],
//           };
//         }

//         userReviewMap[userId].reviews.push({
//           foodId: food._id,
//           foodName: food.name,
//           rating: review.rating,
//           comment: review.comment,
//           createdAt: review.createdAt,
//         });
//       });
//     });

//     const userReviews = Object.values(userReviewMap);

//     // ✅ Log the analytics view
//     await createLog({
//       user: req.user?._id,
//       action: "View Review Analytics",
//       description: `Admin viewed review analytics — ${mostReviewedFoods.length} top reviewed foods found.`,
//       ipAddress: req.ip,
//       method: req.method,
//       endpoint: req.originalUrl,
//     });

//     // ✅ Response
//     res.status(200).json({
//       mostReviewedFoods,
//       userReviews,
//     });
//   } catch (error) {
//     console.error("Error fetching review analytics:", error);

//     // ✅ Log error details
//     await createLog({
//       user: req.user?._id,
//       action: "Review Analytics Error",
//       description: error.message,
//       ipAddress: req.ip,
//       method: req.method,
//       endpoint: req.originalUrl,
//       status: "failed",
//     });

//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };
