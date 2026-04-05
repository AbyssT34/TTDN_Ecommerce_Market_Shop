import OrderModel from "../models/order.model.js";
import ProductModel from "../models/product.model.js";
import paypal from "@paypal/checkout-server-sdk";
import UserModel from "../models/user.model.js";

// Create order from client payload (called after successful Stripe payment)
export const createOrderController = async (req, res) => {
  try {
    // Use userId from auth token (set by auth middleware)
    const userId = req.userId;
    const { products, paymentId, payment_status, delivery_address, totalAmt } =
      req.body;

    if (
      !userId ||
      !products ||
      !Array.isArray(products) ||
      products.length === 0
    ) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    // Update product stock for each product in the order
    for (let i = 0; i < products.length; i++) {
      const productId = products[i].productId || products[i]._id;
      const quantity = parseInt(products[i].quantity) || 1;
      if (productId) {
        await ProductModel.findByIdAndUpdate(
          productId,
          { $inc: { countInStock: -quantity } },
          { new: true },
        );
      }
    }

    const orderDoc = new OrderModel({
      userId,
      products: products.map((p) => ({
        productId: p.productId || p._id || p.id || "",
        productTitle: p.productTitle || p.title || p.name || "",
        quantity: p.quantity || 1,
        price: p.price || 0,
        image: p.image || "",
        subTotal: (p.quantity || 1) * (p.price || 0),
      })),
      paymentId: paymentId || "",
      payment_status: payment_status || "",
      delivery_address: delivery_address || null,
      totalAmt:
        totalAmt ||
        products.reduce((s, it) => s + (it.quantity || 1) * (it.price || 0), 0),
    });

    const saved = await orderDoc.save();
    return res.status(201).json({ success: true, order: saved });
  } catch (err) {
    console.error("createOrder error:", err);
    console.error("Error details:", err.message, err.stack);
    return res
      .status(500)
      .json({ error: "Internal server error", message: err.message });
  }
};

