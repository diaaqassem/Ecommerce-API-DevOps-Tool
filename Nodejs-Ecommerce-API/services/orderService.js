const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const expressAsyncHandler = require("express-async-handler");
const { getAll } = require("./handlersFactory");
const ApiError = require("../utils/apiError");
const Product = require("../models/productModel");
const User = require("../models/userModel");

let bulkOperation;
module.exports = {
  //  @desc        create cash order
  // @route        post /api/orders/
  // @access      Private (for user)
  createCashOrder: expressAsyncHandler(async (req, res) => {
    const { shippingAddress } = req.body;
    //app settings
    const taxPrice = 0;
    const shippingPrice = 0;
    // 1)get cart depend on cart id
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError("No cart found", 404));
    }
    // 2)get order price depend on cart price check if coupon is available
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
    //3) create order with payment default method
    const order = await Order.create({
      user: req.user._id,
      cartItems: cart.cartItems,
      shippingAddress,
      totalOrderPrice,
    });
    //4)after create order ,decrement product quantity,increment product sold
    if (order) {
      bulkOperation = cart.cartItems.map((item) => {
        return {
          updateOne: {
            filter: { _id: item.product },
            update: {
              $inc: { sold: +item.quantity, quantity: -item.quantity },
            },
          },
        };
      });
      await Product.bulkWrite(bulkOperation, {});
      res.status(201).json({
        success: true,
        data: order,
      });
      //5)clear cart depend on cart id in params
      await Cart.deleteOne({ _id: cart._id });
    }
    // for (let i = 0; i < cart.cartItems.length; i++) {
    //   const product = await Product.findById(cart.cartItems[i].product);
    //   product.sold += 1;
    //   product.quantity -= cart.cartItems[i].product.quantity;
    //   await product.save();
    // }
  }),

  //  @desc        GET single order
  // @route        GET /api/orders/:id
  // @access      Private (for user)
  getOrder: expressAsyncHandler(async (req, res, next) => {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!order) {
      return next(new ApiError("No order found", 404));
    }
    res.status(200).json({
      success: true,
      data: order,
    });
  }),

  // @desc    middleware
  filterObjForLoggedUser: function (req, res, next) {
    let filterObj = {};
    if (req.user.role === "user") {
      filterObj = { user: req.user._id };
      req.filterObj = filterObj;
      next();
    } else next();
  },

  //  @desc        get all orders
  // @route        GET /api/orders/
  // @access      Private (for admin)
  getAllOrders: getAll(Order, "order"),

  // @desc    update order delivered status to delivered
  // @route    PUT /api/orders/:id/delivered
  // @access    Private (for admin,manager)
  updateOrderDeliveredStatus: expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return next(new ApiError("No order found", 404));
    }
    order.orderStatus = "Delivered";
    order.deliveredAt = Date.now();
    await order.save();
    res.status(200).json({
      success: true,
      data: order,
    });
  }),

  // @desc    update order paid status to paid
  // @route    PUT /api/orders/:id/paid
  // @access    Private (for admin,manager)
  updateOrderPaidStatus: expressAsyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return next(new ApiError("No order found", 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    await order.save();
    res.status(200).json({
      success: true,
      data: order,
    });
  }),

  // @desc    update order canceled status to canceled
  // @route    PUT /api/orders/:id/canceled
  // @access    Private (for user)
  //   deleteOrder: deleteOne(Order),

  // @desc    GET check out session from stripe and send it as a session
  // @route    POST /api/orders/checkout-session
  // @access    Private (for user)
  checkoutSession: expressAsyncHandler(async (req, res, next) => {
    //app settings
    const taxPrice = 0;
    const shippingPrice = 0;
    // 1)get cart depend on cart id
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return next(new ApiError("No cart found", 404));
    }
    // 2)get order price depend on cart price check if coupon is available
    const cartPrice = cart.totalPriceAfterDiscount
      ? cart.totalPriceAfterDiscount
      : cart.totalCartPrice;
    const totalOrderPrice = cartPrice + taxPrice + shippingPrice;

    // 3) create stripe check out session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "egp",
            unit_amount: totalOrderPrice * 100,
            product_data: {
              name: req.user.name,
              // description: req.user.name,
              image: req.user.image,
            },
            // unit_amount: item.product.price,
            // quantity: item.quantity,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${req.protocol}://${req.get("host")}/api/orders/success`,
      cancel_url: `${req.protocol}://${req.get("host")}/api/orders/canceled`,
      customer_email: req.user.email,
      client_reference_id: cart._id.toString(),
      metadata: req.body.shippingAddress,
    });

    // const session = await stripe.checkout.sessions.create({
    //   line_items: [
    //     {
    //       // name: req.user.name,
    //       price: totalOrderPrice * 100,
    //       // amount: totalOrderPrice * 100,
    //       // currency: "egp",
    //       // description: req.user.name,
    //       // currency_code:"usd",
    //       image: req.user.image,
    //       quantity: 1,
    //     },
    //   ],
    //   mode: "payment",
    //   success_url: `${req.protocol}://${req.get("host")}/api/orders/success`,
    //   cancel_url: `${req.protocol}://${req.get("host")}/api/orders/canceled`,
    //   customer_email: req.user.email,
    //   client_reference_id: cart._id,
    //   metadata: req.body.shippingAddress,
    // });

    // 3)send session to response
    res.status(200).json({
      success: true,
      data: session,
    });
  }),

  // webhook check out for stripe
  webhookCheckout: expressAsyncHandler(async (req, res) => {
    const sig = req.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const cart = await Cart.findOne({ _id: session.client_reference_id });
      const shippingAddress = session.metadata;
      const orderPrice = session.unit_amount / 100;
      const user = await User.findOne({ email: session.customer_email });
      if (cart) {
        cart.isPaid = true;
        cart.paidAt = Date.now();
        await cart.save();
        // create order
        const order = await Order.create({
          user: user._id,
          cartItems: cart.cartItems,
          shippingAddress,
          totalOrderPrice: orderPrice,
        });
        //after create order ,decrement product quantity,increment product sold
        if (order) {
          await Product.bulkWrite(bulkOperation, {});
          res.status(201).json({
            success: true,
            data: order,
          });
          //5)clear cart depend on cart id in params
          await Cart.deleteOne({ _id: cart._id });

          // 6)send email to user
          // sendMail({
          //   to: user.email,
          //   subject: "Order Placed",
          //   text: `Your order has been placed successfully`,
          // });
        }
        res.status(200).json({
          success: true,
        });
      }
    } else {
      res.status(400).send(`Webhook Error: ${event.type}`);
    }
  }),
};
