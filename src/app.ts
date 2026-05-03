import "./loadEnv.js";
import express from "express";
import authRoutes from "./routes/auth.js";

if (!process.env.JWT_SECRET?.trim()) {
  console.warn("[auth] JWT_SECRET is missing or empty; sign-up will fail until it is set");
}

const app = express();
const PORT = Number(process.env.PORT) || 8080;

// app.use(
//   cors({
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     credentials: true,
//   }),
// );
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