export const getOrdersByUserController = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // ✅ default values

    const pageNum = parseInt(page); // ✅ parse sang số
    const limitNum = parseInt(limit); // ✅ parse sang số
    const skip = (pageNum - 1) * limitNum;

    const total = await OrderModel.countDocuments();

    const orderList = await OrderModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .populate("userId")
      .populate({ path: "delivery_address", strictPopulate: false });

    return res.status(200).json({
      data: orderList,
      error: false,
      success: true,
      total,
      page: pageNum, // ✅ trả về số không phải null
      totalPages: Math.ceil(total / limitNum), // ✅ trả về số không phải null
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getTotalOrdersCountController = async (req, res) => {
  try {
    const ordersCount = await OrderModel.countDocuments();

    return res.status(200).json({
      error: false,
      success: true,
      count: ordersCount,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const totalSalesController = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear();
    const ordersList = await OrderModel.find();

    let totalSale = 0;
    let monthlySales = [
      { name: "JAN", totalSale: 0 }, // index 0 - month 1
      { name: "FEB", totalSale: 0 }, // index 1 - month 2
      { name: "MAR", totalSale: 0 }, // index 2 - month 3
      { name: "APRIL", totalSale: 0 }, // index 3 - month 4
      { name: "MAY", totalSale: 0 }, // index 4 - month 5
      { name: "JUNE", totalSale: 0 }, // index 5 - month 6
      { name: "JULY", totalSale: 0 }, // index 6 - month 7
      { name: "AUG", totalSale: 0 }, // index 7 - month 8
      { name: "SEP", totalSale: 0 }, // index 8 - month 9
      { name: "OCT", totalSale: 0 }, // index 9 - month 10
      { name: "NOV", totalSale: 0 }, // index 10 - month 11
      { name: "DEC", totalSale: 0 }, // index 11 - month 12
    ];

    for (let i = 0; i < ordersList.length; i++) {
      totalSale += parseInt(ordersList[i].totalAmt);

      const createdAt = new Date(ordersList[i]?.createdAt);
      const year = createdAt.getFullYear(); // ✅ number, so sánh đúng
      const month = createdAt.getMonth() + 1; // ✅ 1-12

      if (currentYear === year) {
        monthlySales[month - 1].totalSale += parseInt(ordersList[i].totalAmt); // thay 12 if bằng 1 dòng
      }
    }

    return res.status(200).json({
      error: false,
      success: true,
      totalSale: totalSale,
      monthlySales: monthlySales,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const totalUserController = async (req, res) => {
  try {
    const currentYear = new Date().getFullYear(); // ✅ lọc theo năm hiện tại

    const users = await UserModel.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" }, // ✅ sửa "createđAt" -> "createdAt"
            month: { $month: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 },
      },
    ]);

    let monthlyUser = [
      { name: "JAN", totalUsers: 0 },
      { name: "FEB", totalUsers: 0 },
      { name: "MAR", totalUsers: 0 },
      { name: "APRIL", totalUsers: 0 },
      { name: "MAY", totalUsers: 0 },
      { name: "JUNE", totalUsers: 0 },
      { name: "JULY", totalUsers: 0 },
      { name: "AUG", totalUsers: 0 },
      { name: "SEP", totalUsers: 0 },
      { name: "OCT", totalUsers: 0 },
      { name: "NOV", totalUsers: 0 },
      { name: "DEC", totalUsers: 0 },
    ];

    for (let i = 0; i < users.length; i++) {
      if (users[i]?._id?.year === currentYear) {
        const monthIndex = users[i]._id.month - 1; // ✅ month 1-12 -> index 0-11
        monthlyUser[monthIndex].totalUsers = users[i].count; // ✅ thay 12 if bằng 1 dòng
      }
    }
    return res.status(200).json({
      // ✅ thêm response
      error: false,
      success: true,
      monthlyUser,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

// ============ PayPal Integration ============

// Get PayPal client

function getPayPalClient() {
  const mode = process.env.PAYPAL_MODE || "sandbox";

  let clientId, clientSecret;

  if (mode === "live") {
    clientId = process.env.PAYPAL_CLIENT_ID_LIVE;
    clientSecret = process.env.PAYPAL_SECRET_LIVE;
  } else {
    // Default to sandbox/test
    clientId = process.env.PAYPAL_CLIENT_ID_TEST;
    clientSecret = process.env.PAYPAL_SECRET_TEST;
  }

  // Log environment check
  console.log("PayPal Client Setup:", {
    mode,
    hasClientId: !!clientId,
    hasClientSecret: !!clientSecret,
    clientIdLength: clientId?.length || 0,
    secretMatch:
      clientId === clientSecret
        ? "WARNING: ID and Secret are identical!"
        : "OK",
  });

  if (!clientId || !clientSecret) {
    throw new Error(
      `PayPal credentials missing. Mode: ${mode}, clientId: ${clientId ? "set" : "MISSING"}, secret: ${clientSecret ? "set" : "MISSING"}. Set PAYPAL_CLIENT_ID_TEST and PAYPAL_SECRET_TEST in .env`,
    );
  }

  // 2. Khởi tạo Environment
  const environment =
    mode === "live"
      ? new paypal.core.LiveEnvironment(clientId, clientSecret)
      : new paypal.core.SandboxEnvironment(clientId, clientSecret);

  // 3. Trả về Client
  return new paypal.core.PayPalHttpClient(environment);
}

// Create PayPal order
export const createOrderPaypalController = async (req, res) => {
  try {
    let totalAmount = req.query.totalAmount;

    if (!totalAmount || isNaN(totalAmount)) {
      return res.status(400).json({
        success: false,
        message: "Valid totalAmount is required",
        error: true,
      });
    }

    totalAmount = parseFloat(parseFloat(totalAmount).toFixed(2));

    if (!totalAmount || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "totalAmount must be greater than 0",
        error: true,
      });
    }

    const paypalReq = new paypal.orders.OrdersCreateRequest();
    paypalReq.headers["Prefer"] = "return=representation";

    paypalReq.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: totalAmount.toFixed(2),
          },
        },
      ],
    });

    const client = getPayPalClient();
    const order = await client.execute(paypalReq);

    return res.status(201).json({
      success: true,
      id: order.result.id,
      status: order.result.status,
    });
  } catch (err) {
    console.error("PayPal order creation error:", err.message);
    return res.status(500).json({
      success: false,
      message: err.message || "Error creating PayPal order",
      error: true,
      details: {
        status: err.statusCode || err.status,
        message: err.message,
      },
    });
  }
};

// Capture PayPal order
export const captureOrderPaypalController = async (req, res) => {
  try {
    const { paymentId } = req.body;

    // ✅ Capture PayPal order trước
    const client = getPayPalClient();
    const paypalReq = new paypal.orders.OrdersCaptureRequest(paymentId);
    paypalReq.requestBody({});
    await client.execute(paypalReq);

    // ✅ Save order vào DB
    const orderInfo = {
      userId: req.body.userId,
      products: req.body.products,
      paymentId: req.body.paymentId,
      payment_status: req.body.payment_status,
      delivery_address: req.body.delivery_address,
      totalAmt: req.body.totalAmount,
      date: req.body.date,
    };

    const order = new OrderModel(orderInfo);
    await order.save();

    // ✅ Update stock đúng cách
    for (let i = 0; i < req.body.products.length; i++) {
      const product = req.body.products[i];
      await ProductModel.findByIdAndUpdate(
        product.productId,
        { $inc: { countInStock: -(parseInt(product.quantity) || 1) } },
        { new: true },
      );
    }

    return res.status(201).json({
      success: true,
      error: false,
      message: "Order created successfully",
      order: order,
    });
  } catch (err) {
    // ✅ err thay vì error
    console.error("Capture PayPal error:", err);
    return res.status(500).json({
      message: err.message || err, // ✅ err thay vì error
      error: true,
      success: false,
    });
  }
};

export const updateOrderStatusController = async (req, res) => {
  try {
    const { id, order_status } = req.body;

    const updateOrder = await OrderModel.updateOne(
      {
        _id: id,
      },
      {
        order_status: order_status,
      },
      { new: true },
    );

    return res.status(201).json({
      success: true,
      error: false,
      message: "Update Order status",
      data: updateOrder,
    });
  } catch (err) {
    // ✅ err thay vì error
    console.error("Capture PayPal error:", err);
    return res.status(500).json({
      message: err.message || err, // ✅ err thay vì error
      error: true,
      success: false,
    });
  }
};
