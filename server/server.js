
const dotenv = require("dotenv");
dotenv.config(); // ← must be FIRST — loads env before any other import reads it

const app       = require("./src/app");
const connectDB = require("./src/config/db");

const PORT = process.env.PORT || 3000;
const ENV  = process.env.NODE_ENV || "development";

// ─── Uncaught Synchronous Exceptions ─────────────────────────────────────────
/**
 * Catches throws that escape all try/catch blocks.
 * e.g. JSON.parse(undefined) at module level.
 * Log it, then exit — never silently continue with broken state.
 */
process.on("uncaughtException", (err) => {
  console.error("💥 [UncaughtException] Process will exit:", err.message);
  console.error(err.stack);
  process.exit(1); // exit code 1 = abnormal — PM2/Docker will restart
});

// ─── Unhandled Promise Rejections ────────────────────────────────────────────
/**
 * Catches async errors not handled by try/catch.
 * e.g. await db.connect() with no catch anywhere.
 */
process.on("unhandledRejection", (reason) => {
  console.error("💥 [UnhandledRejection] Process will exit:", reason);
  process.exit(1);
});

// ─── Boot Sequence ────────────────────────────────────────────────────────────
/**
 * Always connect DB before accepting HTTP traffic.
 * If DB fails → don't start server → fail fast with clear message.
 */
async function startServer() {
  try {
    // 1. Connect to MongoDB first
    await connectDB();
    console.log("✅ MongoDB connected");

    // 2. Only then start listening
    const server = app.listen(PORT, () => {
      console.log("─────────────────────────────────────");
      console.log(`🚀 Server running on port  : ${PORT}`);
      console.log(`🌍 Environment             : ${ENV}`);
      console.log(`🏥 Health check            : http://localhost:${PORT}/health`);
      console.log(`📡 API base                : http://localhost:${PORT}/api/resumes`);
      console.log("─────────────────────────────────────");
    });

    // 3. Wire graceful shutdown to this server instance
    setupGracefulShutdown(server);

  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    process.exit(1); // clear failure — don't hang
  }
}

// ─── Graceful Shutdown ────────────────────────────────────────────────────────
/**
 * On SIGTERM (Docker stop / Render deploy) or SIGINT (Ctrl+C):
 *  1. Stop accepting new requests
 *  2. Wait for in-flight requests to finish (30s max)
 *  3. Close DB connection cleanly
 *  4. Exit with code 0 (normal)
 *
 * Without this, mid-flight requests get cut and DB connections leak.
 */
function setupGracefulShutdown(server) {
  const shutdown = async (signal) => {
    console.log(`\n⚠️  ${signal} received — shutting down gracefully...`);

    // Stop accepting new connections
    server.close(async () => {
      console.log("🔌 HTTP server closed");

      try {
        const mongoose = require("mongoose");
        await mongoose.connection.close();
        console.log("🗄️  MongoDB connection closed");
        console.log("👋 Shutdown complete. Goodbye.");
        process.exit(0);
      } catch (err) {
        console.error("❌ Error during shutdown:", err.message);
        process.exit(1);
      }
    });

    // Force-kill if shutdown takes more than 30s
    setTimeout(() => {
      console.error("⏰ Graceful shutdown timed out — forcing exit.");
      process.exit(1);
    }, 30_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM")); // Docker / cloud platforms
  process.on("SIGINT",  () => shutdown("SIGINT"));  // Ctrl+C local dev
}

// ─── Start ────────────────────────────────────────────────────────────────────
startServer();






