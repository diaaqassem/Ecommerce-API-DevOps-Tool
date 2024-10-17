const ApiError = require("../utils/apiError");
const expressAsyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const { Coupon } = require("../models/couponModel");

const calcTotalCartPrice = async (cart) => {
  //calculate total price by using for
  let totalPrice = 0;
  cart.cartItems.forEach((cartItem) => {
    totalPrice += cartItem.price * cartItem.quantity;
  });
  cart.totalCartPrice = totalPrice;
  cart.totalPriceAfterDiscount = undefined;
  await cart.save();
  return totalPrice;
};

module.exports = {
  //  @desc        add product to cart
  //  @route       POST /api/cart/
  //  @access      Private (for user)
  addToCart: expressAsyncHandler(async (req, res, next) => {
    const { product, color } = req.body;
    const productQuery = await Product.findById({ _id: product });

    const cart = await Cart.findOne({ user: req.user._id });
    let newCart;
    if (!cart) {
      newCart = new Cart({
        user: req.user._id,
        cartItems: [{ product, color, price: productQuery.price }],
      });
    } else {
      //1) product exit in cart ,update product quantity
      const index = cart.cartItems.findIndex(
        (item) => item.product == product && item.color === color
      );
      if (index > -1) {
        cart.cartItems[index].quantity += 1;
      } else {
        cart.cartItems.push({ product, color, price: productQuery.price });
      }
    }
    calcTotalCartPrice(cart || newCart);
    res.status(201).json({
      success: true,
      message: "Added a new order",
      //   count: cart.cartItems.length,
      data: cart || newCart,
    });
    // const user = await User.findByIdAndUpdate(
    //   req.user._id,
    //   {
    //     $addToSet: {
    //       cart: {
    //         productId: req.body.productId,
    //         quantity: req.body.quantity,
    //       },
    //     },
    //   },
    //   { new: true }
    // );
    // res.status(201).json(user);
  }),

  //  @desc       get cart items
  //  @route       get /api/cart/
  //  @access      Private (for user)
  getCartItems: expressAsyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
     return next(new ApiError("No cart found", 404));
    }
    // cart.totalPriceAfterDiscount = undefined;
    // await cart.save();
    res.status(200).json({
      success: true,
      count: cart.cartItems.length,
      data: cart,
    });
  }),

  //  @desc       remove specific cart item
  //  @route       DELETE /api/cart/:cartId
  //  @access      Private (for user)
  removeFromCart: expressAsyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      next(new ApiError("No cart found", 404));
    }
    const index = cart.cartItems.findIndex((item) => item._id == req.params.id);
    if (index > -1) {
      cart.cartItems.splice(index, 1);
    }
    calcTotalCartPrice(cart);
    res.status(200).json({
      success: true,
      count: cart.cartItems.length,
      data: cart,
    });
  }),

  //  @desc       clear all cart items
  //  @route       DELETE /api/cart/
  //  @access      Private (for user)
  clearCart: expressAsyncHandler(async (req, res) => {
    const cart = await Cart.findOneAndDelete({ user: req.user._id });
    if (!cart) {
      return new ApiError("No cart found", 404);
    }
    res.status(200).json({
      success: true,
      count: 0,
    });
  }),

  //  @desc       update specific cart item quantity
  //  @route       PUT /api/cart/:itemId
  //  @access      Private (for user)
  updateCartQuantity: expressAsyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      next(new ApiError("No cart found", 404));
    }
    const index = cart.cartItems.findIndex((item) => item._id == req.params.id);
    if (index > -1) {
      cart.cartItems[index].quantity = req.body.quantity;
      calcTotalCartPrice(cart);
    } else {
      next(new ApiError("No cart found", 404));
    }
    res.status(200).json({
      success: true,
      count: cart.cartItems.length,
      data: cart,
    });
  }),

  //  @desc        apply coupon to cart
  //  @route       POST /api/cart/applyCoupon
  //  @access      Private (for user)
  applyCoupon: expressAsyncHandler(async (req, res, next) => {
    const { code } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      next(new ApiError("No cart found", 404));
    }
    const coupon = await Coupon.findOne({
      name: code,
      expire: { $gt: Date.now() },
    });
    if (!coupon) {
      next(new ApiError("No coupon found", 404));
    }
    calcTotalCartPrice(cart);
    const discount = coupon.discount;
    const totalPrice = cart.totalCartPrice - discount;
    cart.totalPriceAfterDiscount = totalPrice;
    res.status(200).json({
      success: true,
      count: cart.cartItems.length,
      data: cart,
    });
  }),
};
