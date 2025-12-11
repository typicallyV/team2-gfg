 // server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import mongoose from "mongoose";
import authRoutes from "./routes/authroutes.js";
import connectDB from "./utils/connectDB.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MongoDBSession = connectMongoDBSession(session);

// trust proxy when behind a reverse proxy (set in production)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN  ,
    credentials: true, // allow cookies
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ----- Connect to MongoDB -----
try {
  await connectDB();
} catch (err) {
  console.error("Failed to start server due to DB error");
  process.exit(1);
}
// ----- Session store -----
const store = new MongoDBSession({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// optional: handle store errors
store.on("error", function (error) {
  console.error("Session store error:", error);
});

 

app.use(
  session({
    name: "sid",
    secret: process.env.SESSION_SECRET || "change_me_now",
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      httpOnly: true,
      secure: false, // MUST be false for localhost
      sameSite: 'lax', // MUST be 'lax' for localhost (not 'none')
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/',
    },
  })
);

// ----- Routes -----
app.use("/api/auth", authRoutes);

// health & session-check
app.get("/", (req, res) => res.json({ ok: true }));
app.get("/api/session-check", (req, res) => {
  res.json({ authenticated: !!req.session?.isAuth, user: req.session?.user || null });
});

// simple error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Server error" });
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
