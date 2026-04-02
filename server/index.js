import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./route/user.route.js";
import categoryRouter from "./route/category.route.js";
import productRouter from "./route/product.route.js";
import cartRouter from "./route/cart.route.js";
import myListRouter from "./route/mylist.route.js";
import addressRouter from "./route/address.route.js";
import homeSliderRouter from "./route/homeSlider.route.js";
import bannerV1Router from "./route/bannerV1.route.js";
import blogRouter from "./route/blog.route.js";
import stripeRouter from "./route/stripe.route.js";
import orderRouter from "./route/order.route.js";

const app = express();
const PORT = process.env.PORT || 8000; // 🔹 khai báo ở đây

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: `Server is running on port ${PORT}` });
});

app.use("/api/user", userRouter);
app.use("/api/category", categoryRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/myList", myListRouter);
app.use("/api/address", addressRouter);
app.use("/api/homeSlider",homeSliderRouter);
app.use("/api/bannerV1", bannerV1Router);
app.use("/api/blog", blogRouter);
app.use('/api/stripe', stripeRouter);
app.use('/api/order', orderRouter);

// Kết nối DB và khởi động server
await connectDB();

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
});
