import { config } from "dotenv";
config();

import express, { urlencoded } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import paymentRoutes from "./routes/payment.routes.js";
import miscRoutes from "./routes/miscellaneous.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(morgan("dev"));
app.use(cookieparser());
app.use(urlencoded({ extended: true }));

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1", miscRoutes);

app.use("*", function (req, res) {
  res.status(404).send("OOPs! 404 Page NOt Found");
});

app.use(errorMiddleware);

export default app;
