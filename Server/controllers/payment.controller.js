import AppError from "../utils/error.util.js";
import { razorpay } from "../server.js";
import crypto from "crypto";
import Payment from "../models/payment.schema.js";
import User from "../models/user.model.js";

const getRazorpayApiKey = async (req, res, next) => {
  res.status(200).json({
    success: true,
    message: "Razorpay API key",
    key: process.env.RAZORPAY_KEY_ID,
  });
};
const buySubscription = async (req, res, next) => {
  try {
    const { id } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("Unauthorized, please login"));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot purchase a subscription", 400));
    }

    const planId = process.env.RAZORPAY_PLAN_ID.trim() || "plan_OILDvBiqFjWliB"; // Ensure there are no extra spaces

    let subscription;
    try {
      subscription = await razorpay.subscriptions.create({
        plan_id: planId,
        customer_notify: 1,
        total_count: 12,
      });
    } catch (error) {
      console.error("Razorpay subscription creation error: ", error);
      return next(new AppError("Unable to create subscription", 400));
    }

    if (!subscription) {
      return next(
        new AppError("Subscription creation failed without error", 500)
      );
    }

    // Adding the ID and the status to the user account
    user.subscription.id = subscription.id;
    user.subscription.status = subscription.status;

    // Saving the user object
    await user.save();

    res.status(200).json({
      success: true,
      message: "Subscribed successfully",
      subscription_id: subscription.id,
    });
  } catch (error) {
    console.error("Unexpected error: ", error);
    return next(
      new AppError(
        error.message || "An unexpected error occurred",
        error.statusCode || 500
      )
    );
  }
};

const verifySubscription = async (req, res, next) => {
  const { id } = req.user;
  const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } =
    req.body;

  const user = await User.findById(id);
  if (!user) {
    return next(new AppError("Unauthorized, please login", 400));
  }

  const subscriptionId = user.subscription.id;

  // Generating a signature with SHA256 for verification purposes

  const generatedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(`${razorpay_payment_id}|${subscriptionId}`)
    .digest("hex");

  // Check if generated signature and signature received from the frontend is the same or not
  if (generatedSignature !== razorpay_signature) {
    return next(new AppError("Payment not verified, please try again.", 400));
  }

  // If they match create payment and store it in the DB
  await Payment.create({
    razorpay_payment_id,
    razorpay_subscription_id,
    razorpay_signature,
  });

  // Update the user subscription status to active (This will be created before this)
  user.subscription.status = "active";

  // Save the user in the DB with any changes
  await user.save();

  res.status(200).json({
    success: true,
    message: "Payment verified successfully",
  });
};

const cancelSubscription = async (req, res, next) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id);

    if (!user) {
      return next(new AppError("User not found", 404));
    }

    if (user.role === "ADMIN") {
      return next(new AppError("Admin cannot cancel a subscription", 400));
    }

    const subscriptionId = user.subscription.id;
    console.log("Subscription ID:", subscriptionId);

    // Cancel the subscription in Razorpay
    try {
      const subscription = await razorpay.subscriptions.cancel(subscriptionId);
      user.subscription.status = subscription.status;
      await user.save();
      console.log("Subscription canceled in Razorpay");
    } catch (error) {
      return next(
        new AppError("Unable to cancel subscription, please try again", 400)
      );
    }

    // Check if there's a matching payment record
    const payment = await Payment.findOne({
      razorpay_subscription_id: subscriptionId,
    });

    if (!payment) {
      return next(new AppError("No matching payment found", 404));
    }

    console.log("Payment found:", payment);

    // Calculate if refund period has expired
    const timeSinceSubscribed = Date.now() - payment.createdAt;
    const refundPeriod = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds

    if (timeSinceSubscribed > refundPeriod) {
      return next(
        new AppError("Refund period is over, no refunds allowed", 400)
      );
    }

    // Refund the payment
    await razorpay.payments.refund(payment.razorpay_payment_id, {
      speed: "optimum", // This is required
    });

    // Update user subscription details
    user.subscription.id = undefined;
    user.subscription.status = undefined;
    await user.save();

    // Delete the payment record
    await Payment.deleteOne({ _id: payment._id });

    // Send response
    res.status(200).json({
      success: true,
      message: "Subscription cancelled and refunded successfully",
    });
  } catch (error) {
    // Pass the error to the next middleware
    return next(new AppError(error.message, 500));
  }
};

const allPayments = async (req, res, next) => {
  console.log(req.query);
  const { count, skip } = req.query;

  // Find all subscriptions from razorpay
  const allSubscriptions = await razorpay.subscriptions.all({
    count: count ? count : 10,
    skip: skip ? skip : 0,
  });

  // Filter active subscriptions
  const activeSubscriptionIds = allSubscriptions.items
    .filter((subscription) => subscription.status === "active")
    .map((subscription) => subscription.id);

  // Find payments associated with active subscriptions
  const allPaymentsResponse = await razorpay.payments.all({
    subscription_id: activeSubscriptionIds,
  });

  const allPayments = allPaymentsResponse.items;

  console.log(allPaymentsResponse.count);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Initialize an object to store payments for each month
  const finalMonths = {};
  monthNames.forEach((month) => {
    finalMonths[month] = 0;
  });

  // Calculate payments for each month
  allPayments.forEach((payment) => {
    const paymentDate = new Date(payment.created_at * 1000);
    const month = monthNames[paymentDate.getMonth()];
    finalMonths[month]++;
  });

  // Convert the monthly payments to an array for response
  const monthlySalesRecord = monthNames.map((month) => finalMonths[month]);

  res.status(200).json({
    success: true,
    message: "All payments for active subscriptions",
    allPayments: allPaymentsResponse,
    finalMonths,
    monthlySalesRecord,
  });
};

export {
  allPayments,
  buySubscription,
  verifySubscription,
  cancelSubscription,
  getRazorpayApiKey,
};
