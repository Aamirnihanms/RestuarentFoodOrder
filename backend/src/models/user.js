import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const addressSchema = new mongoose.Schema(
  {
    label: { type: String, default: "Home" }, // Home, Work, etc.
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { type: String },
    country: { type: String, default: "India" },
    phone: { type: String }, // optional phone for that address
    isDefault: { type: Boolean, default: false },
  },
  { _id: false } // prevent nested _id
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },

    phone: { type: String, default: "" }, // Optional user contact number

    // ✅ Multiple saved addresses
    addresses: [addressSchema],

    // ✅ Soft delete & active control
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },

    // ✅ Cart remains unchanged
    cart: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food" },
        name: String,
        category: String,
        price: Number,
        quantity: Number,
        size: String,
        image: String,
        prepTime: String,
        totalPrice: Number,
      },
    ],
  },
  { timestamps: true }
);

// ✅ Password hash before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
