import express from "express";
import { notFoundHandler } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import authRoutes from "./routes/authRoutes.js";
import { errors } from "celebrate";
import { connectMongoDB } from "./db/connectMongoDB.js";

const app = express();
const PORT = process.env.PORT || 3001;
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ message: "server running" });
});

app.use("/api/auth/", authRoutes);

app.use(errors());
app.use(notFoundHandler);
app.use(errorHandler);

await connectMongoDB();
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
