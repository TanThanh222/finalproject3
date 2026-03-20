import Stripe from "stripe";
import Course from "../models/Course.js";
import Payment from "../models/Payment.js";
import Enroll from "../models/Enroll.js";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("Missing STRIPE_SECRET_KEY in environment variables");
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

const getClientUrl = () => process.env.CLIENT_URL || "http://localhost:5173";

const syncCourseStudents = async (courseId) => {
  const activeEnrolls = await Enroll.find({
    course: courseId,
    status: "active",
  }).select("user");

  const studentIds = activeEnrolls.map((item) => item.user);

  await Course.findByIdAndUpdate(courseId, {
    students: studentIds,
  });
};

export const createCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const userEmail = req.user?.email;
    const { courseId } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const existingEnroll = await Enroll.findOne({
      user: userId,
      course: courseId,
      status: "active",
    });

    if (existingEnroll) {
      return res.status(400).json({
        success: false,
        message: "You already own this course",
      });
    }

    const price = Number(course.price || 0);

    if (!Number.isFinite(price) || price <= 0) {
      return res.status(400).json({
        success: false,
        message: "Course price is invalid",
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: userEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: course.title,
              description:
                course.shortDescription ||
                course.description ||
                course.overview ||
                "",
              images: course.image ? [course.image] : [],
            },
            unit_amount: Math.round(price * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        courseId: String(course._id),
        userId: String(userId),
      },
      success_url: `${getClientUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${getClientUrl()}/checkout/cancel?courseId=${course._id}`,
    });

    await Payment.create({
      user: userId,
      course: courseId,
      amount: price,
      currency: "usd",
      provider: "stripe",
      checkoutSessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      status: "requires_payment",
      metadata: {
        courseTitle: course.title || "",
      },
    });

    return res.status(200).json({
      success: true,
      url: session.url,
      sessionId: session.id,
    });
  } catch (error) {
    console.error("createCheckoutSession error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create checkout session",
      error: error.message,
    });
  }
};

export const verifyCheckoutSession = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    const { sessionId } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: "sessionId is required",
      });
    }

    const stripeSession = await stripe.checkout.sessions.retrieve(sessionId);

    const payment = await Payment.findOne({ checkoutSessionId: sessionId })
      .populate("course")
      .populate("user", "name email");

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    if (String(payment.user._id) !== String(userId)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }

    if (stripeSession.payment_status === "paid") {
      payment.status = "paid";
      payment.paymentIntentId =
        typeof stripeSession.payment_intent === "string"
          ? stripeSession.payment_intent
          : payment.paymentIntentId;
      payment.paidAt = payment.paidAt || new Date();
      await payment.save();

      await Enroll.findOneAndUpdate(
        {
          user: payment.user._id,
          course: payment.course._id,
        },
        {
          user: payment.user._id,
          course: payment.course._id,
          payment: payment._id,
          status: "active",
          enrolledAt: new Date(),
        },
        {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        },
      );

      await syncCourseStudents(payment.course._id);
    } else if (
      stripeSession.status === "expired" ||
      stripeSession.payment_status === "unpaid"
    ) {
      payment.status = "cancelled";
      await payment.save();
    }

    return res.status(200).json({
      success: true,
      paymentStatus: payment.status,
      course: {
        ...payment.course.toObject(),
        isOwned: payment.status === "paid",
      },
    });
  } catch (error) {
    console.error("verifyCheckoutSession error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to verify payment",
      error: error.message,
    });
  }
};

export const getMyPayments = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const payments = await Payment.find({ user: userId })
      .populate("course", "title image price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      data: payments,
    });
  } catch (error) {
    console.error("getMyPayments error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch payments",
      error: error.message,
    });
  }
};
