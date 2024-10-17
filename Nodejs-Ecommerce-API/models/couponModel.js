const { default: mongoose } = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "coupon name is required"],
      trim: true,
      unique: true,
    },
    expire: {
      type: Date,
      required: [true, "Expiration date is required"],
    },
    discount: {
      type: Number, //percentage or amount depending on the type of coupon
      required: [true, "Discount value is required"],
    },
  },
  {
    timestamps: true, //creates createdAt and updatedAt fields in schema by default
  }
);

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = { Coupon };
