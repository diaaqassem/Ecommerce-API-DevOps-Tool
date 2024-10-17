const mongoose = require("mongoose");
//  @desc third schema

const brandSchema = mongoose.Schema(
  {
    name: {
      type: String,
      unique: [true, "Brand Must Be  Unique"],
      required: [true, "Please provide a Brand Name"],
      minlength: [2, "Too Short Brand Name"],
      maxlength: [30, "Maximum Length Exceeded"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    img: String,
  },
  {
    timestamps: true, //Saves createdAt and updatedAt as dates (default=false)
  }
);

const setImageUrl = (doc) => {
  if (doc.img) {
    doc.img = `${process.env.BASE_URL}brands/${doc.img}`;
  }
};

//  @desc set base img url
//  create
brandSchema.post("save", (doc) => {
  setImageUrl(doc);
});
//  @desc set base img url
//  get all,get one,update
brandSchema.post("init", (doc) => {
  setImageUrl(doc);
});

const Brand = mongoose.model("Brand", brandSchema);

module.exports = Brand;
