const mongoose = require("mongoose");
//  @desc second schema

const subCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "sub Category Must Be  Unique"],
      required: [true, "Please provide a sub Category Name"],
      minlength: [2, "Too Short Category Name"],
      maxlength: [30, "Maximum Length Exceeded"],
    },

    slug: {
      type: String,
      lowercase: true,
    },

    category: {
      //  @desc foregin key
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  },

  {
    timestamps: true, //   @desc  Saves createdAt and updatedAt as dates (default=false)
  }
);

const SubCategory = mongoose.model("SubCtegory", subCategorySchema);

module.exports = SubCategory;
