const mongoose = require("mongoose");
//  @desc first schema

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "category Must Be  Unique"],
      required: [true, "Please provide a category Name"],
      minlength: [2, "Too Short category Name"],
      maxlength: [30, "Maximum Length Exceeded"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: String,
  },
  {
    timestamps: true, //Saves createdAt and updatedAt as dates (default=false)
  }
);

const setImageUrl = (doc) => {
  if (doc.image) {
    doc.image = `${process.env.BASE_URL}categories/${doc.image}`;
  }
};

//  @desc set base image url
//  create
categorySchema.post("save", (doc) => {
  setImageUrl(doc);
});
//  @desc set base image url
//  get all,get one,update
categorySchema.post("init", (doc) => {
  setImageUrl(doc);
});

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
