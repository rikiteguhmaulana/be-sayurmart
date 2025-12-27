import express from "express";
import router from "./routes/api";
import bodyParser from "body-parser";
import cors from "cors";
import env from "./utils/env";
const app = express();

// 1. Logger di urutan paling atas untuk menangkap semua request
app.use((req, res, next) => {
  const start = Date.now();
  console.log(`[Incoming Request] ${req.method} ${req.url}`);
  res.on("finish", () => {
    const duration = Date.now() - start;
    console.log(
      `[${new Date().toISOString()}] ${req.method} ${req.url} ${res.statusCode} - ${duration}ms`
    );
  });
  next();
});

// 2. CORS yang lebih fleksibel namun aman (mendukung credentials)
app.use(
  cors({
    origin: (origin, callback) => {
      // Izinkan semua origin untuk development agar request tidak terblokir
      callback(null, true);
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
    credentials: true,
  })
);

// 3. Body parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to SayurMart API",
    status: "OK",
    timestamp: new Date().toISOString()
  });
});

app.use("/api", router);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
