const ServerlessHttp = require("serverless-http");

exports.mountRoutes = (app) => {
  //   @desc    Test route to check if server is running
  //            Access at /api/categories
  app.use("/api/categories/", require("./categoryRoute.js"));
  //            Access at /api/subCategories
  app.use("/api/subCategories/", require("./subCategoryRoute.js"));
  //            Access at /api/brands
  app.use("/api/brands/", require("./brandRoute.js"));
  //            Access at /api/productss
  app.use("/api/products/", require("./productRoute.js"));
  //            Access at /api/users
  app.use("/api/users/", require("./userRoute.js"));
  //            Access at /api/auth
  app.use("/api/auth/", require("./authRoute.js"));
  //            Access at /api/reviews
  app.use("/api/reviews/", require("./reviewRoute.js"));
  //            Access at /api/wishList
  app.use("/api/wishList/", require("./wishListRoute.js"));
  //            Access at /api/addresses
  app.use("/api/addresses/", require("./addressRoute.js"));
  //            Access at /api/coupons
  app.use("/api/coupons/", require("./couponRoute.js"));
  //            Access at /api/cart
  app.use("/api/cart/", require("./cartRoute.js"));
  //            Access at /api/orders
  app.use("/api/orders/", require("./orderRoute.js"));

  // for deployment
  // module.exports.handlers = ServerlessHttp(app);
};
