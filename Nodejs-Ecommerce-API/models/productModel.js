const mongoose = require("mongoose");
//  @desc fourth schema

const productSchema = mongoose.Schema(
  {
    title: {
      type: String,
      unique: [true, "Product Must Be  Unique"],
      required: [true, "Please provide a Product Name"],
      minlength: [2, "Too Short Product Name"],
      maxlength: [100, "Maximum Length Exceeded"],
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
    },

    description: {
      required: [true, "product description is required"],
      type: String,
      maxlength: [1000, "Maximum Length Exceeded"],
      trim: true,
    },

    quantity: {
      type: Number,
      required: [true, "product quantity is required"],
    },

    sold: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, "product price is required"],
    },

    priceAfterDiscount: {
      type: Number,
    },

    colors: [String],

    imageCover: {
      type: String,
      required: [true, "product img cover is required"],
    },

    images: [String],

    ratingsAverage: {
      type: Number,
      min: [1, "rating must be above or equal 1"],
      max: [5, "rating must be below or equal 5"],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "product category is required"],
    },

    subCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubCtegory",
      },
    ],

    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
  },

  {
    timestamps: true, //Saves createdAt and updatedAt as dates (default=false)
    //  @desc  to enable virtual populate
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//  @desc vertual relation
productSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

//  @desc mongoose middleware to handle populate relation
productSchema.pre(/^find/, function (next) {
  this.populate({ path: "subCategories", select: "name -_id" })
    .populate({ path: "category", select: "name -_id" })
    .populate({ path: "brand", select: "name + img -_id" });
  next();
});

const setImageCoverUrl = (doc) => {
  if (doc.imageCover) {
    doc.imageCover = `${process.env.BASE_URL}products/${doc.imageCover}`;
  }
};
const setImagesUrl = (doc) => {
  if (doc.images) {
    // map return array of images
    const imagesPaths = doc.images.map(
      (img) => `${process.env.BASE_URL}products/${img}`
    );
    doc.images = imagesPaths;
  }
};

productSchema.post("save", (doc) => {
  //  @desc set base image url
  //  create
  setImageCoverUrl(doc);
  setImagesUrl(doc);
});
productSchema.post("init", (doc) => {
  //  @desc set base image url
  //  get all,get one,update
  setImageCoverUrl(doc);
  setImagesUrl(doc);
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
