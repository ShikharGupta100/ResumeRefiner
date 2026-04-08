// // server/src/config/db.js

const mongoose = require("mongoose");

// ─── Constants ────────────────────────────────────────────────────────────────
const MAX_RETRIES    = 5;
const RETRY_DELAY_MS = 3000; // 3s between retries

const MONGOOSE_OPTIONS = {
  serverSelectionTimeoutMS: 5000,  // fail fast if MongoDB unreachable (5s)
  socketTimeoutMS:          45000, // drop idle sockets after 45s
  maxPoolSize:              10,    // max 10 parallel DB connections
  minPoolSize:              2,     // keep 2 warm connections always ready
  connectTimeoutMS:         10000, // TCP connection timeout (10s)
};

// ─── Connection Events ────────────────────────────────────────────────────────
/**
 * Wire these once at startup — they fire automatically on state changes.
 * Mongoose keeps trying to reconnect on 'disconnected' by default.
 */
function registerConnectionEvents() {
  mongoose.connection.on("connected", () =>
    console.log("🗄️  MongoDB: connected")
  );

  mongoose.connection.on("disconnected", () =>
    console.warn("⚠️  MongoDB: disconnected — attempting reconnect...")
  );

  mongoose.connection.on("reconnected", () =>
    console.log("✅ MongoDB: reconnected")
  );

  mongoose.connection.on("error", (err) =>
    console.error("❌ MongoDB error:", err.message)
  );
}

// ─── Retry Helper ─────────────────────────────────────────────────────────────
const delay = (ms) => new Promise((res) => setTimeout(res, ms));

// ─── Main Connect Function ────────────────────────────────────────────────────
async function connectDB(attempt = 1) {
  // Guard: catch missing env var before Mongoose gives a cryptic error
  if (!process.env.MONGO_URI) {
    console.error("❌ MONGO_URI is not defined in environment variables.");
    process.exit(1);
  }

  // Register events only on first attempt (avoid duplicate listeners)
  if (attempt === 1) {
    registerConnectionEvents();
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, MONGOOSE_OPTIONS);
    // 'connected' event above handles the success log

  } catch (err) {
    console.error(
      `❌ MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`
    );

    if (attempt < MAX_RETRIES) {
      console.log(`⏳ Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await delay(RETRY_DELAY_MS);
      return connectDB(attempt + 1); // recurse with incremented attempt
    }

    // All retries exhausted — let server.js handle exit
    console.error("💥 All MongoDB connection attempts failed. Exiting.");
    process.exit(1);
  }
}

module.exports = connectDB;