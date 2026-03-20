import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
      index: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Course is required"],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "usd",
      lowercase: true,
      trim: true,
    },
    provider: {
      type: String,
      enum: ["stripe"],
      default: "stripe",
    },
    checkoutSessionId: {
      type: String,
      default: null,
    },
    paymentIntentId: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: [
        "pending",
        "requires_payment",
        "paid",
        "failed",
        "cancelled",
        "refunded",
      ],
      default: "pending",
      index: true,
    },
    paidAt: {
      type: Date,
      default: null,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  {
    timestamps: true,
  },
);

paymentSchema.index({ user: 1, course: 1 });
paymentSchema.index({ checkoutSessionId: 1 }, { unique: true, sparse: true });
paymentSchema.index({ paymentIntentId: 1 }, { sparse: true });

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
